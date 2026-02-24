import { isOperator } from "./evaluate.js";

const UNKNOWN_SPEECH = "unknown number - error error error";
const BANNER_WARP_JUMP = "Warp jump! Dividing by zero launched us to infinity.";
const BANNER_COSMIC_RULE = "Cosmic rule: infinity stays infinity.";
const BANNER_COSMIC_FLIP = "Cosmic flip! Now we are at negative infinity.";
const BANNER_INDETERMINATE = "Mission unknown: this infinity move is indeterminate.";
const BANNER_FALLBACK_INFINITY = "Deep space math: still infinity!";
const BANNER_FALLBACK_NEG_INFINITY = "Deep space math: negative infinity!";

function normalizeToken(token) {
  return String(token ?? "").trim().replace(/,/g, "");
}

function isInfinityToken(token) {
  const normalized = normalizeToken(token).toLowerCase();
  return normalized === "infinity" || normalized === "+infinity" || normalized === "-infinity";
}

function isPositiveInfinityToken(token) {
  const normalized = normalizeToken(token).toLowerCase();
  return normalized === "infinity" || normalized === "+infinity";
}

function isNegativeInfinityToken(token) {
  return normalizeToken(token).toLowerCase() === "-infinity";
}

function parseFiniteToken(token) {
  const normalized = normalizeToken(token);
  if (!normalized || isInfinityToken(normalized)) {
    return null;
  }
  const numeric = Number(normalized);
  if (!Number.isFinite(numeric)) {
    return null;
  }
  return numeric;
}

function isZeroToken(token) {
  const numeric = parseFiniteToken(token);
  return numeric !== null && numeric === 0;
}

function isFiniteNonZeroToken(token) {
  const numeric = parseFiniteToken(token);
  return numeric !== null && numeric !== 0;
}

function isFiniteToken(token) {
  return parseFiniteToken(token) !== null;
}

function isFiniteNegativeToken(token) {
  const numeric = parseFiniteToken(token);
  return numeric !== null && numeric < 0;
}

function isIndeterminateBinary(left, operator, right) {
  if (operator === "*" && ((isInfinityToken(left) && isZeroToken(right)) || (isZeroToken(left) && isInfinityToken(right)))) {
    return "infinity_times_zero";
  }
  if (operator === "-" && isInfinityToken(left) && isInfinityToken(right)) {
    return "infinity_minus_infinity";
  }
  if (operator === "/" && isInfinityToken(left) && isInfinityToken(right)) {
    return "infinity_div_infinity";
  }
  if (operator === "/" && isZeroToken(left) && isZeroToken(right)) {
    return "zero_div_zero";
  }
  if (
    operator === "+" &&
    ((isPositiveInfinityToken(left) && isNegativeInfinityToken(right)) ||
      (isNegativeInfinityToken(left) && isPositiveInfinityToken(right)))
  ) {
    return "infinity_plus_negative_infinity";
  }
  return null;
}

function isStableInfinityBinary(left, operator, right) {
  if (operator === "*" && ((isInfinityToken(left) && isFiniteNonZeroToken(right)) || (isFiniteNonZeroToken(left) && isInfinityToken(right)))) {
    return true;
  }
  if (operator === "/" && isInfinityToken(left) && isFiniteNonZeroToken(right)) {
    return true;
  }
  if (
    (operator === "+" || operator === "-") &&
    ((isInfinityToken(left) && isFiniteToken(right)) || (isFiniteToken(left) && isInfinityToken(right)))
  ) {
    return true;
  }
  return false;
}

function isSignFlipToNegativeInfinity(left, operator, right) {
  if (operator === "*") {
    return (
      (isPositiveInfinityToken(left) && isFiniteNegativeToken(right)) ||
      (isFiniteNegativeToken(left) && isPositiveInfinityToken(right))
    );
  }
  if (operator === "/") {
    return isPositiveInfinityToken(left) && isFiniteNegativeToken(right);
  }
  return false;
}

function isFiniteDivideByZero(left, operator, right) {
  return operator === "/" && isFiniteToken(left) && isZeroToken(right);
}

function classifyResultKind(resultString) {
  const normalized = normalizeToken(resultString).toLowerCase();
  if (!normalized) {
    return null;
  }
  if (normalized.includes("error")) {
    return "error";
  }
  if (normalized === "nan") {
    return "indeterminate";
  }
  if (normalized === "infinity" || normalized === "+infinity") {
    return "infinity";
  }
  if (normalized === "-infinity") {
    return "negative_infinity";
  }
  return null;
}

function getSpeechByKind(kind) {
  if (kind === "infinity") {
    return "infinity";
  }
  if (kind === "negative_infinity") {
    return "negative infinity";
  }
  return UNKNOWN_SPEECH;
}

function buildFallbackBanner(kind) {
  if (kind === "negative_infinity") {
    return BANNER_FALLBACK_NEG_INFINITY;
  }
  if (kind === "infinity") {
    return BANNER_FALLBACK_INFINITY;
  }
  return BANNER_INDETERMINATE;
}

export function classifySpecialMath({ tokenList, resultString }) {
  const kind = classifyResultKind(resultString);
  if (!kind) {
    return null;
  }

  const speech = getSpeechByKind(kind);
  const fallback = {
    kind,
    subtype: "generic",
    speech,
    banner: buildFallbackBanner(kind),
  };

  if (!Array.isArray(tokenList) || tokenList.length !== 3 || !isOperator(tokenList[1])) {
    if (kind === "indeterminate" || kind === "error") {
      return {
        ...fallback,
        subtype: kind === "error" ? "error" : "indeterminate",
        banner: BANNER_INDETERMINATE,
      };
    }
    return fallback;
  }

  const [left, operator, right] = tokenList;

  const indeterminateSubtype = isIndeterminateBinary(left, operator, right);
  if (kind === "indeterminate" || kind === "error" || indeterminateSubtype) {
    return {
      kind: kind === "error" ? "error" : "indeterminate",
      subtype: indeterminateSubtype || (kind === "error" ? "error" : "indeterminate"),
      speech: UNKNOWN_SPEECH,
      banner: BANNER_INDETERMINATE,
    };
  }

  if (isFiniteDivideByZero(left, operator, right)) {
    return {
      kind,
      subtype: "divide_by_zero",
      speech,
      banner: BANNER_WARP_JUMP,
    };
  }

  if (isStableInfinityBinary(left, operator, right)) {
    if (kind === "negative_infinity" && isSignFlipToNegativeInfinity(left, operator, right)) {
      return {
        kind,
        subtype: "sign_flip_negative_infinity",
        speech,
        banner: BANNER_COSMIC_FLIP,
      };
    }

    return {
      kind,
      subtype: "infinity_stays_infinity",
      speech,
      banner: BANNER_COSMIC_RULE,
    };
  }

  return fallback;
}

export const specialMathPhrases = {
  UNKNOWN_SPEECH,
  BANNER_WARP_JUMP,
  BANNER_COSMIC_RULE,
  BANNER_COSMIC_FLIP,
  BANNER_INDETERMINATE,
  BANNER_FALLBACK_INFINITY,
  BANNER_FALLBACK_NEG_INFINITY,
};
