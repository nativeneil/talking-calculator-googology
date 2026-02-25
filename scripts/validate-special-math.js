#!/usr/bin/env node

const path = require("path");
const { pathToFileURL } = require("url");

(async () => {
  const moduleUrl = `${pathToFileURL(path.resolve("js/special-math.js")).href}?test=${Date.now()}`;
  const {
    applyProgressAfterEvent,
    getSpecialContextWithProgress,
    resetFunProgress,
    specialMathPhrases,
  } = await import(moduleUrl);

  const baseCases = [
    {
      name: "six seven meme easter egg",
      input: { tokenList: ["6", "*", "7"], resultString: "42" },
      expected: {
        kind: "meme_6_7",
        subtype: "six_times_seven_meme",
        speech: specialMathPhrases.MEME_SIX_SEVEN_SPEECH,
        banner: specialMathPhrases.BANNER_SIX_SEVEN_MEME,
      },
    },
    {
      name: "seven six meme order also works",
      input: { tokenList: ["7", "*", "6"], resultString: "42" },
      expected: {
        kind: "meme_6_7",
        subtype: "six_times_seven_meme",
      },
    },
    {
      name: "finite divide by zero",
      input: { tokenList: ["1", "/", "0"], resultString: "Infinity" },
      expected: {
        kind: "infinity",
        subtype: "divide_by_zero",
        speech: "infinity",
        bannerIn: specialMathPhrases.LESSON_DIVIDE_BY_ZERO,
      },
    },
    {
      name: "infinity times finite",
      input: { tokenList: ["Infinity", "*", "2"], resultString: "Infinity" },
      expected: {
        kind: "infinity",
        subtype: "infinity_stays_infinity",
        bannerIn: specialMathPhrases.LESSON_INFINITY_STAYS_INFINITY,
      },
    },
    {
      name: "infinity sign flip",
      input: { tokenList: ["Infinity", "*", "-2"], resultString: "-Infinity" },
      expected: {
        kind: "negative_infinity",
        subtype: "sign_flip_negative_infinity",
        bannerIn: specialMathPhrases.LESSON_SIGN_FLIP_NEG_INFINITY,
      },
    },
    {
      name: "infinity times zero indeterminate",
      input: { tokenList: ["Infinity", "*", "0"], resultString: "NaN" },
      expected: {
        kind: "indeterminate",
        subtype: "infinity_times_zero",
        speech: "unknown number - error error error",
        bannerIn: specialMathPhrases.LESSON_INDETERMINATE,
      },
    },
    {
      name: "infinity minus infinity indeterminate",
      input: { tokenList: ["Infinity", "-", "Infinity"], resultString: "NaN" },
      expected: {
        kind: "indeterminate",
        subtype: "infinity_minus_infinity",
      },
    },
    {
      name: "zero divide zero indeterminate",
      input: { tokenList: ["0", "/", "0"], resultString: "NaN" },
      expected: {
        kind: "indeterminate",
        subtype: "zero_div_zero",
      },
    },
    {
      name: "infinity plus negative infinity indeterminate",
      input: { tokenList: ["Infinity", "+", "-Infinity"], resultString: "NaN" },
      expected: {
        kind: "indeterminate",
        subtype: "infinity_plus_negative_infinity",
      },
    },
    {
      name: "generic positive infinity fallback",
      input: { tokenList: ["2", "/", "0", "+", "2"], resultString: "Infinity" },
      expected: {
        kind: "infinity",
        subtype: "generic",
        bannerIn: specialMathPhrases.LESSON_FALLBACK_INFINITY,
      },
    },
    {
      name: "error handling",
      input: { tokenList: ["2", "/", "("], resultString: "Error" },
      expected: {
        kind: "error",
        speech: "unknown number - error error error",
        bannerIn: specialMathPhrases.LESSON_INDETERMINATE,
      },
    },
    {
      name: "non-special finite result",
      input: { tokenList: ["2", "+", "2"], resultString: "4" },
      expected: null,
    },
  ];

  let hasFailure = false;

  for (const testCase of baseCases) {
    const progress = resetFunProgress();
    const actual = getSpecialContextWithProgress({
      ...testCase.input,
      progressState: progress,
    });

    let pass = true;

    if (testCase.expected === null) {
      pass = actual === null;
    } else if (!actual) {
      pass = false;
    } else {
      for (const [key, expectedValue] of Object.entries(testCase.expected)) {
        if (key === "bannerIn") {
          if (!Array.isArray(expectedValue) || !expectedValue.includes(actual.banner)) {
            pass = false;
            break;
          }
          continue;
        }
        if (actual[key] !== expectedValue) {
          pass = false;
          break;
        }
      }
    }

    const status = pass ? "PASS" : "FAIL";
    console.log(`[special] ${testCase.name}: ${status}`);

    if (!pass) {
      console.log(`  Expected: ${JSON.stringify(testCase.expected)}`);
      console.log(`  Received: ${JSON.stringify(actual)}`);
      hasFailure = true;
    }
  }

  const totalUniqueLessons = new Set([
    ...specialMathPhrases.LESSON_DIVIDE_BY_ZERO,
    ...specialMathPhrases.LESSON_INFINITY_STAYS_INFINITY,
    ...specialMathPhrases.LESSON_SIGN_FLIP_NEG_INFINITY,
    ...specialMathPhrases.LESSON_INDETERMINATE,
    ...specialMathPhrases.LESSON_FALLBACK_INFINITY,
    ...specialMathPhrases.LESSON_FALLBACK_NEG_INFINITY,
  ]).size;

  const lessonCountPass = totalUniqueLessons >= 72;
  console.log(`[special] at least 72 unique infinity lesson phrases: ${lessonCountPass ? "PASS" : "FAIL"}`);
  if (!lessonCountPass) {
    console.log(`  unique lesson count: ${totalUniqueLessons}`);
    hasFailure = true;
  }

  const nonRepeatProgress = resetFunProgress();
  const seenSequence = [];
  for (let i = 0; i < 8; i += 1) {
    const context = getSpecialContextWithProgress({
      tokenList: ["1", "/", "0"],
      resultString: "Infinity",
      progressState: nonRepeatProgress,
    });
    if (context) {
      seenSequence.push(context.banner);
      applyProgressAfterEvent({ context, progressState: nonRepeatProgress });
    }
  }

  const nonRepeatPass = seenSequence.every((banner, index) => index === 0 || banner !== seenSequence[index - 1]);
  console.log(`[special] lesson selection avoids immediate repeats: ${nonRepeatPass ? "PASS" : "FAIL"}`);
  if (!nonRepeatPass) {
    console.log(`  observed sequence: ${JSON.stringify(seenSequence)}`);
    hasFailure = true;
  }

  const lockedProgress = resetFunProgress();
  const lockedSet = new Set();
  for (let i = 0; i < 12; i += 1) {
    const context = getSpecialContextWithProgress({
      tokenList: ["1", "/", "0"],
      resultString: "Infinity",
      progressState: lockedProgress,
    });
    if (context && context.banner) {
      lockedSet.add(context.banner);
      applyProgressAfterEvent({ context, progressState: lockedProgress });
    }
  }

  const packAOnly = specialMathPhrases.LESSON_PACK_A.divide_by_zero;
  const nonRankBanners = [...lockedSet].filter((banner) => !banner.startsWith("Rank up!"));
  const lockedPass = nonRankBanners.every((banner) => packAOnly.includes(banner));
  console.log(`[special] rank-locked mode uses pack A phrases only: ${lockedPass ? "PASS" : "FAIL"}`);
  if (!lockedPass) {
    console.log(`  observed locked banners: ${JSON.stringify([...lockedSet])}`);
    hasFailure = true;
  }

  const unlockedProgress = resetFunProgress();
  unlockedProgress.rankIndex = 2;
  unlockedProgress.unlockedPackIds = ["A", "B"];
  const unlockedSet = new Set();
  for (let i = 0; i < 18; i += 1) {
    const context = getSpecialContextWithProgress({
      tokenList: ["1", "/", "0"],
      resultString: "Infinity",
      progressState: unlockedProgress,
    });
    if (context && context.banner) {
      unlockedSet.add(context.banner);
      applyProgressAfterEvent({ context, progressState: unlockedProgress });
    }
  }

  const packB = specialMathPhrases.LESSON_PACK_B.divide_by_zero;
  const unlockPass = [...unlockedSet].some((banner) => packB.includes(banner));
  console.log(`[special] rank 2 unlock includes pack B phrases: ${unlockPass ? "PASS" : "FAIL"}`);
  if (!unlockPass) {
    console.log(`  observed unlocked banners: ${JSON.stringify([...unlockedSet])}`);
    hasFailure = true;
  }

  if (hasFailure) {
    process.exitCode = 1;
  }
})();
