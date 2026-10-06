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
