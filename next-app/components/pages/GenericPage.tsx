"use client";

import { useCallback, useMemo, useState } from "react";
import { l2l, integer, numberValue, pct } from "@/lib/l2l";
import type { DailyRow, ScrapRow } from "@/lib/types";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { KpiCard } from "../KpiCard";
import { StatusBadge } from "../StatusBadge";

type Mode = "safety" | "heatmap" | "stock" | "people" | "quality";
const today = () => new Date().toISOString().slice(0,10);

const HSE: Record<number, { title:string; focus:string; points:string[]; action:string }> = {
  1:{title:"Pequenas Mudanças Podem Importar",focus:"Nem toda mudança parece significativa. Uma pequena alteração pode mudar a exposição ao risco.",points:["Verifique mudanças no processo.","Confirme os controles existentes.","Considere a tarefa completa."],action:"Pergunte antes de iniciar: algo nesta tarefa mudou?"},
  2:{title:"Uma Mudança Pode Afetar Outra Coisa",focus:"Mudanças raramente existem isoladamente.",points:["Observe ferramentas e dispositivos.","Avalie materiais e recipientes.","Considere velocidade, sequência e layout."],action:"Olhe além da mudança e verifique o que mais ela pode afetar."},
  3:{title:"Não Esqueça os Controles",focus:"Um controle antigo pode não proteger da mesma forma depois de uma mudança.",points:["Revise proteções e sensores.","Confirme procedimentos e instruções.","Não presuma que o controle continua eficaz."],action:"Confirme que os controles ainda correspondem ao trabalho real."},
  4:{title:"Mudanças Temporárias Ainda São Mudanças",focus:"Algumas das mudanças mais fáceis de ignorar são as que assumimos como temporárias.",points:["Avalie ferramentas substitutas e reparos temporários.","Valide testes de produção e configurações temporárias.","Não deixe uma solução temporária virar processo permanente."],action:"Identifique qualquer mudança temporária e verifique seus riscos."},
  5:{title:"Mudar Deve Gerar uma Pergunta",focus:"Reconheça quando uma mudança merece uma nova análise.",points:["Pergunte quais novos perigos foram introduzidos.","Confirme se os controles continuam eficazes.","Envolva o suporte apropriado."],action:"Torne a análise de risco um hábito sempre que algo mudar."},
};

function PageHead({title,subtitle,status}:{title:string;subtitle:string;status?:React.ReactNode}){
  return <div className="page-head"><div><h1>{title}</h1><p>{subtitle}</p></div>{status}</div>;
}

function Safety(){
  const now=new Date(), item=HSE[now.getDay()];
  return <div className="page">
    <PageHead title="Momento de Segurança" subtitle="Conteúdo diário de HSE"/>
    <section className="hse-modern">
      <div className="hse-visual">
        <span className="hse-day">{now.toLocaleDateString("pt-BR",{weekday:"long"}).toUpperCase()}</span>
        <small>{now.toLocaleDateString("pt-BR")}</small>
        <div className="hse-symbol">✓</div>
        <h2>{item?.title || "Sem conteúdo programado"}</h2>
        <p>{item?.focus || "O conteúdo diário é exibido de segunda a sexta-feira."}</p>
      </div>
      {item && <div className="hse-details">
        <article><span>FOCO</span><h3>{item.title}</h3><p>{item.focus}</p></article>
        <article><span>PONTOS-CHAVE</span><ul>{item.points.map(p=><li key={p}>{p}</li>)}</ul></article>
        <article className="action"><span>AÇÃO DO DIA</span><h3>Pense antes de executar</h3><p>{item.action}</p></article>
      </div>}
    </section>
  </div>
}

function Heatmap(){
  const [date,setDate]=useState(today());
  const loader=useCallback(()=>l2l.pitchHeat(date+" 00:00",date+" 23:59"),[date]);
  const {data=[],loading,error,updatedAt}=useAutoRefresh(loader);

  const lines=useMemo(()=>[...new Set((data||[]).map(r=>String(r.line||"")).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"pt-BR",{numeric:true})),[data]);
  const shiftOf=(value:unknown)=>{
    const d=new Date(String(value||""));
    const h=d.getHours();
    if(h>=7&&h<17)return "1º Turno";
    if(h>=17||h<2)return "2º Turno";
    return "3º Turno";
  };
  const average=(line:string,shift:string)=>{
    const set=(data||[]).filter(r=>String(r.line||"")===line&&shiftOf(r.pitch_start)===shift);
    return set.length?set.reduce((s,r)=>s+numberValue(r.oee),0)/set.length:null;
  };
  const shifts=["1º Turno","2º Turno","3º Turno"];

  return <div className="page">
    <PageHead title="Mapa de Calor OEE" subtitle="Eficiência diária por turno, linha e período" status={<StatusBadge loading={loading} error={error} updatedAt={updatedAt}/>}/>
    <section className="panel filter-panel"><div className="filter-grid one"><label>Data<input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label></div></section>
    <div className="heat-grid">{shifts.map(shift=><section className="panel heat-card" key={shift}><div className="panel-title"><span>EFICIÊNCIA DIÁRIA</span><h2>{shift}</h2></div><div className="heat-table"><div className="heat-row head"><b>Linha</b><b>OEE</b></div>{lines.map(line=>{const v=average(line,shift);return <div className="heat-row" key={line}><b>{line}</b><span className={v===null?"empty":v>=75?"good":v>=50?"warn":"bad"}>{v===null?"—":pct(v,0)}</span></div>})}</div></section>)}</div>
  </div>
}

type StockPosition={model:string;foundry:number;finishing:number;downstream:number;inacabado:number;acabado:number};
function productsOf(row:DailyRow){
  const raw=row.products;
  const list=Array.isArray(raw)?raw:raw&&typeof raw==="object"?Object.values(raw):[];
  const parsed=list.filter(Boolean).map((p:any)=>({model:String(p.product_name??p.product??p.name??p.model??p.product_code??p.part_number??"").trim(),qty:numberValue(p.actual??p.production_actual??p.quantity??p.qty)})).filter(p=>p.model);
  return parsed.length?parsed:[{model:"GERAL",qty:numberValue(row.actual)}];
}
function Stock(){
  const [endDate,setEndDate]=useState(today());
  const [model,setModel]=useState("Todos");
  const loader=useCallback(()=>l2l.dailyWindow("2026-09-15 00:00",endDate+" 23:59"),[endDate]);
  const {data=[],loading,error,updatedAt}=useAutoRefresh(loader);

  const position=useMemo(()=>{
    const map=new Map<string,{model:string;foundry:number;finishing:number;downstream:number}>();
    (data||[]).forEach(row=>{
      const a=String(row.area||"").toUpperCase();
      const stage=/ACAB/.test(a)?"finishing":/^(FND)(?!.*ACAB)/.test(a)?"foundry":/(USI|USIN|MACH|MECAN)/.test(a)?"downstream":"";
      if(!stage)return;
      productsOf(row).forEach(p=>{const item=map.get(p.model)||{model:p.model,foundry:0,finishing:0,downstream:0};(item as any)[stage]+=p.qty;map.set(p.model,item)});
    });
    return [...map.values()].map(x=>({...x,inacabado:Math.max(0,x.foundry-x.finishing),acabado:Math.max(0,x.finishing-x.downstream)})).sort((a,b)=>a.model.localeCompare(b.model,"pt-BR",{numeric:true})) as StockPosition[];
  },[data]);

  const models=position.map(x=>x.model), filtered=model==="Todos"?position:position.filter(x=>x.model===model);
  const inacabado=filtered.reduce((s,x)=>s+x.inacabado,0),acabado=filtered.reduce((s,x)=>s+x.acabado,0);

  return <div className="page">
    <PageHead title="Controle de Estoque" subtitle="Estoque inacabado, acabado e consolidado" status={<StatusBadge loading={loading} error={error} updatedAt={updatedAt}/>}/>
    <section className="panel filter-panel"><div className="filter-grid two"><label>Data final<input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)}/></label><label>Modelo<select value={model} onChange={e=>setModel(e.target.value)}><option value="Todos">Todos os modelos</option>{models.map(m=><option key={m}>{m}</option>)}</select></label></div></section>
    <div className="kpi-grid three"><KpiCard label="Inacabado" value={integer(inacabado)}/><KpiCard label="Acabado" value={integer(acabado)}/><KpiCard label="Estoque total" value={integer(inacabado+acabado)}/></div>
    <section className="panel"><div className="panel-title"><span>DETALHAMENTO POR MODELO</span><h2>Posição de estoque</h2></div><div className="table-wrap"><table><thead><tr><th>Modelo</th><th>Fundição</th><th>Acabamento</th><th>Processo seguinte</th><th>Inacabado</th><th>Acabado</th><th>Total</th></tr></thead><tbody>{filtered.map(x=><tr key={x.model}><td><b>{x.model}</b></td><td>{integer(x.foundry)}</td><td>{integer(x.finishing)}</td><td>{integer(x.downstream)}</td><td><b>{integer(x.inacabado)}</b></td><td><b>{integer(x.acabado)}</b></td><td>{integer(x.inacabado+x.acabado)}</td></tr>)}</tbody></table></div></section>
  </div>
}

function Quality(){
  const [date,setDate]=useState(today());
  const loader=useCallback(()=>l2l.scrap(date+" 00:00",date+" 23:59"),[date]);
  const {data=[],loading,error,updatedAt}=useAutoRefresh(loader);
  const rows=(data||[]) as ScrapRow[];
  const clean=(v:string)=>v.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase();
  const excluded=["LIMPEZA","PARADA","MANUTENCAO","SETUP","LUBRIFICACAO"];
  const defects=rows.filter(r=>!excluded.some(t=>clean(String(r.defect||"")).includes(t)));
  const grouped=Object.values(defects.reduce<Record<string,{name:string;qty:number;events:number}>>((m,r)=>{const name=String(r.defect||"Sem categoria");const g=m[name]||{name,qty:0,events:0};g.qty+=numberValue(r.scrap||1);g.events++;m[name]=g;return m},{})).sort((a,b)=>b.qty-a.qty);

  return <div className="page">
    <PageHead title="Qualidade / Não Qualidade" subtitle="Defeitos de produto e scrap" status={<StatusBadge loading={loading} error={error} updatedAt={updatedAt}/>}/>
    <section className="panel filter-panel"><div className="filter-grid one"><label>Data<input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label></div></section>
    <div className="kpi-grid three"><KpiCard label="Defeitos registrados" value={integer(defects.length)}/><KpiCard label="Quantidade scrap" value={integer(defects.reduce((s,r)=>s+numberValue(r.scrap),0))} tone="bad"/><KpiCard label="Tipos de defeito" value={integer(grouped.length)}/></div>
    <section className="panel"><div className="panel-title"><span>QUALIDADE</span><h2>Ranking de defeitos de produto</h2></div><div className="rank-list">{grouped.map((g,i)=><div className="rank-item" key={g.name}><span>{i+1}</span><div><b>{g.name}</b><small>{g.events} ocorrência(s)</small></div><strong>{integer(g.qty)}</strong></div>)}</div></section>
    <section className="panel"><div className="panel-title"><span>DETALHAMENTO</span><h2>Produto, turno e linha</h2></div><div className="table-wrap"><table><thead><tr><th>Data/Hora</th><th>Turno</th><th>Linha</th><th>Produto</th><th>Defeito</th><th>Qtd.</th></tr></thead><tbody>{defects.map((r,i)=><tr key={String(r.id||i)}><td>{r.date?new Date(r.date).toLocaleString("pt-BR"):"-"}</td><td>{r.shift||"-"}</td><td><b>{r.line||"-"}</b></td><td>{r.product||"Sem modelo"}</td><td>{r.defect||"Sem categoria"}</td><td><b>{integer(r.scrap||1)}</b></td></tr>)}</tbody></table></div></section>
  </div>
}

function People(){
  return <div className="page"><PageHead title="Absenteísmo" subtitle="Indicadores de pessoas e presença"/><section className="panel"><div className="empty-state">A estrutura visual foi migrada. A fonte de absenteísmo continua independente do L2L de produção e será conectada ao mesmo endpoint utilizado na versão atual quando houver fonte dinâmica.</div></section></div>
}

export function GenericPage({title,subtitle,mode}:{title:string;subtitle:string;mode:Mode}){
  if(mode==="safety")return <Safety/>;
  if(mode==="heatmap")return <Heatmap/>;
  if(mode==="stock")return <Stock/>;
  if(mode==="quality")return <Quality/>;
  if(mode==="people")return <People/>;
  return <div className="page"><PageHead title={title} subtitle={subtitle}/></div>;
}
