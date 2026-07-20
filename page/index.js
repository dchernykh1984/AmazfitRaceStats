import * as hmUI from "@zos/ui";
import { getLanguage } from "@zos/settings";
import { BasePage } from "@zeppos/zml/base-page";

import { displayOr, NO_VALUE } from "../lib/stats-formatter.js";
import { labelFor, languageFromZeppCode } from "../lib/i18n/index.js";
import { lineWidth } from "../lib/round-geometry.js";
import { fieldRows } from "../lib/layout.js";
import { DEVICE_WIDTH, DEVICE_HEIGHT, IS_ROUND } from "../utils/config/device.js";
import {
  COLOR_BACKGROUND,
  COLOR_VALUE,
  COLOR_LABEL,
  REFRESH_MS,
  GET_STATS,
} from "../utils/config/constants.js";

// Keep the field rows clear of the narrow top and bottom of the round screen.
const VERTICAL_MARGIN = Math.round(DEVICE_HEIGHT * 0.1);
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
      // the phone is not connected. It is replaced by the fields on the first reply.
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

    // Ask the side service for the latest stats and the field configuration, then
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

    // Arrange the fields for the screen shape and draw them. Round watches get a
    // diamond (fewer fields on the narrow top/bottom rows, more across the wide
    // middle); square watches get a two-column grid. Each field is a caption above
    // its value, centred in its cell.
    render() {
      for (let i = 0; i < this.state.widgets.length; i++) {
        hmUI.deleteWidget(this.state.widgets[i]);
      }
      this.state.widgets = [];

      const metrics = this.state.rows;
      const count = metrics.length;
      if (count === 0) {
        this.drawWaiting();
        return;
      }

      const pattern = fieldRows(count, IS_ROUND);
      const usableHeight = DEVICE_HEIGHT - 2 * VERTICAL_MARGIN;
      const bandHeight = Math.floor(usableHeight / pattern.length);

      let fieldIndex = 0;
      for (let r = 0; r < pattern.length; r++) {
        const cols = pattern[r];
        const bandTop = VERTICAL_MARGIN + r * bandHeight;

        // Width available to this row: the round chord at the band's binding edge,
        // or the full square width. The cells split it equally, so a cell can never
        // poke past the bezel.
        const rowWidth = lineWidth(
          IS_ROUND,
          DEVICE_WIDTH,
          bandTop + bandHeight / 2,
          bandHeight,
          PADDING
        );
        const rowLeft = Math.round((DEVICE_WIDTH - rowWidth) / 2);
        const cellWidth = Math.floor(rowWidth / cols);

        for (let c = 0; c < cols; c++) {
          this.drawCell(
            rowLeft + c * cellWidth,
            cellWidth,
            bandTop,
            bandHeight,
            metrics[fieldIndex]
          );
          fieldIndex += 1;
        }
      }
    },

    // One field: a caption above a larger value, both centred in the cell. Sizes
    // come from the band height; the caption is also shrunk to roughly fit a narrow
    // cell so a multi-column row does not clip its labels (values are short).
    drawCell(cellLeft, cellWidth, bandTop, bandHeight, metric) {
      const gap = 2;
      let labelSize = clamp(Math.floor(bandHeight * 0.3), 12, 28);
      let valueSize = clamp(Math.floor(bandHeight * 0.46), 18, 52);
      if (labelSize + gap + valueSize > bandHeight) {
        const scale = (bandHeight - gap) / (labelSize + valueSize);
        labelSize = Math.max(11, Math.floor(labelSize * scale));
        valueSize = Math.max(14, Math.floor(valueSize * scale));
      }

      const label = labelFor(this.state.language, metric);
      const fitWidth = Math.floor(cellWidth / (Math.max(label.length, 1) * 0.55));
      if (fitWidth < labelSize) {
        labelSize = Math.max(10, fitWidth);
      }

      const blockHeight = labelSize + gap + valueSize;
      const blockTop = bandTop + Math.floor((bandHeight - blockHeight) / 2);
      this.drawText(cellLeft, cellWidth, blockTop, labelSize, COLOR_LABEL, label);
      this.drawText(
        cellLeft,
        cellWidth,
        blockTop + labelSize + gap,
        valueSize,
        COLOR_VALUE,
        displayOr(this.state.stats, metric)
      );
    },

    // The centred "waiting for data" placeholder, drawn before the first reply and
    // whenever there is nothing to show.
    drawWaiting() {
      const size = 48;
      const width = lineWidth(IS_ROUND, DEVICE_WIDTH, DEVICE_HEIGHT / 2, size + 2, PADDING);
      this.drawText(
        Math.round((DEVICE_WIDTH - width) / 2),
        width,
        Math.round(DEVICE_HEIGHT / 2 - size / 2),
        size,
        COLOR_VALUE,
        NO_VALUE
      );
    },

    // Draw one horizontally-centred text widget inside the given cell box.
    drawText(x, width, y, size, color, text) {
      const widget = hmUI.createWidget(hmUI.widget.TEXT, {
        x,
        y,
        w: width,
        h: size + 2,
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
