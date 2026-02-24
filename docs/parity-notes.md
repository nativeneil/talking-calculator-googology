# Parity Notes (Web -> iOS)

## Purpose
These notes define the behavior contract for future Swift/iOS implementation.

## Special Math Kind Values
- `infinity`: positive infinity output.
- `negative_infinity`: negative infinity output.
- `indeterminate`: `NaN` results from undefined forms.
- `error`: runtime parse/evaluation failures surfaced as `Error`.

## Special Math Subtypes
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
- `Infinity` -> `infinity`
- `-Infinity` -> `negative infinity`
- `NaN`/`Error` -> `unknown number - error error error`

## Banner Contract
- Finite `/ 0`: `Warp jump! Dividing by zero launched us to infinity.`
- Stable infinity: `Cosmic rule: infinity stays infinity.`
- Negative infinity sign flip: `Cosmic flip! Now we are at negative infinity.`
- Indeterminate/Error: `Mission unknown: this infinity move is indeterminate.`
- Infinity fallback: `Deep space math: still infinity!`
- Negative infinity fallback: `Deep space math: negative infinity!`

## iOS Implementation Guidance
- Recreate classifier logic as pure Swift functions.
- Keep rendering and speech APIs separate from rule classification.
- Validate parity using `docs/parity-fixtures.json` as canonical acceptance inputs/outputs.
