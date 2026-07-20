// Pure field-layout arithmetic: how to arrange N metric fields for the screen
// shape. Round watches use a diamond - few fields on the narrow top/bottom rows,
// more across the wide middle - so the layout hugs the circle. Square/rectangular
// watches are portrait, and a value field is wider than it is tall, so a
// two-column grid reads better there. Kept free of any Zepp OS dependency so it
// is unit tested; the page turns these column counts into pixel boxes.

// The most metric fields the app will draw. Square screens take the full 10 (a
// two-column grid); the round diamond tops out at 9, because a 4-wide middle row
// crowds the values. MAX_FIELDS is the config/settings cap (the larger of the two),
// which lib/metrics.js re-exports as MAX_ROWS; the device clamps per shape.
export const MAX_FIELDS = 10;
export const MAX_ROUND_FIELDS = 9;

// Diamond row patterns for the round screen: each number is how many columns that
// row has, top to bottom. They mirror the circle (narrow ends, wide middle) and
// every entry sums to its key.
const ROUND_ROWS = {
  1: [1],
  2: [1, 1],
  3: [1, 1, 1],
  4: [1, 2, 1],
  5: [1, 2, 2],
  6: [1, 2, 2, 1],
  7: [1, 2, 3, 1],
  8: [1, 3, 3, 1],
  9: [1, 2, 3, 2, 1],
};

function clampCount(count, max) {
  const n = Math.floor(Number(count));
  if (!Number.isFinite(n) || n < 1) {
    return 1;
  }
  return n > max ? max : n;
}

// The per-row column counts for `count` fields on the given shape. Fields fill the
// rows top to bottom, left to right (field 0 is the top row). Round -> the diamond
// pattern; square -> rows of two with a lone final field centred (its row has a
// single column). Count is clamped per shape: round to MAX_ROUND_FIELDS (9),
// square to MAX_FIELDS (10).
export function fieldRows(count, isRound) {
  if (isRound) {
    return ROUND_ROWS[clampCount(count, MAX_ROUND_FIELDS)].slice();
  }
  const n = clampCount(count, MAX_FIELDS);
  const rows = [];
  for (let left = n; left > 0; left -= 2) {
    rows.push(left >= 2 ? 2 : 1);
  }
  return rows;
}
