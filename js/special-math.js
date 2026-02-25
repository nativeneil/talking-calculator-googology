import { isOperator } from "./evaluate.js";

const UNKNOWN_SPEECH = "unknown number - error error error";
const MEME_SIX_SEVEN_SPEECH = "Forty-two. Yep, six is still afraid that seven ate nine.";
const BANNER_SIX_SEVEN_MEME = "42 detected: six is still side-eyeing seven for eating nine.";

const LESSON_DIVIDE_BY_ZERO = [
  "Warp jump! Dividing by zero launched us to infinity.",
  "Lesson: any non-zero number divided by zero heads toward infinity.",
  "Space tip: x divided by zero is an infinite launch.",
  "Infinity alert: dividing by zero breaks finite limits.",
  "Mission note: divide-by-zero opens the infinity gate.",
  "Math fact: non-zero over zero points to infinity.",
  "Rocket fuel: zero in the denominator means liftoff to infinity.",
  "Navigation error: dividing by zero sends coordinates off the map.",
  "Crew log: zero divisor detected, altitude now infinite.",
  "Astro tip: you cannot split something into zero groups — infinity results.",
];

const LESSON_INFINITY_STAYS_INFINITY = [
  "Cosmic rule: infinity stays infinity.",
  "Lesson: adding or scaling finite values cannot cap infinity.",
  "Space math: infinity plus finite is still infinity.",
  "Infinity law: finite tweaks do not shrink endless size.",
  "Mission lesson: infinity keeps winning against finite numbers.",
  "Rule check: infinity remains infinity under finite operations here.",
  "Star chart: no finite number can outrun infinity.",
  "Crew update: infinity absorbed the finite value without flinching.",
  "Deep space: finite adjustments vanish next to infinity.",
  "Navigation: infinity's heading unchanged — finite course correction ignored.",
];

const LESSON_SIGN_FLIP_NEG_INFINITY = [
  "Cosmic flip! Now we are at negative infinity.",
  "Lesson: multiplying infinity by a negative flips direction.",
  "Sign lesson: positive infinity crossed a negative and turned negative.",
  "Space rule: a negative factor sends infinity below zero forever.",
  "Mission tip: infinity changed sign, not size.",
  "Math fact: infinity with a negative scale becomes negative infinity.",
  "Course reversal: the negative factor flipped infinity downward.",
  "Alert: positive infinity hit a negative and dove to minus infinity.",
  "Crew log: sign bit toggled — we are now heading to negative infinity.",
  "Astro fact: one negative multiplier inverts the infinite direction.",
];

const LESSON_INDETERMINATE = [
  "Mission unknown: this infinity move is indeterminate.",
  "Lesson: this form does not resolve to one numeric value.",
  "Space warning: infinity and zero collided into an undefined result.",
  "Math note: this expression is indeterminate, not finite and not infinite.",
  "Rule check: operations like infinity minus infinity are undefined.",
  "System status: indeterminate form detected, result is not well-defined.",
  "Crew alert: the math engine cannot pick a single answer here.",
  "Deep space paradox: opposing infinities canceled into mystery.",
  "Navigation fail: indeterminate form — no heading can be calculated.",
  "Astro warning: this operation has no well-defined destination.",
];

const LESSON_FALLBACK_INFINITY = [
  "Deep space math: still infinity!",
  "Lesson: we are still in infinite territory.",
  "Space update: result stayed at positive infinity.",
  "Math fact: this path remains unbounded above.",
  "Mission readout: positive infinity confirmed.",
  "Infinity check: no finite limit reached.",
  "Star log: still cruising at positive infinity.",
  "Crew status: infinity holds steady — no ceiling in sight.",
  "Astro update: we remain in the infinite zone.",
  "Navigation: positive infinity locked in, no course change.",
];

const LESSON_FALLBACK_NEG_INFINITY = [
  "Deep space math: negative infinity!",
  "Lesson: the value remains unbounded below.",
  "Space update: result stayed at negative infinity.",
  "Math fact: this path heads endlessly negative.",
  "Mission readout: negative infinity confirmed.",
  "Infinity check: lower bound is still limitless.",
  "Star log: still plummeting at negative infinity.",
  "Crew status: negative infinity holds — no floor in sight.",
  "Astro update: we remain in the negative infinite zone.",
  "Navigation: negative infinity locked in, still descending.",
];

const LESSON_NEGATIVE_DIVIDE_BY_ZERO = [
  "Downward warp! Dividing a negative by zero launched us to negative infinity.",
  "Lesson: a negative number divided by zero plunges toward negative infinity.",
  "Space tip: negative x over zero means a dive to minus infinity.",
  "Gravity alert: negative divided by zero pulls us endlessly downward.",
  "Mission note: negative divide-by-zero opens the downward infinity gate.",
  "Math fact: negative over zero points to negative infinity.",
];

const LESSON_SIGN_FLIP_POS_INFINITY = [
  "Double flip! Two negatives launched us back to positive infinity.",
  "Lesson: negative infinity times a negative flips back to positive.",
  "Sign lesson: two negatives made a positive — infinity is upward again.",
  "Space rule: a double sign flip restores the upward infinite heading.",
  "Mission tip: negative times negative equals positive, even at infinity.",
  "Math fact: sign flip squared returns infinity to the positive side.",
];

const LESSON_INFINITY_TIMES_INFINITY = [
  "Infinity squared! Infinity times infinity is still infinity.",
  "Lesson: multiplying infinities together keeps you infinite.",
  "Space tip: infinity times infinity is an even bigger infinity.",
  "Power surge: two infinities multiplied — result is mega infinity.",
  "Mission note: infinity scaled by infinity stays boundless.",
  "Math fact: the product of two infinities is infinite.",
];

const LESSON_SIXTY_SEVEN_MEME = [
  "67! Why was 6 afraid of 7? Because 7 ate 9... and now 67 showed up!",
  "67 spotted! Six and seven are up to something again.",
  "Alert: 67 detected — six and seven are hanging out together!",
  "67! Looks like 6 finally made peace with 7 after that whole 9 incident.",
  "Fun fact: 67 is 6 and 7 side by side — besties despite the drama.",
  "67! Six leaned on seven. What could go wrong?",
];

const lessonPools = {
  divide_by_zero: LESSON_DIVIDE_BY_ZERO,
  infinity_stays_infinity: LESSON_INFINITY_STAYS_INFINITY,
  sign_flip_negative_infinity: LESSON_SIGN_FLIP_NEG_INFINITY,
  indeterminate: LESSON_INDETERMINATE,
  fallback_infinity: LESSON_FALLBACK_INFINITY,
  fallback_negative_infinity: LESSON_FALLBACK_NEG_INFINITY,
  negative_divide_by_zero: LESSON_NEGATIVE_DIVIDE_BY_ZERO,
  sign_flip_positive_infinity: LESSON_SIGN_FLIP_POS_INFINITY,
  infinity_times_infinity: LESSON_INFINITY_TIMES_INFINITY,
  sixty_seven_meme: LESSON_SIXTY_SEVEN_MEME,
};

const lessonCycle = new Map();

function getNextLesson(lessonKey) {
  const phrases = lessonPools[lessonKey];
  if (!phrases || !phrases.length) {
    return "";
  }

  const index = lessonCycle.get(lessonKey) || 0;
  lessonCycle.set(lessonKey, index + 1);
  return phrases[index % phrases.length];
}

const BANNER_WARP_JUMP = LESSON_DIVIDE_BY_ZERO[0];
const BANNER_COSMIC_RULE = LESSON_INFINITY_STAYS_INFINITY[0];
const BANNER_COSMIC_FLIP = LESSON_SIGN_FLIP_NEG_INFINITY[0];
const BANNER_INDETERMINATE = LESSON_INDETERMINATE[0];
const BANNER_FALLBACK_INFINITY = LESSON_FALLBACK_INFINITY[0];
const BANNER_FALLBACK_NEG_INFINITY = LESSON_FALLBACK_NEG_INFINITY[0];

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

function isFiniteTokenEqual(token, expected) {
  const numeric = parseFiniteToken(token);
  return numeric !== null && numeric === expected;
}

function classifySixSevenMeme(tokenList, resultString) {
  if (!Array.isArray(tokenList) || tokenList.length !== 3 || !isOperator(tokenList[1])) {
    return null;
  }

  const [left, operator, right] = tokenList;
  if (operator !== "*") {
    return null;
  }

  const isSixSevenPair = (
    (isFiniteTokenEqual(left, 6) && isFiniteTokenEqual(right, 7)) ||
    (isFiniteTokenEqual(left, 7) && isFiniteTokenEqual(right, 6))
  );

  if (!isSixSevenPair || !isFiniteTokenEqual(resultString, 42)) {
    return null;
  }

  return {
    kind: "meme_6_7",
    subtype: "six_times_seven_meme",
    speech: MEME_SIX_SEVEN_SPEECH,
    banner: BANNER_SIX_SEVEN_MEME,
  };
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
  if (isSignFlipToPositiveInfinity(left, operator, right)) {
    return false;
  }
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

function isNegativeDivideByZero(left, operator, right) {
  return operator === "/" && isFiniteNegativeToken(left) && isZeroToken(right);
}

function isSignFlipToPositiveInfinity(left, operator, right) {
  if (operator === "*") {
    return (
      (isNegativeInfinityToken(left) && isFiniteNegativeToken(right)) ||
      (isFiniteNegativeToken(left) && isNegativeInfinityToken(right))
    );
  }
  if (operator === "/") {
    return isNegativeInfinityToken(left) && isFiniteNegativeToken(right);
  }
  return false;
}

function isInfinityTimesInfinity(left, operator, right) {
  return operator === "*" && isInfinityToken(left) && isInfinityToken(right);
}

function classifySixtySevenMeme(tokenList, resultString) {
  if (!isFiniteTokenEqual(resultString, 67)) {
    return null;
  }
  return {
    kind: "meme_67",
    subtype: "sixty_seven_meme",
    speech: "sixty seven",
    banner: getNextLesson("sixty_seven_meme"),
  };
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
    return getNextLesson("fallback_negative_infinity");
  }
  if (kind === "infinity") {
    return getNextLesson("fallback_infinity");
  }
  return getNextLesson("indeterminate");
}

function buildFallbackContext(kind, speech) {
  return {
    kind,
    subtype: "generic",
    speech,
    banner: buildFallbackBanner(kind),
  };
}

export function classifySpecialMath({ tokenList, resultString }) {
  const memeContext = classifySixSevenMeme(tokenList, resultString);
  if (memeContext) {
    return memeContext;
  }

  const meme67Context = classifySixtySevenMeme(tokenList, resultString);
  if (meme67Context) {
    return meme67Context;
  }

  const kind = classifyResultKind(resultString);
  if (!kind) {
    return null;
  }

  const speech = getSpeechByKind(kind);

  if (!Array.isArray(tokenList) || tokenList.length !== 3 || !isOperator(tokenList[1])) {
    if (kind === "indeterminate" || kind === "error") {
      return {
        ...buildFallbackContext(kind, speech),
        subtype: kind === "error" ? "error" : "indeterminate",
        banner: getNextLesson("indeterminate"),
      };
    }
    return buildFallbackContext(kind, speech);
  }

  const [left, operator, right] = tokenList;

  const indeterminateSubtype = isIndeterminateBinary(left, operator, right);
  if (kind === "indeterminate" || kind === "error" || indeterminateSubtype) {
    return {
      kind: kind === "error" ? "error" : "indeterminate",
      subtype: indeterminateSubtype || (kind === "error" ? "error" : "indeterminate"),
      speech: UNKNOWN_SPEECH,
      banner: getNextLesson("indeterminate"),
    };
  }

  if (isFiniteDivideByZero(left, operator, right)) {
    if (isNegativeDivideByZero(left, operator, right)) {
      return {
        kind,
        subtype: "negative_divide_by_zero",
        speech,
        banner: getNextLesson("negative_divide_by_zero"),
      };
    }
    return {
      kind,
      subtype: "divide_by_zero",
      speech,
      banner: getNextLesson("divide_by_zero"),
    };
  }

  if (isInfinityTimesInfinity(left, operator, right)) {
    return {
      kind,
      subtype: "infinity_times_infinity",
      speech,
      banner: getNextLesson("infinity_times_infinity"),
    };
  }

  if (isSignFlipToPositiveInfinity(left, operator, right)) {
    return {
      kind,
      subtype: "sign_flip_positive_infinity",
      speech,
      banner: getNextLesson("sign_flip_positive_infinity"),
    };
  }

  if (isStableInfinityBinary(left, operator, right)) {
    if (kind === "negative_infinity" && isSignFlipToNegativeInfinity(left, operator, right)) {
      return {
        kind,
        subtype: "sign_flip_negative_infinity",
        speech,
        banner: getNextLesson("sign_flip_negative_infinity"),
      };
    }

    return {
      kind,
      subtype: "infinity_stays_infinity",
      speech,
      banner: getNextLesson("infinity_stays_infinity"),
    };
  }

  return buildFallbackContext(kind, speech);
}

export const specialMathPhrases = {
  UNKNOWN_SPEECH,
  MEME_SIX_SEVEN_SPEECH,
  BANNER_SIX_SEVEN_MEME,
  LESSON_DIVIDE_BY_ZERO,
  LESSON_INFINITY_STAYS_INFINITY,
  LESSON_SIGN_FLIP_NEG_INFINITY,
  LESSON_INDETERMINATE,
  LESSON_FALLBACK_INFINITY,
  LESSON_FALLBACK_NEG_INFINITY,
  LESSON_NEGATIVE_DIVIDE_BY_ZERO,
  LESSON_SIGN_FLIP_POS_INFINITY,
  LESSON_INFINITY_TIMES_INFINITY,
  LESSON_SIXTY_SEVEN_MEME,
  BANNER_WARP_JUMP,
  BANNER_COSMIC_RULE,
  BANNER_COSMIC_FLIP,
  BANNER_INDETERMINATE,
  BANNER_FALLBACK_INFINITY,
  BANNER_FALLBACK_NEG_INFINITY,
};
