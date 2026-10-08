window.L2L = {
  async getDaily(date, startTime = "00:00", endTime = "23:59") {
    const day = date || new Date().toISOString().slice(0, 10);
    const start = encodeURIComponent(day + " " + startTime);
    const end = encodeURIComponent(day + " " + endTime);
    const response = await fetch(
      "/api/l2l?report=daily&show_shifts=1&show_products=1&start=" + start + "&end=" + end
    );
    const payload = await response.json();
    if (!response.ok || payload.success === false) {
      throw new Error(payload.error || "Falha ao consultar o L2L");
    }
    return Array.isArray(payload.data) ? payload.data : [];
  },
  async getProducts(startDateTime, endDateTime) {
    const start = encodeURIComponent(startDateTime || "");
    const end = encodeURIComponent(endDateTime || "");
    const response = await fetch("/api/l2l?report=products&start=" + start + "&end=" + end);
    const payload = await response.json();
    if (!response.ok || payload.success === false) {
      throw new Error(payload.error || "Falha ao consultar produtos cadastrados no L2L");
    }
    return Array.isArray(payload.data) ? payload.data : [];
  },
  async getPitchHeat(startDate, endDate, startTime = "00:00", endTime = "23:59") {
    const first = startDate || new Date().toISOString().slice(0, 10);
    const last = endDate || first;
    const start = encodeURIComponent(first + " " + startTime);
    const end = encodeURIComponent(last + " " + endTime);
    const response = await fetch("/api/l2l?report=pitchheat&start=" + start + "&end=" + end);
    const payload = await response.json();
    if (!response.ok || payload.success === false) {
      throw new Error(payload.error || "Falha ao consultar pitches do L2L");
    }
    return Array.isArray(payload.data) ? payload.data : [];
  },
  async getOeeSummaryWindow(startDateTime, endDateTime) {
    const start = encodeURIComponent(startDateTime);
    const end = encodeURIComponent(endDateTime);
    const response = await fetch(
      "/api/l2l?report=daily&start=" + start + "&end=" + end
    );
    const payload = await response.json();
    if (!response.ok || payload.success === false) {
      throw new Error(payload.error || "Falha ao consultar resumo OEE do L2L");
    }
    return Array.isArray(payload.data) ? payload.data : [];
  },
  async getOeeShiftRange(startDate, endDate, shift = "Todos", startTime = "00:00", endTime = "23:59") {
    const first = startDate || new Date().toISOString().slice(0, 10);
    const last = endDate || first;

    const addDay = (iso, days = 1) => {
      const d = new Date(iso + "T00:00:00");
      d.setDate(d.getDate() + days);
      return d.toISOString().slice(0, 10);
    };

    if (shift === "1" || shift === "2" || shift === "3") {
      const dates = [];
      const cursor = new Date(first + "T00:00:00");
      const finish = new Date(last + "T00:00:00");
      while (cursor <= finish) {
        dates.push(cursor.toISOString().slice(0, 10));
        cursor.setDate(cursor.getDate() + 1);
      }

      const windows = dates.map(day => {
        if (shift === "1") return [day + " 07:00", day + " 17:00"];
        if (shift === "2") return [day + " 17:00", addDay(day) + " 02:00"];
        return [day + " 02:00", day + " 07:00"];
      });

      const results = await Promise.all(
        windows.map(([start, end]) => this.getOeeSummaryWindow(start, end))
      );
      return results.flat();
    }

    return this.getOeeSummaryWindow(
      first + " " + startTime,
      last + " " + endTime
    );
  },
  async getDailyWindow(startDateTime, endDateTime) {
    const start = encodeURIComponent(startDateTime);
    const end = encodeURIComponent(endDateTime);
    const response = await fetch(
      "/api/l2l?report=daily&show_shifts=1&show_products=1&start=" + start + "&end=" + end
    );
    const payload = await response.json();
    if (!response.ok || payload.success === false) {
      throw new Error(payload.error || "Falha ao consultar janela OEE no L2L");
    }
    return Array.isArray(payload.data) ? payload.data : [];
  },
  async getRange(startDate, endDate, startTime = "00:00", endTime = "23:59") {
    const first = startDate || new Date().toISOString().slice(0, 10);
    const last = endDate || first;
    const dates = [];
    const cursor = new Date(first + "T00:00:00");
    const finish = new Date(last + "T00:00:00");
    while (cursor <= finish) {
      dates.push(cursor.toISOString().slice(0, 10));
      cursor.setDate(cursor.getDate() + 1);
    }
    const requests = dates.map((day, index) => {
      const s = index === 0 ? startTime : "00:00";
      const e = index === dates.length - 1 ? endTime : "23:59";
      return this.getDaily(day, s, e);
    });
    const results = await Promise.all(requests);
    return results.flat();
  },
  async getHomeContextWindow(startDateTime, endDateTime) {
    const start = encodeURIComponent(startDateTime);
    const end = encodeURIComponent(endDateTime);
    const response = await fetch("/api/l2l?report=homecontext&start=" + start + "&end=" + end);
    const payload = await response.json();
    if (!response.ok || payload.success === false) {
      throw new Error(payload.error || "Falha ao consultar Dispatches e comentários do L2L");
    }
    return payload.data || { pitches: [], dispatches: [] };
  },
  async getHomeContext(date, startTime = "00:00", endTime = "23:59") {
    const day = date || new Date().toISOString().slice(0, 10);
    return this.getHomeContextWindow(day + " " + startTime, day + " " + endTime);
  },
  async getScrapDetailsWindow(startDateTime, endDateTime) {
    const start = encodeURIComponent(startDateTime);
    const end = encodeURIComponent(endDateTime);
    const response = await fetch("/api/l2l?report=scrapdetail&start=" + start + "&end=" + end);
    const payload = await response.json();
    if (!response.ok || payload.success === false) {
      throw new Error(payload.error || "Falha ao consultar detalhes de scrap no L2L");
    }
    return Array.isArray(payload.data) ? payload.data : [];
  },
  async getScrapDetails(date, startTime = "00:00", endTime = "23:59") {
    const day = date || new Date().toISOString().slice(0, 10);
    return this.getScrapDetailsWindow(day + " " + startTime, day + " " + endTime);
  },
  number(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  },
  summarize(rows) {
    const sum = (key) => rows.reduce((acc, row) => acc + this.number(row[key]), 0);
    const average = (key) => rows.length
      ? rows.reduce((acc, row) => acc + this.number(row[key]), 0) / rows.length
      : 0;
    return {
      demand: sum("demand"),
      actual: sum("actual"),
      scrap: sum("scrap"),
      rejectPercent: average("reject_percent"),
      availability: average("operational_availability"),
      performance: average("peff"),
      quality: average("yield"),
      oee: average("overall_equipment_effectiveness")
    };
  }
};