#!/usr/bin/env node

const path = require("path");
const { pathToFileURL } = require("url");

(async () => {
  const moduleUrl = `${pathToFileURL(path.resolve("js/special-math.js")).href}?test=${Date.now()}`;
  const { classifySpecialMath, specialMathPhrases } = await import(moduleUrl);

  const cases = [
    {
      name: "six seven meme easter egg",
      input: { tokenList: ["6", "*", "7"], resultString: "42" },
      expected: {
        kind: "meme_6_7",
        subtype: "six_times_seven_meme",
        speech: "six seven",
        banner: "six seven",
      },
    },
    {
      name: "sixty seven meme: result exactly 67",
      input: { tokenList: ["60", "+", "7"], resultString: "67" },
      expected: {
        kind: "meme_67",
        subtype: "sixty_seven_meme",
        speech: "six seven",
        banner: "six seven",
      },
    },
    {
      name: "sixty seven meme: result contains 67",
      input: { tokenList: ["600", "+", "71"], resultString: "671" },
      expected: {
        kind: "meme_67",
        subtype: "sixty_seven_meme",
        speech: "six seven",
        banner: "six seven",
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
        speechIn: specialMathPhrases.LESSON_DIVIDE_BY_ZERO,
        bannerIn: specialMathPhrases.LESSON_DIVIDE_BY_ZERO,
      },
    },
    {
      name: "pi constant easter egg",
      input: { tokenList: ["355", "/", "113"], resultString: "3.1415929203539823009" },
      expected: {
        kind: "constant",
        subtype: "pi_constant",
        speechIn: specialMathPhrases.LESSON_PI_CONSTANT,
        bannerIn: specialMathPhrases.LESSON_PI_CONSTANT,
      },
    },
    {
      name: "golden ratio easter egg",
      input: { tokenList: ["89", "/", "55"], resultString: "1.6181818181818181818" },
      expected: {
        kind: "constant",
        subtype: "golden_ratio",
        speechIn: specialMathPhrases.LESSON_GOLDEN_RATIO,
        bannerIn: specialMathPhrases.LESSON_GOLDEN_RATIO,
      },
    },
    {
      name: "e constant easter egg",
      input: { tokenList: ["19", "/", "7"], resultString: "2.7142857142857142857" },
      expected: {
        kind: "constant",
        subtype: "e_constant",
        speechIn: specialMathPhrases.LESSON_E_CONSTANT,
        bannerIn: specialMathPhrases.LESSON_E_CONSTANT,
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

  for (const testCase of cases) {
    const actual = classifySpecialMath(testCase.input);
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
        if (key === "speechIn") {
          if (!Array.isArray(expectedValue) || !expectedValue.includes(actual.speech)) {
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

  const infinityLessonPools = [
    specialMathPhrases.LESSON_DIVIDE_BY_ZERO,
    specialMathPhrases.LESSON_INFINITY_STAYS_INFINITY,
    specialMathPhrases.LESSON_SIGN_FLIP_NEG_INFINITY,
    specialMathPhrases.LESSON_INDETERMINATE,
    specialMathPhrases.LESSON_FALLBACK_INFINITY,
    specialMathPhrases.LESSON_FALLBACK_NEG_INFINITY,
    specialMathPhrases.LESSON_PI_CONSTANT,
    specialMathPhrases.LESSON_GOLDEN_RATIO,
    specialMathPhrases.LESSON_E_CONSTANT,
  ];

  const uniqueInfinityLessons = new Set(infinityLessonPools.flat());
  const lessonCountPass = uniqueInfinityLessons.size >= 30;
  console.log(`[special] at least 30 unique infinity lesson phrases: ${lessonCountPass ? "PASS" : "FAIL"}`);
  if (!lessonCountPass) {
    console.log(`  unique lesson count: ${uniqueInfinityLessons.size}`);
    hasFailure = true;
  }

  const rotationBanners = [];
  for (let i = 0; i < 4; i += 1) {
    const context = classifySpecialMath({
      tokenList: ["1", "/", "0"],
      resultString: "Infinity",
    });
    rotationBanners.push(context?.banner || "");
  }
  const rotationPass = new Set(rotationBanners).size > 1;
  console.log(`[special] rotating lessons cycle across repeated infinity events: ${rotationPass ? "PASS" : "FAIL"}`);
  if (!rotationPass) {
    console.log(`  observed banners: ${JSON.stringify(rotationBanners)}`);
    hasFailure = true;
  }

  if (hasFailure) {
    process.exitCode = 1;
  }
})();
