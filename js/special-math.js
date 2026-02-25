import { isOperator } from "./evaluate.js";

const UNKNOWN_SPEECH = "unknown number - error error error";
const MEME_SIX_SEVEN_SPEECH = "Forty-two. Yep, six is still afraid that seven ate nine.";
const BANNER_SIX_SEVEN_MEME = "42 detected: six is still side-eyeing seven for eating nine.";

const FUN_PACK_A = "A";
const FUN_PACK_B = "B";
export const FUN_EVENTS_PER_RANK = 4;
export const FUN_RANK_NAMES = [
  "Cadet",
  "Scout",
  "Navigator",
  "Pilot",
  "Commander",
  "Infinity Captain",
];

const LESSON_PACK_A = {
  divide_by_zero: [
    "Warp jump! Dividing by zero launched us to infinity.",
    "Lesson: any non-zero number divided by zero heads toward infinity.",
    "Space tip: x divided by zero is an infinite launch.",
    "Infinity alert: dividing by zero breaks finite limits.",
    "Mission note: divide-by-zero opens the infinity gate.",
    "Math fact: non-zero over zero points to infinity.",
  ],
  infinity_stays_infinity: [
    "Cosmic rule: infinity stays infinity.",
    "Lesson: adding or scaling finite values cannot cap infinity.",
    "Space math: infinity plus finite is still infinity.",
    "Infinity law: finite tweaks do not shrink endless size.",
    "Mission lesson: infinity keeps winning against finite numbers.",
    "Rule check: infinity remains infinity under finite operations here.",
  ],
  sign_flip_negative_infinity: [
    "Cosmic flip! Now we are at negative infinity.",
    "Lesson: multiplying infinity by a negative flips direction.",
    "Sign lesson: positive infinity crossed a negative and turned negative.",
    "Space rule: a negative factor sends infinity below zero forever.",
    "Mission tip: infinity changed sign, not size.",
    "Math fact: infinity with a negative scale becomes negative infinity.",
  ],
  indeterminate: [
    "Mission unknown: this infinity move is indeterminate.",
    "Lesson: this form does not resolve to one numeric value.",
    "Space warning: infinity and zero collided into an undefined result.",
    "Math note: this expression is indeterminate, not finite and not infinite.",
    "Rule check: operations like infinity minus infinity are undefined.",
    "System status: indeterminate form detected, result is not well-defined.",
  ],
  fallback_infinity: [
    "Deep space math: still infinity!",
    "Lesson: we are still in infinite territory.",
    "Space update: result stayed at positive infinity.",
    "Math fact: this path remains unbounded above.",
    "Mission readout: positive infinity confirmed.",
    "Infinity check: no finite limit reached.",
  ],
  fallback_negative_infinity: [
    "Deep space math: negative infinity!",
    "Lesson: the value remains unbounded below.",
    "Space update: result stayed at negative infinity.",
    "Math fact: this path heads endlessly negative.",
    "Mission readout: negative infinity confirmed.",
    "Infinity check: lower bound is still limitless.",
  ],
};

const LESSON_PACK_B = {
  divide_by_zero: [
    "Checkpoint: dividing by zero means no finite answer can contain it.",
    "Lesson booster: when denominator is zero, the value shoots beyond all finite bounds.",
    "Orbit note: you cannot share a number into zero groups, so infinity appears.",
    "Math mission: zero in the denominator breaks ordinary scaling.",
    "Explorer tip: divide-by-zero sends us to the edge of number space.",
    "Rule recap: non-zero over zero is treated as infinite behavior.",
  ],
  infinity_stays_infinity: [
    "Lesson booster: infinity plus one is still infinity.",
    "Mission recap: multiplying infinity by two still keeps it infinite.",
    "Space coach: finite numbers cannot fence in infinity.",
    "Math reminder: infinity ignores tiny and huge finite add-ons alike.",
    "Navigator note: scaling infinity keeps it unbounded.",
    "Checkpoint: infinity remains beyond every finite limit.",
  ],
  sign_flip_negative_infinity: [
    "Lesson booster: a negative scale flips infinity's direction only.",
    "Mission recap: same infinite size, opposite sign.",
    "Space coach: multiply by minus one and infinity points downward.",
    "Math reminder: sign changes do not make infinity finite.",
    "Navigator note: negative infinity is still endless, just below zero.",
    "Checkpoint: direction flips, magnitude stays unbounded.",
  ],
  indeterminate: [
    "Lesson booster: infinity minus infinity has many possible outcomes, so it's indeterminate.",
    "Mission recap: infinity divided by infinity is not one fixed number.",
    "Space coach: zero divided by zero cannot be pinned to a single answer.",
    "Math reminder: indeterminate forms need more context to solve.",
    "Navigator note: undefined forms are clues, not final values.",
    "Checkpoint: this operation needs deeper math than basic rules.",
  ],
  fallback_infinity: [
    "Lesson booster: still positive infinity on this route.",
    "Mission recap: no finite cap reached yet.",
    "Space coach: the value remains beyond every big number.",
    "Math reminder: positive infinity stays above all finite values.",
    "Navigator note: infinite growth is still active.",
    "Checkpoint: unbounded-above result confirmed.",
  ],
  fallback_negative_infinity: [
    "Lesson booster: still negative infinity on this route.",
    "Mission recap: no lower finite bound reached.",
    "Space coach: the value remains below every finite number.",
    "Math reminder: negative infinity stays under all finite values.",
    "Navigator note: unbounded drop is still active.",
    "Checkpoint: unbounded-below result confirmed.",
  ],
};

const lessonPacks = {
  [FUN_PACK_A]: LESSON_PACK_A,
  [FUN_PACK_B]: LESSON_PACK_B,
};

const lessonCategories = [
  "divide_by_zero",
  "infinity_stays_infinity",
  "sign_flip_negative_infinity",
  "indeterminate",
  "fallback_infinity",
  "fallback_negative_infinity",
];

const BANNER_WARP_JUMP = LESSON_PACK_A.divide_by_zero[0];
const BANNER_COSMIC_RULE = LESSON_PACK_A.infinity_stays_infinity[0];
const BANNER_COSMIC_FLIP = LESSON_PACK_A.sign_flip_negative_infinity[0];
const BANNER_INDETERMINATE = LESSON_PACK_A.indeterminate[0];
const BANNER_FALLBACK_INFINITY = LESSON_PACK_A.fallback_infinity[0];
const BANNER_FALLBACK_NEG_INFINITY = LESSON_PACK_A.fallback_negative_infinity[0];

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
    lessonCategory: null,
    progressionEvent: false,
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

function rankUnlockPackIds(rankIndex) {
  const ids = [FUN_PACK_A];
  if (rankIndex >= 2) {
    ids.push(FUN_PACK_B);
  }
  return ids;
}

function toNonNegativeInteger(value, fallback = 0) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) {
    return fallback;
  }
  return Math.floor(numeric);
}

export function resetFunProgress() {
  return {
    totalSpecialEvents: 0,
    rankIndex: 0,
    eventsSinceRankUp: 0,
    unlockedPackIds: [FUN_PACK_A],
    seenPhrasesByCategory: {},
    lastPhraseByCategory: {},
    pendingRankUpBanner: null,
  };
}

function normalizeProgressState(progressState) {
  if (!progressState || typeof progressState !== "object") {
    return resetFunProgress();
  }

  const rankMax = FUN_RANK_NAMES.length - 1;
  progressState.totalSpecialEvents = toNonNegativeInteger(progressState.totalSpecialEvents, 0);
  progressState.rankIndex = Math.min(toNonNegativeInteger(progressState.rankIndex, 0), rankMax);
  progressState.eventsSinceRankUp = toNonNegativeInteger(progressState.eventsSinceRankUp, 0);

  if (progressState.rankIndex >= rankMax) {
    progressState.eventsSinceRankUp = 0;
  } else {
    progressState.eventsSinceRankUp = progressState.eventsSinceRankUp % FUN_EVENTS_PER_RANK;
  }

  if (!Array.isArray(progressState.unlockedPackIds)) {
    progressState.unlockedPackIds = [];
  }

  const allowedByRank = new Set(rankUnlockPackIds(progressState.rankIndex));
  const sanitizedUnlocks = progressState.unlockedPackIds
    .filter((id) => id === FUN_PACK_A || id === FUN_PACK_B)
    .filter((id) => allowedByRank.has(id));
  progressState.unlockedPackIds = Array.from(new Set([FUN_PACK_A, ...sanitizedUnlocks, ...allowedByRank]));

  if (!progressState.seenPhrasesByCategory || typeof progressState.seenPhrasesByCategory !== "object") {
    progressState.seenPhrasesByCategory = {};
  }

  if (!progressState.lastPhraseByCategory || typeof progressState.lastPhraseByCategory !== "object") {
    progressState.lastPhraseByCategory = {};
  }

  if (typeof progressState.pendingRankUpBanner !== "string" || !progressState.pendingRankUpBanner.trim()) {
    progressState.pendingRankUpBanner = null;
  }

  return progressState;
}

function getLessonsForCategory(category, progressState) {
  const unlocks = progressState.unlockedPackIds || [FUN_PACK_A];
  const merged = [];
  unlocks.forEach((packId) => {
    const pack = lessonPacks[packId];
    const categoryLessons = pack?.[category];
    if (Array.isArray(categoryLessons)) {
      merged.push(...categoryLessons);
    }
  });
  return merged;
}

function pickLessonPhrase(category, progressState) {
  const lessons = getLessonsForCategory(category, progressState);
  if (!lessons.length) {
    return {
      phrase: "",
      resetSeen: false,
    };
  }

  const seen = Array.isArray(progressState.seenPhrasesByCategory[category])
    ? progressState.seenPhrasesByCategory[category]
    : [];
  const last = progressState.lastPhraseByCategory[category] || null;

  let resetSeen = false;
  let phrase = lessons.find((candidate) => !seen.includes(candidate) && candidate !== last);

  if (!phrase) {
    resetSeen = true;
    phrase = lessons.find((candidate) => candidate !== last) || lessons[0];
  }

  return {
    phrase,
    resetSeen,
  };
}

function getFallbackCategory(kind) {
  if (kind === "negative_infinity") {
    return "fallback_negative_infinity";
  }
  if (kind === "infinity") {
    return "fallback_infinity";
  }
  return "indeterminate";
}

function buildBaseSpecialContext({ tokenList, resultString }) {
  const memeContext = classifySixSevenMeme(tokenList, resultString);
  if (memeContext) {
    return memeContext;
  }

  const kind = classifyResultKind(resultString);
  if (!kind) {
    return null;
  }

  const speech = getSpeechByKind(kind);

  if (!Array.isArray(tokenList) || tokenList.length !== 3 || !isOperator(tokenList[1])) {
    if (kind === "indeterminate" || kind === "error") {
      return {
        kind: kind === "error" ? "error" : "indeterminate",
        subtype: kind === "error" ? "error" : "indeterminate",
        speech: UNKNOWN_SPEECH,
        lessonCategory: "indeterminate",
        progressionEvent: true,
      };
    }

    return {
      kind,
      subtype: "generic",
      speech,
      lessonCategory: getFallbackCategory(kind),
      progressionEvent: true,
    };
  }

  const [left, operator, right] = tokenList;
  const indeterminateSubtype = isIndeterminateBinary(left, operator, right);

  if (kind === "indeterminate" || kind === "error" || indeterminateSubtype) {
    return {
      kind: kind === "error" ? "error" : "indeterminate",
      subtype: indeterminateSubtype || (kind === "error" ? "error" : "indeterminate"),
      speech: UNKNOWN_SPEECH,
      lessonCategory: "indeterminate",
      progressionEvent: true,
    };
  }

  if (isFiniteDivideByZero(left, operator, right)) {
    return {
      kind,
      subtype: "divide_by_zero",
      speech,
      lessonCategory: "divide_by_zero",
      progressionEvent: true,
    };
  }

  if (isStableInfinityBinary(left, operator, right)) {
    if (kind === "negative_infinity" && isSignFlipToNegativeInfinity(left, operator, right)) {
      return {
        kind,
        subtype: "sign_flip_negative_infinity",
        speech,
        lessonCategory: "sign_flip_negative_infinity",
        progressionEvent: true,
      };
    }

    return {
      kind,
      subtype: "infinity_stays_infinity",
      speech,
      lessonCategory: "infinity_stays_infinity",
      progressionEvent: true,
    };
  }

  return {
    kind,
    subtype: "generic",
    speech,
    lessonCategory: getFallbackCategory(kind),
    progressionEvent: true,
  };
}

function withoutMeta(context) {
  if (!context || typeof context !== "object") {
    return context;
  }
  const next = { ...context };
  delete next._meta;
  return next;
}

export function getSpecialContextWithProgress({ tokenList, resultString, progressState }) {
  const normalizedProgress = normalizeProgressState(progressState || resetFunProgress());
  const baseContext = buildBaseSpecialContext({ tokenList, resultString });
  if (!baseContext) {
    return null;
  }

  if (!baseContext.lessonCategory) {
    return {
      ...baseContext,
      _meta: {
        usedPendingRankUpBanner: false,
        progressionEvent: false,
      },
    };
  }

  if (normalizedProgress.pendingRankUpBanner) {
    return {
      ...baseContext,
      banner: normalizedProgress.pendingRankUpBanner,
      _meta: {
        usedPendingRankUpBanner: true,
        progressionEvent: baseContext.progressionEvent,
      },
    };
  }

  const { phrase, resetSeen } = pickLessonPhrase(baseContext.lessonCategory, normalizedProgress);
  return {
    ...baseContext,
    banner: phrase,
    _meta: {
      usedPendingRankUpBanner: false,
      progressionEvent: baseContext.progressionEvent,
      lessonCategory: baseContext.lessonCategory,
      selectedPhrase: phrase,
      resetSeen,
    },
  };
}

export function applyProgressAfterEvent({ context, progressState }) {
  const normalizedProgress = normalizeProgressState(progressState || resetFunProgress());
  if (!context) {
    return normalizedProgress;
  }

  const meta = context._meta || {};

  if (meta.usedPendingRankUpBanner) {
    normalizedProgress.pendingRankUpBanner = null;
  }

  if (meta.lessonCategory && meta.selectedPhrase && !meta.usedPendingRankUpBanner) {
    if (!Array.isArray(normalizedProgress.seenPhrasesByCategory[meta.lessonCategory])) {
      normalizedProgress.seenPhrasesByCategory[meta.lessonCategory] = [];
    }

    if (meta.resetSeen) {
      normalizedProgress.seenPhrasesByCategory[meta.lessonCategory] = [];
    }

    const seenList = normalizedProgress.seenPhrasesByCategory[meta.lessonCategory];
    if (!seenList.includes(meta.selectedPhrase)) {
      seenList.push(meta.selectedPhrase);
    }
    normalizedProgress.lastPhraseByCategory[meta.lessonCategory] = meta.selectedPhrase;
  }

  if (meta.progressionEvent) {
    normalizedProgress.totalSpecialEvents += 1;

    if (normalizedProgress.rankIndex < FUN_RANK_NAMES.length - 1) {
      normalizedProgress.eventsSinceRankUp += 1;
      if (normalizedProgress.eventsSinceRankUp >= FUN_EVENTS_PER_RANK) {
        normalizedProgress.eventsSinceRankUp = 0;
        normalizedProgress.rankIndex += 1;

        const unlocked = new Set(rankUnlockPackIds(normalizedProgress.rankIndex));
        normalizedProgress.unlockedPackIds = Array.from(unlocked);
        normalizedProgress.pendingRankUpBanner = `Rank up! ${FUN_RANK_NAMES[normalizedProgress.rankIndex]} unlocked.`;
      }
    } else {
      normalizedProgress.eventsSinceRankUp = 0;
    }
  }

  return normalizedProgress;
}

export function getFunProgressSummary(progressState) {
  const normalized = normalizeProgressState(progressState || resetFunProgress());
  const maxRank = FUN_RANK_NAMES.length - 1;
  const isMaxRank = normalized.rankIndex >= maxRank;

  return {
    rankName: FUN_RANK_NAMES[normalized.rankIndex],
    rankIndex: normalized.rankIndex,
    nextRankIn: isMaxRank ? 0 : FUN_EVENTS_PER_RANK - normalized.eventsSinceRankUp,
    totalSpecialEvents: normalized.totalSpecialEvents,
    unlockedPackIds: [...normalized.unlockedPackIds],
  };
}

const legacyProgressState = resetFunProgress();

export function classifySpecialMath({ tokenList, resultString }) {
  const context = getSpecialContextWithProgress({
    tokenList,
    resultString,
    progressState: legacyProgressState,
  });

  if (!context) {
    return null;
  }

  applyProgressAfterEvent({
    context,
    progressState: legacyProgressState,
  });

  return withoutMeta(context);
}

export const specialMathPhrases = {
  UNKNOWN_SPEECH,
  MEME_SIX_SEVEN_SPEECH,
  BANNER_SIX_SEVEN_MEME,
  LESSON_DIVIDE_BY_ZERO: [...LESSON_PACK_A.divide_by_zero, ...LESSON_PACK_B.divide_by_zero],
  LESSON_INFINITY_STAYS_INFINITY: [...LESSON_PACK_A.infinity_stays_infinity, ...LESSON_PACK_B.infinity_stays_infinity],
  LESSON_SIGN_FLIP_NEG_INFINITY: [...LESSON_PACK_A.sign_flip_negative_infinity, ...LESSON_PACK_B.sign_flip_negative_infinity],
  LESSON_INDETERMINATE: [...LESSON_PACK_A.indeterminate, ...LESSON_PACK_B.indeterminate],
  LESSON_FALLBACK_INFINITY: [...LESSON_PACK_A.fallback_infinity, ...LESSON_PACK_B.fallback_infinity],
  LESSON_FALLBACK_NEG_INFINITY: [...LESSON_PACK_A.fallback_negative_infinity, ...LESSON_PACK_B.fallback_negative_infinity],
  LESSON_PACK_A,
  LESSON_PACK_B,
  BANNER_WARP_JUMP,
  BANNER_COSMIC_RULE,
  BANNER_COSMIC_FLIP,
  BANNER_INDETERMINATE,
  BANNER_FALLBACK_INFINITY,
  BANNER_FALLBACK_NEG_INFINITY,
};

export const funProgressConstants = {
  FUN_PACK_A,
  FUN_PACK_B,
  FUN_EVENTS_PER_RANK,
  FUN_RANK_NAMES,
  lessonCategories,
};
