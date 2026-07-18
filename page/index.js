import * as hmUI from "@zos/ui";
import { getLanguage } from "@zos/settings";
import { BasePage } from "@zeppos/zml/base-page";

import { displayOr } from "../lib/stats-formatter.js";
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
    },

    build() {
      this.state.language = languageFromZeppCode(getLanguage());
      hmUI.createWidget(hmUI.widget.FILL_RECT, {
        x: 0,
        y: 0,
        w: DEVICE_WIDTH,
        h: DEVICE_HEIGHT,
        color: COLOR_BACKGROUND,
      });

      this.refresh();
      this.state.timer = setInterval(() => this.refresh(), REFRESH_MS);
    },

    onDestroy() {
      if (this.state.timer) {
        clearInterval(this.state.timer);
        this.state.timer = null;
      }
    },

    // Ask the side service for the latest stats and the row configuration, then
    // redraw. Failures are ignored: the last frame stays on screen.
    refresh() {
      this.request({ method: GET_STATS })
        .then((data) => {
          const payload = data || {};
          this.state.stats = payload.stats || null;
          this.state.rows = payload.rows || [];
          this.render();
        })
        .catch(() => {});
    },

    render() {
      for (let i = 0; i < this.state.widgets.length; i++) {
        hmUI.deleteWidget(this.state.widgets[i]);
      }
      this.state.widgets = [];

      const rows = this.state.rows;
      const count = rows.length;
      if (count === 0) {
        return;
      }

      const usableHeight = DEVICE_HEIGHT - 2 * VERTICAL_MARGIN;
      const bandHeight = Math.floor(usableHeight / count);
      const valueSize = clamp(Math.floor(bandHeight * 0.44), 22, 56);
      const labelSize = clamp(Math.floor(bandHeight * 0.28), 16, 30);

      for (let i = 0; i < count; i++) {
        const bandTop = VERTICAL_MARGIN + i * bandHeight;
        const labelY = bandTop + Math.floor(bandHeight * 0.1);
        const valueY = bandTop + Math.floor(bandHeight * 0.44);

        this.drawLine(labelY, labelSize, COLOR_LABEL, labelFor(this.state.language, rows[i]));
        this.drawLine(valueY, valueSize, COLOR_VALUE, displayOr(this.state.stats, rows[i]));
      }
    },

    // Draw one horizontally-centred line, its width limited to the chord of the
    // round screen at that height so the bezel cannot clip it.
    drawLine(y, size, color, text) {
      const width = safeLineWidth(DEVICE_WIDTH, y + size / 2, size, PADDING);
      const widget = hmUI.createWidget(hmUI.widget.TEXT, {
        x: Math.round((DEVICE_WIDTH - width) / 2),
        y,
        w: width,
        h: size + 6,
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
