import { BaseSideService, settingsLib } from "@zeppos/zml/base-side";

import { buildRequestUrl } from "../lib/request-url.js";
import { resolveRowMetrics, SETTING_KEYS, DEFAULT_SITE_URL } from "../lib/settings.js";
import { MAX_ROWS } from "../lib/metrics.js";
import { GET_STATS } from "../utils/config/constants.js";

// Read the rider's configuration out of settingsStorage into a plain object.
// Every value is stored as a string; the pure helpers coerce as needed.
function readConfig() {
  const raw = { [SETTING_KEYS.ROW_COUNT]: settingsLib.getItem(SETTING_KEYS.ROW_COUNT) };
  for (let i = 0; i < MAX_ROWS; i++) {
    raw[SETTING_KEYS.ROW_METRIC_PREFIX + i] = settingsLib.getItem(
      SETTING_KEYS.ROW_METRIC_PREFIX + i
    );
  }
  return {
    siteUrl: settingsLib.getItem(SETTING_KEYS.SITE_URL) || DEFAULT_SITE_URL,
    competitionId: settingsLib.getItem(SETTING_KEYS.COMPETITION_ID),
    bib: settingsLib.getItem(SETTING_KEYS.BIB),
    rows: resolveRowMetrics(raw),
  };
}

// Fetch the rider's stats and reply with them and the row configuration. The
// device stays dumb: it renders exactly what it is given. Any failure (no phone
// network, a 404 before the race has data, malformed JSON) replies with null
// stats so the device shows the "--" placeholder rather than breaking.
async function fetchStats(res) {
  const config = readConfig();
  const url = buildRequestUrl(config.siteUrl, config.competitionId, config.bib);
  if (!url) {
    res(null, { stats: null, rows: config.rows });
    return;
  }

  try {
    const response = await fetch({ url, method: "GET" });
    const body = typeof response.body === "string" ? JSON.parse(response.body) : response.body;
    const stats = body && body.stats ? body.stats : null;
    res(null, { stats, rows: config.rows });
  } catch {
    res(null, { stats: null, rows: config.rows });
  }
}

AppSideService(
  BaseSideService({
    onInit() {},

    onRequest(req, res) {
      if (req.method === GET_STATS) {
        fetchStats(res);
      }
    },

    onRun() {},

    onDestroy() {},
  })
);
