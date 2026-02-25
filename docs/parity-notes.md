# Parity Notes (Web -> iOS)

## Purpose
These notes define the behavior contract for future Swift/iOS implementation.

## Special Math Kind Values
- `meme_6_7`: finite easter-egg result for `6 * 7`/`7 * 6` yielding `42`.
- `infinity`: positive infinity output.
- `negative_infinity`: negative infinity output.
- `indeterminate`: `NaN` results from undefined forms.
- `error`: runtime parse/evaluation failures surfaced as `Error`.

## Special Math Subtypes
- `six_times_seven_meme`: fun 6/7 meme trigger for `42`.
- `divide_by_zero`: finite value divided by zero.
- `infinity_stays_infinity`: operations where infinity remains infinity with finite non-zero values.
- `sign_flip_negative_infinity`: positive infinity transformed to negative infinity via negative finite multiplier/divisor.
- `infinity_times_zero`: indeterminate form.
- `infinity_minus_infinity`: indeterminate form.
- `infinity_div_infinity`: indeterminate form.
- `zero_div_zero`: indeterminate form.
- `infinity_plus_negative_infinity`: indeterminate form.
- `indeterminate`: generic indeterminate fallback.
- `error`: generic runtime error fallback.
- `generic`: fallback for special results when no specific binary rule is matched.

## Speech Contract
- `6 * 7` (or `7 * 6`) -> `Forty-two. Yep, six is still afraid that seven ate nine.`
- Display value `67` (Fun Mode on) -> `six seven`
- `Infinity` -> `infinity`
- `-Infinity` -> `negative infinity`
- `NaN`/`Error` -> `unknown number - error error error`

## Banner Contract
- 6/7 meme trigger: `42 detected: six is still side-eyeing seven for eating nine.`
- Finite `/ 0`: `Warp jump! Dividing by zero launched us to infinity.`
- Stable infinity: `Cosmic rule: infinity stays infinity.`
- Negative infinity sign flip: `Cosmic flip! Now we are at negative infinity.`
- Indeterminate/Error: `Mission unknown: this infinity move is indeterminate.`
- Infinity fallback: `Deep space math: still infinity!`
- Negative infinity fallback: `Deep space math: negative infinity!`
- Infinity flows rotate through a 30+ phrase lesson pool to keep repeated interactions fresh.

## Auto-Speak Behavior
- On `=` with Fun Mode enabled, any shown special banner is auto-spoken using the banner text (including `meme_6_7`).
- On rank-up thresholds, the triggering event still speaks its normal lesson banner; a queued `Rank up! <rank>` banner is shown/spoken on the next special event.
- With Fun Mode disabled, suppress fun banners, banner auto-speak, progression increments, and `67` meme speech override.

## Fun Progression Contract (V2)
- Persistence key: `funProgressV1` (JSON).
- Progress model:
  - `totalSpecialEvents`
  - `rankIndex`
  - `eventsSinceRankUp`
  - `unlockedPackIds`
  - `seenPhrasesByCategory`
  - `lastPhraseByCategory`
  - `pendingRankUpBanner`
- Rank-up cadence: every `4` special events.
- Rank names in order:
  - `Cadet`
  - `Scout`
  - `Navigator`
  - `Pilot`
  - `Commander`
  - `Infinity Captain`
- Pack unlock schedule:
  - Rank 0 -> Pack A
  - Rank 2+ -> Pack A + Pack B
- Phrase rotation rules:
  - Never repeat the same phrase back-to-back in the same category.
  - Prefer unseen phrases from unlocked packs.
  - When a category pool is exhausted, clear seen tracking for that category and continue.
- Reset behavior:
  - `Reset Fun Progress` clears `funProgressV1` state back to defaults.
  - Does not alter voice settings.
  - Does not disable Fun Mode.

## iOS Implementation Guidance
- Recreate classifier logic as pure Swift functions.
- Keep rendering and speech APIs separate from rule classification.
- Validate parity using `docs/parity-fixtures.json` as canonical acceptance inputs/outputs.
- Include a persisted `funModeEnabled` setting; when disabled, suppress meme speech and fun banners.
