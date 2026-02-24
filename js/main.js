import { createCalculatorState, defaultVoiceSettings } from "./state.js";
import { evaluate, isOperator } from "./evaluate.js";
import {
  formatExpression,
  formatResultToFit,
  getHistoryEntryLabel,
  updateDisplay,
} from "./format-display.js";
import { numberToWords } from "./number-words.js";
import { buildSpeechText, speakText } from "./speech.js";
import { classifySpecialMath } from "./special-math.js";
import { createFunBannerController } from "./fun-banner.js";

const resultEl = document.getElementById("result");
const expressionEl = document.getElementById("expression");
const historyList = document.getElementById("historyList");
const keypad = document.querySelector(".keypad");
const voiceButton = document.getElementById("voiceButton");
const voicePanel = document.getElementById("voicePanel");
const voiceSelect = document.getElementById("voiceSelect");
const voiceRate = document.getElementById("voiceRate");
const voicePitch = document.getElementById("voicePitch");
const voiceVolume = document.getElementById("voiceVolume");
const funModeToggle = document.getElementById("funModeToggle");
const voiceReset = document.getElementById("voiceReset");
const funBannerEl = document.getElementById("funBanner");

const state = createCalculatorState();
const funBanner = createFunBannerController(funBannerEl);

function renderDisplay() {
  updateDisplay(state, resultEl, expressionEl);
}

function clearSpecialMathFeedback() {
  state.lastSpecialContext = null;
  funBanner.hideFunBanner();
}

function updateHistory() {
  if (!historyList) {
    return;
  }
  historyList.innerHTML = "";
  state.history.forEach((entry, index) => {
    const li = document.createElement("li");
    const text = document.createElement("span");
    text.textContent = getHistoryEntryLabel(entry);
    const restoreButton = document.createElement("button");
    restoreButton.type = "button";
    restoreButton.className = "history-restore";
    restoreButton.dataset.index = String(index);
    restoreButton.textContent = "Restore";
    li.appendChild(text);
    li.appendChild(restoreButton);
    historyList.appendChild(li);
  });
}

function pushCurrentInput() {
  if (!state.currentInput || state.currentInput === "-") {
    return;
  }
  state.tokens.push(state.currentInput);
  state.currentInput = "";
}

function getStoredVoiceName() {
  return localStorage.getItem("voiceName") || "";
}

function saveSelectedVoiceName(name) {
  localStorage.setItem("voiceName", name);
}

function getStoredVoiceSettings() {
  const storedRate = localStorage.getItem("voiceRate");
  const storedPitch = localStorage.getItem("voicePitch");
  const storedVolume = localStorage.getItem("voiceVolume");
  return {
    rate: storedRate !== null ? Number(storedRate) : defaultVoiceSettings.rate,
    pitch: storedPitch !== null ? Number(storedPitch) : defaultVoiceSettings.pitch,
    volume: storedVolume !== null ? Number(storedVolume) : defaultVoiceSettings.volume,
  };
}

function saveVoiceSettings(settings) {
  localStorage.setItem("voiceRate", String(settings.rate));
  localStorage.setItem("voicePitch", String(settings.pitch));
  localStorage.setItem("voiceVolume", String(settings.volume));
}

function getStoredFunMode() {
  const stored = localStorage.getItem("funModeEnabled");
  if (stored === null) {
    return true;
  }
  return stored === "true";
}

function saveFunMode(enabled) {
  localStorage.setItem("funModeEnabled", String(enabled));
}

function buildVoiceLabel(voice) {
  const lang = voice.lang ? ` (${voice.lang})` : "";
  return `${voice.name}${lang}`;
}

function populateVoiceSelect(voices) {
  if (!voiceSelect) {
    return;
  }
  voiceSelect.innerHTML = "";
  voices.forEach((voice) => {
    const option = document.createElement("option");
    option.value = voice.name;
    option.textContent = buildVoiceLabel(voice);
    voiceSelect.appendChild(option);
  });
}

function getFallbackVoiceName(voices) {
  const gbVoice = voices.find((voice) => voice.lang && voice.lang.startsWith("en-GB"));
  if (gbVoice) {
    return gbVoice.name;
  }
  const enVoice = voices.find((voice) => voice.lang && voice.lang.startsWith("en"));
  if (enVoice) {
    return enVoice.name;
  }
  return voices[0]?.name || "";
}

function refreshVoiceList() {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) {
    return;
  }
  const englishVoices = voices.filter((voice) => voice.lang && voice.lang.startsWith("en"));
  state.availableVoices = (englishVoices.length ? englishVoices : voices)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  populateVoiceSelect(state.availableVoices);
  const storedName = getStoredVoiceName();
  const fallbackName = getFallbackVoiceName(state.availableVoices);
  state.selectedVoiceName = state.availableVoices.some((voice) => voice.name === storedName)
    ? storedName
    : fallbackName;

  if (voiceSelect && state.selectedVoiceName) {
    voiceSelect.value = state.selectedVoiceName;
  }
}

function setSelectedVoice(name) {
  state.selectedVoiceName = name;
  saveSelectedVoiceName(name);
}

function applyVoiceSettings(settings) {
  state.voiceSettings = settings;
  if (voiceRate) {
    voiceRate.value = String(settings.rate);
  }
  if (voicePitch) {
    voicePitch.value = String(settings.pitch);
  }
  if (voiceVolume) {
    voiceVolume.value = String(settings.volume);
  }
}

function applyFunMode(enabled) {
  state.funModeEnabled = enabled;
  if (funModeToggle) {
    funModeToggle.checked = enabled;
  }
  if (!enabled) {
    clearSpecialMathFeedback();
  }
}

function resetVoiceSettings() {
  applyVoiceSettings({
    ...defaultVoiceSettings,
  });
  saveVoiceSettings(state.voiceSettings);
}

function updateVoiceSettingValue(key, value) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return;
  }
  state.voiceSettings = {
    ...state.voiceSettings,
    [key]: numeric,
  };
  saveVoiceSettings(state.voiceSettings);
}

function toggleVoicePanel(forceState) {
  if (!voicePanel || !voiceButton) {
    return;
  }
  const shouldOpen = forceState ?? voicePanel.hasAttribute("hidden");
  if (shouldOpen) {
    voicePanel.removeAttribute("hidden");
    voiceButton.setAttribute("aria-expanded", "true");
    refreshVoiceList();
  } else {
    voicePanel.setAttribute("hidden", "");
    voiceButton.setAttribute("aria-expanded", "false");
  }
}

function handleVoiceSelection() {
  const selected = voiceSelect?.value;
  if (selected) {
    setSelectedVoice(selected);
  }
}

function handleFunModeToggle() {
  if (!funModeToggle) {
    return;
  }
  applyFunMode(funModeToggle.checked);
  saveFunMode(state.funModeEnabled);
}

function hasUsableLastResult() {
  return state.lastResult !== "" && !state.lastResult.toLowerCase().includes("error");
}

function clearAll() {
  state.tokens = [];
  state.currentInput = "";
  state.lastResult = "";
  state.lastExpression = "";
  state.lastAction = null;
  clearSpecialMathFeedback();
  renderDisplay();
}

function backspace() {
  if (state.currentInput) {
    state.currentInput = state.currentInput.slice(0, -1);
  } else if (state.tokens.length) {
    const lastToken = state.tokens.pop();
    if (!isOperator(lastToken)) {
      state.currentInput = lastToken.slice(0, -1);
    }
  }
  renderDisplay();
}

function handleDigit(value) {
  if (state.lastAction === "equals") {
    state.tokens = [];
    state.lastResult = "";
    state.lastExpression = "";
    state.lastAction = null;
    clearSpecialMathFeedback();
  }

  if (value === ".") {
    if (state.currentInput.includes("e") || state.currentInput.includes("E")) {
      return;
    }
    if (state.currentInput.includes(".")) {
      return;
    }
    state.currentInput = state.currentInput ? `${state.currentInput}.` : "0.";
    renderDisplay();
    return;
  }

  if (value === "e") {
    if (!state.currentInput || state.currentInput.includes("e") || state.currentInput.includes("E")) {
      return;
    }
    state.currentInput += "e";
    renderDisplay();
    return;
  }

  state.currentInput += value;
  renderDisplay();
}

function handleOperator(operator) {
  if (state.lastAction === "equals" && !state.currentInput && state.tokens.length === 0 && hasUsableLastResult()) {
    state.tokens = [state.lastResult];
  }

  if (state.lastAction === "equals") {
    state.lastExpression = "";
    state.lastAction = null;
  }

  if (state.currentInput.endsWith("e") && operator === "-") {
    state.currentInput += "-";
    renderDisplay();
    return;
  }

  if (state.currentInput.endsWith("e")) {
    return;
  }

  if (!state.currentInput && (state.tokens.length === 0 || isOperator(state.tokens[state.tokens.length - 1])) && operator === "-") {
    state.currentInput = "-";
    renderDisplay();
    return;
  }

  if (state.currentInput) {
    pushCurrentInput();
  }

  if (state.tokens.length === 0) {
    return;
  }

  if (isOperator(state.tokens[state.tokens.length - 1])) {
    state.tokens[state.tokens.length - 1] = operator;
  } else {
    state.tokens.push(operator);
  }

  state.lastAction = null;
  renderDisplay();
}

function toggleSign() {
  if (state.currentInput) {
    if (state.currentInput === "-") {
      state.currentInput = "";
      renderDisplay();
      return;
    }
    state.currentInput = state.currentInput.startsWith("-")
      ? state.currentInput.slice(1)
      : `-${state.currentInput}`;
    renderDisplay();
    return;
  }

  if (state.tokens.length && isOperator(state.tokens[state.tokens.length - 1])) {
    state.currentInput = "-";
    renderDisplay();
    return;
  }

  if (hasUsableLastResult()) {
    state.currentInput = state.lastResult.startsWith("-")
      ? state.lastResult.slice(1)
      : `-${state.lastResult}`;
    state.lastResult = "";
    state.lastExpression = "";
    state.tokens = [];
    state.lastAction = null;
    clearSpecialMathFeedback();
    renderDisplay();
  }
}

function applySpecialContext(tokenList, resultString) {
  if (!state.funModeEnabled) {
    clearSpecialMathFeedback();
    return;
  }

  const context = classifySpecialMath({ tokenList, resultString });
  state.lastSpecialContext = context;
  if (context) {
    funBanner.showFunBanner(context.banner, 2600);
  } else {
    funBanner.hideFunBanner();
  }
}

function handleEquals() {
  if (state.currentInput.endsWith("e") || state.currentInput.endsWith("-")) {
    return;
  }

  pushCurrentInput();

  if (!state.tokens.length) {
    return;
  }

  if (isOperator(state.tokens[state.tokens.length - 1])) {
    state.tokens.pop();
  }

  const evaluatedTokens = [...state.tokens];
  const expressionText = formatExpression(evaluatedTokens, "");
  state.lastExpression = expressionText;

  try {
    const result = evaluate(evaluatedTokens);
    const resultString = result.toString();
    state.lastResult = resultString;

    const formattedResult = formatResultToFit(resultString, resultEl);
    state.history.unshift({
      expression: expressionText,
      displayResult: formattedResult,
      rawResult: resultString,
    });
    state.history = state.history.slice(0, 10);
    updateHistory();

    applySpecialContext(evaluatedTokens, resultString);
    state.tokens = [];
    state.currentInput = "";
    state.lastAction = "equals";
    renderDisplay();
  } catch (error) {
    state.lastResult = "Error";
    state.tokens = [];
    state.currentInput = "";
    state.lastAction = "equals";
    applySpecialContext(evaluatedTokens, state.lastResult);
    renderDisplay();
  }
}

function speakCurrent() {
  const specialContext = state.lastAction === "equals" && !state.currentInput && state.tokens.length === 0
    ? state.lastSpecialContext
    : null;

  const text = buildSpeechText({
    currentInput: state.currentInput,
    lastResult: state.lastResult,
    displayText: resultEl?.textContent || "",
    specialContext,
    funModeEnabled: state.funModeEnabled,
    numberToWords,
  });

  if (!text) {
    return;
  }

  const speakButton = document.querySelector(".key.speak");
  speakText({
    text,
    selectedVoiceName: state.selectedVoiceName,
    voiceSettings: state.voiceSettings,
    speakButton,
    speechSynthesis: window.speechSynthesis,
    SpeechSynthesisUtteranceCtor: globalThis.SpeechSynthesisUtterance,
  });
}

if (keypad) {
  keypad.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) {
      return;
    }

    const action = button.dataset.action;
    const value = button.dataset.value;

    if (action === "digit") {
      handleDigit(value);
      return;
    }

    if (action === "operator") {
      handleOperator(value);
      return;
    }

    if (action === "equals") {
      handleEquals();
      return;
    }

    if (action === "clear") {
      clearAll();
      return;
    }

    if (action === "backspace") {
      backspace();
      return;
    }

    if (action === "toggle-sign") {
      toggleSign();
      return;
    }

    if (action === "speak") {
      speakCurrent();
    }
  });
}

if (historyList) {
  historyList.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || button.dataset.index === undefined) {
      return;
    }

    const index = Number(button.dataset.index);
    const entry = state.history[index];
    if (!entry) {
      return;
    }

    state.currentInput = entry.rawResult;
    state.lastResult = "";
    state.lastExpression = entry.expression;
    state.tokens = [];
    state.lastAction = null;
    clearSpecialMathFeedback();
    renderDisplay();
  });
}

if (voiceButton) {
  voiceButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleVoicePanel();
  });
}

if (voiceSelect) {
  voiceSelect.addEventListener("change", handleVoiceSelection);
}

if (voiceRate) {
  voiceRate.addEventListener("input", (event) => {
    updateVoiceSettingValue("rate", event.target.value);
  });
}

if (voicePitch) {
  voicePitch.addEventListener("input", (event) => {
    updateVoiceSettingValue("pitch", event.target.value);
  });
}

if (voiceVolume) {
  voiceVolume.addEventListener("input", (event) => {
    updateVoiceSettingValue("volume", event.target.value);
  });
}

if (funModeToggle) {
  funModeToggle.addEventListener("change", handleFunModeToggle);
}

if (voiceReset) {
  voiceReset.addEventListener("click", () => {
    resetVoiceSettings();
  });
}

if (voicePanel) {
  voicePanel.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}

document.addEventListener("click", (event) => {
  if (!voicePanel || !voiceButton || voicePanel.hasAttribute("hidden")) {
    return;
  }
  if (!voicePanel.contains(event.target) && event.target !== voiceButton) {
    toggleVoicePanel(false);
  }
});

window.speechSynthesis.addEventListener("voiceschanged", refreshVoiceList);
applyVoiceSettings(getStoredVoiceSettings());
applyFunMode(getStoredFunMode());
refreshVoiceList();

document.addEventListener("keydown", (event) => {
  if (event.key >= "0" && event.key <= "9") {
    handleDigit(event.key);
    return;
  }

  if (event.key === ".") {
    handleDigit(".");
    return;
  }

  if (event.key.toLowerCase() === "e") {
    handleDigit("e");
    return;
  }

  if (["+", "-", "*", "/"].includes(event.key)) {
    if (event.key === "-" && state.currentInput.endsWith("e")) {
      state.currentInput += "-";
      renderDisplay();
      return;
    }
    handleOperator(event.key);
    return;
  }

  if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    handleEquals();
  }

  if (event.key === "Backspace") {
    backspace();
  }

  if (event.key === "Escape") {
    clearAll();
  }
});

renderDisplay();

function getState() {
  return state;
}

export {
  backspace,
  clearAll,
  getState,
  handleDigit,
  handleEquals,
  handleOperator,
  speakCurrent,
  toggleSign,
};
