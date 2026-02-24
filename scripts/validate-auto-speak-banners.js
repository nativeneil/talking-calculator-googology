#!/usr/bin/env node

const path = require("path");
const { pathToFileURL } = require("url");

class FakeDecimal {
  constructor(value) {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      throw new Error("Invalid number");
    }
    this.numeric = numeric;
  }

  plus(other) {
    return new FakeDecimal(this.numeric + other.numeric);
  }

  minus(other) {
    return new FakeDecimal(this.numeric - other.numeric);
  }

  times(other) {
    return new FakeDecimal(this.numeric * other.numeric);
  }

  div(other) {
    return new FakeDecimal(this.numeric / other.numeric);
  }

  isFinite() {
    return Number.isFinite(this.numeric);
  }

  sd() {
    if (!Number.isFinite(this.numeric)) {
      return 1;
    }
    const normalized = Math.abs(this.numeric)
      .toString()
      .replace(/e[+-]?\d+$/i, "")
      .replace(".", "")
      .replace(/^0+/, "");
    return normalized.length || 1;
  }

  toSignificantDigits(precision) {
    return new FakeDecimal(Number(this.numeric.toPrecision(precision)));
  }

  toExponential(precision) {
    return this.numeric.toExponential(precision);
  }

  toString() {
    if (Object.is(this.numeric, -0)) {
      return "0";
    }
    return String(this.numeric);
  }
}

class FakeElement {
  constructor(id = "") {
    this.id = id;
    this.textContent = "";
    this.innerHTML = "";
    this.children = [];
    this.dataset = {};
    this.value = "";
    this.checked = true;
    this.scrollLeft = 0;
    this.scrollWidth = 0;
    this.clientWidth = 2000;
    this.className = "";
    this.type = "";
    this.listeners = new Map();
    this.attributes = new Map();
    this.classList = {
      add: () => {},
      remove: () => {},
      contains: () => false,
    };
  }

  addEventListener(type, handler) {
    const list = this.listeners.get(type) || [];
    list.push(handler);
    this.listeners.set(type, list);
  }

  emit(type, event = {}) {
    const list = this.listeners.get(type) || [];
    list.forEach((handler) => handler(event));
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  setAttribute(name, value) {
    this.attributes.set(name, value);
  }

  removeAttribute(name) {
    this.attributes.delete(name);
  }

  hasAttribute(name) {
    return this.attributes.has(name);
  }

  contains() {
    return false;
  }

  closest() {
    return this;
  }

  querySelector(selector) {
    if (selector === ".speak-label") {
      return this.children.find((child) => child.className === "speak-label") || null;
    }
    return null;
  }
}

async function createHarness() {
  const keydownListeners = [];

  const elements = {
    result: new FakeElement("result"),
    expression: new FakeElement("expression"),
    historyList: new FakeElement("historyList"),
    keypad: new FakeElement("keypad"),
    voiceButton: new FakeElement("voiceButton"),
    voicePanel: new FakeElement("voicePanel"),
    voiceSelect: new FakeElement("voiceSelect"),
    voiceRate: new FakeElement("voiceRate"),
    voicePitch: new FakeElement("voicePitch"),
    voiceVolume: new FakeElement("voiceVolume"),
    voiceReset: new FakeElement("voiceReset"),
    funModeToggle: new FakeElement("funModeToggle"),
    funBanner: new FakeElement("funBanner"),
  };

  const speakButton = new FakeElement("speakButton");
  const speakLabel = new FakeElement("speakLabel");
  speakLabel.className = "speak-label";
  speakLabel.textContent = "Speak";
  speakButton.appendChild(speakLabel);

  const localStorageMap = new Map();
  const localStorage = {
    getItem(key) {
      return localStorageMap.has(key) ? localStorageMap.get(key) : null;
    },
    setItem(key, value) {
      localStorageMap.set(key, String(value));
    },
  };

  const spoken = [];
  const speechSynthesis = {
    getVoices() {
      return [];
    },
    addEventListener() {},
    cancel() {},
    speak(utterance) {
      spoken.push(utterance.text);
      if (typeof utterance.onend === "function") {
        utterance.onend();
      }
    },
  };

  const fakeDocument = {
    getElementById(id) {
      return elements[id] || new FakeElement(id);
    },
    querySelector(selector) {
      if (selector === ".keypad") {
        return elements.keypad;
      }
      if (selector === ".key.speak") {
        return speakButton;
      }
      return new FakeElement(selector);
    },
    createElement(tag) {
      if (tag === "canvas") {
        return {
          getContext() {
            return {
              font: "",
              measureText(text) {
                return { width: text.length * 8 };
              },
            };
          },
        };
      }
      return new FakeElement(tag);
    },
    addEventListener(type, handler) {
      if (type === "keydown") {
        keydownListeners.push(handler);
      }
    },
  };

  global.document = fakeDocument;
  global.localStorage = localStorage;
  global.window = {
    speechSynthesis,
    getComputedStyle() {
      return {
        fontWeight: "400",
        fontSize: "16px",
        fontFamily: "sans-serif",
      };
    },
  };
  global.window.window = global.window;
  global.Decimal = FakeDecimal;
  global.SpeechSynthesisUtterance = function SpeechSynthesisUtterance(text) {
    this.text = text;
    this.voice = null;
    this.rate = 1;
    this.pitch = 1;
    this.volume = 1;
  };

  const moduleUrl = `${pathToFileURL(path.resolve("js/main.js")).href}?test=${Date.now()}`;
  const app = await import(moduleUrl);

  function runExpression(tokens) {
    app.clearAll();
    for (const token of tokens) {
      if (/^[0-9]$/.test(token) || token === "." || token === "e") {
        app.handleDigit(token);
      } else if (["+", "-", "*", "/"].includes(token)) {
        app.handleOperator(token);
      } else if (token === "=") {
        app.handleEquals();
      }
    }
  }

  return {
    app,
    elements,
    spoken,
    runExpression,
  };
}

(async () => {
  const specialMathUrl = `${pathToFileURL(path.resolve("js/special-math.js")).href}?test=${Date.now()}`;
  const { specialMathPhrases } = await import(specialMathUrl);
  const h = await createHarness();
  let failed = false;

  h.runExpression(["1", "/", "0", "="]);
  const lastInfinitySpeech = h.spoken[h.spoken.length - 1];
  const infinityPass = specialMathPhrases.LESSON_DIVIDE_BY_ZERO.includes(lastInfinitySpeech);
  console.log(`[auto-speak] infinity equals speaks banner: ${infinityPass ? "PASS" : "FAIL"}`);
  if (!infinityPass) {
    console.log(`  expected one of: ${JSON.stringify(specialMathPhrases.LESSON_DIVIDE_BY_ZERO)}`);
    console.log(`  received: ${lastInfinitySpeech}`);
    failed = true;
  }

  const beforeMeme = h.spoken.length;
  h.runExpression(["6", "*", "7", "="]);
  const memePass = (
    h.spoken.length === beforeMeme + 1 &&
    h.spoken[h.spoken.length - 1] === specialMathPhrases.BANNER_SIX_SEVEN_MEME
  );
  console.log(`[auto-speak] meme 6*7 auto-speaks banner: ${memePass ? "PASS" : "FAIL"}`);
  if (!memePass) {
    console.log(`  expected: ${specialMathPhrases.BANNER_SIX_SEVEN_MEME}`);
    console.log(`  received: ${h.spoken[h.spoken.length - 1]}`);
    failed = true;
  }

  h.elements.funModeToggle.checked = false;
  h.elements.funModeToggle.emit("change");
  const beforeDisabled = h.spoken.length;
  h.runExpression(["1", "/", "0", "="]);
  const disabledPass = h.spoken.length === beforeDisabled;
  console.log(`[auto-speak] fun mode off disables auto-speak: ${disabledPass ? "PASS" : "FAIL"}`);
  if (!disabledPass) {
    console.log(`  speech count changed from ${beforeDisabled} to ${h.spoken.length}`);
    failed = true;
  }

  if (failed) {
    process.exitCode = 1;
  }
})();
