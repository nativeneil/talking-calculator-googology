function getDecimalCtor() {
  return globalThis.Decimal || globalThis.window?.Decimal || null;
}

export function getHistoryEntryLabel(entry) {
  return `${entry.expression} = ${entry.displayResult}`;
}

export function formatExpression(tokenList, pendingInput) {
  const displayTokens = tokenList.map((token) => formatTokenForDisplay(token));
  if (pendingInput) {
    displayTokens.push(formatInputForDisplay(pendingInput));
  }
  return displayTokens.join(" ");
}

export function formatTokenForDisplay(token) {
  if (token === "*") return "×";
  if (token === "/") return "÷";
  if (token === "+" || token === "-") return token;
  return formatInputForDisplay(token);
}

export function formatInputForDisplay(value) {
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

export function formatNumberForDisplay(value) {
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

function getResultFont(resultEl) {
  const style = window.getComputedStyle(resultEl);
  return `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
}

function measureResultTextWidth(text, resultEl) {
  const canvas = measureResultTextWidth.canvas || document.createElement("canvas");
  measureResultTextWidth.canvas = canvas;
  const context = canvas.getContext("2d");
  context.font = getResultFont(resultEl);
  return context.measureText(text).width;
}

function fitsResultDisplay(text, resultEl) {
  const availableWidth = resultEl.clientWidth;
  return measureResultTextWidth(text, resultEl) <= Math.max(availableWidth - 2, 0);
}

export function formatResultToFit(value, resultEl) {
  if (!value) {
    return value;
  }
  if (value.toLowerCase().includes("error")) {
    return value;
  }

  const formatted = formatNumberForDisplay(value);
  if (fitsResultDisplay(formatted, resultEl)) {
    return formatted;
  }

  const DecimalCtor = getDecimalCtor();
  if (!DecimalCtor) {
    return formatted;
  }

  let decimalValue = null;
  try {
    decimalValue = new DecimalCtor(value);
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
    if (fitsResultDisplay(candidate, resultEl)) {
      return candidate;
    }
  }

  for (let precision = maxSig; precision >= 1; precision -= 1) {
    const candidate = decimalValue.toExponential(precision - 1);
    if (fitsResultDisplay(candidate, resultEl)) {
      return candidate;
    }
  }

  return decimalValue.toExponential(0);
}

export function updateDisplay(state, resultEl, expressionEl) {
  let visibleValue = state.currentInput || state.lastResult || "0";
  if (state.currentInput) {
    visibleValue = formatInputForDisplay(state.currentInput);
  } else if (state.lastResult) {
    visibleValue = formatResultToFit(state.lastResult, resultEl);
  }
  resultEl.textContent = visibleValue;
  if (state.currentInput) {
    resultEl.scrollLeft = resultEl.scrollWidth;
  }

  const activeExpression = state.currentInput
    ? formatExpression(state.tokens, state.currentInput)
    : state.tokens.length
      ? formatExpression(state.tokens, "")
      : state.lastExpression;

  expressionEl.textContent = activeExpression;
  expressionEl.scrollLeft = expressionEl.scrollWidth;
}
