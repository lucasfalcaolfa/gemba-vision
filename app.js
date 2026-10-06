const pages={
home:{title:"Visão Geral",sub:"Painel de gestão à vista da operação",html:home()},
safety:{title:"Momento de Segurança",sub:"Mensagem e foco de segurança do dia",html:safety()},
oee:{title:"OEE / Eficiência",sub:"Acompanhamento de desempenho por linha e turno",html:oee()},
production:{title:"Produção em Tempo Real",sub:"Plano x realizado e ritmo da operação",html:production()},
people:{title:"Absenteísmo",sub:"Acompanhamento de presença e disponibilidade de mão de obra",html:people()},
quality:{title:"Qualidade / Não Qualidade",sub:"Scrap, retrabalho, defeitos e Pareto",html:quality()},
stock:{title:"Controle de Estoque",sub:"Estoque da Fundição — Inacabado e Acabado",html:stock()}
};
function shell(p){return '<div class="page"><div class="page-head"><div><h1>'+p.title+'</h1><p>'+p.sub+'</p></div><div class="refresh">● Atualização: automática</div></div>'+p.html+'</div>'}
function card(label,value,cls=""){return '<div class="card"><div class="label">'+label+'</div><div class="value '+cls+'">'+value+'</div></div>'}
function home(){return '<div class="hero-status"><div class="status"><span class="dot green"></span> OPERAÇÃO NORMAL</div><p style="margin:8px 0 0;color:#47616f">Visão consolidada — Segurança, Pessoas, Produção, OEE e Qualidade.</p></div><div class="cards">'+card("OEE Geral","85,4%","good")+card("Eficiência","89,8%","good")+card("Produção","12.480","")+card("Qualidade","98,5%","good")+card("Absenteísmo","3,2%","warn")+'</div><div class="section-grid"><div class="panel"><h2>Produção por linha</h2><table><tr><th>Linha</th><th>Plano</th><th>Real</th><th>Ating.</th><th>Status</th></tr><tr><td>AL1</td><td>4.500</td><td>4.320</td><td>96%</td><td><span class="status"><span class="dot yellow"></span>Atenção</span></td></tr><tr><td>AL2</td><td>4.200</td><td>4.450</td><td>106%</td><td><span class="status"><span class="dot green"></span>OK</span></td></tr><tr><td>AL3</td><td>3.800</td><td>3.710</td><td>98%</td><td><span class="status"><span class="dot green"></span>OK</span></td></tr></table></div><div class="panel"><h2>Momento de Segurança</h2><div class="safety-img" style="min-height:180px"><div><div class="shield">🦺</div><h2>SEGURANÇA EM PRIMEIRO LUGAR</h2><div>Use os EPIs e respeite as áreas demarcadas.</div></div></div></div></div>'}
function safety(){return '<div class="safety-card"><div class="safety-img"><div><div class="shield">🦺</div><div style="font-size:12px;letter-spacing:2px">MOMENTO DE SEGURANÇA • HOJE</div><h2>SEGURANÇA EM PRIMEIRO LUGAR</h2><p>Use os EPIs corretos, mantenha atenção ao entorno e nunca realize intervenção sem bloqueio seguro.</p></div></div><div class="panel"><h2>Foco do dia</h2><div class="mini"><div class="label">Tema</div><strong>Segurança com máquinas</strong></div><div class="mini" style="margin-top:10px"><div class="label">Comportamento esperado</div><strong style="font-size:16px">Parar, bloquear e verificar antes de intervir.</strong></div><div class="mini" style="margin-top:10px"><div class="label">Responsável</div><strong style="font-size:16px">Liderança da área</strong></div></div></div><div class="panel" style="margin-top:18px"><h2>Histórico dos últimos dias</h2><table><tr><th>Data</th><th>Tema</th><th>Área</th><th>Status</th></tr><tr><td>06/10</td><td>Segurança com máquinas</td><td>Fundição</td><td>🟢 Realizado</td></tr><tr><td>05/10</td><td>Uso de EPI</td><td>Injeção</td><td>🟢 Realizado</td></tr><tr><td>04/10</td><td>Ergonomia</td><td>Acabamento</td><td>🟢 Realizado</td></tr></table></div>'}
const oeeData=[
{area:"Fundição",linha:"AL1",turno:"A",oee:91.0,disp:94.0,perf:97.0,qual:99.0,ef:91.0,meta:85},
{area:"Fundição",linha:"AL1",turno:"B",oee:86.0,disp:91.0,perf:95.0,qual:99.0,ef:87.0,meta:85},
{area:"Fundição",linha:"AL2",turno:"A",oee:78.0,disp:88.0,perf:91.0,qual:97.0,ef:78.0,meta:85},
{area:"Fundição",linha:"AL2",turno:"B",oee:82.0,disp:89.0,perf:94.0,qual:98.0,ef:82.0,meta:85},
{area:"Fundição",linha:"AL3",turno:"A",oee:86.0,disp:92.0,perf:94.0,qual:99.0,ef:86.0,meta:85},
{area:"Acabamento",linha:"AC1",turno:"A",oee:88.0,disp:93.0,perf:95.0,qual:99.0,ef:88.0,meta:85},
{area:"Acabamento",linha:"AC2",turno:"B",oee:84.0,disp:90.0,perf:94.0,qual:99.0,ef:84.0,meta:85},
{area:"Usinagem",linha:"US1",turno:"A",oee:89.0,disp:94.0,perf:95.0,qual:99.0,ef:89.0,meta:85},
{area:"Usinagem",linha:"US2",turno:"C",oee:87.0,disp:92.0,perf:95.0,qual:99.0,ef:87.0,meta:85}
];
function pct(v){return v.toLocaleString("pt-BR",{minimumFractionDigits:1,maximumFractionDigits:1})+"%"}
function oee(){
return '<div class="panel oee-filter-panel"><div class="oee-filter-head"><div><h2>Filtros de eficiência</h2><p>Escolha um setor e, se quiser, uma linha. Os indicadores são recalculados com os dados reais do L2L.</p></div><button class="filter-reset" id="oeeReset">↺ Limpar filtros</button></div><div class="oee-filters oee-filters-live"><label>Setor<select id="oeeArea"><option value="Todas">Toda a fábrica</option></select></label><label>Linha<select id="oeeLinha"><option value="Todas">Todas as linhas</option></select></label></div><div class="filter-context" id="oeeContext">🟡 L2L: carregando...</div></div><div class="cards" id="oeeCards"></div><div class="section-grid oee-section-grid"><div class="panel"><h2>Eficiência por linha</h2><div id="oeeTable"></div></div><div class="panel oee-chart-panel"><h2>Comparativo de eficiência</h2><div class="chart" id="oeeChart"></div><div class="footer-note">Meta de referência: 85% • atualização automática a cada 1 minuto.</div></div></div>';
}

const oeeFilterState={area:"Todas",line:"Todas"};

function populateOeeFilters(){
  const areaEl=document.getElementById("oeeArea");
  const lineEl=document.getElementById("oeeLinha");
  if(!areaEl||!lineEl)return;

  const areas=[...new Set(l2lRows.map(r=>r.area).filter(Boolean))].sort();
  const previousArea=oeeFilterState.area;
  areaEl.innerHTML='<option value="Todas">Toda a fábrica</option>'+areas.map(a=>'<option value="'+a+'">'+a+'</option>').join("");
  areaEl.value=areas.includes(previousArea)?previousArea:"Todas";
  oeeFilterState.area=areaEl.value;

  const lines=[...new Set(l2lRows.filter(r=>oeeFilterState.area==="Todas"||r.area===oeeFilterState.area).map(r=>r.line).filter(Boolean))].sort();
  const previousLine=oeeFilterState.line;
  lineEl.innerHTML='<option value="Todas">Todas as linhas</option>'+lines.map(l=>'<option value="'+l+'">'+l+'</option>').join("");
  lineEl.value=lines.includes(previousLine)?previousLine:"Todas";
  oeeFilterState.line=lineEl.value;
}

function getFilteredOeeRows(){
  return l2lRows.filter(r=>
    (oeeFilterState.area==="Todas"||r.area===oeeFilterState.area) &&
    (oeeFilterState.line==="Todas"||r.line===oeeFilterState.line)
  );
}

function initOee(){
  const area=document.getElementById("oeeArea");
  const line=document.getElementById("oeeLinha");
  const reset=document.getElementById("oeeReset");
  if(!area||!line||!reset)return;

  populateOeeFilters();

  area.addEventListener("change",()=>{
    oeeFilterState.area=area.value;
    oeeFilterState.line="Todas";
    populateOeeFilters();
    renderOeeLive();
  });

  line.addEventListener("change",()=>{
    oeeFilterState.line=line.value;
    renderOeeLive();
  });

  reset.addEventListener("click",()=>{
    oeeFilterState.area="Todas";
    oeeFilterState.line="Todas";
    populateOeeFilters();
    renderOeeLive();
  });

  renderOeeLive();
}

function renderOeeLive(){
  if(currentPage!=="oee")return;
  populateOeeFilters();

  const rows=getFilteredOeeRows();
  const groups=groupedByLine(rows);
  const selectedArea=oeeFilterState.area==="Todas"?"Toda a fábrica":oeeFilterState.area;
  const selectedLine=oeeFilterState.line==="Todas"?"Todas as linhas":oeeFilterState.line;

  const oeeValue=avg(rows,"overall_equipment_effectiveness");
  const efficiency=avg(rows,"peff");
  const availability=avg(rows,"operational_availability");
  const quality=avg(rows,"yield");
  const scrapPct=avg(rows,"scrap_percent");

  const cards=document.getElementById("oeeCards");
  if(cards){
    cards.innerHTML=
      card("OEE",rows.length?fmtPct(oeeValue):"—",oeeValue>=85?"good":"warn")+
      card("Eficiência",rows.length?fmtPct(efficiency):"—",efficiency>=85?"good":"warn")+
      card("Disponibilidade",rows.length?fmtPct(availability):"—")+
      card("Qualidade",rows.length?fmtPct(quality):"—","good")+
      card("Scrap %",rows.length?fmtPct(scrapPct):"—",scrapPct<=2?"good":"warn");
  }

  const ctx=document.getElementById("oeeContext");
  if(ctx)ctx.textContent=liveStamp()+" • "+selectedArea+" • "+selectedLine+" • "+groups.length+" linha(s)";

  const table=document.getElementById("oeeTable");
  if(table){
    table.innerHTML=groups.length
      ? '<div class="table-scroll"><table><tr><th>Setor</th><th>Linha</th><th>OEE</th><th>Eficiência</th><th>Dispon.</th><th>Qualidade</th><th>Status</th></tr>'+
        groups.map(g=>'<tr><td>'+g.area+'</td><td><b>'+g.line+'</b></td><td>'+fmtPct(g.oee)+'</td><td><b>'+fmtPct(g.performance)+'</b></td><td>'+fmtPct(g.availability)+'</td><td>'+fmtPct(g.quality)+'</td><td><span class="status"><span class="dot '+(g.performance>=85?"green":"red")+'"></span>'+(g.performance>=85?"Meta atingida":"Abaixo da meta")+'</span></td></tr>').join("")+
        '</table></div>'
      : '<div class="empty-state">Nenhum dado encontrado para o setor/linha selecionado.</div>';
  }

  const chart=document.getElementById("oeeChart");
  if(chart){
    chart.innerHTML=groups.length
      ? groups.slice(0,14).map(g=>'<div class="col"><i style="--h:'+Math.max(0,Math.min(100,g.performance))+'%"></i><span>'+g.line+'</span><b>'+fmtPct(g.performance)+'</b></div>').join("")
      : '<div class="empty-state">Sem dados para exibir.</div>';
  }
}

const productionData=[
{area:"Fundição",linha:"AL1",turno:"A",date:"2026-10-05",start:"07:00",end:"08:00",plan:900,real:850},
{area:"Fundição",linha:"AL1",turno:"A",date:"2026-10-05",start:"08:00",end:"09:00",plan:900,real:875},
{area:"Fundição",linha:"AL1",turno:"A",date:"2026-10-05",start:"09:00",end:"10:00",plan:900,real:920},
{area:"Fundição",linha:"AL2",turno:"A",date:"2026-10-05",start:"07:00",end:"08:00",plan:850,real:810},
{area:"Fundição",linha:"AL2",turno:"A",date:"2026-10-05",start:"08:00",end:"09:00",plan:850,real:830},
{area:"Fundição",linha:"AL3",turno:"A",date:"2026-10-05",start:"07:00",end:"08:00",plan:830,real:790},
{area:"Fundição",linha:"AL3",turno:"A",date:"2026-10-05",start:"08:00",end:"09:00",plan:830,real:760},
{area:"Acabamento",linha:"AC1",turno:"A",date:"2026-10-05",start:"08:00",end:"09:00",plan:780,real:790},
{area:"Usinagem",linha:"US1",turno:"A",date:"2026-10-05",start:"08:00",end:"09:00",plan:760,real:740},
{area:"Fundição",linha:"AL1",turno:"A",date:"2026-10-06",start:"08:00",end:"09:00",plan:900,real:860},
{area:"Fundição",linha:"AL1",turno:"A",date:"2026-10-06",start:"09:00",end:"10:00",plan:900,real:920},
{area:"Fundição",linha:"AL1",turno:"A",date:"2026-10-06",start:"10:00",end:"11:00",plan:900,real:880},
{area:"Fundição",linha:"AL2",turno:"A",date:"2026-10-06",start:"08:00",end:"09:00",plan:850,real:820},
{area:"Fundição",linha:"AL2",turno:"A",date:"2026-10-06",start:"09:00",end:"10:00",plan:850,real:870},
{area:"Fundição",linha:"AL3",turno:"A",date:"2026-10-06",start:"08:00",end:"09:00",plan:830,real:760},
{area:"Acabamento",linha:"AC1",turno:"A",date:"2026-10-06",start:"08:00",end:"09:00",plan:780,real:790},
{area:"Usinagem",linha:"US1",turno:"A",date:"2026-10-06",start:"08:00",end:"09:00",plan:760,real:740}
];
function production(){return '<div class="panel"><div class="oee-filter-panel"><div class="oee-filters"><label>Área<select id="prodArea"><option value="Todas">Toda a fábrica</option><option>Fundição</option><option>Acabamento</option><option>Usinagem</option></select></label><label>Linha<select id="prodLinha"><option value="Todas">Todas as linhas</option></select></label><label>Turno<select id="prodTurno"><option value="Todos">Todos os turnos</option><option>A</option><option>B</option><option>C</option></select></label><label>Data<input id="prodDate" type="date"></label><label>De<input id="prodStart" type="time" value="00:00"></label><label>Até<input id="prodEnd" type="time" value="23:59"></label></div><div class="filter-actions"><button class="filter-reset" id="prodReset">↺ Limpar filtros</button></div><div class="filter-context" id="prodContext"></div></div></div><div id="prodCards" class="cards"></div><div class="panel"><h2>Controle de produção — análise detalhada</h2><div id="prodTable"></div><div class="footer-note">Dados reais do L2L • atualização automática a cada 1 minuto.</div></div>'}
function updateProduction(){const area=document.getElementById("prodArea").value,linha=document.getElementById("prodLinha").value,turno=document.getElementById("prodTurno").value,date=document.getElementById("prodDate").value,start=document.getElementById("prodStart").value,end=document.getElementById("prodEnd").value;let rows=productionData.filter(x=>(area==="Todas"||x.area===area)&&(linha==="Todas"||x.linha===linha)&&(turno==="Todos"||x.turno===turno)&&(!date||x.date===date)&&x.end>start&&x.start<end);const plan=rows.reduce((a,x)=>a+x.plan,0),real=rows.reduce((a,x)=>a+x.real,0),saldo=real-plan,ating=plan?real/plan*100:0,ritmo=rows.length?real/rows.length:0;document.getElementById("prodCards").innerHTML=card("Plano",plan.toLocaleString("pt-BR"))+card("Realizado",real.toLocaleString("pt-BR"))+card("Saldo",(saldo>=0?"+":"")+saldo.toLocaleString("pt-BR"),saldo>=0?"good":"bad")+card("Atingimento",ating.toFixed(1)+"%",ating>=100?"good":ating>=95?"warn":"bad")+card("Ritmo/h",Math.round(ritmo).toLocaleString("pt-BR"),"good");document.getElementById("prodContext").textContent=(area==="Todas"?"Toda a fábrica":area)+" • "+(linha==="Todas"?"Todas as linhas":linha)+" • "+(turno==="Todos"?"Todos os turnos":"Turno "+turno)+" • "+(date?date.split("-").reverse().join("/"):"Todas as datas")+" • "+start+" → "+end+" • "+rows.length+" registro(s)";document.getElementById("prodTable").innerHTML=rows.length?'<table><tr><th>Área</th><th>Linha</th><th>Turno</th><th>Período</th><th>Plano</th><th>Realizado</th><th>Saldo</th><th>Ating.</th><th>Status</th></tr>'+rows.map(x=>{const s=x.real-x.plan,p=x.real/x.plan*100;return '<tr><td>'+x.area+'</td><td><b>'+x.linha+'</b></td><td>'+x.turno+'</td><td>'+x.start+'–'+x.end+'</td><td>'+x.plan.toLocaleString("pt-BR")+'</td><td>'+x.real.toLocaleString("pt-BR")+'</td><td>'+(s>=0?"+":"")+s.toLocaleString("pt-BR")+'</td><td>'+p.toFixed(1)+'%</td><td>'+(p>=100?"🟢":p>=95?"🟡":"🔴")+'</td></tr>'}).join("")+'</table>':'<div class="empty-state">Nenhum registro encontrado para os filtros selecionados.</div>'}
function initProduction(){const area=document.getElementById("prodArea"),linha=document.getElementById("prodLinha"),turno=document.getElementById("prodTurno"),date=document.getElementById("prodDate"),start=document.getElementById("prodStart"),end=document.getElementById("prodEnd");function updateLines(){const a=area.value;linha.innerHTML='<option value="Todas">Todas as linhas</option>'+[...new Set(productionData.filter(x=>a==="Todas"||x.area===a).map(x=>x.linha))].map(x=>'<option>'+x+'</option>').join("")}area.addEventListener("change",()=>{updateLines();updateProduction()});[linha,turno,date,start,end].forEach(x=>x.addEventListener("change",updateProduction));document.getElementById("prodReset").addEventListener("click",()=>{area.value="Todas";turno.value="Todos";date.value="";start.value="00:00";end.value="23:59";updateLines();linha.value="Todas";updateProduction()});updateLines();updateProduction()}
const stockData=[
{modelo:"Case-Joint",inacabado:1850,acabado:920},
{modelo:"INJP1",inacabado:1320,acabado:680},
{modelo:"INJP2",inacabado:980,acabado:540},
{modelo:"Outros",inacabado:760,acabado:410}
];
function stock(){return '<div class="panel"><div class="filter-context">Controle físico do estoque da Fundição • visão por modelo</div></div><div class="panel"><h2>Estoque da Fundição — Inacabado</h2><p class="stock-rule">Entradas da Fundição − consumo/saída para Acabamento</p><div id="stockInacabado"></div></div><div class="panel"><h2>Estoque da Fundição — Acabado</h2><p class="stock-rule">Produção do Acabamento − saída/envio para Usinagem</p><div id="stockAcabado"></div></div><div class="panel"><h2>Resumo do Estoque</h2><div id="stockResumo"></div><div class="footer-note">Dados demonstrativos nesta primeira versão. A estrutura está preparada para receber os dados reais do L2L/Excel.</div></div>'}
function updateStock(){const totalI=stockData.reduce((a,x)=>a+x.inacabado,0),totalA=stockData.reduce((a,x)=>a+x.acabado,0);const table=(field)=>'<table><tr><th>Modelo</th><th>Quantidade</th><th>Status</th></tr>'+stockData.map(x=>'<tr><td><b>'+x.modelo+'</b></td><td>'+x[field].toLocaleString("pt-BR")+'</td><td>'+(x[field]>1000?"🟢":x[field]>500?"🟡":"🔴")+'</td></tr>').join("")+'<tr><th>Total</th><th>'+stockData.reduce((a,x)=>a+x[field],0).toLocaleString("pt-BR")+'</th><th></th></tr></table>';document.getElementById("stockInacabado").innerHTML=table("inacabado");document.getElementById("stockAcabado").innerHTML=table("acabado");document.getElementById("stockResumo").innerHTML='<table><tr><th>Indicador</th><th>Quantidade</th></tr><tr><td>Estoque Inacabado</td><td><b>'+totalI.toLocaleString("pt-BR")+'</b></td></tr><tr><td>Estoque Acabado</td><td><b>'+totalA.toLocaleString("pt-BR")+'</b></td></tr><tr><th>Estoque Total</th><th>'+(totalI+totalA).toLocaleString("pt-BR")+'</th></tr></table>'}
function initStock(){updateStock()}
function people(){return '<div class="cards">'+card("Absenteísmo","3,2%","warn")+card("Presentes","94,8%","good")+card("Faltas","11","bad")+card("Afastamentos","4","warn")+card("Efetivo","342")+'</div><div class="panel"><h2>Absenteísmo por área</h2><table><tr><th>Área</th><th>Efetivo</th><th>Ausentes</th><th>%</th><th>Indicador</th></tr><tr><td>Fundição</td><td>120</td><td>4</td><td>3,3%</td><td><div class="bar"><i style="width:33%"></i></div></td></tr><tr><td>Injeção</td><td>85</td><td>2</td><td>2,4%</td><td><div class="bar"><i style="width:24%"></i></div></td></tr><tr><td>Usinagem</td><td>110</td><td>5</td><td>4,5%</td><td><div class="bar"><i style="width:45%"></i></div></td></tr></table></div>'}
function quality(){return '<div class="cards">'+card("Qualidade","98,5%","good")+card("Scrap","1,5%","good")+card("Retrabalho","2,1%","warn")+card("PPM","185","warn")+card("NQ","R$ 12,4 mil","bad")+'</div><div class="section-grid"><div class="panel"><h2>Pareto de defeitos</h2><table><tr><th>Defeito</th><th>%</th><th>Representação</th></tr><tr><td>Porosidade</td><td>38%</td><td><div class="bar"><i style="width:38%"></i></div></td></tr><tr><td>Rebarba</td><td>21%</td><td><div class="bar"><i style="width:21%"></i></div></td></tr><tr><td>Trinca</td><td>15%</td><td><div class="bar"><i style="width:15%"></i></div></td></tr><tr><td>Dimensional</td><td>12%</td><td><div class="bar"><i style="width:12%"></i></div></td></tr></table></div><div class="panel"><h2>Não qualidade por processo</h2><div class="kpis"><div class="mini"><div class="label">Injeção</div><strong>42%</strong></div><div class="mini"><div class="label">Acabamento</div><strong>31%</strong></div><div class="mini"><div class="label">Usinagem</div><strong>18%</strong></div></div></div></div>'}
let currentPage="home";
let l2lRows=[];
let l2lLastUpdate=null;
let l2lError="";

function n(v){const x=Number(v);return Number.isFinite(x)?x:0}
function avg(rows,key){return rows.length?rows.reduce((s,r)=>s+n(r[key]),0)/rows.length:0}
function total(rows,key){return rows.reduce((s,r)=>s+n(r[key]),0)}
function fmt(v,d=0){return n(v).toLocaleString("pt-BR",{minimumFractionDigits:d,maximumFractionDigits:d})}
function fmtPct(v){return fmt(v,1)+"%"}
function todayISO(){return new Date().toISOString().slice(0,10)}

async function refreshL2L(){
  try{
    l2lRows=await window.L2L.getDaily(todayISO());
    l2lLastUpdate=new Date();
    l2lError="";
    applyLiveData(currentPage);
  }catch(err){
    l2lError=err.message||"Falha ao consultar L2L";
    applyLiveData(currentPage);
  }
}

function liveStamp(){
  if(l2lError)return "🔴 L2L: "+l2lError;
  if(!l2lLastUpdate)return "🟡 L2L: carregando...";
  return "🟢 L2L atualizado às "+l2lLastUpdate.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
}

function groupedByLine(rows){
  const map={};
  rows.forEach(r=>{
    const key=r.line||"Sem linha";
    if(!map[key])map[key]={line:key,area:r.area||"",demand:0,actual:0,scrap:0,oee:[],availability:[],performance:[],quality:[]};
    const g=map[key];
    g.demand+=n(r.demand);g.actual+=n(r.actual);g.scrap+=n(r.scrap);
    if(r.overall_equipment_effectiveness!==null&&r.overall_equipment_effectiveness!==undefined)g.oee.push(n(r.overall_equipment_effectiveness));
    if(r.operational_availability!==null&&r.operational_availability!==undefined)g.availability.push(n(r.operational_availability));
    if(r.peff!==null&&r.peff!==undefined)g.performance.push(n(r.peff));
    if(r.yield!==null&&r.yield!==undefined)g.quality.push(n(r.yield));
  });
  return Object.values(map).map(g=>({
    ...g,
    oee:g.oee.length?g.oee.reduce((a,b)=>a+b,0)/g.oee.length:0,
    availability:g.availability.length?g.availability.reduce((a,b)=>a+b,0)/g.availability.length:0,
    performance:g.performance.length?g.performance.reduce((a,b)=>a+b,0)/g.performance.length:0,
    quality:g.quality.length?g.quality.reduce((a,b)=>a+b,0)/g.quality.length:0
  })).sort((a,b)=>a.line.localeCompare(b.line));
}

function applyLiveData(page){
  const refresh=document.querySelector(".refresh");
  if(refresh)refresh.textContent=liveStamp();

  if(page==="home"){
    const groups=groupedByLine(l2lRows);
    const demand=total(l2lRows,"demand"),actual=total(l2lRows,"actual"),scrap=total(l2lRows,"scrap");
    const oeeAvg=avg(l2lRows,"overall_equipment_effectiveness"), perf=avg(l2lRows,"peff"), qual=avg(l2lRows,"yield");
    const cards=document.querySelectorAll(".cards .card .value");
    if(cards[0])cards[0].textContent=fmtPct(oeeAvg);
    if(cards[1])cards[1].textContent=fmtPct(perf);
    if(cards[2])cards[2].textContent=fmt(actual);
    if(cards[3])cards[3].textContent=fmtPct(qual);
    const table=document.querySelector(".section-grid .panel table");
    if(table){
      table.innerHTML='<tr><th>Linha</th><th>Plano</th><th>Real</th><th>Ating.</th><th>Status</th></tr>'+
      groups.slice(0,12).map(g=>{const p=g.demand?g.actual/g.demand*100:0;return '<tr><td>'+g.line+'</td><td>'+fmt(g.demand)+'</td><td>'+fmt(g.actual)+'</td><td>'+fmtPct(p)+'</td><td><span class="status"><span class="dot '+(p>=100?"green":p>=95?"yellow":"red")+'"></span>'+(p>=100?"OK":p>=95?"Atenção":"Crítico")+'</span></td></tr>'}).join("");
    }
  }

  if(page==="production"){
    const groups=groupedByLine(l2lRows);
    const plan=total(l2lRows,"demand"),real=total(l2lRows,"actual"),saldo=real-plan,ating=plan?real/plan*100:0;
    const cards=document.getElementById("prodCards");
    if(cards)cards.innerHTML=card("Plano",fmt(plan))+card("Realizado",fmt(real))+card("Saldo",(saldo>=0?"+":"")+fmt(saldo),saldo>=0?"good":"bad")+card("Atingimento",fmtPct(ating),ating>=100?"good":ating>=95?"warn":"bad")+card("Scrap",fmt(total(l2lRows,"scrap")),total(l2lRows,"scrap")===0?"good":"warn");
    const ctx=document.getElementById("prodContext");if(ctx)ctx.textContent=liveStamp()+" • "+groups.length+" linha(s)";
    const table=document.getElementById("prodTable");
    if(table)table.innerHTML='<table><tr><th>Área</th><th>Linha</th><th>Plano</th><th>Realizado</th><th>Scrap</th><th>Saldo</th><th>Ating.</th><th>Status</th></tr>'+
      groups.map(g=>{const s=g.actual-g.demand,p=g.demand?g.actual/g.demand*100:0;return '<tr><td>'+g.area+'</td><td><b>'+g.line+'</b></td><td>'+fmt(g.demand)+'</td><td>'+fmt(g.actual)+'</td><td>'+fmt(g.scrap)+'</td><td>'+(s>=0?"+":"")+fmt(s)+'</td><td>'+fmtPct(p)+'</td><td>'+(p>=100?"🟢":p>=95?"🟡":"🔴")+'</td></tr>'}).join("")+'</table>';
  }

  if(page==="oee")renderOeeLive();

  if(page==="quality"){
    const cards=document.querySelectorAll(".cards .card .value");
    const quality=avg(l2lRows,"yield"),scrapPct=avg(l2lRows,"scrap_percent"),reject=avg(l2lRows,"reject_percent"),scrap=total(l2lRows,"scrap");
    if(cards[0])cards[0].textContent=fmtPct(quality);
    if(cards[1])cards[1].textContent=fmtPct(scrapPct);
    if(cards[2])cards[2].textContent=fmt(scrap);
    if(cards[3])cards[3].textContent=fmtPct(reject);
  }
}

function render(page){
  currentPage=page;
  document.getElementById("content").innerHTML=shell(pages[page]);
  if(page==="stock")initStock();
  if(page==="oee")initOee();
  applyLiveData(page);
}
document.querySelectorAll(".nav").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".nav").forEach(x=>x.classList.remove("active"));b.classList.add("active");render(b.dataset.page)}));
function tick(){const d=new Date();document.getElementById("date").textContent=d.toLocaleDateString("pt-BR",{weekday:"long",day:"2-digit",month:"long",year:"numeric"});document.getElementById("time").textContent=d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
render("home");tick();setInterval(tick,1000);refreshL2L();setInterval(refreshL2L,60000);
