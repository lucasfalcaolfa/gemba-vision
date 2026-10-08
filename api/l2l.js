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

  async function resolveNumericSite(start, end) {
    const configuredId = String(process.env.L2L_SITE_ID || "").trim();
    if (/^\d+$/.test(configuredId)) return Number(configuredId);

    // 1) Best source: the production report already used by this integration.
    try {
      const daily = await l2lGet("/api/1.0/reporting/production/daily_summary_data_by_line/", {
        site: siteCode,
        start,
        end,
      });
      const rows = Array.isArray(daily?.data) ? daily.data : [];
      const found = rows.find(r => r.site !== undefined && r.site !== null && String(r.site).trim() !== "")?.site;
      if (found !== undefined && found !== null && String(found).trim() !== "") return Number(found);
    } catch {}

    // 2) Resolve by the Sites master data when the selected period has no production rows.
    try {
      const sitesPayload = await l2lGet("/api/1.0/sites/", { limit: 2000 });
      const sites = Array.isArray(sitesPayload?.data) ? sitesPayload.data : [];
      const wanted = String(siteCode || "").trim().toUpperCase();
      const match = sites.find(site => {
        const candidates = [
          site.code,
          site.name,
          site.externalid,
          site.external_id,
          site.sitecode,
          site.site_code,
        ].filter(v => v !== undefined && v !== null).map(v => String(v).trim().toUpperCase());
        return candidates.includes(wanted);
      });
      if (match?.id !== undefined && match?.id !== null) return Number(match.id);
    } catch {}

    // 3) Last safe fallback for the currently configured Manaus plant.
    // This numeric id has already been observed in successful L2L production responses.
    if (String(siteCode || "").trim().toUpperCase() === "BRMNP3") return 240;

    throw new Error("Unable to resolve numeric L2L site id.");
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

  if (report === "pitchheat") {
    const start = String(req.query.start || "").trim();
    const end = String(req.query.end || "").trim();
    if (!start || !end) {
      return res.status(400).json({ success: false, error: "start and end are required for pitch heatmap." });
    }

    try {
      const toIso = (value) => {
        const v = String(value || "").trim().replace(" ", "T");
        return v.length === 16 ? v + ":00" : v;
      };

      const numericSite = await resolveNumericSite(start, end);

      const [linesResult, areasResult] = await Promise.allSettled([
        l2lGet("/api/1.0/lines/", { site: numericSite, limit: 2000 }),
        l2lGet("/api/1.0/areas/", { site: numericSite, limit: 2000 }),
      ]);
      const dataOf = (result) => result.status === "fulfilled" && Array.isArray(result.value?.data) ? result.value.data : [];
      const lines = dataOf(linesResult);
      const areas = dataOf(areasResult);
      const areaMap = new Map(areas.map(x => [String(x.id), x]));

      const lineMap = new Map(lines.map(line => {
        const areaId =
          typeof line.area === "object"
            ? (line.area?.id ?? line.area?.pk)
            : (line.area ?? line.area_id);
        const areaObj = areaMap.get(String(areaId));
        const embeddedArea =
          typeof line.area === "object"
            ? (line.area?.name ?? line.area?.code ?? line.area?.description ?? "")
            : "";
        const area =
          embeddedArea ||
          areaObj?.name ||
          areaObj?.code ||
          areaObj?.description ||
          line.area_name ||
          line.areaname ||
          "";
        return [String(line.id), {
          line: line.name ?? line.code ?? line.description ?? String(line.id),
          area: String(area || ""),
        }];
      }));

      const payload = await l2lGet("/api/1.0/pitches/", {
        site: numericSite,
        pitch_start__lte: toIso(end),
        pitch_end__gte: toIso(start),
        limit: 2000,
        order_by: "pitch_start",
      });

      if (payload?.success === false) {
        throw new Error(payload.error || "L2L returned success=false for Pitches.");
      }

      const rows = (Array.isArray(payload?.data) ? payload.data : []).map(row => {
        const lineId =
          row.line && typeof row.line === "object"
            ? (row.line.id ?? row.line.pk)
            : row.line;
        const meta = lineMap.get(String(lineId)) || {};

        const pitchAreaId =
          row.area && typeof row.area === "object"
            ? (row.area.id ?? row.area.pk)
            : row.area;
        const pitchAreaObj = areaMap.get(String(pitchAreaId));
        const pitchArea =
          (row.area && typeof row.area === "object"
            ? (row.area.name ?? row.area.code ?? row.area.description ?? "")
            : "") ||
          pitchAreaObj?.name ||
          pitchAreaObj?.code ||
          pitchAreaObj?.description ||
          "";

        const embeddedLine =
          row.line && typeof row.line === "object"
            ? (row.line.name ?? row.line.code ?? row.line.description ?? "")
            : "";

        return {
          id: row.id,
          line_id: lineId,
          line: meta.line || embeddedLine || String(lineId ?? "Sem linha"),
          area: meta.area || String(pitchArea || ""),
          pitch_start: row.pitch_start,
          pitch_end: row.pitch_end,
          oee: Number(row.overall_equipment_effectiveness ?? 0),
          planned_production_minutes: Number(row.planned_production_minutes ?? 0),
          actual: Number(row.actual ?? 0),
          demand: Number(row.demand ?? 0),
          scrap: Number(row.scrap ?? 0),
          shift: row.shift,
        };
      }).filter(row => row.pitch_start && row.pitch_end);

      return res.status(200).json({
        success: true,
        data: rows,
        meta: {
          numeric_site: numericSite,
          pitch_count: rows.length,
          line_count: lines.length,
          mapped_area_count: [...lineMap.values()].filter(x => x.area).length,
          areas: [...new Set(rows.map(x => x.area).filter(Boolean))].sort(),
        },
      });
    } catch (error) {
      return res.status(error.status || 502).json({
        success: false,
        error: error.message || "Unable to load pitch heatmap data.",
      });
    }
  }

  if (report === "homecontext") {
    const start = String(req.query.start || "").trim();
    const end = String(req.query.end || "").trim();
    if (!start || !end) {
      return res.status(400).json({ success: false, error: "start and end are required for home context." });
    }

    try {
      const toIso = (value) => {
        const v = String(value || "").trim().replace(" ", "T");
        return v.length === 16 ? v + ":00" : v;
      };
      const startIso = toIso(start);
      const endIso = toIso(end);
      const numericSite = await resolveNumericSite(start, end);

      const lookupResults = await Promise.allSettled([
        l2lGet("/api/1.0/lines/", { site: numericSite, limit: 2000 }),
        l2lGet("/api/1.0/productcomponents/", { site: numericSite, limit: 2000 }),
        l2lGet("/api/1.0/dispatchtypes/", { site: numericSite, limit: 2000 }),
      ]);

      const dataOf = (result) => result.status === "fulfilled" && Array.isArray(result.value?.data) ? result.value.data : [];
      const [lines, products, dispatchTypes] = lookupResults.map(dataOf);
      const byId = (rows) => new Map(rows.map(x => [String(x.id), x]));
      const lineMap = byId(lines);
      const productMap = byId(products);
      const dispatchTypeMap = byId(dispatchTypes);

      const refId = (value) => {
        if (value && typeof value === "object") return value.id ?? value.pk ?? value.value ?? null;
        return value;
      };
      const label = (value, map, fallback = "-") => {
        if (value && typeof value === "object") {
          return value.name ?? value.code ?? value.description ?? value.number ?? String(value.id ?? fallback);
        }
        const found = map.get(String(value));
        return found ? (found.name ?? found.code ?? found.description ?? String(found.id)) : (value ?? fallback);
      };
      const isFndLine = (lineRef, row = {}) => {
        const line = lineMap.get(String(refId(lineRef))) || (lineRef && typeof lineRef === "object" ? lineRef : null);
        const area = String(
          line?.area?.name ??
          line?.area_name ??
          line?.areacode ??
          line?.area ??
          row.areacode ??
          row.area?.name ??
          row.area ??
          ""
        ).toUpperCase();
        const lineCode = String(line?.code ?? line?.name ?? row.linecode ?? row.lineabbreviation ?? "").toUpperCase();
        return area === "FND" || area.startsWith("FND_") || area.includes("FUNDI") || lineCode.startsWith("FND_") || lineCode.includes("INJETORA AL");
      };

      let pitchesPayload;
      try {
        pitchesPayload = await l2lGet("/api/1.0/pitches/", {
          site: numericSite,
          pitch_start__gte: startIso,
          pitch_start__lte: endIso,
          limit: 2000,
          order_by: "pitch_start",
        });
      } catch {
        pitchesPayload = { data: [] };
      }

      let dispatchPayload;
      try {
        dispatchPayload = await l2lGet("/api/1.0/dispatches/", {
          site: numericSite,
          areacode: "FND",
          created__gte: startIso,
          created__lte: endIso,
          limit: 2000,
          order_by: "-created",
        });
      } catch {
        dispatchPayload = await l2lGet("/api/1.0/dispatches/", {
          site: numericSite,
          created__gte: startIso,
          created__lte: endIso,
          limit: 2000,
          order_by: "-created",
        });
      }

      const pitches = (Array.isArray(pitchesPayload?.data) ? pitchesPayload.data : [])
        .filter(row => isFndLine(row.line, row))
        .map(row => ({
          id: row.id,
          start: row.pitch_start ?? row.start ?? row.created ?? null,
          end: row.pitch_end ?? row.end ?? null,
          line: label(row.line, lineMap, row.linecode ?? "Sem linha"),
          line_id: refId(row.line),
          product: label(row.actual_product ?? row.planned_product, productMap, "Sem modelo"),
          product_id: refId(row.actual_product ?? row.planned_product),
          demand: Number(row.demand ?? 0),
          actual: Number(row.actual ?? 0),
          scrap: Number(row.scrap ?? 0),
          comment: String(row.comment ?? row.comments ?? row.countermeasure ?? row.countermeasures ?? "").trim(),
          oee: Number(row.overall_equipment_effectiveness ?? 0),
        }));

      const dispatches = (Array.isArray(dispatchPayload?.data) ? dispatchPayload.data : [])
        .filter(row => isFndLine(row.line, row))
        .map(row => {
          const typeRef = row.dispatchtype ?? row.dispatch_type ?? row.type;
          const reason = row.reason?.description ?? row.reason?.name ?? row.reason ?? row.reasoncode ?? row.whydescription ?? row.why ?? "";
          return {
            id: row.id,
            number: row.number ?? row.dispatchnumber ?? row.id,
            created: row.created ?? row.started ?? row.opened ?? null,
            completed: row.completed ?? row.closed ?? null,
            line: label(row.line, lineMap, row.linecode ?? row.lineabbreviation ?? "Sem linha"),
            line_id: refId(row.line),
            machine: row.machinedescription ?? row.machine?.description ?? row.machine?.name ?? row.machinecode ?? "",
            product: label(
              row.product ?? row.actual_product ?? row.planned_product ?? row.productcomponent ?? row.product_component,
              productMap,
              ""
            ),
            product_id: refId(
              row.product ?? row.actual_product ?? row.planned_product ?? row.productcomponent ?? row.product_component
            ),
            dispatch_type: label(typeRef, dispatchTypeMap, row.dispatchtypecode ?? row.dispatch_type_code ?? "Dispatch"),
            dispatch_type_id: refId(typeRef),
            description: String(row.description ?? row.problem ?? row.name ?? row.text ?? "").trim(),
            reason: String(reason ?? "").trim(),
            status: row.statusdescription ?? row.status_name ?? row.status ?? "",
            downtime_minutes: Number(row.downtime_minutes ?? row.downtime ?? 0),
          };
        });

      return res.status(200).json({ success: true, data: { pitches, dispatches } });
    } catch (error) {
      return res.status(error.status || 502).json({ success: false, error: error.message || "Unable to load L2L home context." });
    }
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

      // Generic L2L record APIs use the numeric Site FK.
      const numericSite = await resolveNumericSite(start, end);

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
          cause:
            row.cause?.name ??
            row.cause?.description ??
            row.cause ??
            row.reason?.name ??
            row.reason?.description ??
            row.reason ??
            row.root_cause?.name ??
            row.root_cause?.description ??
            row.root_cause ??
            row.scrap_cause?.name ??
            row.scrap_cause?.description ??
            row.scrap_cause ??
            row.cause_description ??
            row.comment ??
            row.comments ??
            row.notes ??
            "",
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
