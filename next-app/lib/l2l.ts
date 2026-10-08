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
    const shiftWindow = shift === "1"
      ? ["07:00", "17:00"]
      : shift === "2"
        ? ["17:00", "02:00"]
        : shift === "3"
          ? ["02:00", "07:00"]
          : ["00:00", "23:59"];
    return this.dailyWindow(
      `${startDate} ${shiftWindow[0]}`,
      `${endDate} ${shiftWindow[1]}`
    );
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
