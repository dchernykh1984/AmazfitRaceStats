import { getDeviceInfo, SCREEN_SHAPE_SQUARE } from "@zos/device";

const info = getDeviceInfo();

export const DEVICE_WIDTH = info.width;
export const DEVICE_HEIGHT = info.height;

// Round watches clip the corners off a row, so a line's width is chord-limited on
// them; square/rectangular screens can use the full width. The page passes this
// to lineWidth(). Unknown shape falls back to round, keeping the safe chord limit.
export const IS_ROUND = info.screenShape !== SCREEN_SHAPE_SQUARE;
