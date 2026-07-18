// Colors drawn on the (black) watch screen.
export const COLOR_BACKGROUND = 0x000000;
export const COLOR_VALUE = 0xffffff;
export const COLOR_LABEL = 0xaaaaaa;

// How often the device asks the side service for fresh stats. Standings only
// change when a rider crosses a lap line, so a minute is plenty.
export const REFRESH_MS = 60000;

// The request method the device sends to the side service.
export const GET_STATS = "GET_STATS";
