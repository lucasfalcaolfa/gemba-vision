"use client";

import { useCallback, useMemo, useState } from "react";
import { l2l, numberValue, pct, integer } from "@/lib/l2l";
import type { Shift } from "@/lib/types";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { StatusBadge } from "../StatusBadge";

const today = () => new Date().toISOString().slice(0, 10);

export function OeePage() {
  const [area, setArea] = useState("FND");
  const [line, setLine] = useState("Todas");
  const [shift, setShift] = useState<Shift>("Todos");
  const [date, setDate] = useState(today());

  const loader = useCallback(
    () => l2l.oeeShiftRange(date, date, shift),
    [date, shift]
  );
  const { data = [], loading, error, updatedAt } = useAutoRefresh(loader);

  const rows = useMemo(() => (data || []).filter(r =>
    (area === "Todas" || String(r.area || "") === area) &&
    (line === "Todas" || String(r.line || "") === line)
  ), [data, area, line]);

  const areas = useMemo(() => [...new Set((data || []).map(r => String(r.area || "")).filter(Boolean))].sort(), [data]);
  const lines = useMemo(() => [...new Set((data || []).filter(r => area === "Todas" || String(r.area || "") === area).map(r => String(r.line || "")).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"pt-BR",{numeric:true})), [data, area]);

  const groups = [...rows].sort((a,b)=>numberValue(b.overall_equipment_effectiveness)-numberValue(a.overall_equipment_effectiveness));

  return (
    <div className="page">
      <div className="page-head">
        <div><h1>OEE / Eficiência</h1><p>Acompanhamento de desempenho por linha e turno</p></div>
        <StatusBadge loading={loading} error={error} updatedAt={updatedAt} />
      </div>

      <section className="panel filter-panel">
        <div className="filter-head"><div><h2>Filtros de eficiência</h2><p>Automático • qualquer alteração atualiza o L2L. Turnos: 1º 07:00–17:00 • 2º 17:00–02:00 • 3º 02:00–07:00.</p></div><span className="auto-pill"><i /> Atualização automática</span></div>
        <div className="filter-grid four">
          <label>Setor<select value={area} onChange={e=>{setArea(e.target.value);setLine("Todas")}}><option value="Todas">Todos</option>{areas.map(v=><option key={v}>{v}</option>)}</select></label>
          <label>Linha<select value={line} onChange={e=>setLine(e.target.value)}><option value="Todas">Todas as linhas</option>{lines.map(v=><option key={v}>{v}</option>)}</select></label>
          <label>Turno<select value={shift} onChange={e=>setShift(e.target.value as Shift)}><option value="Todos">Todos os turnos</option><option value="1">1º Turno • 07:00–17:00</option><option value="2">2º Turno • 17:00–02:00</option><option value="3">3º Turno • 02:00–07:00</option></select></label>
          <label>Data<input type="date" value={date} onChange={e=>setDate(e.target.value)} /></label>
        </div>
      </section>

      <section className="machine-grid">
        {groups.map((r,i)=>{
          const oee=numberValue(r.overall_equipment_effectiveness);
          const tone=oee>=85?"good":oee>=70?"warn":"bad";
          return <article className={`machine-card ${tone}`} key={String(r.line)+i}>
            <div className="machine-head"><div><span>{String(r.area||"")}</span><h3>{String(r.line||"Sem linha")}</h3></div><b>{oee>=85?"Dentro da meta":oee>=70?"Atenção":"Crítico"}</b></div>
            <div className="oee-value"><span>OEE</span><strong>{pct(oee,0)}</strong></div>
            <div className="metric-grid">
              <div><span>OA</span><b>{pct(r.operational_availability,0)}</b></div>
              <div><span>PPP</span><b>{pct(r.peff,0)}</b></div>
              <div><span>Yield</span><b>{pct(r.yield,0)}</b></div>
              <div><span>Produção</span><b>{integer(r.actual)} / {integer(r.demand)}</b></div>
            </div>
          </article>
        })}
      </section>

      <section className="panel">
        <div className="panel-title"><span>RANKING EM TEMPO REAL</span><h2>Comparativo de eficiência por linha</h2></div>
        <div className="rank-list">
          {groups.map((r,i)=><div className="rank-item" key={"rank"+String(r.line)+i}><span>{i+1}</span><div><b>{String(r.line||"Sem linha")}</b><small>OA {pct(r.operational_availability)} • PPP {pct(r.peff)} • Yield {pct(r.yield)}</small></div><strong>{pct(r.overall_equipment_effectiveness)}</strong></div>)}
        </div>
      </section>
    </div>
  );
}
