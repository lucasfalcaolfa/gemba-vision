"use client";

import { useCallback, useMemo, useState } from "react";
import { l2l, integer, numberValue, pct } from "@/lib/l2l";
import type { DailyRow } from "@/lib/types";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { KpiCard } from "../KpiCard";
import { StatusBadge } from "../StatusBadge";

const addDay = (iso: string, days: number) => {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

const operationalWindow = () => {
  const today = new Date().toISOString().slice(0, 10);
  const start = addDay(today, -1);
  return { start, end: today };
};

const isFnd = (row: DailyRow) => String(row.area || "").toUpperCase().startsWith("FND");
const processOf = (row: DailyRow) => /ACAB/i.test(String(row.area || row.line || "")) ? "acabamento" : "injecao";

export function OverviewPage() {
  const [process, setProcess] = useState<"injecao" | "acabamento">("injecao");
  const windowRange = useMemo(operationalWindow, []);

  const loader = useCallback(
    () => l2l.dailyWindow(windowRange.start + " 07:00", windowRange.end + " 07:00"),
    [windowRange]
  );
  const { data = [], loading, error, updatedAt } = useAutoRefresh(loader);

  const rows = useMemo(
    () => (data || []).filter(isFnd).filter(r => processOf(r) === process),
    [data, process]
  );

  const demand = rows.reduce((s, r) => s + numberValue(r.demand), 0);
  const actual = rows.reduce((s, r) => s + numberValue(r.actual), 0);
  const scrap = rows.reduce((s, r) => s + numberValue(r.scrap), 0);
  const oeeRows = rows.filter(r => Number.isFinite(Number(r.overall_equipment_effectiveness)));
  const avgOee = oeeRows.length
    ? oeeRows.reduce((s, r) => s + numberValue(r.overall_equipment_effectiveness), 0) / oeeRows.length
    : 0;
  const attainment = demand ? (actual / demand) * 100 : 0;

  const lines = [...rows]
    .sort((a, b) => numberValue(b.overall_equipment_effectiveness) - numberValue(a.overall_equipment_effectiveness))
    .slice(0, 8);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <span className="eyebrow">GESTÃO À VISTA • FND</span>
          <h1>Visão Geral</h1>
          <p>Janela operacional {windowRange.start.split("-").reverse().join("/")} 07:00 → {windowRange.end.split("-").reverse().join("/")} 07:00</p>
        </div>
        <StatusBadge loading={loading} error={error} updatedAt={updatedAt} />
      </div>

      <section className="executive-switch panel">
        <div><span>PROCESSO</span><strong>Selecione a operação</strong></div>
        <div className="segmented">
          <button className={process === "injecao" ? "active" : ""} onClick={() => setProcess("injecao")}>Injetoras</button>
          <button className={process === "acabamento" ? "active" : ""} onClick={() => setProcess("acabamento")}>Acabamento</button>
        </div>
      </section>

      <section className="section">
        <div className="section-title"><div><span>01 • RESULTADO</span><h2>Resumo executivo</h2></div><p>Indicadores principais do processo selecionado.</p></div>
        <div className="kpi-grid five">
          <KpiCard label="Demanda" value={integer(demand)} />
          <KpiCard label="Produção real" value={integer(actual)} tone={attainment >= 100 ? "good" : attainment >= 95 ? "warn" : "bad"} />
          <KpiCard label="Produzido líquido" value={integer(Math.max(0, actual - scrap))} />
          <KpiCard label="OEE médio" value={pct(avgOee)} tone={avgOee >= 85 ? "good" : avgOee >= 70 ? "warn" : "bad"} />
          <KpiCard label="Não qualidade" value={integer(scrap)} tone={scrap > 0 ? "bad" : "good"} />
        </div>
      </section>

      <section className="section-grid two">
        <article className="panel feature-panel">
          <div className="panel-title"><span>PLANO X REAL</span><h2>Performance de produção</h2></div>
          <div className="hero-number"><strong>{pct(attainment)}</strong><span>Atingimento do plano</span></div>
          <div className="progress"><i style={{ width: `${Math.min(100, Math.max(0, attainment))}%` }} /></div>
          <div className="metric-row"><span>Gap</span><b>{integer(actual - demand)} peças</b></div>
        </article>
        <article className="panel feature-panel">
          <div className="panel-title"><span>EFICIÊNCIA</span><h2>Melhores linhas por OEE</h2></div>
          <div className="rank-list">
            {lines.map((r, i) => (
              <div className="rank-item" key={String(r.line) + i}>
                <span>{i + 1}</span>
                <div><b>{String(r.line || "Sem linha")}</b><small>{String(r.area || "FND")}</small></div>
                <strong>{pct(r.overall_equipment_effectiveness)}</strong>
              </div>
            ))}
            {!lines.length && <div className="empty-state">Sem linhas no período.</div>}
          </div>
        </article>
      </section>
    </div>
  );
}
