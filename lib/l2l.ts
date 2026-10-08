import type { DailyRow, HomeContext, ScrapRow, Shift } from "./types";

const encode = (value: string) => encodeURIComponent(value);

async function request<T>(query: string): Promise<T> {
  const response = await fetch(`/api/l2l?${query}`, { cache: "no-store" });
  const payload = await response.json();
  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.error || "Falha ao consultar o L2L");
  }
  return payload.data as T;
}

export const l2l = {
  daily(date: string, start = "00:00", end = "23:59") {
    return request<DailyRow[]>(
      `report=daily&show_shifts=1&show_products=1&start=${encode(date + " " + start)}&end=${encode(date + " " + end)}`
    );
  },

  dailyWindow(start: string, end: string) {
    return request<DailyRow[]>(
      `report=daily&show_shifts=1&show_products=1&start=${encode(start)}&end=${encode(end)}`
    );
  },

  oeeShiftRange(startDate: string, endDate: string, shift: Shift) {
    const addDay = (iso: string, days = 1) => {
      const d = new Date(iso + "T00:00:00");
      d.setDate(d.getDate() + days);
      return d.toISOString().slice(0, 10);
    };
    if (shift === "1") return this.dailyWindow(startDate + " 07:00", endDate + " 17:00");
    if (shift === "2") return this.dailyWindow(startDate + " 17:00", addDay(endDate) + " 02:00");
    if (shift === "3") return this.dailyWindow(startDate + " 02:00", endDate + " 07:00");
    return this.dailyWindow(startDate + " 00:00", endDate + " 23:59");
  },

  scrap(start: string, end: string) {
    return request<ScrapRow[]>(
      `report=scrapdetail&start=${encode(start)}&end=${encode(end)}`
    );
  },

  homeContext(start: string, end: string) {
    return request<HomeContext>(
      `report=homecontext&start=${encode(start)}&end=${encode(end)}`
    );
  },

  pitchHeat(start: string, end: string) {
    return request<DailyRow[]>(
      `report=pitchheat&start=${encode(start)}&end=${encode(end)}`
    );
  },
};

export const numberValue = (value: unknown) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

export const pct = (value: unknown, digits = 1) =>
  `${numberValue(value).toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits })}%`;

export const integer = (value: unknown) =>
  Math.round(numberValue(value)).toLocaleString("pt-BR");
