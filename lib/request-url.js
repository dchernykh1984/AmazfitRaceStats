// Builds the timing-site endpoint for a rider, matching the Garmin data field's
// contract exactly so a race timed for one client works for the other. Pure and
// unit tested; the side service calls this before fetching.

// The endpoint for a competition and bib, or null when the settings are not yet
// usable (blank URL, non-positive competition id, or blank bib). A trailing slash
// on the site URL is tolerated.
export function buildRequestUrl(siteUrl, competitionId, bib) {
  const base = String(siteUrl == null ? "" : siteUrl)
    .trim()
    .replace(/\/+$/, "");
  const competition = Number(competitionId);
  const bibValue = String(bib == null ? "" : bib).trim();

  if (base === "" || !Number.isInteger(competition) || competition <= 0 || bibValue === "") {
    return null;
  }
  return base + "/api/v1/live-stats/" + competition + "/" + bibValue;
}
