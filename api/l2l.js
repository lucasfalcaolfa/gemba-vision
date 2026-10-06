/**
 * Vercel Serverless Function - L2L proxy
 * Keeps L2L credentials on the server and exposes only whitelisted reports.
 *
 * Required environment variables in Vercel:
 *   L2L_BASE_URL=https://<company>.leading2lean.com
 *   L2L_API_KEY=...
 *   L2L_SITE_CODE=...
 */
module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  const baseUrl = (process.env.L2L_BASE_URL || "").replace(/\/$/, "");
  const apiKey = process.env.L2L_API_KEY;
  const siteCode = process.env.L2L_SITE_CODE;

  async function l2lGet(path, params = {}) {
    const url = new URL(baseUrl + path);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && String(value).trim() !== "") {
        url.searchParams.set(key, String(value));
      }
    }
    const response = await fetch(url, {
      method: "GET",
      headers: { L2LAUTH: apiKey, Accept: "application/json" },
    });
    const raw = await response.text();
    let payload;
    try { payload = JSON.parse(raw); }
    catch { payload = { success: false, error: "Invalid JSON returned by L2L." }; }
    if (!response.ok) {
      const error = new Error(payload.error || "L2L request failed.");
      error.status = response.status;
      throw error;
    }
    return payload;
  }

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const report = String(req.query.report || "health");

  if (report === "health") {
    return res.status(200).json({
      success: true,
      configured: Boolean(baseUrl && apiKey && siteCode),
      service: "L2L",
    });
  }

  if (!baseUrl || !apiKey || !siteCode) {
    return res.status(503).json({
      success: false,
      error: "L2L integration is not configured in Vercel environment variables.",
    });
  }

  if (report === "scrapdetail") {
    const start = String(req.query.start || "").trim();
    const end = String(req.query.end || "").trim();
    if (!start || !end) {
      return res.status(400).json({ success: false, error: "start and end are required for scrap details." });
    }

    try {
      const toIso = (value) => {
        const v = String(value || "").trim().replace(" ", "T");
        return v.length === 16 ? v + ":00" : v;
      };
      const startIso = toIso(start);
      const endIso = toIso(end);

      // Generic L2L record APIs use the numeric Site FK (example: 240),
      // while production reporting uses the configured site code (example: BRMNP3).
      const dailyForSite = await l2lGet("/api/1.0/reporting/production/daily_summary_data_by_line/", {
        site: siteCode,
        start,
        end,
      });
      const dailyRows = Array.isArray(dailyForSite?.data) ? dailyForSite.data : [];
      const numericSite = dailyRows.find(r => r.site !== undefined && r.site !== null)?.site;

      if (numericSite === undefined || numericSite === null || numericSite === "") {
        throw new Error("Unable to resolve numeric L2L site id for Scrap Detail.");
      }

      let scrapPayload = await l2lGet("/api/1.0/scrapdetail/", {
        site: numericSite,
        start__gte: startIso,
        start__lte: endIso,
        limit: 2000,
        order_by: "-start",
      });

      const lookups = await Promise.allSettled([
        l2lGet("/api/1.0/scrapcategory/", { site: numericSite, limit: 2000 }),
        l2lGet("/api/1.0/productcomponents/", { site: numericSite, limit: 2000 }),
        l2lGet("/api/1.0/resourceshifts/", { site: numericSite, limit: 2000 }),
        l2lGet("/api/1.0/lines/", { site: numericSite, limit: 2000 }),
      ]);

      const dataOf = (result) => result.status === "fulfilled" && Array.isArray(result.value?.data) ? result.value.data : [];
      const [categories, products, shifts, lines] = lookups.map(dataOf);
      const byId = (rows) => new Map(rows.map(x => [String(x.id), x]));
      const categoryMap = byId(categories);
      const productMap = byId(products);
      const shiftMap = byId(shifts);
      const lineMap = byId(lines);

      const refId = (value) => {
        if (value && typeof value === "object") return value.id ?? value.pk ?? value.value ?? null;
        return value;
      };
      const refLabel = (value, map, fallback = "-") => {
        if (value && typeof value === "object") return value.name ?? value.code ?? value.description ?? String(value.id ?? fallback);
        const found = map.get(String(value));
        return found ? (found.name ?? found.code ?? found.description ?? String(found.id)) : (value ?? fallback);
      };

      const startDate = new Date(start.replace(" ", "T"));
      const endDate = new Date(end.replace(" ", "T"));
      const rows = Array.isArray(scrapPayload?.data) ? scrapPayload.data : [];
      const normalized = rows.map(row => {
        const whenRaw = row.start || row.created || row.end || null;
        const when = whenRaw ? new Date(whenRaw) : null;
        const lineRef = lineMap.get(String(refId(row.line))) || (row.line && typeof row.line === "object" ? row.line : null);
        return {
          id: row.id,
          date: whenRaw,
          defect: refLabel(row.category, categoryMap, "Sem categoria"),
          defect_id: refId(row.category),
          product: refLabel(row.product, productMap, "Sem modelo"),
          product_id: refId(row.product),
          shift: refLabel(row.shift, shiftMap, "Sem turno"),
          shift_id: refId(row.shift),
          line: refLabel(row.line, lineMap, "Sem linha"),
          line_id: refId(row.line),
          area: lineRef?.area?.name ?? lineRef?.area_name ?? lineRef?.area ?? "",
          scrap: Number(row.scrap || 0),
        };
      }).filter(row => {
        if (!row.date) return true;
        const d = new Date(row.date);
        if (Number.isNaN(d.getTime()) || Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return true;
        return d >= startDate && d <= endDate;
      });

      return res.status(200).json({ success: true, data: normalized });
    } catch (error) {
      return res.status(error.status || 502).json({ success: false, error: error.message || "Unable to load L2L scrap details." });
    }
  }

  const allowedReports = {
    daily: "/api/1.0/reporting/production/daily_summary_data_by_line/",
    oee: "/api/1.0/reporting/production/oee_sites/",
  };

  const path = allowedReports[report];
  if (!path) {
    return res.status(400).json({ success: false, error: "Unsupported L2L report." });
  }

  const url = new URL(baseUrl + path);
  url.searchParams.set("site", siteCode);

  const passThrough = [
    "start",
    "end",
    "linecode",
    "line_externalid",
    "line_id",
    "costcentercode",
    "show_shifts",
    "show_products",
    "sites",
  ];

  for (const key of passThrough) {
    const value = req.query[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  if (!url.searchParams.get("start") || !url.searchParams.get("end")) {
    return res.status(400).json({
      success: false,
      error: "start and end are required for this report.",
    });
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        L2LAUTH: apiKey,
        Accept: "application/json",
      },
    });

    const raw = await response.text();
    let payload;
    try {
      payload = JSON.parse(raw);
    } catch {
      payload = { success: false, error: "Invalid JSON returned by L2L." };
    }

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: payload.error || "L2L request failed.",
      });
    }

    return res.status(200).json(payload);
  } catch (error) {
    return res.status(502).json({
      success: false,
      error: "Unable to reach L2L.",
    });
  }
};
