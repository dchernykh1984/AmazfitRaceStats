// Pure geometry for keeping text inside a round screen. A round watch cuts the
// corners off a row, so a line placed too near the top or bottom is sliced by the
// bezel unless its width is limited to the chord of the circle at that height.

// Half the on-screen width of a circle of the given radius, at dy pixels from its
// horizontal centre line. Zero past the edge of the circle.
export function safeHalfWidth(radius, dy) {
  const distance = Math.abs(dy);
  if (distance >= radius) {
    return 0;
  }
  return Math.sqrt(radius * radius - distance * distance);
}

// The widest a horizontally-centred line may be at vertical position y (its
// centre) on a round screen of the given size, once a padding is kept from the
// bezel on each side. The binding chord is at whichever end of the line's height
// is furthest from the centre line.
export function safeLineWidth(screenSize, y, lineHeight, padding) {
  const radius = screenSize / 2;
  const top = y - lineHeight / 2;
  const bottom = y + lineHeight / 2;
  const dyTop = Math.abs(top - radius);
  const dyBottom = Math.abs(bottom - radius);
  const half = safeHalfWidth(radius, Math.max(dyTop, dyBottom));
  const width = 2 * half - 2 * padding;
  return width > 0 ? width : 0;
}

// The width to draw a horizontally-centred line for the screen shape. A round
// screen clips the row corners, so the line is chord-limited (safeLineWidth); a
// square/rectangular screen has no bezel to dodge, so it uses the full width
// minus the padding on each side (independent of y). Never negative.
export function lineWidth(isRound, screenSize, y, lineHeight, padding) {
  if (isRound) {
    return safeLineWidth(screenSize, y, lineHeight, padding);
  }
  const width = screenSize - 2 * padding;
  return width > 0 ? width : 0;
}
