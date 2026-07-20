// Pure field-layout arithmetic: how to arrange N metric fields for the screen
// shape. Round watches use a diamond - few fields on the narrow top/bottom rows,
// more across the wide middle - so the layout hugs the circle. Square/rectangular
// watches are portrait, and a value field is wider than it is tall, so a
// two-column grid reads better there. Kept free of any Zepp OS dependency so it
// is unit tested; the page turns these column counts into pixel boxes.

// The most metric fields the app will draw. Owned here because it is a layout
// limit; lib/metrics.js re-exports it as MAX_ROWS for the settings/config code.
// Capped at 9 (a 1-2-3-2-1 round diamond): a 4-wide middle row crowds the values.
export const MAX_FIELDS = 9;

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

function clampCount(count) {
  const n = Math.floor(Number(count));
  if (!Number.isFinite(n) || n < 1) {
    return 1;
  }
  return n > MAX_FIELDS ? MAX_FIELDS : n;
}

// The per-row column counts for `count` fields on the given shape. Fields fill the
// rows top to bottom, left to right (field 0 is the top row). Round -> the diamond
// pattern; square -> rows of two with a lone final field centred (its row has a
// single column). Count is clamped into 1..MAX_FIELDS.
export function fieldRows(count, isRound) {
  const n = clampCount(count);
  if (isRound) {
    return ROUND_ROWS[n].slice();
  }
  const rows = [];
  for (let left = n; left > 0; left -= 2) {
    rows.push(left >= 2 ? 2 : 1);
  }
  return rows;
}
