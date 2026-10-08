export type Shift = "Todos" | "1" | "2" | "3";

export interface DailyRow {
  date?: string;
  area?: string;
  area_id?: number | string;
  line?: string;
  line_id?: number | string;
  site?: number | string;
  demand?: number;
  actual?: number;
  scrap?: number;
  reject_percent?: number;
  operational_availability?: number;
  overall_equipment_effectiveness?: number;
  peff?: number;
  yield?: number;
  products?: unknown[];
  shifts?: unknown[];
  [key: string]: unknown;
}

export interface ScrapRow {
  id?: string | number;
  date?: string | null;
  defect?: string;
  product?: string;
  shift?: string;
  line?: string;
  area?: string;
  cause?: string;
  scrap?: number;
}

export interface PitchRow {
  id?: string | number;
  start?: string | null;
  end?: string | null;
  line?: string;
  line_id?: string | number | null;
  product?: string;
  demand?: number;
  actual?: number;
  scrap?: number;
  comment?: string;
  oee?: number;
}

export interface DispatchRow {
  id?: string | number;
  number?: string | number;
  created?: string | null;
  completed?: string | null;
  line?: string;
  line_id?: string | number | null;
  machine?: string;
  product?: string;
  dispatch_type?: string;
  description?: string;
  reason?: string;
  status?: string;
  downtime_minutes?: number;
}

export interface HomeContext {
  pitches: PitchRow[];
  dispatches: DispatchRow[];
}
