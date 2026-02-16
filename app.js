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
const voiceReset = document.getElementById("voiceReset");

let tokens = [];
let currentInput = "";
let lastResult = "";
let lastExpression = "";
let lastAction = null;
let history = [];
let availableVoices = [];
let selectedVoiceName = "";
const defaultVoiceSettings = {
  rate: 1,
  pitch: 1,
  volume: 1,
};

let voiceSettings = {
  ...defaultVoiceSettings,
};

function getHistoryEntryLabel(entry) {
  return `${entry.expression} = ${entry.displayResult}`;
}

const digitWords = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

const tensDigitWords = [
  "",
  "ten",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];

const scaleNames = [
  "",
  "thousand",
  "million",
  "billion",
  "trillion",
  "quadrillion",
  "quintillion",
  "sextillion",
  "septillion",
  "octillion",
  "nonillion",
  "decillion",
  "undecillion",
  "duodecillion",
  "tredecillion",
  "quattuordecillion",
  "quindecillion",
  "sexdecillion",
  "septendecillion",
  "octodecillion",
  "novemdecillion",
  "vigintillion",
  "unvigintillion",
  "duovigintillion",
  "trevigintillion",
  "quattuorvigintillion",
  "quinvigintillion",
  "sexvigintillion",
  "septenvigintillion",
  "octovigintillion",
  "novemvigintillion",
  "trigintillion",
  "untrigintillion",
  "duotrigintillion",
  "trestrigintillion",
  "quattuortrigintillion",
  "quintrigintillion",
  "sextrigintillion",
  "septentrigintillion",
  "octotrigintillion",
  "novemtrigintillion",
  "quadragintillion",
  "unquadragintillion",
  "duoquadragintillion",
  "tresquadragintillion",
  "quattuorquadragintillion",
  "quinquadragintillion",
  "sexquadragintillion",
  "septenquadragintillion",
  "octoquadragintillion",
  "novemquadragintillion",
  "quinquagintillion",
  "unquinquagintillion",
  "duoquinquagintillion",
  "tresquinquagintillion",
  "quattuorquinquagintillion",
  "quinquinquagintillion",
  "sexquinquagintillion",
  "septenquinquagintillion",
  "octoquinquagintillion",
  "novemquinquagintillion",
  "sexagintillion",
  "unsexagintillion",
  "duosexagintillion",
  "tresexagintillion",
  "quattuorsexagintillion",
  "quinsexagintillion",
  "sexsexagintillion",
  "septensexagintillion",
  "octosexagintillion",
  "novemsexagintillion",
  "septuagintillion",
  "unseptuagintillion",
  "duoseptuagintillion",
  "treseptuagintillion",
  "quattuorseptuagintillion",
  "quinseptuagintillion",
  "sexseptuagintillion",
  "septenseptuagintillion",
  "octoseptuagintillion",
  "novemseptuagintillion",
  "octogintillion",
  "unoctogintillion",
  "duooctogintillion",
  "treoctogintillion",
  "quattuoroctogintillion",
  "quinoctogintillion",
  "sexoctogintillion",
  "septenoctogintillion",
  "octooctogintillion",
  "novemoctogintillion",
  "nonagintillion",
  "unnonagintillion",
  "duononagintillion",
  "trenonagintillion",
  "quattuornonagintillion",
  "quinnonagintillion",
  "sexnonagintillion",
  "septennonagintillion",
  "octononagintillion",
  "novemnonagintillion",
  "centillion",
];

const googolismPowerNames = {
  0: "one",
  1: "ten",
  2: "hundred",
  3: "thousand",
  4: "ten thousand",
  5: "hundred thousand",
  6: "million",
  9: "billion",
  12: "trillion",
  15: "quadrillion",
  18: "quintillion",
  21: "sextillion",
  24: "septillion",
  27: "octillion",
  30: "nonillion",
  33: "decillion",
  36: "undecillion",
  39: "duodecillion",
  42: "tredecillion",
  45: "quattuordecillion",
  48: "quindecillion",
  51: "sexdecillion",
  54: "septendecillion",
  57: "octodecillion",
  60: "novemdecillion",
  63: "vigintillion",
  66: "unvigintillion",
  69: "duovigintillion",
  72: "tresvigintillion",
  75: "quattuorvigintillion",
  78: "quinvigintillion",
  81: "sexvigintillion",
  84: "septenvigintillion",
  87: "octovigintillion",
  90: "novemvigintillion",
  93: "trigintillion",
  96: "untrigintillion",
  99: "duotrigintillion",
  102: "trestrigintillion",
  105: "quattuortrigintillion",
  108: "quintrigintillion",
  111: "sextrigintillion",
  114: "septentrigintillion",
  117: "octotrigintillion",
  120: "novemtrigintillion",
  123: "quadragintillion",
  126: "unquadragintillion",
  129: "duoquadragintillion",
  132: "tresquadragintillion",
  135: "quattuorquadragintillion",
  138: "quinquadragintillion",
  141: "sexquadragintillion",
  144: "septenquadragintillion",
  147: "octoquadragintillion",
  150: "novemquadragintillion",
  153: "quinquagintillion",
  156: "unquinquagintillion",
  159: "duoquinquagintillion",
  162: "tresquinquagintillion",
  165: "quattuorquinquagintillion",
  168: "quinquinquagintillion",
  171: "sexquinquagintillion",
  174: "septenquinquagintillion",
  177: "octoquinquagintillion",
  180: "novemquinquagintillion",
  183: "sexagintillion",
  186: "unsexagintillion",
  189: "duosexagintillion",
  192: "tresexagintillion",
  195: "quattuorsexagintillion",
  198: "quinsexagintillion",
  201: "sexsexagintillion",
  204: "septensexagintillion",
  207: "octosexagintillion",
  210: "novemsexagintillion",
  213: "septuagintillion",
  216: "unseptuagintillion",
  219: "duoseptuagintillion",
  222: "treseptuagintillion",
  225: "quattuorseptuagintillion",
  228: "quinseptuagintillion",
  231: "sexseptuagintillion",
  234: "septenseptuagintillion",
  237: "octoseptuagintillion",
  240: "novemseptuagintillion",
  243: "octogintillion",
  246: "unoctogintillion",
  249: "duooctogintillion",
  252: "tresoctogintillion",
  255: "quattuoroctogintillion",
  258: "quinoctogintillion",
  261: "sexoctogintillion",
  264: "septenoctogintillion",
  267: "octooctogintillion",
  270: "novemoctogintillion",
  273: "nonagintillion",
  276: "unnonagintillion",
  279: "duononagintillion",
  282: "tresnonagintillion",
  285: "quattuornonagintillion",
  288: "quinnonagintillion",
  291: "sexnonagintillion",
  294: "septennonagintillion",
  297: "octononagintillion",
  300: "novemnonagintillion",
  100: "googol",
  200: "gargoogol",
  302: "ecetonchunk",
  303: "centillion",
  304: "ecetonbunch",
  306: "uncentillion",
  308: "ecetoncrowd",
  309: "duocentillion",
  312: "trescentillion",
  333: "decicentillion",
  360: "sexagintillion",
  363: "viginticentillion",
  393: "trigintacentillion",
  423: "quadragintacentillion",
  453: "quinquagintacentillion",
  603: "ducentillion",
  903: "trecentillion",
  1203: "quadringentillion",
  1503: "quingentillion",
  1803: "sescentillion",
  2103: "septingentillion",
  2403: "octingentillion",
  2703: "nongentillion",
  3003: "millillion",
};

const standardSmallIllionNames = {
  1: "million",
  2: "billion",
  3: "trillion",
  4: "quadrillion",
  5: "quintillion",
  6: "sextillion",
  7: "septillion",
  8: "octillion",
  9: "nonillion",
  10: "decillion",
};

const latinUnitsPrefixes = [
  "",
  "un",
  "duo",
  "tres",
  "quattuor",
  "quin",
  "sex",
  "septen",
  "octo",
  "novem",
];

const latinTensPrefixes = [
  "",
  "deci",
  "viginti",
  "triginta",
  "quadraginta",
  "quinquaginta",
  "sexaginta",
  "septuaginta",
  "octoginta",
  "nonaginta",
];

const latinHundredsPrefixes = [
  "",
  "centi",
  "ducenti",
  "trecenti",
  "quadringenti",
  "quingenti",
  "sescenti",
  "septingenti",
  "octingenti",
  "nongenti",
];

function normalizeNonNegativeExponent(exponentValue) {
  if (typeof exponentValue === "bigint") {
    return exponentValue >= 0n ? exponentValue : null;
  }
  if (typeof exponentValue === "number") {
    if (!Number.isFinite(exponentValue) || exponentValue < 0 || !Number.isInteger(exponentValue)) {
      return null;
    }
    return BigInt(exponentValue);
  }
  if (typeof exponentValue === "string" && /^\+?\d+$/.test(exponentValue)) {
    return BigInt(exponentValue);
  }
  return null;
}

function toSafeNumber(bigintValue) {
  if (bigintValue > BigInt(Number.MAX_SAFE_INTEGER)) {
    return null;
  }
  return Number(bigintValue);
}

function getOverridePowerName(exponentValue) {
  const safeExponent = toSafeNumber(exponentValue);
  if (safeExponent === null) {
    return null;
  }
  return googolismPowerNames[safeExponent] || null;
}

function applyRepoDialectSmoothing(prefix) {
  let smoothed = prefix;
  smoothed = smoothed.replace(/tre(?=[aeiou])/g, "tres");
  smoothed = smoothed.replace(/([aeiou])\1+/g, "$1");
  return smoothed;
}

function finalizeIllionName(prefix) {
  const smoothedPrefix = applyRepoDialectSmoothing(prefix);
  let name = `${smoothedPrefix}illion`;
  name = name.replace(/([ai])illion$/, "illion");
  name = name.replace(/([aeiou])\1+/g, "$1");
  return name;
}

function buildLatinPrefixUnderOneThousand(value) {
  if (!Number.isInteger(value) || value < 0 || value > 999) {
    return "";
  }
  if (value === 0) {
    return "";
  }

  const units = value % 10;
  const tens = Math.floor(value / 10) % 10;
  const hundreds = Math.floor(value / 100);
  return `${latinUnitsPrefixes[units]}${latinTensPrefixes[tens]}${latinHundredsPrefixes[hundreds]}`;
}

function buildMilliaChainPrefix(index) {
  if (index < 1000n) {
    return buildLatinPrefixUnderOneThousand(Number(index));
  }

  const higher = index / 1000n;
  const lower = Number(index % 1000n);
  const higherPrefix = higher === 1n ? "" : buildMilliaChainPrefix(higher);
  const lowerPrefix = lower === 0 ? "n" : buildLatinPrefixUnderOneThousand(lower);
  return `${higherPrefix}milli${lowerPrefix}`;
}

function buildIllionNameFromIndex(indexValue) {
  const index = normalizeNonNegativeExponent(indexValue);
  if (index === null || index < 1n) {
    return null;
  }

  const safeIndex = toSafeNumber(index);
  if (safeIndex !== null) {
    const smallName = standardSmallIllionNames[safeIndex];
    if (smallName) {
      return smallName;
    }
    if (safeIndex <= 999) {
      return finalizeIllionName(buildLatinPrefixUnderOneThousand(safeIndex));
    }
  }

  const prefix = buildMilliaChainPrefix(index);
  if (!prefix) {
    return null;
  }
  return finalizeIllionName(prefix);
}

function getScaleNameByScaleIndex(scaleIndexValue) {
  const scaleIndex = normalizeNonNegativeExponent(scaleIndexValue);
  if (scaleIndex === null) {
    return null;
  }
  if (scaleIndex === 0n) {
    return "";
  }
  if (scaleIndex === 1n) {
    return "thousand";
  }

  const exponent = scaleIndex * 3n;
  const overrideName = getOverridePowerName(exponent);
  if (overrideName) {
    return overrideName;
  }

  const safeScaleIndex = toSafeNumber(scaleIndex);
  if (safeScaleIndex !== null && safeScaleIndex < scaleNames.length) {
    return scaleNames[safeScaleIndex];
  }

  return buildIllionNameFromIndex(scaleIndex - 1n);
}

function resolvePowerNameFromExponent(exponentValue, options = {}) {
  const { allowNearestLower = false } = options;
  const exponent = normalizeNonNegativeExponent(exponentValue);
  if (exponent === null) {
    return null;
  }

  const overrideName = getOverridePowerName(exponent);
  if (overrideName) {
    return overrideName;
  }

  const mod = exponent % 3n;
  if (mod === 0n) {
    return getScaleNameByScaleIndex(exponent / 3n);
  }
  if (!allowNearestLower || exponent < 3n) {
    return null;
  }

  const lowerScaleName = getScaleNameByScaleIndex((exponent - mod) / 3n);
  if (!lowerScaleName) {
    return null;
  }
  if (mod === 1n) {
    return `ten ${lowerScaleName}`.trim();
  }
  return `one hundred ${lowerScaleName}`.trim();
}

function parseScientificExponent(exponentText) {
  if (!/^[+-]?\d+$/.test(exponentText)) {
    return null;
  }
  try {
    return BigInt(exponentText);
  } catch (error) {
    return null;
  }
}

function combineMantissaWithPowerName(mantissaWords, powerName) {
  if (!mantissaWords) {
    return "";
  }

  if (mantissaWords === "one") {
    return powerName;
  }
  if (mantissaWords === "negative one") {
    return `negative ${powerName}`;
  }

  const isNegative = mantissaWords.startsWith("negative ");
  const baseMantissa = isNegative ? mantissaWords.slice("negative ".length) : mantissaWords;
  const digitIndex = digitWords.indexOf(baseMantissa);
  if (digitIndex >= 2) {
    if (powerName === "ten" || powerName.startsWith("ten ")) {
      const rest = powerName === "ten" ? "" : powerName.slice(4);
      return `${isNegative ? "negative " : ""}${tensDigitWords[digitIndex]}${rest ? ` ${rest}` : ""}`.trim();
    }
    if (powerName.startsWith("one hundred ")) {
      const rest = powerName.slice("one hundred ".length);
      return `${isNegative ? "negative " : ""}${digitWords[digitIndex]} hundred ${rest}`.trim();
    }
  }

  return `${mantissaWords} ${powerName}`.trim();
}

function getPowerOfTenName(valueStr) {
  if (!/^[1-9]\d*$/.test(valueStr)) {
    return null;
  }

  const match = valueStr.match(/^1(0+)$/);
  if (!match) {
    return null;
  }

  const exponent = BigInt(match[1].length);
  const namedPower = resolvePowerNameFromExponent(exponent, { allowNearestLower: true });
  if (!namedPower) {
    return null;
  }
  if (namedPower.includes(" ")) {
    return namedPower;
  }
  if (exponent === 1n) {
    return namedPower;
  }
  return `one ${namedPower}`;
}

function updateDisplay() {
  let visibleValue = currentInput || lastResult || "0";
  if (currentInput) {
    visibleValue = formatInputForDisplay(currentInput);
  } else if (lastResult) {
    visibleValue = formatResultToFit(lastResult);
  }
  resultEl.textContent = visibleValue;
  if (currentInput) {
    resultEl.scrollLeft = resultEl.scrollWidth;
  }
  const activeExpression = currentInput
    ? formatExpression(tokens, currentInput)
    : tokens.length
      ? formatExpression(tokens, "")
      : lastExpression;
  expressionEl.textContent = activeExpression;
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

function buildVoiceLabel(voice) {
  const lang = voice.lang ? ` (${voice.lang})` : "";
  return `${voice.name}${lang}`;
}

function populateVoiceSelect(voices) {
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
  availableVoices = (englishVoices.length ? englishVoices : voices)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));
  populateVoiceSelect(availableVoices);
  const storedName = getStoredVoiceName();
  const fallbackName = getFallbackVoiceName(availableVoices);
  selectedVoiceName = availableVoices.some((voice) => voice.name === storedName)
    ? storedName
    : fallbackName;
  if (selectedVoiceName) {
    voiceSelect.value = selectedVoiceName;
  }
}

function setSelectedVoice(name) {
  selectedVoiceName = name;
  saveSelectedVoiceName(name);
}

function applyVoiceSettings(settings) {
  voiceSettings = settings;
  voiceRate.value = String(settings.rate);
  voicePitch.value = String(settings.pitch);
  voiceVolume.value = String(settings.volume);
}

function resetVoiceSettings() {
  applyVoiceSettings({
    ...defaultVoiceSettings,
  });
  saveVoiceSettings(voiceSettings);
}

function updateVoiceSettingValue(key, value) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return;
  }
  voiceSettings = {
    ...voiceSettings,
    [key]: numeric,
  };
  saveVoiceSettings(voiceSettings);
}

function toggleVoicePanel(forceState) {
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
  const selected = voiceSelect.value;
  if (selected) {
    setSelectedVoice(selected);
  }
}

function formatExpression(tokenList, pendingInput) {
  const displayTokens = tokenList.map((token) => formatTokenForDisplay(token));
  if (pendingInput) {
    displayTokens.push(formatInputForDisplay(pendingInput));
  }
  return displayTokens.join(" ");
}

function formatTokenForDisplay(token) {
  if (token === "*") return "×";
  if (token === "/") return "÷";
  if (token === "+" || token === "-") return token;
  return formatInputForDisplay(token);
}

function formatInputForDisplay(value) {
  if (!value) {
    return value;
  }
  if (value === "-") {
    return value;
  }
  if (/[eE]/.test(value)) {
    return value;
  }

  const sign = value.startsWith("-") ? "-" : "";
  const unsigned = sign ? value.slice(1) : value;
  const hasTrailingDot = unsigned.endsWith(".");
  const [integerPart, fractionalPart] = unsigned.split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (fractionalPart !== undefined) {
    const safeFraction = hasTrailingDot ? "" : fractionalPart;
    return `${sign}${formattedInteger}.${safeFraction}`;
  }
  return `${sign}${formattedInteger}`;
}

function formatNumberForDisplay(value) {
  if (!value) {
    return value;
  }
  if (value.toLowerCase().includes("error")) {
    return value;
  }
  if (/[eE]/.test(value)) {
    return value;
  }

  const sign = value.startsWith("-") ? "-" : "";
  const unsigned = sign ? value.slice(1) : value;
  const [integerPart, fractionalPart] = unsigned.split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (fractionalPart !== undefined) {
    return `${sign}${formattedInteger}.${fractionalPart}`;
  }
  return `${sign}${formattedInteger}`;
}

function getResultFont() {
  const style = window.getComputedStyle(resultEl);
  return `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
}

function measureResultTextWidth(text) {
  const canvas = measureResultTextWidth.canvas || document.createElement("canvas");
  measureResultTextWidth.canvas = canvas;
  const context = canvas.getContext("2d");
  context.font = getResultFont();
  return context.measureText(text).width;
}

function fitsResultDisplay(text) {
  const availableWidth = resultEl.clientWidth;
  return measureResultTextWidth(text) <= Math.max(availableWidth - 2, 0);
}

function formatResultToFit(value) {
  if (!value) {
    return value;
  }
  if (value.toLowerCase().includes("error")) {
    return value;
  }

  const formatted = formatNumberForDisplay(value);
  if (fitsResultDisplay(formatted)) {
    return formatted;
  }

  let decimalValue = null;
  try {
    decimalValue = new Decimal(value);
  } catch (error) {
    return formatted;
  }

  if (!decimalValue.isFinite()) {
    return formatted;
  }

  const maxSig = Math.min(decimalValue.sd(), 60);
  for (let precision = maxSig; precision >= 1; precision -= 1) {
    const rounded = decimalValue.toSignificantDigits(precision).toString();
    const candidate = formatNumberForDisplay(rounded);
    if (fitsResultDisplay(candidate)) {
      return candidate;
    }
  }

  for (let precision = maxSig; precision >= 1; precision -= 1) {
    const candidate = decimalValue.toExponential(precision - 1);
    if (fitsResultDisplay(candidate)) {
      return candidate;
    }
  }

  return decimalValue.toExponential(0);
}

function updateHistory() {
  historyList.innerHTML = "";
  history.forEach((entry, index) => {
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
  if (!currentInput || currentInput === "-") {
    return;
  }
  tokens.push(currentInput);
  currentInput = "";
}

function clearAll() {
  tokens = [];
  currentInput = "";
  lastResult = "";
  lastExpression = "";
  lastAction = null;
  updateDisplay();
}

function backspace() {
  if (currentInput) {
    currentInput = currentInput.slice(0, -1);
  } else if (tokens.length) {
    const lastToken = tokens.pop();
    if (!isOperator(lastToken)) {
      currentInput = lastToken.slice(0, -1);
    }
  }
  updateDisplay();
}

function isOperator(token) {
  return token === "+" || token === "-" || token === "*" || token === "/";
}

function handleDigit(value) {
  if (lastAction === "equals") {
    tokens = [];
    lastResult = "";
    lastExpression = "";
    lastAction = null;
  }

  if (value === ".") {
    if (currentInput.includes("e") || currentInput.includes("E")) {
      return;
    }
    if (currentInput.includes(".")) {
      return;
    }
    currentInput = currentInput ? `${currentInput}.` : "0.";
    updateDisplay();
    return;
  }

  if (value === "e") {
    if (!currentInput || currentInput.includes("e") || currentInput.includes("E")) {
      return;
    }
    currentInput += "e";
    updateDisplay();
    return;
  }

  currentInput += value;
  updateDisplay();
}

function handleOperator(operator) {
  if (lastAction === "equals") {
    lastExpression = "";
  }
  if (currentInput.endsWith("e") && operator === "-") {
    currentInput += "-";
    updateDisplay();
    return;
  }
  if (currentInput.endsWith("e")) {
    return;
  }

  if (!currentInput && (tokens.length === 0 || isOperator(tokens[tokens.length - 1])) && operator === "-") {
    currentInput = "-";
    updateDisplay();
    return;
  }

  if (!currentInput && tokens.length === 0 && lastResult) {
    tokens = [lastResult];
  }

  if (currentInput) {
    pushCurrentInput();
  }

  if (tokens.length === 0) {
    return;
  }

  if (isOperator(tokens[tokens.length - 1])) {
    tokens[tokens.length - 1] = operator;
  } else {
    tokens.push(operator);
  }

  lastAction = null;
  updateDisplay();
}

function toggleSign() {
  if (currentInput) {
    if (currentInput === "-") {
      currentInput = "";
      updateDisplay();
      return;
    }
    currentInput = currentInput.startsWith("-")
      ? currentInput.slice(1)
      : `-${currentInput}`;
    updateDisplay();
    return;
  }

  if (tokens.length && isOperator(tokens[tokens.length - 1])) {
    currentInput = "-";
    updateDisplay();
    return;
  }

  if (lastResult) {
    currentInput = lastResult.startsWith("-")
      ? lastResult.slice(1)
      : `-${lastResult}`;
    lastResult = "";
    lastExpression = "";
    tokens = [];
    lastAction = null;
    updateDisplay();
  }
}

function handleEquals() {
  if (currentInput.endsWith("e") || currentInput.endsWith("-")) {
    return;
  }

  pushCurrentInput();

  if (!tokens.length) {
    return;
  }

  if (isOperator(tokens[tokens.length - 1])) {
    tokens.pop();
  }

  const expressionText = formatExpression(tokens, "");
  lastExpression = expressionText;

  try {
    const result = evaluate(tokens);
    const resultString = result.toString();
    lastResult = resultString;
    const formattedResult = formatResultToFit(resultString);
    history.unshift({
      expression: expressionText,
      displayResult: formattedResult,
      rawResult: resultString,
    });
    history = history.slice(0, 10);
    updateHistory();
    tokens = [];
    currentInput = "";
    lastAction = "equals";
    updateDisplay();
  } catch (error) {
    lastResult = "Error";
    tokens = [];
    currentInput = "";
    lastAction = "equals";
    updateDisplay();
  }
}

function evaluate(tokenList) {
  const output = [];
  const operators = [];
  const precedence = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
  };

  tokenList.forEach((token) => {
    if (!isOperator(token)) {
      output.push(token);
      return;
    }

    while (
      operators.length &&
      precedence[operators[operators.length - 1]] >= precedence[token]
    ) {
      output.push(operators.pop());
    }
    operators.push(token);
  });

  while (operators.length) {
    output.push(operators.pop());
  }

  const stack = [];
  output.forEach((token) => {
    if (!isOperator(token)) {
      stack.push(new Decimal(token));
      return;
    }

    const right = stack.pop();
    const left = stack.pop();
    if (!left || !right) {
      throw new Error("Invalid expression");
    }

    switch (token) {
      case "+":
        stack.push(left.plus(right));
        break;
      case "-":
        stack.push(left.minus(right));
        break;
      case "*":
        stack.push(left.times(right));
        break;
      case "/":
        stack.push(left.div(right));
        break;
      default:
        throw new Error("Unknown operator");
    }
  });

  if (stack.length !== 1) {
    throw new Error("Invalid expression");
  }
  return stack[0];
}

function speakCurrent() {
  const rawValue = currentInput || lastResult || resultEl.textContent.trim();
  const text = numberToWords(rawValue);
  if (!text) {
    return;
  }
  const speechText = makeSpeechFriendlyUtteranceText(text);

  const speakButton = document.querySelector('.key.speak');

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(speechText);
  const voices = window.speechSynthesis.getVoices();
  const selectedVoice = voices.find((voice) => voice.name === selectedVoiceName);
  const fallbackVoice = voices.find((voice) => voice.lang && voice.lang.startsWith("en-GB"));
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  } else if (fallbackVoice) {
    utterance.voice = fallbackVoice;
  }
  utterance.rate = voiceSettings.rate;
  utterance.pitch = voiceSettings.pitch;
  utterance.volume = voiceSettings.volume;

  // Add speaking animation
  if (speakButton) {
    speakButton.classList.add('speaking');
    const speakLabel = speakButton.querySelector('.speak-label');
    if (speakLabel) {
      speakLabel.textContent = 'Speaking';
    }
  }

  utterance.onend = () => {
    if (speakButton) {
      speakButton.classList.remove('speaking');
      const speakLabel = speakButton.querySelector('.speak-label');
      if (speakLabel) {
        speakLabel.textContent = 'Speak';
      }
    }
  };

  utterance.onerror = () => {
    if (speakButton) {
      speakButton.classList.remove('speaking');
      const speakLabel = speakButton.querySelector('.speak-label');
      if (speakLabel) {
        speakLabel.textContent = 'Speak';
      }
    }
  };

  window.speechSynthesis.speak(utterance);
}

function makeSpeechFriendlyUtteranceText(text) {
  return text.replace(/\b[a-z]+illion\b/gi, (word) => {
    if (!/milli/i.test(word) || word.length < 15) {
      return word;
    }
    return word
      .replace(/milli/gi, " milli ")
      .replace(/\s+/g, " ")
      .trim();
  });
}

function basicNumberToWords(valueStr) {
  let normalized = normalizeNumberString(valueStr);
  if (!normalized) {
    return "";
  }

  let prefix = "";
  if (normalized.startsWith("-")) {
    prefix = "negative ";
    normalized = normalized.slice(1);
  }

  const hasDecimal = normalized.includes(".");
  let [integerPart, fractionalPart = ""] = normalized.split(".");
  integerPart = integerPart.replace(/^0+/, "") || "0";

  let words = integerToWords(integerPart);
  if (!words) {
    words = "zero";
  }

  if (hasDecimal) {
    const fraction = fractionalPart === "" ? "0" : fractionalPart;
    const fractionWords = fraction
      .split("")
      .map((digit) => digitWords[Number(digit)])
      .join(" ");
    words = `${words} point ${fractionWords}`;
  }

  return `${prefix}${words}`.trim();
}

function numberToWords(valueStr) {
  if (!valueStr) {
    return "";
  }

  const trimmedLower = valueStr.trim().toLowerCase();
  if (trimmedLower === "infinity" || trimmedLower === "+infinity") {
    return "infinity and beyond!";
  }
  if (trimmedLower === "-infinity") {
    return "negative infinity and beyond!";
  }

  if (trimmedLower.includes("error")) {
    return "error";
  }

  const scientificMatch = valueStr.trim().match(/^(-?)([0-9]*\.?[0-9]+)[eE]([+-]?\d+)$/);
  if (scientificMatch) {
    const mantissa = scientificMatch[2];
    const exponent = parseScientificExponent(scientificMatch[3]);
    const powerName = exponent !== null && exponent > 0n
      ? resolvePowerNameFromExponent(exponent, { allowNearestLower: true })
      : null;
    if (powerName) {
      const mantissaWords = basicNumberToWords(`${scientificMatch[1]}${mantissa}`);
      if (mantissaWords) {
        return combineMantissaWithPowerName(mantissaWords, powerName);
      }
    }
  }

  let normalized = normalizeNumberString(valueStr);
  if (!normalized) {
    return "";
  }

  let prefix = "";
  if (normalized.startsWith("-")) {
    prefix = "negative ";
    normalized = normalized.slice(1);
  }

  const powerName = getPowerOfTenName(normalized);
  if (powerName) {
    return `${prefix}${powerName}`.trim();
  }

  const singleDigitPowerMatch = normalized.match(/^([1-9])0+$/);
  if (singleDigitPowerMatch) {
    const digit = singleDigitPowerMatch[1];
    const exponent = normalized.length - 1;
    const namedPower = resolvePowerNameFromExponent(exponent, { allowNearestLower: false });
    if (namedPower) {
      if (digit === "1") {
        if (exponent === 1 || namedPower.includes(" ")) {
          return `${prefix}${namedPower}`.trim();
        }
        return `${prefix}one ${namedPower}`.trim();
      }
      const digitNumber = Number(digit);
      if (namedPower === "ten" || namedPower.startsWith("ten ")) {
        const rest = namedPower === "ten" ? "" : namedPower.slice(4);
        return `${prefix}${tensDigitWords[digitNumber]}${rest ? ` ${rest}` : ""}`.trim();
      }
      if (namedPower.startsWith("one hundred ")) {
        const rest = namedPower.slice("one hundred ".length);
        return `${prefix}${digitWords[digitNumber]} hundred ${rest}`.trim();
      }
      return `${prefix}${digitWords[Number(digit)]} ${namedPower}`.trim();
    }
  }

  const hasDecimal = normalized.includes(".");
  let [integerPart, fractionalPart = ""] = normalized.split(".");
  integerPart = integerPart.replace(/^0+/, "") || "0";

  let words = integerToWords(integerPart);
  if (!words) {
    words = "zero";
  }

  if (hasDecimal) {
    const fraction = fractionalPart === "" ? "0" : fractionalPart;
    const fractionWords = fraction
      .split("")
      .map((digit) => digitWords[Number(digit)])
      .join(" ");
    words = `${words} point ${fractionWords}`;
  }

  return `${prefix}${words}`.trim();
}

function normalizeNumberString(valueStr) {
  const trimmed = valueStr.trim();
  if (!trimmed) {
    return null;
  }

  const cleaned = trimmed.replace(/,/g, "");
  if (cleaned.includes("Infinity") || cleaned.includes("NaN")) {
    return null;
  }

  if (/[eE]/.test(cleaned)) {
    return expandScientific(cleaned);
  }

  return cleaned;
}

function expandScientific(valueStr) {
  const match = valueStr.trim().match(/^(-?)([0-9]*\.?[0-9]+)[eE]([+-]?\d+)$/);
  if (!match) {
    return valueStr;
  }

  const sign = match[1];
  const mantissa = match[2];
  const exponent = Number(match[3]);
  const parts = mantissa.split(".");
  const digits = parts.join("");
  const decimalPlaces = parts[1] ? parts[1].length : 0;
  const shift = exponent - decimalPlaces;

  if (shift >= 0) {
    return `${sign}${digits}${"0".repeat(shift)}`;
  }

  const position = digits.length + shift;
  if (position > 0) {
    return `${sign}${digits.slice(0, position)}.${digits.slice(position)}`;
  }

  return `${sign}0.${"0".repeat(Math.abs(position))}${digits}`;
}

function integerToWords(intStr) {
  if (intStr === "0") {
    return "zero";
  }

  if (/^[1-9]0{100}$/.test(intStr)) {
    return `${digitWords[Number(intStr[0])]} googol`;
  }

  const groups = [];
  for (let i = intStr.length; i > 0; i -= 3) {
    const start = Math.max(i - 3, 0);
    groups.unshift(intStr.slice(start, i));
  }

  const words = [];
  let lastGroupValue = 0;
  let hasMissingScale = false;

  groups.forEach((group, index) => {
    const value = Number(group);
    const scaleIndex = groups.length - 1 - index;
    if (value === 0) {
      if (scaleIndex === 0) {
        lastGroupValue = value;
      }
      return;
    }

    let groupWords = convertHundreds(value);
    const scale = getScaleNameByScaleIndex(BigInt(scaleIndex));
    if (scale === null) {
      hasMissingScale = true;
      return;
    }
    if (scale) {
      groupWords += ` ${scale}`;
    }
    words.push(groupWords);
    if (scaleIndex === 0) {
      lastGroupValue = value;
    }
  });

  if (hasMissingScale) {
    return `unnamed number, ten to the power of ${intStr.length - 1}`;
  }

  if (words.length > 1 && lastGroupValue > 0 && lastGroupValue < 100) {
    const last = words.pop();
    words[words.length - 1] = `${words[words.length - 1]} and ${last}`;
  }

  return words.join(" ");
}

function convertHundreds(value) {
  if (value === 0) {
    return "";
  }

  const units = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  const hundreds = Math.floor(value / 100);
  const remainder = value % 100;
  let words = "";

  if (hundreds) {
    words = `${units[hundreds]} hundred`;
    if (remainder) {
      words += " and ";
    }
  }

  if (remainder) {
    if (remainder < 20) {
      words += units[remainder];
    } else {
      const ten = Math.floor(remainder / 10);
      const unit = remainder % 10;
      words += tens[ten];
      if (unit) {
        words += ` ${units[unit]}`;
      }
    }
  }

  return words;
}

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

historyList.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || button.dataset.index === undefined) {
    return;
  }

  const index = Number(button.dataset.index);
  const entry = history[index];
  if (!entry) {
    return;
  }

  currentInput = entry.rawResult;
  lastResult = "";
  lastExpression = entry.expression;
  tokens = [];
  lastAction = null;
  updateDisplay();
});

voiceButton.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleVoicePanel();
});

voiceSelect.addEventListener("change", handleVoiceSelection);

voiceRate.addEventListener("input", (event) => {
  updateVoiceSettingValue("rate", event.target.value);
});

voicePitch.addEventListener("input", (event) => {
  updateVoiceSettingValue("pitch", event.target.value);
});

voiceVolume.addEventListener("input", (event) => {
  updateVoiceSettingValue("volume", event.target.value);
});

voiceReset.addEventListener("click", () => {
  resetVoiceSettings();
});

voicePanel.addEventListener("click", (event) => {
  event.stopPropagation();
});

document.addEventListener("click", (event) => {
  if (voicePanel.hasAttribute("hidden")) {
    return;
  }
  if (!voicePanel.contains(event.target) && event.target !== voiceButton) {
    toggleVoicePanel(false);
  }
});

window.speechSynthesis.addEventListener("voiceschanged", refreshVoiceList);
applyVoiceSettings(getStoredVoiceSettings());
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
    if (event.key === "-" && currentInput.endsWith("e")) {
      currentInput += "-";
      updateDisplay();
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

updateDisplay();
