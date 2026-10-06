window.L2L = {
  async getDaily(date) {
    const day = date || new Date().toISOString().slice(0, 10);
    const start = encodeURIComponent(day + " 00:00");
    const end = encodeURIComponent(day + " 23:59");
    const response = await fetch("/api/l2l?report=daily&start=" + start + "&end=" + end);
    const payload = await response.json();
    if (!response.ok || payload.success === false) {
      throw new Error(payload.error || "Falha ao consultar o L2L");
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