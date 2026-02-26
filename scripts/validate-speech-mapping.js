#!/usr/bin/env node

const path = require("path");
const { pathToFileURL } = require("url");

(async () => {
  const speechUrl = `${pathToFileURL(path.resolve("js/speech.js")).href}?test=${Date.now()}`;
  const wordsUrl = `${pathToFileURL(path.resolve("js/number-words.js")).href}?test=${Date.now()}`;

  const { buildSpeechText, MEME_SIXTY_SEVEN_SPEECH } = await import(speechUrl);
  const { numberToWords } = await import(wordsUrl);

  const cases = [
    {
      name: "special context overrides raw value",
      input: {
        currentInput: "",
        lastResult: "Infinity",
        displayText: "Infinity",
        specialContext: {
          speech: "infinity",
        },
        numberToWords,
      },
      expected: "infinity",
    },
    {
      name: "positive infinity",
      input: {
        currentInput: "",
        lastResult: "Infinity",
        displayText: "Infinity",
        specialContext: null,
        numberToWords,
      },
      expected: "infinity",
    },
    {
      name: "negative infinity",
      input: {
        currentInput: "",
        lastResult: "-Infinity",
        displayText: "-Infinity",
        specialContext: null,
        numberToWords,
      },
      expected: "negative infinity",
    },
    {
      name: "nan maps to unknown",
      input: {
        currentInput: "",
        lastResult: "NaN",
        displayText: "NaN",
        specialContext: null,
        numberToWords,
      },
      expected: "unknown number - error error error",
    },
    {
      name: "error maps to unknown",
      input: {
        currentInput: "",
        lastResult: "Error",
        displayText: "Error",
        specialContext: null,
        numberToWords,
      },
      expected: "unknown number - error error error",
    },
    {
      name: "finite number words",
      input: {
        currentInput: "42",
        lastResult: "",
        displayText: "42",
        specialContext: null,
        numberToWords,
      },
      expected: "forty two",
    },
    {
      name: "67 meme speech when fun mode on",
      input: {
        currentInput: "",
        lastResult: "67",
        displayText: "67",
        specialContext: null,
        funModeEnabled: true,
        numberToWords,
      },
      expected: "six seven sixty seven",
    },
    {
      name: "671 meme speech when fun mode on",
      input: {
        currentInput: "",
        lastResult: "671",
        displayText: "671",
        specialContext: null,
        funModeEnabled: true,
        numberToWords,
      },
      expected: "six seven six hundred and seventy one",
    },
    {
      name: "6x7=42 with specialContext says six seven",
      input: {
        currentInput: "",
        lastResult: "42",
        displayText: "42",
        specialContext: { speech: "six seven" },
        funModeEnabled: true,
        numberToWords,
      },
      expected: "six seven",
    },
    {
      name: "special context wins over generic 67 fun speech",
      input: {
        currentInput: "",
        lastResult: "67",
        displayText: "67",
        specialContext: { speech: "Pi party! 3.14159... keeps circling forever." },
        funModeEnabled: true,
        numberToWords,
      },
      expected: "Pi party! 3.14159... keeps circling forever.",
    },
    {
      name: "67 uses normal speech when fun mode off",
      input: {
        currentInput: "",
        lastResult: "67",
        displayText: "67",
        specialContext: null,
        funModeEnabled: false,
        numberToWords,
      },
      expected: "sixty seven",
    },
  ];

  let hasFailure = false;

  for (const testCase of cases) {
    const actual = buildSpeechText(testCase.input);
    const pass = actual === testCase.expected;
    const status = pass ? "PASS" : "FAIL";
    console.log(`[speech] ${testCase.name}: ${status}`);

    if (!pass) {
      console.log(`  Expected: ${testCase.expected}`);
      console.log(`  Received: ${actual}`);
      hasFailure = true;
    }
  }

  if (hasFailure) {
    process.exitCode = 1;
  }
})();
