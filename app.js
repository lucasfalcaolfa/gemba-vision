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
return '<div class="panel oee-filter-panel"><div class="oee-filter-head"><div><h2>Filtros de eficiência</h2><p>Filtre os dados reais do L2L por setor, linha, turno, dia e faixa de horário.</p></div><button class="filter-reset" id="oeeReset">↺ Limpar filtros</button></div><div class="oee-filters oee-filters-live"><label>Setor<select id="oeeArea"><option value="Todas">Toda a fábrica</option></select></label><label>Linha<select id="oeeLinha"><option value="Todas">Todas as linhas</option></select></label><label>Turno<select id="oeeShift"><option value="Todos">Todos os turnos</option><option value="1">1º Turno</option><option value="2">2º Turno</option><option value="3">3º Turno</option></select></label><label>Data inicial<input id="oeeStartDate" type="date"></label><label>Data final<input id="oeeEndDate" type="date"></label><label>Hora inicial<input id="oeeStart" type="time" value="00:00"></label><label>Hora final<input id="oeeEnd" type="time" value="23:59"></label></div><div class="filter-context" id="oeeContext">🟡 L2L: carregando...</div></div><div class="cards" id="oeeCards"></div><div class="section-grid oee-section-grid"><div class="panel"><h2>Comparativo de eficiência por linha</h2><div id="oeeTable"></div></div><div class="panel oee-chart-panel"><h2>Modelos com melhor eficiência</h2><div id="oeeChart"></div><div class="footer-note">Ranking conforme os filtros selecionados • atualização automática a cada 1 minuto.</div></div></div>';
}

let oeeRows=[];
let oeeLoading=false;
const oeeFilterState={area:"Todas",line:"Todas",shift:"Todos",startDate:"",endDate:"",start:"00:00",end:"23:59"};

function normalizeShift(value){
  if(value===null||value===undefined||value==="")return "";
  const s=String(value).trim().toUpperCase();
  if(/^1/.test(s)||s==="A")return "1";
  if(/^2/.test(s)||s==="B")return "2";
  if(/^3/.test(s)||s==="C")return "3";
  return s;
}

function rowShift(row){
  return normalizeShift(
    row.shift_number ??
    row.shift_id ??
    row.shift_code ??
    row.shift_name ??
    row.production_shift ??
    row.shift
  );
}

function hasShiftDetail(rows){
  return rows.some(r=>rowShift(r)!=="");
}

async function refreshOeeRange(){
  if(oeeLoading)return;
  oeeLoading=true;
  const ctx=document.getElementById("oeeContext");
  if(ctx)ctx.textContent="🟡 Consultando L2L...";
  try{
    oeeRows=await window.L2L.getRange(oeeFilterState.startDate||todayISO(),oeeFilterState.endDate||oeeFilterState.startDate||todayISO(),oeeFilterState.start,oeeFilterState.end);
    l2lLastUpdate=new Date();
    l2lError="";
    if(currentPage==="oee"){
      populateOeeFilters();
      renderOeeLive();
    }
  }catch(err){
    l2lError=err.message||"Falha ao consultar L2L";
    if(currentPage==="oee")renderOeeLive();
  }finally{
    oeeLoading=false;
  }
}

function populateOeeFilters(){
  const areaEl=document.getElementById("oeeArea");
  const lineEl=document.getElementById("oeeLinha");
  if(!areaEl||!lineEl)return;

  const source=oeeRows.length?oeeRows:l2lRows;
  const areas=[...new Set(source.map(r=>r.area).filter(Boolean))].sort();
  areaEl.innerHTML='<option value="Todas">Toda a fábrica</option>'+areas.map(a=>'<option value="'+a+'">'+a+'</option>').join("");
  areaEl.value=areas.includes(oeeFilterState.area)?oeeFilterState.area:"Todas";
  oeeFilterState.area=areaEl.value;

  const lines=[...new Set(source.filter(r=>oeeFilterState.area==="Todas"||r.area===oeeFilterState.area).map(r=>r.line).filter(Boolean))].sort();
  lineEl.innerHTML='<option value="Todas">Todas as linhas</option>'+lines.map(l=>'<option value="'+l+'">'+l+'</option>').join("");
  lineEl.value=lines.includes(oeeFilterState.line)?oeeFilterState.line:"Todas";
  oeeFilterState.line=lineEl.value;
}

function getFilteredOeeRows(){
  const source=oeeRows.length?oeeRows:l2lRows;
  const shiftAvailable=hasShiftDetail(source);
  return source.filter(r=>
    (oeeFilterState.area==="Todas"||r.area===oeeFilterState.area) &&
    (oeeFilterState.line==="Todas"||r.line===oeeFilterState.line) &&
    (oeeFilterState.shift==="Todos"||!shiftAvailable||rowShift(r)===oeeFilterState.shift)
  );
}

function initOee(){
  const area=document.getElementById("oeeArea");
  const line=document.getElementById("oeeLinha");
  const shift=document.getElementById("oeeShift");
  const startDate=document.getElementById("oeeStartDate");
  const endDate=document.getElementById("oeeEndDate");
  const start=document.getElementById("oeeStart");
  const end=document.getElementById("oeeEnd");
  const reset=document.getElementById("oeeReset");
  if(!area||!line||!shift||!startDate||!endDate||!start||!end||!reset)return;

  if(!oeeFilterState.startDate)oeeFilterState.startDate=todayISO();
  if(!oeeFilterState.endDate)oeeFilterState.endDate=oeeFilterState.startDate;
  startDate.value=oeeFilterState.startDate;
  endDate.value=oeeFilterState.endDate;
  start.value=oeeFilterState.start;
  end.value=oeeFilterState.end;
  shift.value=oeeFilterState.shift;
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

  shift.addEventListener("change",()=>{
    oeeFilterState.shift=shift.value;
    renderOeeLive();
  });

  startDate.addEventListener("change",async()=>{
    oeeFilterState.startDate=startDate.value||todayISO();
    if(oeeFilterState.endDate<oeeFilterState.startDate){oeeFilterState.endDate=oeeFilterState.startDate;endDate.value=oeeFilterState.endDate;}
    await refreshOeeRange();
  });

  endDate.addEventListener("change",async()=>{
    oeeFilterState.endDate=endDate.value||oeeFilterState.startDate||todayISO();
    if(oeeFilterState.endDate<oeeFilterState.startDate){oeeFilterState.startDate=oeeFilterState.endDate;startDate.value=oeeFilterState.startDate;}
    await refreshOeeRange();
  });

  start.addEventListener("change",async()=>{
    oeeFilterState.start=start.value||"00:00";
    if(oeeFilterState.end<=oeeFilterState.start){
      oeeFilterState.end="23:59";
      end.value=oeeFilterState.end;
    }
    await refreshOeeRange();
  });

  end.addEventListener("change",async()=>{
    oeeFilterState.end=end.value||"23:59";
    if(oeeFilterState.end<=oeeFilterState.start){
      oeeFilterState.start="00:00";
      start.value=oeeFilterState.start;
    }
    await refreshOeeRange();
  });

  reset.addEventListener("click",async()=>{
    oeeFilterState.area="Todas";
    oeeFilterState.line="Todas";
    oeeFilterState.shift="Todos";
    oeeFilterState.startDate=todayISO();
    oeeFilterState.endDate=oeeFilterState.startDate;
    oeeFilterState.start="00:00";
    oeeFilterState.end="23:59";
    startDate.value=oeeFilterState.startDate;
    endDate.value=oeeFilterState.endDate;
    start.value=oeeFilterState.start;
    end.value=oeeFilterState.end;
    shift.value=oeeFilterState.shift;
    await refreshOeeRange();
  });

  if(!oeeRows.length)refreshOeeRange();
  else renderOeeLive();
}

function gaugeTone(value){
  const v=n(value);
  if(v>=85)return "gauge-green";
  if(v>=70)return "gauge-yellow";
  return "gauge-red";
}

function deltaMarkup(value,target=85){
  const diff=n(value)-target;
  const cls=diff>0?"delta-up":diff<0?"delta-down":"delta-flat";
  const arrow=diff>0?"▲":diff<0?"▼":"—";
  return '<span class="metric-delta '+cls+'" title="Diferença em relação à referência de '+target+'%">'+arrow+Math.abs(diff).toFixed(0)+'%</span>';
}

function mainGauge(value){
  const v=Math.max(0,Math.min(100,n(value)));
  const tone=gaugeTone(v);
  return '<div class="ref-main-gauge"><svg viewBox="0 0 220 138" role="img" aria-label="OEE '+fmtPct(v)+'"><path class="ref-gauge-track" d="M25 112 A85 85 0 0 1 195 112" pathLength="100"></path><path class="ref-gauge-value '+tone+'" d="M25 112 A85 85 0 0 1 195 112" pathLength="100" stroke-dasharray="'+v+' 100"></path><text x="110" y="62" text-anchor="middle" class="ref-gauge-label">OEE</text><text x="110" y="88" text-anchor="middle" class="ref-gauge-delta '+(n(v)>=85?"delta-up":"delta-down")+'">'+(n(v)>=85?"▲":"▼")+Math.abs(n(v)-85).toFixed(0)+'%</text><text x="110" y="116" text-anchor="middle" class="ref-gauge-number '+tone+'">'+fmt(v,0)+'%</text></svg></div>';
}

function miniMetric(value,label,target=85){
  const v=Math.max(0,Math.min(100,n(value)));
  const tone=gaugeTone(v);
  const icon=label==="OA"?"▣":label==="PPP"?"⚙":"◎";
  return '<div class="ref-metric-row"><div class="ref-mini-circle '+tone+'" style="--pct:'+v+'"><div class="ref-mini-inner"><span class="ref-mini-icon">'+icon+'</span><span class="ref-mini-value">'+fmt(v,0)+'%</span></div></div><strong>'+label+'</strong>'+deltaMarkup(v,target)+'</div>';
}

function lineGaugeCard(g){
  const status=g.oee>=85?"Dentro da meta":g.oee>=70?"Atenção":"Crítico";
  const statusCls=g.oee>=85?"status-ok":g.oee>=70?"status-watch":"status-critical";
  const attainment=g.demand?g.actual/g.demand*100:0;
  return '<article class="pro-oee-card">'+
    '<div class="pro-card-head"><div><div class="pro-card-kicker">'+(g.area||"Setor")+'</div><h3>'+g.line+'</h3></div><span class="pro-status '+statusCls+'">'+status+'</span></div>'+
    '<div class="pro-card-body">'+mainGauge(g.oee)+
      '<div class="pro-divider"></div>'+
      '<div class="pro-metrics">'+miniMetric(g.availability,"OA",85)+miniMetric(g.performance,"PPP",85)+miniMetric(g.quality,"Yield",85)+'</div>'+
    '</div>'+
    '<div class="pro-card-foot"><div><span>Meta OEE</span><strong>85%</strong></div><div><span>Atingimento</span><strong>'+fmtPct(attainment)+'</strong></div><div><span>Produção</span><strong>'+fmt(g.actual)+' / '+fmt(g.demand)+'</strong></div></div>'+
  '</article>';
}

function renderOeeLive(){
  if(currentPage!=="oee")return;
  populateOeeFilters();

  const rows=getFilteredOeeRows();
  const source=oeeRows.length?oeeRows:l2lRows;
  const groups=groupedByLine(rows);
  const selectedArea=oeeFilterState.area==="Todas"?"Toda a fábrica":oeeFilterState.area;
  const selectedLine=oeeFilterState.line==="Todas"?"Todas as linhas":oeeFilterState.line;
  const selectedShift=oeeFilterState.shift==="Todos"?"Todos os turnos":oeeFilterState.shift+"º Turno";
  const shiftNote=oeeFilterState.shift!=="Todos"&&!hasShiftDetail(source)?" • turno não detalhado pelo retorno atual do L2L":"";

  const oeeValue=avg(rows,"overall_equipment_effectiveness");
  const efficiency=avg(rows,"peff");
  const availability=avg(rows,"operational_availability");
  const quality=avg(rows,"yield");
  const scrapPct=avg(rows,"scrap_percent");

  const cards=document.getElementById("oeeCards");
  if(cards){
    cards.className="line-gauge-grid";
    const ordered=[...groups].sort((a,b)=>b.performance-a.performance);
    cards.innerHTML=ordered.length
      ? ordered.map(lineGaugeCard).join("")
      : '<div class="empty-state">Nenhuma linha encontrada para os filtros selecionados.</div>';
  }

  const ctx=document.getElementById("oeeContext");
  if(ctx)ctx.textContent=liveStamp()+" • "+selectedArea+" • "+selectedLine+" • "+selectedShift+" • "+(oeeFilterState.startDate||"")+(oeeFilterState.endDate&&oeeFilterState.endDate!==oeeFilterState.startDate?" → "+oeeFilterState.endDate:"")+" • "+oeeFilterState.start+"–"+oeeFilterState.end+" • "+groups.length+" linha(s)"+shiftNote;

  const table=document.getElementById("oeeTable");
  if(table){
    const lineRank=[...groups].sort((a,b)=>b.performance-a.performance);
    table.innerHTML=rankingRows(
      lineRank,
      g=>g.line,
      g=>g.performance,
      g=>(g.area||"Sem setor")+" • OEE "+fmtPct(g.oee)+" • Dispon. "+fmtPct(g.availability)+" • Qualidade "+fmtPct(g.quality)
    );
  }

  const chart=document.getElementById("oeeChart");
  if(chart){
    const products=groupedProducts(rows).slice(0,10);
    chart.innerHTML=products.length
      ? rankingRows(
          products,
          p=>p.name,
          p=>p.efficiency,
          p=>(p.lineCount?p.lineCount+" linha(s)":"")+" • Produção "+fmt(p.actual)
        )
      : '<div class="empty-state"><strong>Modelos não detalhados pelo retorno atual do L2L.</strong><br>O painel já solicita <code>show_products=1</code>; quando o L2L retornar eficiência por produto/modelo, o ranking aparecerá automaticamente.</div>';
  }
}

let productionRows=[];
let productionLoading=false;
let prodSectorChartInstance=null;
let prodLineChartInstance=null;
const productionFilterState={area:"Todas",line:"Todas",shift:"Todos",startDate:"",endDate:"",start:"00:00",end:"23:59"};

function production(){
  return '<div class="panel oee-filter-panel">'+
    '<div class="oee-filter-head"><div><h2>Filtros de produção</h2><p>Dados reais do L2L para demanda, produção atual e produzido líquido, com atualização automática a cada 1 minuto.</p></div><button class="filter-reset" id="prodReset">↺ Limpar filtros</button></div>'+
    '<div class="oee-filters oee-filters-live">'+
      '<label>Setor<select id="prodArea"><option value="Todas">Toda a fábrica</option></select></label>'+
      '<label>Linha<select id="prodLinha"><option value="Todas">Todas as linhas</option></select></label>'+
      '<label>Turno<select id="prodTurno"><option value="Todos">Todos os turnos</option><option value="1">1º Turno</option><option value="2">2º Turno</option><option value="3">3º Turno</option></select></label>'+
      '<label>Data inicial<input id="prodStartDate" type="date"></label><label>Data final<input id="prodEndDate" type="date"></label>'+
      '<label>Hora inicial<input id="prodStart" type="time" value="00:00"></label>'+
      '<label>Hora final<input id="prodEnd" type="time" value="23:59"></label>'+
    '</div>'+
    '<div class="filter-context" id="prodContext">🟡 L2L: carregando...</div>'+
  '</div>'+
  '<div id="prodCards" class="cards"></div>'+
  '<div class="prod-dashboard-grid">'+
    '<div class="panel"><h2>Resumo por setor</h2><div id="prodAreas"></div></div>'+
    '<div class="panel"><h2>Demanda x Produção Atual por setor</h2><div class="chart-wrap"><canvas id="prodSectorChart"></canvas></div></div>'+
  '</div>'+
  '<div class="prod-dashboard-grid">'+
    '<div class="panel"><h2>Atingimento por linha</h2><div class="chart-wrap"><canvas id="prodLineChart"></canvas></div></div>'+
    '<div class="panel"><h2>Visão executiva</h2><div id="prodExecutive"></div></div>'+
  '</div>'+
  '<div class="panel"><h2>Todas as linhas — produção em tempo real</h2><div id="prodTable"></div><div class="footer-note">Fonte: L2L • Demanda = demand • Produção atual = actual • Produzido líquido = actual − scrap • atualização automática a cada 1 minuto.</div></div>'+
  '<div class="scrap-modal" id="scrapModal" aria-hidden="true"><div class="scrap-modal-backdrop" onclick="closeScrapDetails()"></div><section class="scrap-modal-panel" role="dialog" aria-modal="true" aria-labelledby="scrapModalTitle"><div class="scrap-modal-head"><div><span>DETALHAMENTO L2L</span><h2 id="scrapModalTitle">Scrap / Defeitos</h2></div><button type="button" class="scrap-close" onclick="closeScrapDetails()" aria-label="Fechar">×</button></div><div class="scrap-modal-context" id="scrapModalContext"></div><div id="scrapModalBody"><div class="empty-state">Carregando detalhes...</div></div></section></div>';
}

async function refreshProductionRange(){
  if(productionLoading)return;
  productionLoading=true;
  const ctx=document.getElementById("prodContext");
  if(ctx)ctx.textContent="🟡 Consultando L2L...";
  try{
    productionRows=await window.L2L.getRange(productionFilterState.startDate||todayISO(),productionFilterState.endDate||productionFilterState.startDate||todayISO(),productionFilterState.start,productionFilterState.end);
    l2lLastUpdate=new Date();
    l2lError="";
    if(currentPage==="production"){
      populateProductionFilters();
      renderProductionLive();
    }
  }catch(err){
    l2lError=err.message||"Falha ao consultar L2L";
    if(currentPage==="production")renderProductionLive();
  }finally{
    productionLoading=false;
  }
}

function populateProductionFilters(){
  const areaEl=document.getElementById("prodArea");
  const lineEl=document.getElementById("prodLinha");
  if(!areaEl||!lineEl)return;

  const source=productionRows.length?productionRows:l2lRows;
  const areas=[...new Set(source.map(r=>r.area).filter(Boolean))].sort();
  areaEl.innerHTML='<option value="Todas">Toda a fábrica</option>'+areas.map(a=>'<option value="'+a+'">'+a+'</option>').join("");
  areaEl.value=areas.includes(productionFilterState.area)?productionFilterState.area:"Todas";
  productionFilterState.area=areaEl.value;

  const lines=[...new Set(source.filter(r=>productionFilterState.area==="Todas"||r.area===productionFilterState.area).map(r=>r.line).filter(Boolean))].sort();
  lineEl.innerHTML='<option value="Todas">Todas as linhas</option>'+lines.map(l=>'<option value="'+l+'">'+l+'</option>').join("");
  lineEl.value=lines.includes(productionFilterState.line)?productionFilterState.line:"Todas";
  productionFilterState.line=lineEl.value;
}

function getFilteredProductionRows(){
  const source=productionRows.length?productionRows:l2lRows;
  const shiftAvailable=hasShiftDetail(source);
  return source.filter(r=>
    (productionFilterState.area==="Todas"||r.area===productionFilterState.area) &&
    (productionFilterState.line==="Todas"||r.line===productionFilterState.line) &&
    (productionFilterState.shift==="Todos"||!shiftAvailable||rowShift(r)===productionFilterState.shift)
  );
}

function groupedProductionByArea(rows){
  const map={};
  rows.forEach(r=>{
    const key=r.area||"Sem setor";
    if(!map[key])map[key]={area:key,demand:0,actual:0,scrap:0,lines:new Set()};
    map[key].demand+=n(r.demand);
    map[key].actual+=n(r.actual);
    map[key].scrap+=n(r.scrap);
    if(r.line)map[key].lines.add(r.line);
  });
  return Object.values(map).map(x=>({
    area:x.area,
    demand:x.demand,
    actual:x.actual,
    scrap:x.scrap,
    net:Math.max(0,x.actual-x.scrap),
    attainment:x.demand?x.actual/x.demand*100:0,
    lineCount:x.lines.size
  })).sort((a,b)=>a.area.localeCompare(b.area));
}

function productionAreaCard(a){
  const cls=a.attainment>=100?"good":a.attainment>=95?"warn":"bad";
  return '<article class="prod-area-card">'+
    '<div class="prod-area-head"><div><span>SETOR</span><h3>'+a.area+'</h3></div><strong class="'+cls+'">'+fmtPct(a.attainment)+'</strong></div>'+
    '<div class="prod-area-grid">'+
      '<div><span>Demanda</span><b>'+fmt(a.demand)+'</b></div>'+
      '<div><span>Produção atual</span><b>'+fmt(a.actual)+'</b></div>'+
      '<div><span>Produzido líquido</span><b>'+fmt(a.net)+'</b></div>'+
      '<div><span>Scrap</span><b>'+fmt(a.scrap)+'</b></div>'+
    '</div>'+
    '<div class="prod-area-foot">'+a.lineCount+' linha(s) no L2L</div>'+
  '</article>';
}

function destroyProdCharts(){
  if(prodSectorChartInstance){
    prodSectorChartInstance.destroy();
    prodSectorChartInstance=null;
  }
  if(prodLineChartInstance){
    prodLineChartInstance.destroy();
    prodLineChartInstance=null;
  }
}

function renderProdSectorChart(areaGroups){
  const canvas=document.getElementById("prodSectorChart");
  if(!canvas||!window.Chart)return;
  if(prodSectorChartInstance)prodSectorChartInstance.destroy();

  prodSectorChartInstance=new Chart(canvas,{
    type:"bar",
    data:{
      labels:areaGroups.map(a=>a.area),
      datasets:[
        {label:"Demanda",data:areaGroups.map(a=>a.demand),borderWidth:1},
        {label:"Produção atual",data:areaGroups.map(a=>a.actual),borderWidth:1}
      ]
    },
    options:{
      responsive:true,
      maintainAspectRatio:false,
      interaction:{mode:"index",intersect:false},
      plugins:{
        legend:{position:"top"},
        tooltip:{callbacks:{label:(ctx)=>ctx.dataset.label+": "+Number(ctx.raw||0).toLocaleString("pt-BR")}}
      },
      scales:{
        x:{grid:{display:false}},
        y:{beginAtZero:true,ticks:{callback:v=>Number(v).toLocaleString("pt-BR")}}
      }
    }
  });
}

function renderProdLineChart(lineGroups){
  const canvas=document.getElementById("prodLineChart");
  if(!canvas||!window.Chart)return;
  if(prodLineChartInstance)prodLineChartInstance.destroy();

  const topLines=[...lineGroups].sort((a,b)=>b.actual-a.actual).slice(0,15);

  prodLineChartInstance=new Chart(canvas,{
    type:"bar",
    data:{
      labels:topLines.map(x=>x.line),
      datasets:[{
        label:"Atingimento %",
        data:topLines.map(x=>x.demand?x.actual/x.demand*100:0),
        borderWidth:1
      }]
    },
    options:{
      indexAxis:"y",
      responsive:true,
      maintainAspectRatio:false,
      plugins:{
        legend:{display:false},
        tooltip:{callbacks:{label:(ctx)=>"Atingimento: "+Number(ctx.raw||0).toLocaleString("pt-BR",{maximumFractionDigits:1})+"%"}}
      },
      scales:{
        y:{grid:{display:false}},
        x:{beginAtZero:true,suggestedMax:120,ticks:{callback:v=>v+"%"}}
      }
    }
  });
}

function renderProdExecutive(areaGroups,lineGroups){
  const targetAreas=areaGroups.filter(a=>a.attainment>=100).length;
  const watchAreas=areaGroups.filter(a=>a.attainment>=95&&a.attainment<100).length;
  const criticalAreas=areaGroups.filter(a=>a.attainment<95).length;

  const sortedBest=[...lineGroups].sort((a,b)=>(b.demand?b.actual/b.demand:0)-(a.demand?a.actual/a.demand:0));
  const sortedWorst=[...lineGroups].sort((a,b)=>(a.demand?a.actual/a.demand:0)-(b.demand?b.actual/b.demand:0));
  const bestLine=sortedBest[0];
  const worstLine=sortedWorst[0];

  const box=document.getElementById("prodExecutive");
  if(!box)return;

  box.innerHTML='<div class="prod-exec-grid">'+
    '<div class="mini"><div class="label">Setores na meta</div><strong>'+targetAreas+'</strong></div>'+
    '<div class="mini"><div class="label">Setores em atenção</div><strong>'+watchAreas+'</strong></div>'+
    '<div class="mini"><div class="label">Setores críticos</div><strong>'+criticalAreas+'</strong></div>'+
    '<div class="mini"><div class="label">Melhor linha</div><strong>'+(bestLine?bestLine.line:"-")+'</strong></div>'+
    '<div class="mini"><div class="label">Linha crítica</div><strong>'+(worstLine?worstLine.line:"-")+'</strong></div>'+
    '<div class="mini"><div class="label">Linhas monitoradas</div><strong>'+lineGroups.length+'</strong></div>'+
  '</div>';
}

function productionScrapCard(scrap){
  const cls=scrap===0?"good":"warn";
  const scope=productionFilterState.line!=="Todas"
    ? productionFilterState.line
    : productionFilterState.area!=="Todas"
      ? productionFilterState.area
      : "Todas as linhas";
  return '<button type="button" class="card prod-scrap-kpi" onclick="openScrapDetails()" title="Clique para ver os defeitos, causas, modelos, turnos e datas do scrap"><div class="label">Scrap <span class="scrap-drill-icon">↗</span></div><div class="value '+cls+'">'+fmt(scrap)+'</div><div class="scrap-kpi-hint">'+scope+' • clique para detalhar</div></button>';
}

function closeScrapDetails(){
  const modal=document.getElementById("scrapModal");
  if(!modal)return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
  document.body.classList.remove("modal-open");
}

function scrapDateTime(value){
  if(!value)return "-";
  const d=new Date(value);
  if(Number.isNaN(d.getTime()))return String(value);
  return d.toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"});
}

function resolveScrapArea(row){
  if(row.area)return String(row.area);
  const match=(productionRows.length?productionRows:l2lRows).find(r=>String(r.line||"")===String(row.line||""));
  return match?.area||"";
}

function scrapSummary(rows){
  const totalQty=rows.reduce((s,r)=>s+n(r.scrap),0);
  const defects={};
  rows.forEach(r=>{
    const k=r.defect||"Sem categoria";
    defects[k]=(defects[k]||0)+n(r.scrap);
  });
  const top=Object.entries(defects).sort((a,b)=>b[1]-a[1])[0];
  return {
    qty:totalQty,
    events:rows.length,
    defects:Object.keys(defects).length,
    topDefect:top?top[0]:"-",
    topQty:top?top[1]:0
  };
}
function groupScrap(rows,keyFn){
  const map={};
  rows.forEach(r=>{
    const key=keyFn(r)||"Não informado";
    if(!map[key])map[key]={key,qty:0,events:0,defects:{}};
    const g=map[key];
    g.qty+=n(r.scrap);
    g.events+=1;
    const d=r.defect||"Sem categoria";
    g.defects[d]=(g.defects[d]||0)+n(r.scrap);
  });
  return Object.values(map).map(g=>{
    const sorted=Object.entries(g.defects).sort((a,b)=>b[1]-a[1]);
    return {...g,topDefect:sorted[0]?.[0]||"-",topQty:sorted[0]?.[1]||0,defectCount:Object.keys(g.defects).length};
  }).sort((a,b)=>b.qty-a.qty);
}

function scrapDay(value){
  if(!value)return "Sem data";
  const d=new Date(value);
  if(Number.isNaN(d.getTime()))return String(value);
  return d.toLocaleDateString("pt-BR");
}

function scrapGroupCards(title,items){
  if(!items.length)return '<section class="scrap-group-panel"><h3>'+title+'</h3><div class="empty-state">Sem dados.</div></section>';
  return '<section class="scrap-group-panel"><h3>'+title+'</h3><div class="scrap-group-list">'+
    items.map((g,i)=>'<div class="scrap-group-row"><div class="scrap-group-rank">'+(i+1)+'</div><div class="scrap-group-main"><strong>'+g.key+'</strong><span>'+g.events+' ocorrência(s) • '+g.defectCount+' defeito(s)</span><small>Principal: '+g.topDefect+' ('+fmt(g.topQty)+')</small></div><b>'+fmt(g.qty)+'</b></div>').join("")+
  '</div></section>';
}

async function openScrapDetails(lineOverride="", areaOverride=""){
  const modal=document.getElementById("scrapModal");
  const body=document.getElementById("scrapModalBody");
  const ctx=document.getElementById("scrapModalContext");
  if(!modal||!body||!ctx)return;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
  document.body.classList.add("modal-open");
  body.innerHTML='<div class="scrap-loading"><div class="scrap-spinner"></div><strong>Consultando detalhes de scrap no L2L...</strong></div>';

  const date=productionFilterState.date||todayISO();
  ctx.textContent='Período: '+date.split("-").reverse().join("/")+' • '+productionFilterState.start+'–'+productionFilterState.end;

  try{
    let rows=await window.L2L.getScrapDetails(date,productionFilterState.start,productionFilterState.end);

    const activeArea=areaOverride||productionFilterState.area;
    const activeLine=lineOverride||productionFilterState.line;
    rows=rows.map(r=>({...r,area:resolveScrapArea(r)})).filter(r=>
      (activeArea==="Todas"||!activeArea||String(r.area)===String(activeArea)) &&
      (activeLine==="Todas"||!activeLine||String(r.line)===String(activeLine)) &&
      (productionFilterState.shift==="Todos"||normalizeShift(r.shift)===productionFilterState.shift)
    );

    rows.sort((a,b)=>new Date(b.date||0)-new Date(a.date||0));
    const summary=scrapSummary(rows);

    const contextArea=areaOverride||productionFilterState.area;
    const contextLine=lineOverride||productionFilterState.line;
    ctx.textContent='L2L • '+(contextArea==="Todas"||!contextArea?"Todos os setores":contextArea)+' • '+(contextLine==="Todas"||!contextLine?"Todas as linhas":contextLine)+' • '+date.split("-").reverse().join("/")+' • '+productionFilterState.start+'–'+productionFilterState.end;
    const title=document.getElementById("scrapModalTitle");
    if(title)title.textContent=contextLine && contextLine!=="Todas" ? 'Scrap / Defeitos — '+contextLine : 'Scrap / Defeitos';

    if(!rows.length){
      body.innerHTML='<div class="scrap-empty"><strong>Nenhum detalhe de scrap encontrado para este período.</strong><p>Se houver Scrap no resumo, mas nenhum registro aqui, a linha pode estar registrando scrap sem categoria/detalhamento. O L2L só consegue mostrar defeito, modelo e turno quando esses detalhes são gravados no Scrap Detail.</p></div>';
      return;
    }

    const byLine=groupScrap(rows,r=>r.line||"Sem linha");
    const byShift=groupScrap(rows,r=>r.shift||"Sem turno");
    const byDate=groupScrap(rows,r=>scrapDay(r.date));
    const byModel=groupScrap(rows,r=>r.product||"Sem modelo");
    const byDefect=groupScrap(rows,r=>r.defect||"Sem categoria");
    const byCause=groupScrap(rows,r=>r.cause||"Causa não informada");

    body.innerHTML=
      '<div class="scrap-summary-grid">'+
        '<div><span>Scrap detalhado</span><strong>'+fmt(summary.qty)+'</strong></div>'+
        '<div><span>Ocorrências</span><strong>'+fmt(summary.events)+'</strong></div>'+
        '<div><span>Tipos de defeito</span><strong>'+fmt(summary.defects)+'</strong></div>'+
        '<div><span>Principal defeito</span><strong>'+summary.topDefect+'</strong><small>'+fmt(summary.topQty)+' peça(s)</small></div>'+
      '</div>'+
      '<div class="scrap-analysis-grid">'+
        scrapGroupCards("Defeitos por linha",byLine)+
        scrapGroupCards("Defeitos por turno",byShift)+
        scrapGroupCards("Defeitos por data",byDate)+
        scrapGroupCards("Defeitos por modelo",byModel)+
      '</div>'+
      '<div class="scrap-detail-grid">'+
        '<section class="scrap-defect-section"><h3>Todos os defeitos</h3><div class="scrap-defect-ranking">'+
          byDefect.map((g,i)=>'<div class="scrap-defect-row"><span class="scrap-defect-rank">'+(i+1)+'</span><div><strong>'+g.key+'</strong><small>'+g.events+' ocorrência(s)</small></div><b>'+fmt(g.qty)+'</b></div>').join("")+
        '</div></section>'+
        '<section class="scrap-defect-section"><h3>Causas registradas</h3><div class="scrap-defect-ranking">'+
          byCause.map((g,i)=>'<div class="scrap-defect-row"><span class="scrap-defect-rank">'+(i+1)+'</span><div><strong>'+g.key+'</strong><small>'+g.events+' ocorrência(s)</small></div><b>'+fmt(g.qty)+'</b></div>').join("")+
        '</div></section>'+
      '</div>'+
      '<section class="scrap-occurrence-section"><h3>Ocorrências detalhadas</h3><div class="scrap-table-wrap"><table class="scrap-detail-table"><thead><tr><th>Data / Hora</th><th>Setor</th><th>Linha</th><th>Turno</th><th>Modelo / Produto</th><th>Defeito</th><th>Causa</th><th>Qtd.</th></tr></thead><tbody>'+
        rows.map(r=>'<tr><td>'+scrapDateTime(r.date)+'</td><td>'+(r.area||"-")+'</td><td><b>'+(r.line||"-")+'</b></td><td>'+(r.shift||"-")+'</td><td>'+(r.product||"-")+'</td><td><span class="defect-chip">'+(r.defect||"Sem categoria")+'</span></td><td><span class="cause-chip">'+(r.cause||"Não informada")+'</span></td><td><b>'+fmt(r.scrap)+'</b></td></tr>').join("")+
      '</tbody></table></div></section>';
  }catch(err){
    body.innerHTML='<div class="scrap-empty error"><strong>Não foi possível carregar os detalhes de Scrap.</strong><p>'+(err.message||"Erro ao consultar o L2L.")+'</p></div>';
  }
}

function lineScrapButton(g){
  const disabled=n(g.scrap)<=0;
  return '<button type="button" class="line-scrap-btn '+(disabled?'zero':'has-scrap')+'" '+(disabled?'disabled':'onclick="openScrapDetails(\''+String(g.line).replace(/'/g,"&#39;")+'\',\''+String(g.area||"").replace(/'/g,"&#39;")+'\')"')+' title="'+(disabled?'Sem scrap registrado nesta linha':'Clique para ver os defeitos desta linha')+'"><span>'+fmt(g.scrap)+'</span>'+(disabled?'':'<small>Ver defeitos ↗</small>')+'</button>';
}

function renderProductionLive(){
  if(currentPage!=="production")return;

  populateProductionFilters();
  const rows=getFilteredProductionRows();
  const groups=groupedByLine(rows);
  const areaGroups=groupedProductionByArea(rows);

  const demand=total(rows,"demand");
  const actual=total(rows,"actual");
  const scrap=total(rows,"scrap");
  const net=Math.max(0,actual-scrap);
  const attainment=demand?actual/demand*100:0;

  const cards=document.getElementById("prodCards");
  if(cards){
    cards.innerHTML=
      card("Demanda",fmt(demand))+
      card("Produção atual",fmt(actual),actual>=demand&&demand>0?"good":"")+
      card("Produzido líquido",fmt(net),net>0?"good":"")+
      card("Atingimento",fmtPct(attainment),attainment>=100?"good":attainment>=95?"warn":"bad")+
      productionScrapCard(scrap);
  }

  const areas=document.getElementById("prodAreas");
  if(areas){
    areas.innerHTML=areaGroups.length
      ? '<div class="prod-area-cards">'+areaGroups.map(productionAreaCard).join("")+'</div>'
      : '<div class="empty-state">Nenhum setor retornado pelo L2L.</div>';
  }

  renderProdSectorChart(areaGroups);
  renderProdLineChart(groups);
  renderProdExecutive(areaGroups,groups);

  const selectedArea=productionFilterState.area==="Todas"?"Toda a fábrica":productionFilterState.area;
  const selectedLine=productionFilterState.line==="Todas"?"Todas as linhas":productionFilterState.line;
  const selectedShift=productionFilterState.shift==="Todos"?"Todos os turnos":productionFilterState.shift+"º Turno";
  const ctx=document.getElementById("prodContext");
  if(ctx)ctx.textContent=liveStamp()+" • "+selectedArea+" • "+selectedLine+" • "+selectedShift+" • "+(productionFilterState.startDate||"")+(productionFilterState.endDate&&productionFilterState.endDate!==productionFilterState.startDate?" → "+productionFilterState.endDate:"")+" • "+productionFilterState.start+"–"+productionFilterState.end+" • "+groups.length+" linha(s)";

  const table=document.getElementById("prodTable");
  if(table){
    const allGroups=[...groups].sort((a,b)=>(a.area||"").localeCompare(b.area||"")||a.line.localeCompare(b.line));
    table.innerHTML=allGroups.length
      ? '<div class="table-scroll"><table><tr><th>Setor</th><th>Linha</th><th>Demanda</th><th>Produção atual</th><th>Produzido líquido</th><th>Scrap</th><th>Atingimento</th><th>Status</th></tr>'+
        allGroups.map(g=>{
          const netLine=Math.max(0,g.actual-g.scrap);
          const pct=g.demand?g.actual/g.demand*100:0;
          return '<tr><td>'+g.area+'</td><td><b>'+g.line+'</b></td><td>'+fmt(g.demand)+'</td><td><b>'+fmt(g.actual)+'</b></td><td>'+fmt(netLine)+'</td><td>'+lineScrapButton(g)+'</td><td>'+fmtPct(pct)+'</td><td>'+(pct>=100?"🟢":pct>=95?"🟡":"🔴")+'</td></tr>';
        }).join("")+
        '</table></div>'
      : '<div class="empty-state">Nenhum dado de produção encontrado para os filtros selecionados.</div>';
  }
}

function initProduction(){
  const area=document.getElementById("prodArea");
  const line=document.getElementById("prodLinha");
  const shift=document.getElementById("prodTurno");
  const startDate=document.getElementById("prodStartDate");
  const endDate=document.getElementById("prodEndDate");
  const start=document.getElementById("prodStart");
  const end=document.getElementById("prodEnd");
  const reset=document.getElementById("prodReset");
  if(!area||!line||!shift||!startDate||!endDate||!start||!end||!reset)return;

  if(!productionFilterState.startDate)productionFilterState.startDate=todayISO();
  if(!productionFilterState.endDate)productionFilterState.endDate=productionFilterState.startDate;
  startDate.value=productionFilterState.startDate;
  endDate.value=productionFilterState.endDate;
  start.value=productionFilterState.start;
  end.value=productionFilterState.end;
  shift.value=productionFilterState.shift;
  populateProductionFilters();

  area.addEventListener("change",()=>{
    productionFilterState.area=area.value;
    productionFilterState.line="Todas";
    populateProductionFilters();
    renderProductionLive();
  });

  line.addEventListener("change",()=>{
    productionFilterState.line=line.value;
    renderProductionLive();
  });

  shift.addEventListener("change",()=>{
    productionFilterState.shift=shift.value;
    renderProductionLive();
  });

  startDate.addEventListener("change",async()=>{
    productionFilterState.startDate=startDate.value||todayISO();
    if(productionFilterState.endDate<productionFilterState.startDate){productionFilterState.endDate=productionFilterState.startDate;endDate.value=productionFilterState.endDate;}
    await refreshProductionRange();
  });

  endDate.addEventListener("change",async()=>{
    productionFilterState.endDate=endDate.value||productionFilterState.startDate||todayISO();
    if(productionFilterState.endDate<productionFilterState.startDate){productionFilterState.startDate=productionFilterState.endDate;startDate.value=productionFilterState.startDate;}
    await refreshProductionRange();
  });

  start.addEventListener("change",async()=>{
    productionFilterState.start=start.value||"00:00";
    await refreshProductionRange();
  });

  end.addEventListener("change",async()=>{
    productionFilterState.end=end.value||"23:59";
    await refreshProductionRange();
  });

  reset.addEventListener("click",async()=>{
    productionFilterState.area="Todas";
    productionFilterState.line="Todas";
    productionFilterState.shift="Todos";
    productionFilterState.startDate=todayISO();
    productionFilterState.endDate=productionFilterState.startDate;
    productionFilterState.start="00:00";
    productionFilterState.end="23:59";
    startDate.value=productionFilterState.startDate;
    endDate.value=productionFilterState.endDate;
    start.value=productionFilterState.start;
    end.value=productionFilterState.end;
    shift.value=productionFilterState.shift;
    await refreshProductionRange();
  });

  if(!productionRows.length)refreshProductionRange();
  else renderProductionLive();
}

let stockRows=[];
let stockMeta={};
let stockLoading=false;
const stockFilterState={startDate:"2026-09-15",endDate:"",model:"Todos"};

function stock(){
  return '<div class="panel stock-filter-panel">'+
    '<div class="stock-filter-head"><div><span>CONTROLE EM TEMPO REAL</span><h2>Fluxo de estoque por modelo</h2><p>Rastreamento automático do L2L: Injetora → Jateamento → Acabamento → Usinagem.</p></div><div class="stock-live-badge" id="stockLiveStatus">🟡 L2L: carregando...</div></div>'+
    '<div class="stock-filter-grid stock-filter-grid-range">'+
      '<label>Data inicial<input id="stockStartDate" type="date"></label>'+
      '<label>Data final<input id="stockEndDate" type="date"></label>'+
      '<label>Modelo<select id="stockModel"><option value="Todos">Todos os modelos</option></select></label>'+
      '<button type="button" id="stockReset" class="stock-filter-reset">↺ 15/09 até hoje</button>'+
    '</div>'+
    '<div class="filter-context" id="stockContext">Atualização automática a cada 1 minuto.</div>'+
  '</div>'+
  '<div class="cards stock-live-kpis" id="stockCards"></div>'+
  '<div class="stock-selected-grid" id="stockSelected"></div>'+
  '<div class="panel"><div class="stock-section-head"><div><span>FLUXO PRODUTIVO</span><h2>Quantidade por modelo e etapa</h2><p>Quantidade registrada no L2L em cada etapa do processo, organizada por modelo.</p></div></div><div id="stockByModel"></div></div>'+
  '<div class="stock-stage-grid">'+
    '<div class="panel"><div class="stock-section-head"><div><span>WIP 1</span><h2>Aguardando Jateamento</h2><p>Injetado − Jateado.</p></div></div><div id="stockAwaitShot"></div></div>'+
    '<div class="panel"><div class="stock-section-head"><div><span>WIP 2</span><h2>Aguardando Acabamento</h2><p>Jateado − Acabado.</p></div></div><div id="stockAwaitFinish"></div></div>'+
  '</div>'+
  '<div class="stock-stage-grid">'+
    '<div class="panel"><div class="stock-section-head"><div><span>INACABADO</span><h2>Estoque Inacabado</h2><p>WIP total antes da conclusão do Acabamento.</p></div></div><div id="stockInacabado"></div></div>'+
    '<div class="panel"><div class="stock-section-head"><div><span>ACABADO</span><h2>Estoque Acabado</h2><p>Acabado − Usinado.</p></div></div><div id="stockAcabado"></div></div>'+
  '</div>'+
  '<div class="panel"><div class="stock-section-head"><div><span>CONSOLIDADO</span><h2>Resumo do Estoque</h2><p>Resumo do período e do modelo selecionado.</p></div></div><div id="stockResumo"></div></div>'+
  '<div class="stock-calculation-note"><strong>Fonte:</strong> L2L Pitch Details por produto e linha. O painel recalcula automaticamente a cada <b>1 minuto</b> usando o período selecionado.</div>';
}

function stockEsc(value){
  return String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}

function normalizeStockRows(rows){
  return (Array.isArray(rows)?rows:[]).map(x=>({
    model:String(x.model||"").trim(),
    productId:x.product_id,
    injection:n(x.injection),
    shotblast:n(x.shotblast),
    finishing:n(x.finishing),
    machining:n(x.machining),
    awaitingShotblast:n(x.awaiting_shotblast),
    awaitingFinishing:n(x.awaiting_finishing),
    inacabado:n(x.unfinished),
    acabado:n(x.finished),
    total:n(x.total_stock),
    scrap:n(x.scrap),
    lines:x.lines||{}
  })).filter(x=>x.model);
}

function populateStockModels(position){
  const select=document.getElementById("stockModel");
  if(!select)return;
  const models=[...new Set(position.map(x=>x.model).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
  select.innerHTML='<option value="Todos">Todos os modelos</option>'+models.map(m=>'<option value="'+stockEsc(m)+'">'+stockEsc(m)+'</option>').join("");
  if(models.includes(stockFilterState.model))select.value=stockFilterState.model;
  else{
    stockFilterState.model="Todos";
    select.value="Todos";
  }
}

function stockFilteredPosition(position){
  return stockFilterState.model==="Todos"?position:position.filter(x=>x.model===stockFilterState.model);
}

function stockQtyStatus(qty){
  if(qty<=0)return '<span class="stock-live-status zero">Sem saldo</span>';
  return '<span class="stock-live-status ok">Disponível</span>';
}

function stockStageCell(value,cls=""){
  return '<span class="stock-stage-value '+cls+'">'+fmt(value)+'</span>';
}

function renderStockByModel(rows){
  const el=document.getElementById("stockByModel");
  if(!el)return;
  if(!rows.length){
    el.innerHTML='<div class="empty-state"><strong>Nenhum modelo retornado pelo L2L.</strong><br>Verifique o período ou se existem Pitch Details registrados nas linhas de Injeção, Jateamento, Acabamento e Usinagem.</div>';
    return;
  }
  const ordered=[...rows].sort((a,b)=>b.total-a.total||a.model.localeCompare(b.model));
  el.innerHTML='<div class="table-scroll"><table class="stock-flow-table"><thead><tr>'+
    '<th>Modelo</th><th>Injetado</th><th>Jateado</th><th>Acabado produzido</th><th>Usinado</th>'+
    '<th>WIP Jateamento</th><th>WIP Acabamento</th><th>Inacabado</th><th>Acabado disponível</th><th>Total</th>'+
    '</tr></thead><tbody>'+
    ordered.map(x=>'<tr>'+
      '<td><b>'+stockEsc(x.model)+'</b></td>'+
      '<td>'+stockStageCell(x.injection,"stage-injection")+'</td>'+
      '<td>'+stockStageCell(x.shotblast,"stage-shotblast")+'</td>'+
      '<td>'+stockStageCell(x.finishing,"stage-finishing")+'</td>'+
      '<td>'+stockStageCell(x.machining,"stage-machining")+'</td>'+
      '<td>'+stockStageCell(x.awaitingShotblast,"stage-wip")+'</td>'+
      '<td>'+stockStageCell(x.awaitingFinishing,"stage-wip")+'</td>'+
      '<td><span class="stock-pill stock-pill-wip">'+fmt(x.inacabado)+'</span></td>'+
      '<td><span class="stock-pill stock-pill-fg">'+fmt(x.acabado)+'</span></td>'+
      '<td><b class="stock-total-model">'+fmt(x.total)+'</b></td>'+
    '</tr>').join("")+
    '</tbody></table></div>';
}

function renderStockStageList(elId,rows,key,label){
  const el=document.getElementById(elId);
  if(!el)return;
  const ordered=[...rows].filter(x=>n(x[key])>0).sort((a,b)=>n(b[key])-n(a[key]));
  if(!ordered.length){
    el.innerHTML='<div class="empty-state">Sem saldo nesta etapa para a seleção atual.</div>';
    return;
  }
  el.innerHTML='<div class="stock-stage-list">'+ordered.map(x=>
    '<div class="stock-stage-row"><div><strong>'+stockEsc(x.model)+'</strong><span>'+label+'</span></div><b>'+fmt(x[key])+'</b></div>'
  ).join("")+'</div>';
}

async function refreshStockRange(){
  if(stockLoading)return;
  stockLoading=true;
  const status=document.getElementById("stockLiveStatus");
  if(status)status.textContent="🟡 Consultando fluxo por modelo...";
  try{
    const first=stockFilterState.startDate||"2026-09-15";
    const last=stockFilterState.endDate||todayISO();
    const result=await window.L2L.getStockFlow(first,last);
    stockRows=normalizeStockRows(result.data);
    stockMeta=result.meta||{};
    l2lLastUpdate=new Date();
    l2lError="";
    if(currentPage==="stock")updateStock();
  }catch(err){
    l2lError=err.message||"Falha ao consultar fluxo de estoque no L2L";
    stockRows=[];
    stockMeta={};
    if(currentPage==="stock")updateStock();
  }finally{
    stockLoading=false;
  }
}

function updateStock(){
  const position=stockRows;
  populateStockModels(position);
  const visible=stockFilteredPosition(position);

  const totalI=visible.reduce((s,x)=>s+x.inacabado,0);
  const totalA=visible.reduce((s,x)=>s+x.acabado,0);
  const totalShotWip=visible.reduce((s,x)=>s+x.awaitingShotblast,0);
  const totalFinishWip=visible.reduce((s,x)=>s+x.awaitingFinishing,0);
  const totalInjection=visible.reduce((s,x)=>s+x.injection,0);
  const totalShotblast=visible.reduce((s,x)=>s+x.shotblast,0);
  const totalFinishing=visible.reduce((s,x)=>s+x.finishing,0);
  const totalMachining=visible.reduce((s,x)=>s+x.machining,0);

  const status=document.getElementById("stockLiveStatus");
  if(status)status.textContent=liveStamp();

  const context=document.getElementById("stockContext");
  if(context){
    const startLabel=(stockFilterState.startDate||"2026-09-15").split("-").reverse().join("/");
    const endLabel=(stockFilterState.endDate||todayISO()).split("-").reverse().join("/");
    const modelLabel=stockFilterState.model==="Todos"?"Todos os modelos":stockFilterState.model;
    const lines=stockMeta.lines_consulted!==undefined?" • "+stockMeta.lines_consulted+" linhas consultadas":"";
    context.textContent=liveStamp()+" • "+startLabel+" → "+endLabel+" • "+modelLabel+" • "+position.length+" modelo(s)"+lines+" • atualização a cada 1 minuto";
  }

  const cards=document.getElementById("stockCards");
  if(cards)cards.innerHTML=
    card("Inacabados",fmt(totalI),totalI>0?"warn":"")+
    card("Acabados disponíveis",fmt(totalA),totalA>0?"good":"")+
    card("WIP p/ Jateamento",fmt(totalShotWip))+
    card("WIP p/ Acabamento",fmt(totalFinishWip))+
    card("Modelos",fmt(visible.length));

  const selected=document.getElementById("stockSelected");
  if(selected){
    if(stockFilterState.model!=="Todos"&&visible.length){
      const x=visible[0];
      selected.innerHTML=
        '<article class="stock-model-focus"><div class="stock-model-focus-head"><div><span>MODELO SELECIONADO</span><h2>'+stockEsc(x.model)+'</h2></div><span class="stock-live-status ok">L2L</span></div>'+
        '<div class="stock-model-flow">'+
          '<div><span>Injetado</span><strong>'+fmt(x.injection)+'</strong></div>'+
          '<i>→</i><div><span>Jateado</span><strong>'+fmt(x.shotblast)+'</strong></div>'+
          '<i>→</i><div><span>Acabado</span><strong>'+fmt(x.finishing)+'</strong></div>'+
          '<i>→</i><div><span>Usinado</span><strong>'+fmt(x.machining)+'</strong></div>'+
        '</div>'+
        '<div class="stock-model-values"><div><span>Inacabado</span><strong>'+fmt(x.inacabado)+'</strong><small>WIP antes do Acabamento</small></div><div><span>Acabado disponível</span><strong>'+fmt(x.acabado)+'</strong><small>Acabamento − Usinagem</small></div><div><span>Total em estoque</span><strong>'+fmt(x.total)+'</strong><small>Inacabado + Acabado</small></div></div></article>';
    }else selected.innerHTML="";
  }

  renderStockByModel(visible);
  renderStockStageList("stockAwaitShot",visible,"awaitingShotblast","Aguardando Jateamento");
  renderStockStageList("stockAwaitFinish",visible,"awaitingFinishing","Aguardando Acabamento");
  renderStockStageList("stockInacabado",visible,"inacabado","Estoque Inacabado");
  renderStockStageList("stockAcabado",visible,"acabado","Estoque Acabado");

  const resumo=document.getElementById("stockResumo");
  if(resumo){
    resumo.innerHTML=
      '<div class="stock-summary-grid stock-summary-grid-extended">'+
        '<div><span>Injetado</span><strong>'+fmt(totalInjection)+'</strong><small>Produção acumulada</small></div>'+
        '<div><span>Jateado</span><strong>'+fmt(totalShotblast)+'</strong><small>Produção acumulada</small></div>'+
        '<div><span>Acabamento</span><strong>'+fmt(totalFinishing)+'</strong><small>Produção acumulada</small></div>'+
        '<div><span>Usinagem</span><strong>'+fmt(totalMachining)+'</strong><small>Produção acumulada</small></div>'+
        '<div><span>Inacabado</span><strong>'+fmt(totalI)+'</strong><small>WIP total</small></div>'+
        '<div><span>Acabado disponível</span><strong>'+fmt(totalA)+'</strong><small>Antes da Usinagem</small></div>'+
      '</div>'+
      (!position.length?'<div class="stock-warning">⚠️ O L2L não retornou registros de produto para as linhas identificadas no período. O painel não usa mais o agregado “GERAL”; ele só exibe modelos realmente encontrados nos Pitch Details.</div>':'');
  }
}

function initStock(){
  const startDate=document.getElementById("stockStartDate");
  const endDate=document.getElementById("stockEndDate");
  const model=document.getElementById("stockModel");
  const reset=document.getElementById("stockReset");
  if(!startDate||!endDate||!model||!reset)return;

  if(!stockFilterState.startDate)stockFilterState.startDate="2026-09-15";
  if(!stockFilterState.endDate)stockFilterState.endDate=todayISO();
  startDate.value=stockFilterState.startDate;
  endDate.value=stockFilterState.endDate;

  startDate.addEventListener("change",async()=>{
    stockFilterState.startDate=startDate.value||"2026-09-15";
    if(stockFilterState.endDate<stockFilterState.startDate){
      stockFilterState.endDate=stockFilterState.startDate;
      endDate.value=stockFilterState.endDate;
    }
    stockFilterState.model="Todos";
    await refreshStockRange();
  });

  endDate.addEventListener("change",async()=>{
    stockFilterState.endDate=endDate.value||todayISO();
    if(stockFilterState.endDate<stockFilterState.startDate){
      stockFilterState.startDate=stockFilterState.endDate;
      startDate.value=stockFilterState.startDate;
    }
    stockFilterState.model="Todos";
    await refreshStockRange();
  });

  model.addEventListener("change",()=>{
    stockFilterState.model=model.value;
    updateStock();
  });

  reset.addEventListener("click",async()=>{
    stockFilterState.startDate="2026-09-15";
    stockFilterState.endDate=todayISO();
    stockFilterState.model="Todos";
    startDate.value=stockFilterState.startDate;
    endDate.value=stockFilterState.endDate;
    await refreshStockRange();
  });

  refreshStockRange();
}
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
    if(currentPage==="oee")await refreshOeeRange();
    if(currentPage==="production")await refreshProductionRange();
    if(currentPage==="stock")await refreshStockRange();
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

function extractProductRows(rows){
  const out=[];
  rows.forEach(row=>{
    let products=row.products;
    if(!products)return;
    if(!Array.isArray(products) && typeof products==="object") products=Object.values(products);
    if(!Array.isArray(products))return;
    products.forEach(p=>{
      if(!p||typeof p!=="object")return;
      const name=p.product_name ?? p.product ?? p.name ?? p.model ?? p.product_code ?? p.part_number ?? p.description;
      const efficiencyRaw=p.peff ?? p.efficiency ?? p.performance_efficiency ?? p.overall_equipment_effectiveness ?? p.oee;
      const efficiency=Number(efficiencyRaw);
      if(!name || !Number.isFinite(efficiency))return;
      out.push({
        name:String(name),
        efficiency,
        line:row.line||"",
        area:row.area||"",
        actual:n(p.actual ?? p.production_actual ?? 0)
      });
    });
  });
  return out;
}

function groupedProducts(rows){
  const map={};
  extractProductRows(rows).forEach(p=>{
    if(!map[p.name])map[p.name]={name:p.name,values:[],actual:0,lines:new Set()};
    map[p.name].values.push(p.efficiency);
    map[p.name].actual+=p.actual;
    if(p.line)map[p.name].lines.add(p.line);
  });
  return Object.values(map).map(x=>({
    name:x.name,
    efficiency:x.values.reduce((a,b)=>a+b,0)/x.values.length,
    actual:x.actual,
    lineCount:x.lines.size
  })).sort((a,b)=>b.efficiency-a.efficiency);
}

function rankingRows(items,getName,getValue,getMeta){
  if(!items.length)return '<div class="empty-state">Sem dados para exibir com os filtros selecionados.</div>';
  return '<div class="ranking-list">'+items.map((item,index)=>{
    const value=Math.max(0,Math.min(120,getValue(item)));
    const width=Math.min(100,value);
    const cls=value>=85?"rank-good":value>=70?"rank-warn":"rank-bad";
    return '<div class="rank-row"><div class="rank-head"><div class="rank-name"><span class="rank-pos">'+(index+1)+'</span><strong>'+getName(item)+'</strong></div><b class="'+cls+'">'+fmtPct(getValue(item))+'</b></div><div class="rank-track"><i class="'+cls+'" style="width:'+width+'%"></i></div><div class="rank-meta">'+getMeta(item)+'</div></div>';
  }).join("")+'</div>';
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

  if(page==="production")renderProductionLive();

  if(page==="oee")renderOeeLive();

  if(page==="stock")updateStock();

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
  if(currentPage==="production"&&page!=="production")destroyProdCharts();
  currentPage=page;
  document.getElementById("content").innerHTML=shell(pages[page]);
  if(page==="stock")initStock();
  if(page==="oee")initOee();
  if(page==="production")initProduction();
  applyLiveData(page);
}
document.querySelectorAll(".nav").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".nav").forEach(x=>x.classList.remove("active"));b.classList.add("active");render(b.dataset.page)}));
function tick(){const d=new Date();document.getElementById("date").textContent=d.toLocaleDateString("pt-BR",{weekday:"long",day:"2-digit",month:"long",year:"numeric"});document.getElementById("time").textContent=d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
render("home");tick();setInterval(tick,1000);refreshL2L();setInterval(refreshL2L,60000);
