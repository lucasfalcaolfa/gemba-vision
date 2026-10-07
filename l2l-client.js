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
  async getScrapDetails(date, startTime = "00:00", endTime = "23:59") {
    const day = date || new Date().toISOString().slice(0, 10);
    const start = encodeURIComponent(day + " " + startTime);
    const end = encodeURIComponent(day + " " + endTime);
    const response = await fetch("/api/l2l?report=scrapdetail&start=" + start + "&end=" + end);
    const payload = await response.json();
    if (!response.ok || payload.success === false) {
      throw new Error(payload.error || "Falha ao consultar detalhes de scrap no L2L");
    }
    return Array.isArray(payload.data) ? payload.data : [];
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