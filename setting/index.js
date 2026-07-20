import { METRICS, MAX_ROWS } from "../lib/metrics.js";
import { labelFor } from "../lib/i18n/index.js";
import {
  SETTING_KEYS,
  DEFAULT_SITE_URL,
  DEFAULT_COMPETITION_ID,
  DEFAULT_BIB,
  DEFAULT_ROW_COUNT,
} from "../lib/settings.js";

// The phone settings screen. It writes the rider's configuration to
// settingsStorage; the side service reads it back when it fetches. Labels are in
// English here (the phone UI); the on-watch labels follow the watch language.
//
// Writing a value re-runs build(), so changing the row count immediately shows
// the right number of per-row metric pickers.

const FIELD_STYLE = { marginBottom: "16px" };
const LABEL_STYLE = { fontSize: "15px", color: "#333", marginBottom: "6px" };

function field(title, control) {
  return View({ style: FIELD_STYLE }, [Text({ style: LABEL_STYLE }, title), control]);
}

AppSettingsPage({
  state: {
    props: {},
  },

  setItem(key, value) {
    this.state.props.settingsStorage.setItem(key, value);
  },

  getItem(key) {
    return this.state.props.settingsStorage.getItem(key);
  },

  build(props) {
    this.state.props = props;

    const siteUrl = this.getItem(SETTING_KEYS.SITE_URL) || DEFAULT_SITE_URL;
    const competitionId = this.getItem(SETTING_KEYS.COMPETITION_ID) || DEFAULT_COMPETITION_ID;
    const bib = this.getItem(SETTING_KEYS.BIB) || DEFAULT_BIB;
    const rowCount = Number(this.getItem(SETTING_KEYS.ROW_COUNT)) || DEFAULT_ROW_COUNT;

    const metricOptions = METRICS.map((metric, index) => ({
      name: labelFor("en", metric),
      value: String(index),
    }));

    const rowCountOptions = [];
    for (let i = 1; i <= MAX_ROWS; i++) {
      rowCountOptions.push({ name: String(i), value: String(i) });
    }

    const rowPickers = [];
    for (let i = 0; i < rowCount; i++) {
      const stored = this.getItem(SETTING_KEYS.ROW_METRIC_PREFIX + i);
      const value = stored == null || stored === "" ? String(i) : stored;
      rowPickers.push(
        field(
          "Row " + (i + 1),
          Select({
            options: metricOptions,
            value,
            onChange: (next) => this.setItem(SETTING_KEYS.ROW_METRIC_PREFIX + i, next),
          })
        )
      );
    }

    return View({ style: { padding: "16px 20px" } }, [
      // TextInput renders its value as the tappable target; when empty it falls
      // back to `label` as a placeholder. Without a non-empty label an empty
      // field has nothing to tap, so a first value can never be entered.
      field(
        "Site URL",
        TextInput({
          label: "Enter site URL",
          value: siteUrl,
          onChange: (next) => this.setItem(SETTING_KEYS.SITE_URL, next),
        })
      ),
      field(
        "Competition ID",
        TextInput({
          label: "Enter competition ID",
          value: competitionId,
          onChange: (next) => this.setItem(SETTING_KEYS.COMPETITION_ID, next),
        })
      ),
      field(
        "Bib number",
        TextInput({
          label: "Enter bib number",
          value: bib,
          onChange: (next) => this.setItem(SETTING_KEYS.BIB, next),
        })
      ),
      field(
        "Rows",
        Select({
          options: rowCountOptions,
          value: String(rowCount),
          onChange: (next) => this.setItem(SETTING_KEYS.ROW_COUNT, next),
        })
      ),
      ...rowPickers,
    ]);
  },
});
