# AGENTS.md

## Project overview
- This repository is a static browser calculator app.
- Core files:
- `index.html`: UI structure and script includes.
- `style.css`: layout, keypad grid, and responsive styling.
- `app.js`: calculator state, expression evaluation (`decimal.js`), history, keyboard support, and speech synthesis.

## Run and validate
- Open `index.html` in a browser for manual testing.
- If you need a local server, use: `python3 -m http.server` from repo root.
- No formal automated test suite is configured; validate by manual scenarios.

## Manual test checklist
- Arithmetic precedence: `2 + 3 * 4 = 14`.
- Decimal input: `0.1 + 0.2` should evaluate with Decimal precision.
- Scientific input: positive/negative exponents through keypad and keyboard.
- History restore should repopulate current input with prior result.
- Voice settings should persist across page reloads.
- Voice panel open/close behavior should work with outside clicks.

## Coding conventions
- Keep dependencies minimal; prefer plain JS and browser APIs.
- Preserve `Decimal` arithmetic for evaluation to avoid floating-point regressions.
- Keep display formatting logic separate from numeric evaluation.
- For UI changes, update both desktop and mobile behavior.
- Avoid introducing build tooling unless explicitly requested.

## Change guidance
- For calculator logic updates, test both keypad clicks and keyboard paths.
- For speech features, gracefully handle missing voices or unavailable speech APIs.
- For settings persistence, validate `localStorage` read/write edge cases (`0`, empty, missing keys).

## Non-goals
- Do not add frameworks or bundlers for routine fixes.
- Do not refactor large sections unless required for a clear bug fix or requested feature.
