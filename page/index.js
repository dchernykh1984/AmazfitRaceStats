import * as hmUI from "@zos/ui";
import { getLanguage } from "@zos/settings";
import { BasePage } from "@zeppos/zml/base-page";

import { displayOr, NO_VALUE } from "../lib/stats-formatter.js";
import { labelFor, languageFromZeppCode } from "../lib/i18n/index.js";
import { safeLineWidth } from "../lib/round-geometry.js";
import { DEVICE_WIDTH, DEVICE_HEIGHT } from "../utils/config/device.js";
import {
  COLOR_BACKGROUND,
  COLOR_VALUE,
  COLOR_LABEL,
  REFRESH_MS,
  GET_STATS,
} from "../utils/config/constants.js";

// Keep rows clear of the narrow top and bottom of the round screen.
const VERTICAL_MARGIN = Math.round(DEVICE_HEIGHT * 0.14);
const PADDING = 6;

function clamp(value, low, high) {
  if (value < low) {
    return low;
  }
  return value > high ? high : value;
}

Page(
  BasePage({
    state: {
      language: "en",
      rows: [],
      stats: null,
      widgets: [],
      timer: null,
      destroyed: false,
      loading: false,
    },

    build() {
      let languageCode = 2;
      try {
        languageCode = getLanguage();
      } catch {
        // Some devices/firmwares may not expose the setting; fall back to English
        // rather than let build() throw and leave the screen blank.
      }
      this.state.language = languageFromZeppCode(languageCode);

      hmUI.createWidget(hmUI.widget.FILL_RECT, {
        x: 0,
        y: 0,
        w: DEVICE_WIDTH,
        h: DEVICE_HEIGHT,
        color: COLOR_BACKGROUND,
      });

      // Show the "waiting for data" placeholder at once, so the screen is never a
      // blank black circle while the first request is in flight - or forever, if
      // the phone is not connected. It is replaced by the rows on the first reply.
      this.drawWaiting();

      this.refresh();
      this.state.timer = setInterval(() => this.refresh(), REFRESH_MS);
    },

    onDestroy() {
      this.state.destroyed = true;
      if (this.state.timer) {
        clearInterval(this.state.timer);
        this.state.timer = null;
      }
    },

    // Ask the side service for the latest stats and the row configuration, then
    // redraw. Failures are ignored: the last frame stays on screen. A reply that
    // arrives after the page is gone is dropped, so it never touches freed widgets.
    refresh() {
      // Skip if a request is still in flight, so a slow network cannot pile up
      // overlapping requests on each timer tick.
      if (this.state.loading) {
        return;
      }
      this.state.loading = true;
      this.request({ method: GET_STATS })
        .then((data) => {
          this.state.loading = false;
          if (this.state.destroyed) {
            return;
          }
          const payload = data || {};
          this.state.stats = payload.stats || null;
          this.state.rows = payload.rows || [];
          this.render();
        })
        .catch(() => {
          this.state.loading = false;
        });
    },

    render() {
      for (let i = 0; i < this.state.widgets.length; i++) {
        hmUI.deleteWidget(this.state.widgets[i]);
      }
      this.state.widgets = [];

      const rows = this.state.rows;
      const count = rows.length;
      if (count === 0) {
        this.drawWaiting();
        return;
      }

      const usableHeight = DEVICE_HEIGHT - 2 * VERTICAL_MARGIN;
      const bandHeight = Math.floor(usableHeight / count);

      // A caption sits above a larger value. Size both so the whole block fits the
      // band with a gap between them, then centre the block - this is what keeps
      // the two lines from overlapping when many rows squeeze the band.
      const gap = 2;
      let labelSize = clamp(Math.floor(bandHeight * 0.3), 14, 30);
      let valueSize = clamp(Math.floor(bandHeight * 0.48), 22, 56);
      if (labelSize + gap + valueSize > bandHeight) {
        const scale = (bandHeight - gap) / (labelSize + valueSize);
        labelSize = Math.max(12, Math.floor(labelSize * scale));
        valueSize = Math.max(16, Math.floor(valueSize * scale));
      }
      const blockHeight = labelSize + gap + valueSize;

      for (let i = 0; i < count; i++) {
        const bandTop = VERTICAL_MARGIN + i * bandHeight;
        const blockTop = bandTop + Math.floor((bandHeight - blockHeight) / 2);

        this.drawLine(blockTop, labelSize, COLOR_LABEL, labelFor(this.state.language, rows[i]));
        this.drawLine(
          blockTop + labelSize + gap,
          valueSize,
          COLOR_VALUE,
          displayOr(this.state.stats, rows[i])
        );
      }
    },

    // The centred "waiting for data" placeholder, drawn before the first reply
    // and whenever there is nothing to show.
    drawWaiting() {
      this.drawLine(Math.round(DEVICE_HEIGHT / 2 - 28), 48, COLOR_VALUE, NO_VALUE);
    },

    // Draw one horizontally-centred line, its width limited to the chord of the
    // round screen at that height so the bezel cannot clip it.
    drawLine(y, size, color, text) {
      const height = size + 2;
      const width = safeLineWidth(DEVICE_WIDTH, y + height / 2, height, PADDING);
      const widget = hmUI.createWidget(hmUI.widget.TEXT, {
        x: Math.round((DEVICE_WIDTH - width) / 2),
        y,
        w: width,
        h: height,
        color,
        text_size: size,
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.CENTER_V,
        text_style: hmUI.text_style.NONE,
        text,
      });
      this.state.widgets.push(widget);
    },
  })
);
