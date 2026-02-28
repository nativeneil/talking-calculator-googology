import { isOperator } from "./evaluate.js";

const UNKNOWN_SPEECH = "unknown number - error error error";
const MEME_SIX_SEVEN_SPEECH = "six seven";
const BANNER_SIX_SEVEN_MEME = "six seven";

const LESSON_DIVIDE_BY_ZERO = [
  "Warp core breach! Dividing by zero created a local singularity.",
  "Warning: Zero divisor detected. Reality is beginning to pixelate.",
  "Singularity protocol: Any non-zero value over zero heads toward infinity.",
  "Space-time anomaly! Dividing by zero opens an infinite gateway.",
  "Navigation error: You cannot divide existence into zero parts.",
  "Astro tip: Dividing by zero launches the result past the cosmic horizon.",
  "Deep space alert: Zero divisor detected. Altitude now infinite.",
  "Mission note: The zero-point field is expanding. Result: Infinity.",
  "Neural link warning: Dividing by zero creates a logic paradox.",
  "Cosmic law: Infinity results when finite limits are divided by nothing.",
  "Nice try! You split something into zero groups and broke math.",
  "Pro tip: Dividing by zero is how you unlock infinity. Every time.",
  "You found the cheat code! Divide by zero equals instant infinity.",
];

const LESSON_INFINITY_STAYS_INFINITY = [
  "Cosmic rule: Infinity remains unchanged by finite operations.",
  "Deep space scan: The horizon is still infinite.",
  "Universal constant: You cannot increment the absolute maximum.",
  "Infinity law: Finite tweaks vanish against endless scale.",
  "Mission update: Infinity has absorbed the value without deviation.",
  "Star chart: No finite coordinate can outrun the infinite expanse.",
  "Data log: Infinity is stable. Finite input ignored.",
  "Navigation: Heading remains infinite. Course correction failed.",
  "Astro fact: Adding to infinity is like adding a drop to a cosmic ocean.",
  "System status: Infinity confirmed. Scaling remains boundless.",
  "No matter how hard you try, infinity plus anything is still infinity.",
  "Nice attempt! But you cannot sneak past infinity with addition.",
  "Fun fact: Infinity ate your number for breakfast and did not even notice.",
  "Infinity plus a million? Still infinity. Infinity plus a billion? Still infinity. It always wins.",
  "You could add every number ever invented and infinity would just shrug.",
];

const LESSON_SIGN_FLIP_NEG_INFINITY = [
  "Cosmic flip! We have entered the negative infinity void.",
  "Warning: Multiplying infinity by a negative inverts the vector.",
  "Sign lesson: Positive infinity crossed a negative and dove below zero.",
  "Space rule: A negative factor sends the infinite dive downward forever.",
  "Mission tip: Infinity has changed sign. Prepare for negative descent.",
  "Math fact: Negative scaling has inverted the infinite direction.",
  "Course reversal: Infinity is now pulling us into the negative abyss.",
  "Alert: Positive infinity hit a negative and dove to minus infinity.",
  "Crew log: Sign bit toggled. Heading into the negative infinite zone.",
  "Astro fact: One negative multiplier flips the infinite destination.",
  "Plot twist! One little minus sign flipped infinity upside down.",
  "Infinity was going up forever but a negative sent it crashing the other way.",
  "Lesson learned: Even infinity obeys the sign rules. Negative flips the direction.",
];

const LESSON_INDETERMINATE = [
  "Mission unknown: This operation is indeterminate.",
  "Quantum glitch: This form does not resolve to a single numeric value.",
  "Paradox detected: Infinity and zero have collided into mystery.",
  "Math warning: Result is indeterminate. Logic engine is stalling.",
  "Rule check: Operations like infinity minus infinity are undefined.",
  "System status: Indeterminate form detected. Result: Unknown.",
  "Crew alert: The math engine cannot calculate a destination here.",
  "Deep space anomaly: Opposing infinities have created a logic knot.",
  "Navigation fail: Indeterminate result. Heading cannot be computed.",
  "Astro warning: This operation has no well-defined solution.",
];

const LESSON_FALLBACK_INFINITY = [
  "Still soaring through the positive infinite expanse.",
  "We are locked in the endless sky of infinity.",
  "Up, up, and beyond! Result remains infinite.",
  "Infinity alert: We are still climbing at maximum velocity.",
  "No ceiling detected. Territory remains infinite.",
  "We are cruising through the infinite zone forever.",
  "Star log: Still positive infinity. No finite limit in sight.",
  "Crew status: Infinity holds steady. Heading remains unbounded.",
  "Astro update: We remain in the infinite sector.",
  "Navigation: Positive infinity confirmed. No course change.",
  "Yep, still infinity. It is not going to change its mind no matter what you press.",
  "Infinity is just vibing. Nothing you do can faze it.",
];

const LESSON_FALLBACK_NEG_INFINITY = [
  "Still falling through the negative infinite void.",
  "Bottomless pit: Still sinking through negative infinity.",
  "Down we go! Result remains endlessly negative.",
  "Stuck in the negative infinity basement.",
  "No floor detected. Territory remains negative infinite.",
  "We are diving through the minus infinity zone forever.",
  "Star log: Still negative infinity. Lower bound is limitless.",
  "Crew status: Negative infinity holds. Descent remains unbounded.",
  "Astro update: We remain in the negative infinite sector.",
  "Navigation: Negative infinity confirmed. Still descending.",
];

const QUIPS_INFINITY_SPEAK = [
  "still infinity",
  "there is nothing beyond infinity",
  "always infinity",
  "infinity forever",
  "yep, still infinity",
  "infinity all day long",
  "surprise, it is infinity",
  "infinity is not going anywhere",
  "the answer remains infinity",
  "endlessly infinity",
];

const QUIPS_NEG_INFINITY_SPEAK = [
  "still negative infinity",
  "the void goes on",
  "negative infinity forever",
  "yep, still negative infinity",
  "endlessly negative infinity",
  "the abyss has no bottom",
  "negative infinity is not going anywhere",
  "always negative infinity",
  "deeper and deeper, negative infinity",
  "the minus side of forever",
];

const LESSON_NEGATIVE_DIVIDE_BY_ZERO = [
  "Downward warp! Dividing a negative by zero created a dive to infinity.",
  "Warning: A negative value over zero plunges toward minus infinity.",
  "Space tip: Negative x over zero means a dive to the negative horizon.",
  "Gravity alert: Negative divided by zero pulls us endlessly downward.",
  "Mission note: Negative divide-by-zero opens the downward abyss.",
  "Math fact: Negative over zero points to negative infinity.",
];

const LESSON_SIGN_FLIP_POS_INFINITY = [
  "Double flip! Two negatives launched us back to positive infinity.",
  "Sign recovery: Negative infinity times a negative flips back to positive.",
  "Sign lesson: Double negative scaling restores the upward vector.",
  "Space rule: A double sign flip returns the infinite heading to positive.",
  "Mission tip: Negative times negative equals positive, even at infinity.",
  "Math fact: Sign flip squared returns infinity to the positive side.",
  "Two negatives made a positive! Infinity bounced back from the void.",
  "Negative times negative? Even infinity knows that trick. Back to positive!",
];

const LESSON_INFINITY_TIMES_INFINITY = [
  "Hyper-infinity! Infinity times infinity is still infinite.",
  "Lesson: Multiplying infinities together maintains endless scale.",
  "Space tip: Infinity times infinity is a secondary-order infinity.",
  "Power surge: Two infinities multiplied. Result: Mega-infinite.",
  "Mission note: Infinity scaled by infinity remains boundless.",
  "Math fact: The product of two infinities is always infinite.",
  "No such thing as double infinity! Infinity times infinity is just infinity being dramatic.",
  "Sorry, you cannot level up infinity. It is already the final boss.",
  "Infinity squared? Still infinity. There is no bigger infinity in this calculator.",
  "Two infinities walk into a bar. The result? Still just one infinity.",
];

const LESSON_MULTIPLY_BY_ZERO = [
  "Absolute Zero Protocol: The numbers have been erased from the timeline.",
  "Zero-Point Event: Your values have collapsed into a void.",
  "Magic trick: Everything multiplied by zero is zero.",
  "Zero wins: It crushed your numbers into absolute nothingness.",
  "Total erasure: The zero ray has neutralized the values.",
  "Whoosh! Your data has disappeared into the zero-point field.",
];

const LESSON_LARGE_NUMBER = [
  "Galactic scale detected. Are we calculating the star count of a nebula?",
  "Warning: High-density integer. Calculation approaching cosmic proportions.",
  "Stellar mass values detected. We are counting atoms in the local cluster.",
  "Interstellar scale: This number exceeds the planetary count of the galaxy.",
  "Mega-calculation: That number is so large it barely fits the buffer.",
  "Deep space math: We have reached a multi-billion scale result.",
];

const LESSON_PI_CONSTANT = [
  "Orbit locked! 3.14159... is the code of the circle.",
  "Circle secret unlocked: You have found Pi, the eternal ratio.",
  "Pi detected! We are now circling at 3.14159...",
  "Math sparkle: Pi has arrived with its never-ending decimals.",
  "Orbit note: Pi is steering the geometry of this mission.",
  "Astro cameo: A classic cosmic constant has appeared.",
];

const LESSON_GOLDEN_RATIO = [
  "Proportion found! You have detected the Golden Ratio.",
  "Phi spotted! That is the glow of cosmic balance.",
  "Pattern alert: The Golden Ratio has emerged in the data.",
  "Design magic: Phi has appeared with perfect elegant balance.",
  "Nature code unlocked: The Golden Ratio is online.",
  "Galaxy spiral: Beautiful proportions have been detected.",
];

const LESSON_E_CONSTANT = [
  "Euler alert! Constant E has arrived at 2.71828.",
  "E detected! Growth math just became exponential.",
  "Exponential buddy spotted: Constant E is on the dashboard.",
  "Mission update: Continuous growth mode engaged.",
  "E cameo! The Euler constant has joined the party.",
  "Science sparkle: Growth constant E is steering the system.",
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
  pi_constant: LESSON_PI_CONSTANT,
  golden_ratio: LESSON_GOLDEN_RATIO,
  e_constant: LESSON_E_CONSTANT,
  multiply_by_zero: LESSON_MULTIPLY_BY_ZERO,
  large_number: LESSON_LARGE_NUMBER,
  quips_infinity: QUIPS_INFINITY_SPEAK,
  quips_negative_infinity: QUIPS_NEG_INFINITY_SPEAK,
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

function isWithinTolerance(value, target, tolerance) {
  return Math.abs(value - target) <= tolerance;
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

function isMultiplyByZero(left, operator, right) {
  return operator === "*" && (isZeroToken(left) || isZeroToken(right)) && !isInfinityToken(left) && !isInfinityToken(right);
}

function isLargeNumber(resultString) {
  const numeric = parseFiniteToken(resultString);
  if (numeric === null) return false;
  return Math.abs(numeric) >= 1000000000;
}

function classifySixtySevenMeme(tokenList, resultString) {
  const digits = String(resultString).replace(/[^0-9]/g, "");
  if (!digits.includes("67")) return null;
  return {
    kind: "meme_67",
    subtype: "sixty_seven_meme",
    speech: "six seven",
    banner: "six seven",
  };
}

function classifyConstantEasterEgg(resultString) {
  const numeric = parseFiniteToken(resultString);
  if (numeric === null) {
    return null;
  }

  if (isWithinTolerance(numeric, Math.PI, 0.002)) {
    const banner = getNextLesson("pi_constant");
    return {
      kind: "constant",
      subtype: "pi_constant",
      speech: banner,
      banner,
    };
  }

  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  if (isWithinTolerance(numeric, goldenRatio, 0.005)) {
    const banner = getNextLesson("golden_ratio");
    return {
      kind: "constant",
      subtype: "golden_ratio",
      speech: banner,
      banner,
    };
  }

  if (isWithinTolerance(numeric, Math.E, 0.005)) {
    const banner = getNextLesson("e_constant");
    return {
      kind: "constant",
      subtype: "e_constant",
      speech: banner,
      banner,
    };
  }

  return null;
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

function buildFallbackBanner(kind) {
  if (kind === "negative_infinity") {
    return getNextLesson("fallback_negative_infinity");
  }
  if (kind === "infinity") {
    return getNextLesson("fallback_infinity");
  }
  return getNextLesson("indeterminate");
}

function buildFallbackContext(kind) {
  const banner = buildFallbackBanner(kind);
  return {
    kind,
    subtype: "generic",
    speech: banner,
    banner,
  };
}

export { getNextLesson };

export function classifySpecialMath({ tokenList, resultString }) {
  const memeContext = classifySixSevenMeme(tokenList, resultString);
  if (memeContext) {
    return memeContext;
  }

  const meme67Context = classifySixtySevenMeme(tokenList, resultString);
  if (meme67Context) {
    return meme67Context;
  }

  const constantContext = classifyConstantEasterEgg(resultString);
  if (constantContext) {
    return constantContext;
  }

  if (isLargeNumber(resultString)) {
    const banner = getNextLesson("large_number");
    return {
      kind: "large_number",
      subtype: "large_number",
      speech: banner,
      banner,
    };
  }

  if (Array.isArray(tokenList) && tokenList.length === 3 && isOperator(tokenList[1])) {
    const [left, operator, right] = tokenList;
    if (isMultiplyByZero(left, operator, right)) {
      const banner = getNextLesson("multiply_by_zero");
      return {
        kind: "multiply_by_zero",
        subtype: "multiply_by_zero",
        speech: banner,
        banner,
      };
    }
  }

  const kind = classifyResultKind(resultString);
  if (!kind) {
    return null;
  }

  if (!Array.isArray(tokenList) || tokenList.length !== 3 || !isOperator(tokenList[1])) {
    if (kind === "indeterminate" || kind === "error") {
      const banner = getNextLesson("indeterminate");
      return {
        kind,
        subtype: kind === "error" ? "error" : "indeterminate",
        speech: banner,
        banner,
      };
    }
    return buildFallbackContext(kind);
  }

  const [left, operator, right] = tokenList;

  const indeterminateSubtype = isIndeterminateBinary(left, operator, right);
  if (kind === "indeterminate" || kind === "error" || indeterminateSubtype) {
    const banner = getNextLesson("indeterminate");
    return {
      kind: kind === "error" ? "error" : "indeterminate",
      subtype: indeterminateSubtype || (kind === "error" ? "error" : "indeterminate"),
      speech: banner,
      banner,
    };
  }

  if (isFiniteDivideByZero(left, operator, right)) {
    if (isNegativeDivideByZero(left, operator, right)) {
      const banner = getNextLesson("negative_divide_by_zero");
      return {
        kind,
        subtype: "negative_divide_by_zero",
        speech: banner,
        banner,
      };
    }
    const banner = getNextLesson("divide_by_zero");
    return {
      kind,
      subtype: "divide_by_zero",
      speech: banner,
      banner,
    };
  }

  if (isInfinityTimesInfinity(left, operator, right)) {
    const banner = getNextLesson("infinity_times_infinity");
    return {
      kind,
      subtype: "infinity_times_infinity",
      speech: banner,
      banner,
    };
  }

  if (isSignFlipToPositiveInfinity(left, operator, right)) {
    const banner = getNextLesson("sign_flip_positive_infinity");
    return {
      kind,
      subtype: "sign_flip_positive_infinity",
      speech: banner,
      banner,
    };
  }

  if (isStableInfinityBinary(left, operator, right)) {
    if (kind === "negative_infinity" && isSignFlipToNegativeInfinity(left, operator, right)) {
      const banner = getNextLesson("sign_flip_negative_infinity");
      return {
        kind,
        subtype: "sign_flip_negative_infinity",
        speech: banner,
        banner,
      };
    }

    const banner = getNextLesson("infinity_stays_infinity");
    return {
      kind,
      subtype: "infinity_stays_infinity",
      speech: banner,
      banner,
    };
  }

  return buildFallbackContext(kind);
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
  LESSON_PI_CONSTANT,
  LESSON_GOLDEN_RATIO,
  LESSON_E_CONSTANT,
  LESSON_MULTIPLY_BY_ZERO,
  LESSON_LARGE_NUMBER,
  QUIPS_INFINITY_SPEAK,
  QUIPS_NEG_INFINITY_SPEAK,
  BANNER_WARP_JUMP,
  BANNER_COSMIC_RULE,
  BANNER_COSMIC_FLIP,
  BANNER_INDETERMINATE,
  BANNER_FALLBACK_INFINITY,
  BANNER_FALLBACK_NEG_INFINITY,
};
