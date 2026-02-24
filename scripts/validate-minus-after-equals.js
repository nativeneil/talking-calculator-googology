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
    };
  }

  addEventListener(type, handler) {
    this.listeners.set(type, handler);
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

  querySelector() {
    return null;
  }
}

async function createHarness() {
  const keydownListeners = [];
  const clickListeners = [];

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
    funBanner: new FakeElement("funBanner"),
  };

  elements.voicePanel.setAttribute("hidden", "");

  const storage = new Map();
  const localStorage = {
    getItem(key) {
      return storage.has(key) ? storage.get(key) : null;
    },
    setItem(key, value) {
      storage.set(key, String(value));
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
        return new FakeElement("speak");
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
      if (type === "click") {
        clickListeners.push(handler);
      }
    },
  };

  const speechSynthesis = {
    getVoices() {
      return [];
    },
    addEventListener() {},
    speak() {},
    cancel() {},
  };

  const fakeWindow = {
    speechSynthesis,
    getComputedStyle() {
      return {
        fontWeight: "400",
        fontSize: "16px",
        fontFamily: "sans-serif",
      };
    },
    window: null,
  };
  fakeWindow.window = fakeWindow;

  global.document = fakeDocument;
  global.localStorage = localStorage;
  global.window = fakeWindow;
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

  function clear() {
    app.clearAll();
  }

  function keypress(key) {
    const event = {
      key,
      preventDefault() {},
      target: null,
    };
    keydownListeners.forEach((listener) => listener(event));
  }

  function runTokens(sequence, mode) {
    clear();
    sequence.forEach((token) => {
      if (mode === "keyboard") {
        keypress(token);
        return;
      }

      if (/^[0-9]$/.test(token) || token === "." || token === "e") {
        app.handleDigit(token);
      } else if (["+", "-", "*", "/"].includes(token)) {
        app.handleOperator(token);
      } else if (token === "=") {
        app.handleEquals();
      } else if (token === "C") {
        app.clearAll();
      } else {
        throw new Error(`Unsupported token: ${token}`);
      }
    });

    return {
      result: elements.result.textContent.replace(/,/g, ""),
      expression: elements.expression.textContent,
    };
  }

  return { runTokens };
}

const cases = [
  {
    name: "10+10= then -10= -> 10",
    sequence: ["1", "0", "+", "1", "0", "=", "-", "1", "0", "="],
    expected: "10",
  },
  {
    name: "50= then -5= -> 45",
    sequence: ["5", "0", "=", "-", "5", "="],
    expected: "45",
  },
  {
    name: "12.5+7.5= then -10= -> 10",
    sequence: ["1", "2", ".", "5", "+", "7", ".", "5", "=", "-", "1", "0", "="],
    expected: "10",
  },
  {
    name: "9*9= then -1= -> 80",
    sequence: ["9", "*", "9", "=", "-", "1", "="],
    expected: "80",
  },
  {
    name: "100/4= then -5= -> 20",
    sequence: ["1", "0", "0", "/", "4", "=", "-", "5", "="],
    expected: "20",
  },
  {
    name: "negative result chain: 3-10= then -5= -> -12",
    sequence: ["3", "-", "1", "0", "=", "-", "5", "="],
    expected: "-12",
  },
  {
    name: "zero result chain: 5-5= then -2= -> -2",
    sequence: ["5", "-", "5", "=", "-", "2", "="],
    expected: "-2",
  },
  {
    name: "chained minus after equals: 20= then -5= then -3= -> 12",
    sequence: ["2", "0", "=", "-", "5", "=", "-", "3", "="],
    expected: "12",
  },
  {
    name: "10+10=20 then * -2 = -40",
    sequence: ["1", "0", "+", "1", "0", "=", "*", "-", "2", "="],
    expected: "-40",
  },
  {
    name: "9*9=81 then / -3 = -27",
    sequence: ["9", "*", "9", "=", "/", "-", "3", "="],
    expected: "-27",
  },
  {
    name: "20= then + -5 = 15",
    sequence: ["2", "0", "=", "+", "-", "5", "="],
    expected: "15",
  },
  {
    name: "20= then - -5 = 25",
    sequence: ["2", "0", "=", "-", "-", "5", "="],
    expected: "25",
  },
];

(async () => {
  const harness = await createHarness();
  let hasFailure = false;

  for (const mode of ["keypad", "keyboard"]) {
    for (const testCase of cases) {
      const { result } = harness.runTokens(testCase.sequence, mode);
      const pass = result === testCase.expected;
      const status = pass ? "PASS" : "FAIL";
      console.log(`[${mode}] ${testCase.name}: ${status}`);
      if (!pass) {
        console.log(`  Expected ${testCase.expected}, received ${result}`);
        hasFailure = true;
      }
    }
  }

  if (hasFailure) {
    process.exitCode = 1;
  }
})();
