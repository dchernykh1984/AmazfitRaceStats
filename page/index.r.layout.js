// Zepp OS requires a per-page layout module named `index.[screenType].layout.js`
// (here `.r` for the round target). This page builds its UI imperatively with
// `hmUI.createWidget` in `index.js`, so there are no declarative widget
// descriptors to export - the file exists only to satisfy the build's zosLoader.
export const LAYOUT = {};
