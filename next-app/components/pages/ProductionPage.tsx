"use client";

import { useCallback, useMemo, useState } from "react";
import { l2l, integer, numberValue, pct } from "@/lib/l2l";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { KpiCard } from "../KpiCard";
import { StatusBadge } from "../StatusBadge";

const today = () => new Date().toISOString().slice(0, 10);

export function ProductionPage() {
  const [date, setDate] = useState(today());
  const [area, setArea] = useState("Todas");
  const [line, setLine] = useState("Todas");

  const loader = useCallback(() => l2l.daily(date), [date]);
  const { data = [], loading, error, updatedAt } = useAutoRefresh(loader);

  const rows = useMemo(() => (data || []).filter(r =>
    (area === "Todas" || String(r.area || "") === area) &&
    (line === "Todas" || String(r.line || "") === line)
  ), [data, area, line]);

  const areas = useMemo(() => [...new Set((data || []).map(r=>String(r.area||"")).filter(Boolean))].sort(), [data]);
  const lines = useMemo(() => [...new Set((data || []).filter(r=>area==="Todas"||String(r.area||"")===area).map(r=>String(r.line||"")).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"pt-BR",{numeric:true})), [data, area]);

  const demand=rows.reduce((s,r)=>s+numberValue(r.demand),0);
  const actual=rows.reduce((s,r)=>s+numberValue(r.actual),0);
  const scrap=rows.reduce((s,r)=>s+numberValue(r.scrap),0);
  const attainment=demand?actual/demand*100:0;

  return <div className="page">
    <div className="page-head"><div><h1>Produção em Tempo Real</h1><p>Demanda, produção atual e scrap por linha</p></div><StatusBadge loading={loading} error={error} updatedAt={updatedAt}/></div>

    <section className="panel filter-panel">
      <div className="filter-head"><div><h2>Filtros de produção</h2><p>Atualização automática a cada 1 minuto.</p></div><span className="auto-pill"><i/> Tempo real</span></div>
      <div className="filter-grid three">
        <label>Setor<select value={area} onChange={e=>{setArea(e.target.value);setLine("Todas")}}><option value="Todas">Todos os setores</option>{areas.map(v=><option key={v}>{v}</option>)}</select></label>
        <label>Linha<select value={line} onChange={e=>setLine(e.target.value)}><option value="Todas">Todas as linhas</option>{lines.map(v=><option key={v}>{v}</option>)}</select></label>
        <label>Data<input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label>
      </div>
    </section>

    <div className="kpi-grid five">
      <KpiCard label="Demanda" value={integer(demand)}/>
      <KpiCard label="Produção atual" value={integer(actual)} tone={attainment>=100?"good":"default"}/>
      <KpiCard label="Produzido líquido" value={integer(Math.max(0,actual-scrap))}/>
      <KpiCard label="Atingimento" value={pct(attainment)} tone={attainment>=100?"good":attainment>=95?"warn":"bad"}/>
      <KpiCard label="Scrap" value={integer(scrap)} tone={scrap>0?"bad":"good"}/>
    </div>

    <section className="panel">
      <div className="panel-title"><span>LINHAS MONITORADAS</span><h2>Produção por linha</h2></div>
      <div className="table-wrap"><table><thead><tr><th>Setor</th><th>Linha</th><th>Demanda</th><th>Produção</th><th>Líquido</th><th>Scrap</th><th>Atingimento</th></tr></thead><tbody>
        {rows.sort((a,b)=>String(a.line||"").localeCompare(String(b.line||""),"pt-BR",{numeric:true})).map((r,i)=>{
          const d=numberValue(r.demand), a=numberValue(r.actual), s=numberValue(r.scrap);
          return <tr key={String(r.line)+i}><td>{String(r.area||"-")}</td><td><b>{String(r.line||"-")}</b></td><td>{integer(d)}</td><td><b>{integer(a)}</b></td><td>{integer(Math.max(0,a-s))}</td><td>{integer(s)}</td><td>{pct(d?a/d*100:0)}</td></tr>
        })}
      </tbody></table></div>
    </section>
  </div>
}
