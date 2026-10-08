"use client";

import { useCallback, useMemo, useState } from "react";
import { l2l, numberValue, pct } from "@/lib/l2l";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { KpiCard } from "../KpiCard";
import { StatusBadge } from "../StatusBadge";

const today = () => new Date().toISOString().slice(0, 10);

type PitchRow = {
  line?: string;
  area?: string;
  pitch_start?: string;
  pitch_end?: string;
  oee?: number;
  actual?: number;
  demand?: number;
  scrap?: number;
  shift?: unknown;
  [key: string]: unknown;
};

const shiftOf = (row: PitchRow) => {
  const explicit = String(row.shift ?? "").trim();
  if (explicit === "1" || /1/.test(explicit)) return "1º Turno";
  if (explicit === "2" || /2/.test(explicit)) return "2º Turno";
  if (explicit === "3" || /3/.test(explicit)) return "3º Turno";

  const date = new Date(String(row.pitch_start || ""));
  if (Number.isNaN(date.getTime())) return "Sem turno";

  const hour = date.getHours();
  if (hour >= 7 && hour < 17) return "1º Turno";
  if (hour >= 17 || hour < 2) return "2º Turno";
  return "3º Turno";
};

const toneOf = (value: number | null) => {
  if (value === null) return "empty";
  if (value >= 85) return "good";
  if (value >= 70) return "warn";
  return "bad";
};

export function HeatmapPage() {
  const [date, setDate] = useState(today());
  const [line, setLine] = useState("Todas");
  const [shift, setShift] = useState("Todos");

  const loader = useCallback(
    () => l2l.pitchHeat(date + " 00:00", date + " 23:59"),
    [date]
  );

  const { data = [], loading, error, updatedAt } = useAutoRefresh(loader);

  const rows = (data || []) as PitchRow[];

  const lines = useMemo(
    () =>
      [...new Set(rows.map(row => String(row.line || "")).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true })),
    [rows]
  );

  const filteredRows = useMemo(
    () =>
      rows.filter(row =>
        (line === "Todas" || String(row.line || "") === line) &&
        (shift === "Todos" || shiftOf(row) === shift)
      ),
    [rows, line, shift]
  );

  const shifts = ["1º Turno", "2º Turno", "3º Turno"];

  const matrix = useMemo(() => {
    const result = new Map<string, Map<string, PitchRow[]>>();

    for (const row of filteredRows) {
      const rowLine = String(row.line || "Sem linha");
      const rowShift = shiftOf(row);

      if (!result.has(rowLine)) result.set(rowLine, new Map());
      const shiftMap = result.get(rowLine)!;

      if (!shiftMap.has(rowShift)) shiftMap.set(rowShift, []);
      shiftMap.get(rowShift)!.push(row);
    }

    return result;
  }, [filteredRows]);

  const average = (targetLine: string, targetShift: string) => {
    const set = matrix.get(targetLine)?.get(targetShift) || [];
    if (!set.length) return null;
    return set.reduce((sum, row) => sum + numberValue(row.oee), 0) / set.length;
  };

  const oeeRows = filteredRows.filter(row => Number.isFinite(Number(row.oee)));
  const avgOee = oeeRows.length
    ? oeeRows.reduce((sum, row) => sum + numberValue(row.oee), 0) / oeeRows.length
    : 0;

  const best = oeeRows.length
    ? [...oeeRows].sort((a, b) => numberValue(b.oee) - numberValue(a.oee))[0]
    : null;

  const worst = oeeRows.length
    ? [...oeeRows].sort((a, b) => numberValue(a.oee) - numberValue(b.oee))[0]
    : null;

  const visibleLines = line === "Todas" ? lines : lines.filter(value => value === line);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <span className="eyebrow">OEE • ANÁLISE VISUAL</span>
          <h1>Mapa de Calor OEE</h1>
          <p>Eficiência por linha e turno usando os pitches reais do L2L.</p>
        </div>
        <StatusBadge loading={loading} error={error} updatedAt={updatedAt} />
      </div>

      <section className="panel filter-panel">
        <div className="filter-head">
          <div>
            <h2>Filtros do mapa</h2>
            <p>Selecione data, linha ou turno para analisar a eficiência operacional.</p>
          </div>
          <span className="auto-pill"><i /> Dados L2L</span>
        </div>

        <div className="filter-grid three">
          <label>
            Linha
            <select value={line} onChange={e => setLine(e.target.value)}>
              <option value="Todas">Todas as linhas</option>
              {lines.map(value => <option key={value}>{value}</option>)}
            </select>
          </label>

          <label>
            Turno
            <select value={shift} onChange={e => setShift(e.target.value)}>
              <option value="Todos">Todos os turnos</option>
              {shifts.map(value => <option key={value}>{value}</option>)}
            </select>
          </label>

          <label>
            Data
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </label>
        </div>
      </section>

      <section className="kpi-grid three">
        <KpiCard
          label="OEE médio"
          value={pct(avgOee)}
          tone={avgOee >= 85 ? "good" : avgOee >= 70 ? "warn" : "bad"}
        />
        <KpiCard
          label="Melhor resultado"
          value={best ? pct(best.oee) : "-"}
          helper={best ? String(best.line || "Sem linha") + " • " + shiftOf(best) : "Sem dados"}
          tone={best ? "good" : "default"}
        />
        <KpiCard
          label="Menor resultado"
          value={worst ? pct(worst.oee) : "-"}
          helper={worst ? String(worst.line || "Sem linha") + " • " + shiftOf(worst) : "Sem dados"}
          tone={worst ? "bad" : "default"}
        />
      </section>

      <section className="section">
        <div className="section-title">
          <div>
            <span>MATRIZ DE EFICIÊNCIA</span>
            <h2>OEE por linha e turno</h2>
          </div>
          <p>Verde ≥ 85% • Amarelo 70–84% • Vermelho &lt; 70%</p>
        </div>

        <div className="heat-grid">
          {shifts
            .filter(item => shift === "Todos" || shift === item)
            .map(targetShift => (
              <article className="panel heat-card" key={targetShift}>
                <div className="panel-title">
                  <span>EFICIÊNCIA DIÁRIA</span>
                  <h2>{targetShift}</h2>
                </div>

                <div className="heat-table">
                  <div className="heat-row head">
                    <b>Linha</b>
                    <b>OEE</b>
                  </div>

                  {visibleLines.map(targetLine => {
                    const value = average(targetLine, targetShift);
                    return (
                      <div className="heat-row" key={targetLine}>
                        <b>{targetLine}</b>
                        <span className={toneOf(value)}>
                          {value === null ? "—" : pct(value, 0)}
                        </span>
                      </div>
                    );
                  })}

                  {!visibleLines.length && (
                    <div className="empty-state">Sem linhas para o período selecionado.</div>
                  )}
                </div>
              </article>
            ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-title">
          <span>PITCHES</span>
          <h2>Detalhamento do período</h2>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Linha</th>
                <th>Turno</th>
                <th>Início</th>
                <th>Fim</th>
                <th>Demanda</th>
                <th>Produção</th>
                <th>Scrap</th>
                <th>OEE</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows
                .sort((a, b) => String(a.pitch_start || "").localeCompare(String(b.pitch_start || "")))
                .map((row, index) => (
                  <tr key={String(row.line) + String(row.pitch_start) + index}>
                    <td><b>{String(row.line || "-")}</b></td>
                    <td>{shiftOf(row)}</td>
                    <td>{row.pitch_start ? new Date(row.pitch_start).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "-"}</td>
                    <td>{row.pitch_end ? new Date(row.pitch_end).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "-"}</td>
                    <td>{Math.round(numberValue(row.demand)).toLocaleString("pt-BR")}</td>
                    <td>{Math.round(numberValue(row.actual)).toLocaleString("pt-BR")}</td>
                    <td>{Math.round(numberValue(row.scrap)).toLocaleString("pt-BR")}</td>
                    <td><b>{pct(row.oee)}</b></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
