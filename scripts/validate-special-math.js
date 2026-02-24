#!/usr/bin/env node

const path = require("path");
const { pathToFileURL } = require("url");

(async () => {
  const moduleUrl = `${pathToFileURL(path.resolve("js/special-math.js")).href}?test=${Date.now()}`;
  const { classifySpecialMath, specialMathPhrases } = await import(moduleUrl);

  const cases = [
    {
      name: "finite divide by zero",
      input: { tokenList: ["1", "/", "0"], resultString: "Infinity" },
      expected: {
        kind: "infinity",
        subtype: "divide_by_zero",
        speech: "infinity",
        banner: specialMathPhrases.BANNER_WARP_JUMP,
      },
    },
    {
      name: "infinity times finite",
      input: { tokenList: ["Infinity", "*", "2"], resultString: "Infinity" },
      expected: {
        kind: "infinity",
        subtype: "infinity_stays_infinity",
        banner: specialMathPhrases.BANNER_COSMIC_RULE,
      },
    },
    {
      name: "infinity sign flip",
      input: { tokenList: ["Infinity", "*", "-2"], resultString: "-Infinity" },
      expected: {
        kind: "negative_infinity",
        subtype: "sign_flip_negative_infinity",
        banner: specialMathPhrases.BANNER_COSMIC_FLIP,
      },
    },
    {
      name: "infinity times zero indeterminate",
      input: { tokenList: ["Infinity", "*", "0"], resultString: "NaN" },
      expected: {
        kind: "indeterminate",
        subtype: "infinity_times_zero",
        speech: "unknown number - error error error",
        banner: specialMathPhrases.BANNER_INDETERMINATE,
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
        banner: specialMathPhrases.BANNER_FALLBACK_INFINITY,
      },
    },
    {
      name: "error handling",
      input: { tokenList: ["2", "/", "("], resultString: "Error" },
      expected: {
        kind: "error",
        speech: "unknown number - error error error",
        banner: specialMathPhrases.BANNER_INDETERMINATE,
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

  if (hasFailure) {
    process.exitCode = 1;
  }
})();
