const pages={
home:{title:"Visão Geral",sub:"Painel de gestão à vista da operação",html:home()},
safety:{title:"Momento de Segurança",sub:"Mensagem e foco de segurança do dia",html:safety()},
oee:{title:"OEE / Eficiência",sub:"Acompanhamento de desempenho por linha e turno",html:oee()},
heatmap:{title:"Mapa de Calor OEE",sub:"Eficiência diária por turno, linha e período",html:heatmap()},
production:{title:"Produção em Tempo Real",sub:"Plano x realizado e ritmo da operação",html:production()},
people:{title:"Absenteísmo",sub:"Acompanhamento de presença e disponibilidade de mão de obra",html:people()},
quality:{title:"Qualidade / Não Qualidade",sub:"Scrap, retrabalho, defeitos e Pareto",html:quality()},
stock:{title:"Controle de Estoque",sub:"Estoque da Fundição — Inacabado e Acabado",html:stock()}
};
function shell(p){return '<div class="page"><div class="page-head"><div><h1>'+p.title+'</h1><p>'+p.sub+'</p></div><div class="refresh">● Atualização: automática</div></div>'+p.html+'</div>'}
function card(label,value,cls=""){return '<div class="card"><div class="label">'+label+'</div><div class="value '+cls+'">'+value+'</div></div>'}
function home(){
  return '<section class="home-command panel">'+
    '<div class="home-command-copy"><span>GESTÃO À VISTA • FND</span><h2 id="homeYesterdayTitle">Resumo operacional</h2><p>Janela oficial da Fundição: 07:00 de um dia até 07:00 do dia seguinte.</p></div>'+
    '<div class="home-command-side"><div class="home-yesterday-status" id="homeYesterdayStatus">🟡 Consultando L2L...</div><div class="home-source-badge">Fonte: L2L • atualização automática a cada 1 minuto</div></div>'+
  '</section>'+
  '<nav class="home-quick-nav" aria-label="Resumo da Visão Geral">'+
    '<a class="home-quick-link" href="#home-result"><span>01</span><b>Resultado</b></a>'+
    '<a class="home-quick-link" href="#home-production"><span>02</span><b>Produção</b></a>'+
    '<a class="home-quick-link" href="#home-flow"><span>03</span><b>Produtos</b></a>'+
    '<a class="home-quick-link" href="#home-efficiency"><span>04</span><b>OEE</b></a>'+
    '<a class="home-quick-link" href="#home-quality"><span>05</span><b>Não Qualidade</b></a>'+
    '<a class="home-quick-link" href="#home-events"><span>06</span><b>Ocorrências</b></a>'+
  '</nav>'+
  '<section class="home-block" id="home-result">'+
    '<div class="home-block-title"><div><span>01 • RESULTADO DO DIA</span><h2>Resumo executivo</h2></div><p>Principais indicadores da FND para leitura rápida.</p></div>'+
    '<div class="home-yesterday-kpis" id="homeYesterdayKpis"></div>'+
  '</section>'+
  '<section class="home-block" id="home-production">'+
    '<div class="home-block-title"><div><span>02 • PRODUÇÃO</span><h2>Plano x realizado</h2></div><p>Resultado consolidado da janela operacional.</p></div>'+
    '<article class="panel home-focus-panel home-production-panel"><div class="home-section-head"><div><span>DEMANDA X REAL</span><h2>Performance de produção</h2></div></div><div id="homeYesterdayProduction"></div></article>'+
  '</section>'+
  '<section class="home-block" id="home-flow">'+
    '<div class="home-block-title"><div><span>03 • FLUXO DE PRODUTOS</span><h2>Produtos por processo e turno</h2></div><p>Injetoras e Acabamento separados, dentro da mesma visão.</p></div>'+
    '<article class="panel home-wide-panel home-products-panel"><div class="home-section-head"><div><span>MIX PRODUZIDO</span><h2>Injetoras → Acabamento</h2></div></div><div id="homeYesterdayModels"></div></article>'+
  '</section>'+
  '<section class="home-block" id="home-efficiency">'+
    '<div class="home-block-title"><div><span>04 • EFICIÊNCIA</span><h2>OEE por linha</h2></div><p>OEE, OA, PPP, Yield e produção de cada máquina.</p></div>'+
    '<div class="panel home-wide-panel"><div id="homeYesterdayOee"></div></div>'+
  '</section>'+
  '<section class="home-block" id="home-quality">'+
    '<div class="home-block-title"><div><span>05 • NÃO QUALIDADE</span><h2>Defeitos registrados</h2></div><p>Ocorrências priorizadas por quantidade, linha e modelo.</p></div>'+
    '<div class="panel home-wide-panel"><div id="homeYesterdayDefects"></div></div>'+
  '</section>'+
  '<section class="home-block" id="home-events">'+
    '<div class="home-block-title"><div><span>06 • OCORRÊNCIAS</span><h2>Dispatches e contramedidas</h2></div><p>Eventos de manutenção e registros de produção do período.</p></div>'+
    '<div class="panel home-wide-panel"><div id="homeYesterdayEvents"></div></div>'+
  '</section>';
}
function safety(){return '<div class="panel safety-live-panel"><div class="safety-live-head"><div><span>MOMENTO DE SEGURANÇA</span><h2 id="safetyWeekTitle">Safety Moments — Semana atual</h2><p id="safetyWeekMeta">Conteúdo organizado automaticamente a partir do PDF semanal.</p></div><div class="safety-mode-switch"><button id="safetyModeDynamic" class="active">▥ Visualização dinâmica</button><button id="safetyModeWeekly">▣ Semanal</button><a class="safety-open-pdf" href="SafetyMomentWeek_Current.pdf" target="_blank" rel="noopener">▤ Abrir PDF ↗</a></div></div><div class="safety-status" id="safetyStatus">Carregando Momento de Segurança...</div><section id="safetyDynamic" class="safety-dynamic"><div id="safetyDayCards" class="safety-day-cards"></div><div id="safetyDayDetail" class="safety-day-detail"></div></section><section id="safetyWeekly" class="safety-weekly" hidden><div class="safety-viewer"><canvas id="safetyCanvas"></canvas></div></section><div class="safety-help">O modo <b>Dinâmico</b> organiza a leitura do dia. O modo <b>Semanal</b> mantém o PDF oficial completo.</div></div>'}
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
return '<div class="panel oee-filter-panel"><div class="oee-filter-head"><div><h2>Filtros de eficiência</h2><p>Selecione os filtros e clique em Aplicar filtros. Turnos: 1º 07:00–17:00 • 2º 17:00–02:00 • 3º 02:00–07:00.</p></div><div class="oee-filter-actions"><button class="filter-apply premium-apply" id="oeeApply"><span>✓</span> Aplicar filtros</button><button class="filter-reset" id="oeeReset">↺ Limpar filtros</button></div></div><div class="oee-filters oee-filters-live oee-filters-datetime"><label>Setor<select id="oeeArea"><option value="Todas">Toda a fábrica</option></select></label><label>Linha<select id="oeeLinha"><option value="Todas">Todas as linhas</option></select></label><label>Turno<select id="oeeShift"><option value="Todos">Todos os turnos</option><option value="1">1º Turno • 07:00–17:00</option><option value="2">2º Turno • 17:00–02:00</option><option value="3">3º Turno • 02:00–07:00</option></select></label><label>Data / hora inicial<input id="oeeStartAt" type="datetime-local"></label><label>Data / hora final<input id="oeeEndAt" type="datetime-local"></label></div><div class="filter-context" id="oeeContext">🟡 L2L: carregando...</div></div><div class="cards" id="oeeCards"></div><div class="section-grid oee-section-grid"><div class="panel"><h2>Comparativo de eficiência por linha</h2><div id="oeeTable"></div></div><div class="panel oee-chart-panel"><h2>Modelos com melhor eficiência</h2><div id="oeeChart"></div><div class="footer-note">Ranking conforme os filtros selecionados • atualização automática a cada 1 minuto.</div></div></div>';
}

function dateTimeLocalValue(date,time){
  return (date||todayISO())+"T"+(time||"00:00");
}

function splitDateTimeLocal(value,fallbackDate,fallbackTime){
  const raw=String(value||"");
  if(!raw.includes("T"))return {date:fallbackDate||todayISO(),time:fallbackTime||"00:00"};
  const [date,timeRaw]=raw.split("T");
  return {date:date||fallbackDate||todayISO(),time:(timeRaw||fallbackTime||"00:00").slice(0,5)};
}

const heatmapFilterState={area:"Todas",line:"Todas",shift:"Todos",startDate:"",endDate:"",start:"00:00",end:"23:59"};
let heatmapWeekIndex=0;

function heatmap(){
  return '<div class="panel heatmap-filter-panel">'+
    '<div class="oee-filter-head"><div><span class="heatmap-kicker">ANÁLISE DIÁRIA</span><h2>Mapa de calor OEE por período</h2><p>Eficiência diária por injetora e turno. Turnos oficiais: 1º 07:00–17:00 • 2º 17:00–02:00 • 3º 02:00–07:00.</p></div><div class="oee-filter-actions"><button class="filter-apply premium-apply" id="heatApply"><span>✓</span> Atualizar mapa</button><button class="filter-reset" id="heatReset">↺ Hoje</button></div></div>'+
    '<div class="oee-filters oee-filters-live heatmap-day-filters"><label>Setor<select id="heatArea"><option value="Todas">Toda a fábrica</option></select></label><label>Linha<select id="heatLine"><option value="Todas">Todas as linhas</option></select></label><label>Turno<select id="heatShift"><option value="Todos">Todos os turnos</option><option value="1">1º Turno • 07:00–17:00</option><option value="2">2º Turno • 17:00–02:00</option><option value="3">3º Turno • 02:00–07:00</option></select></label><label>Data inicial<input id="heatStartDate" type="date"></label><label>Data final<input id="heatEndDate" type="date"></label></div>'+
    '<div class="filter-context" id="heatContext">🟡 L2L: carregando mapa de calor...</div>'+
  '</div>'+
  '<div id="oeeHeatmapMount"></div>';
}

let oeeRows=[];
let oeeProductRows=[];
let oeeLoading=false;
let oeeHeatmapRows=[];
let oeeHourlyHeatmapRows=[];
let oeeHeatmapLoading=false;
let oeeHeatmapKey="";
const oeeFilterState={area:"Todas",line:"Todas",shift:"Todos",startDate:"",endDate:"",start:"00:00",end:"23:59"};

function normalizeShift(value){
  if(value===null||value===undefined||value==="")return "";
  const s=String(value).trim().toUpperCase();
  if(/^1/.test(s)||s==="A")return "1";
  if(/^2/.test(s)||s==="B")return "2";
  if(/^3/.test(s)||s==="C")return "3";
  return s;
}

const SHIFT_SCHEDULE={
  "1":{label:"1º Turno",time:"07:00–17:00",hours:[7,8,9,10,11,12,13,14,15,16]},
  "2":{label:"2º Turno",time:"17:00–02:00",hours:[17,18,19,20,21,22,23,0,1]},
  "3":{label:"3º Turno",time:"02:00–07:00",hours:[2,3,4,5,6]}
};

function shiftDisplay(value){
  const key=normalizeShift(value);
  const shift=SHIFT_SCHEDULE[key];
  return shift ? shift.label+" • "+shift.time : "Todos os turnos";
}

function shiftFromHour(hour){
  const h=Number(hour);
  if(h>=7&&h<17)return "1";
  if(h>=17||h<2)return "2";
  return "3";
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
  if(ctx)ctx.textContent="🟡 Consultando OEE oficial do L2L...";
  try{
    const startDate=oeeFilterState.startDate||todayISO();
    const endDate=oeeFilterState.endDate||startDate;

    const [summaryRows,productRows]=await Promise.all([
      window.L2L.getOeeShiftRange(
        startDate,
        endDate,
        oeeFilterState.shift,
        oeeFilterState.start,
        oeeFilterState.end
      ),
      window.L2L.getRange(
        startDate,
        endDate,
        oeeFilterState.start,
        oeeFilterState.end
      ).catch(()=>[])
    ]);

    oeeRows=summaryRows;
    oeeProductRows=productRows;
    l2lLastUpdate=new Date();
    l2lError="";
    if(currentPage==="oee"){
      populateOeeFilters();
      renderOeeLive();
    }
  }catch(err){
    l2lError=err.message||"Falha ao consultar OEE no L2L";
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

  const lines=[...new Set(source.filter(r=>oeeFilterState.area==="Todas"||r.area===oeeFilterState.area).map(r=>r.line).filter(Boolean))].sort((a,b)=>oeeLineNumber(a)-oeeLineNumber(b)||String(a).localeCompare(String(b),"pt-BR",{numeric:true,sensitivity:"base"}));
  lineEl.innerHTML='<option value="Todas">Todas as linhas</option>'+lines.map(l=>'<option value="'+l+'">'+l+'</option>').join("");
  lineEl.value=lines.includes(oeeFilterState.line)?oeeFilterState.line:"Todas";
  oeeFilterState.line=lineEl.value;
}

function getFilteredOeeRows(){
  const source=oeeRows.length?oeeRows:[];
  return source.filter(r=>
    (oeeFilterState.area==="Todas"||r.area===oeeFilterState.area) &&
    (oeeFilterState.line==="Todas"||r.line===oeeFilterState.line)
  );
}

function initOee(){
  const area=document.getElementById("oeeArea");
  const line=document.getElementById("oeeLinha");
  const shift=document.getElementById("oeeShift");
  const startAt=document.getElementById("oeeStartAt");
  const endAt=document.getElementById("oeeEndAt");
  const apply=document.getElementById("oeeApply");
  const reset=document.getElementById("oeeReset");
  if(!area||!line||!shift||!startAt||!endAt||!apply||!reset)return;

  if(!oeeFilterState.startDate)oeeFilterState.startDate=todayISO();
  if(!oeeFilterState.endDate)oeeFilterState.endDate=oeeFilterState.startDate;
  populateOeeFilters();
  area.value=oeeFilterState.area;
  line.value=oeeFilterState.line;
  shift.value=oeeFilterState.shift;
  startAt.value=dateTimeLocalValue(oeeFilterState.startDate,oeeFilterState.start);
  endAt.value=dateTimeLocalValue(oeeFilterState.endDate,oeeFilterState.end);

  function refreshLineOptionsForDraft(){
    const source=oeeRows.length?oeeRows:l2lRows;
    const selectedArea=area.value;
    const lines=[...new Set(source.filter(r=>selectedArea==="Todas"||r.area===selectedArea).map(r=>r.line).filter(Boolean))]
      .sort((a,b)=>oeeLineNumber(a)-oeeLineNumber(b)||String(a).localeCompare(String(b),"pt-BR",{numeric:true,sensitivity:"base"}));
    const current=line.value;
    line.innerHTML='<option value="Todas">Todas as linhas</option>'+lines.map(l=>'<option value="'+l+'">'+l+'</option>').join("");
    line.value=lines.includes(current)?current:"Todas";
  }

  area.addEventListener("change",refreshLineOptionsForDraft);

  apply.addEventListener("click",async()=>{
    apply.disabled=true;
    apply.classList.add("loading");
    apply.innerHTML='<span>⏳</span> Aplicando...';
    try{
      const first=splitDateTimeLocal(startAt.value,todayISO(),"00:00");
      const last=splitDateTimeLocal(endAt.value,first.date,"23:59");
      oeeFilterState.area=area.value;
      oeeFilterState.line=line.value;
      oeeFilterState.shift=shift.value;
      oeeFilterState.startDate=first.date;
      oeeFilterState.endDate=last.date<first.date?first.date:last.date;
      oeeFilterState.start=first.time;
      oeeFilterState.end=last.time;

      if(oeeFilterState.shift==="1"){
        oeeFilterState.start="07:00";
        oeeFilterState.end="17:00";
      }else if(oeeFilterState.shift==="2"){
        oeeFilterState.start="17:00";
        oeeFilterState.end="02:00";
      }else if(oeeFilterState.shift==="3"){
        oeeFilterState.start="02:00";
        oeeFilterState.end="07:00";
      }
      if(oeeFilterState.shift==="Todos"&&oeeFilterState.endDate===oeeFilterState.startDate&&oeeFilterState.end<=oeeFilterState.start){
        oeeFilterState.end="23:59";
        endAt.value=dateTimeLocalValue(oeeFilterState.endDate,oeeFilterState.end);
      }
      await refreshOeeRange();
      renderOeeLive();
    }finally{
      apply.disabled=false;
      apply.classList.remove("loading");
      apply.innerHTML='<span>✓</span> Aplicar filtros';
    }
  });

  reset.addEventListener("click",async()=>{
    oeeFilterState.area="Todas";
    oeeFilterState.line="Todas";
    oeeFilterState.shift="Todos";
    oeeFilterState.startDate=todayISO();
    oeeFilterState.endDate=todayISO();
    oeeFilterState.start="00:00";
    oeeFilterState.end="23:59";
    area.value="Todas";
    shift.value="Todos";
    refreshLineOptionsForDraft();
    line.value="Todas";
    startAt.value=dateTimeLocalValue(oeeFilterState.startDate,oeeFilterState.start);
    endAt.value=dateTimeLocalValue(oeeFilterState.endDate,oeeFilterState.end);
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

function isHeatmapInjectionLine(lineName){
  const name=String(lineName||"").toUpperCase().trim();
  return /INJETORA\s*AL\s*0*\d+/.test(name);
}

function previousWorkingDays(endIso,count){
  const end=new Date((endIso||todayISO())+"T00:00:00");
  const dates=[];
  const cursor=new Date(end);

  while(dates.length<count){
    if(cursor.getDay()!==0)dates.unshift(localIsoDate(cursor));
    cursor.setDate(cursor.getDate()-1);
  }
  return {
    start:dates[0]||endIso||todayISO(),
    end:dates[dates.length-1]||endIso||todayISO()
  };
}

function isoDaysBefore(iso,days){
  const d=new Date((iso||todayISO())+"T00:00:00");
  d.setDate(d.getDate()-days);
  return localIsoDate(d);
}

function oeeLineNumber(lineName){
  const name=String(lineName||"").toUpperCase().trim();
  const patterns=[
    /INJETORA\s*AL\s*0*(\d+)/,
    /INJETORA\s*0*(\d+)/,
    /\bAL\s*0*(\d+)\b/,
    /\bINJ(?:ETORA)?\s*0*(\d+)\b/,
    /(\d+)/
  ];
  for(const pattern of patterns){
    const match=name.match(pattern);
    if(match)return Number(match[1]);
  }
  return Number.MAX_SAFE_INTEGER;
}

function sortOeeCardsByLine(groups){
  return [...groups].sort((a,b)=>{
    const areaA=String(a.area||"");
    const areaB=String(b.area||"");
    const areaCompare=areaA.localeCompare(areaB,"pt-BR",{numeric:true,sensitivity:"base"});
    if(areaCompare!==0)return areaCompare;

    const numberA=oeeLineNumber(a.line);
    const numberB=oeeLineNumber(b.line);
    if(numberA!==numberB)return numberA-numberB;

    return String(a.line||"").localeCompare(String(b.line||""),"pt-BR",{numeric:true,sensitivity:"base"});
  });
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







function chunkHeatDates(dates,size=7){
  const chunks=[];
  for(let i=0;i<dates.length;i+=size)chunks.push(dates.slice(i,i+size));
  return chunks;
}

function heatWeekLabel(dates){
  if(!dates.length)return "";
  const first=dates[0].label;
  const last=dates[dates.length-1].label;
  return first===last?first:first+" → "+last;
}

function changeHeatWeek(delta){
  const allDates=oeeHeatDateRange(
    heatmapFilterState.startDate||todayISO(),
    heatmapFilterState.endDate||heatmapFilterState.startDate||todayISO()
  );
  const weeks=chunkHeatDates(allDates,7);
  if(!weeks.length)return;
  heatmapWeekIndex=Math.max(0,Math.min(weeks.length-1,heatmapWeekIndex+delta));
  renderOeeHeatmap();
}

function oeeHeatDateRange(startDate,endDate){
  const out=[];
  const first=new Date((startDate||todayISO())+"T00:00:00");
  const last=new Date((endDate||startDate||todayISO())+"T00:00:00");
  if(Number.isNaN(first.getTime())||Number.isNaN(last.getTime()))return out;

  for(let d=new Date(first);d<=last;d.setDate(d.getDate()+1)){
    out.push({
      iso:localIsoDate(d),
      label:d.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"}),
      weekday:d.toLocaleDateString("pt-BR",{weekday:"short"}).replace(".","")
    });
  }
  return out;
}

function nextIsoDay(iso){
  const d=new Date(iso+"T00:00:00");
  d.setDate(d.getDate()+1);
  return d.toISOString().slice(0,10);
}

function oeeHourShift(hour){
  return shiftFromHour(hour);
}

function oeeHourLabel(hour){
  return String(hour).padStart(2,"0")+":00";
}

function mergeHourlyRows(rows,date,hour){
  const map={};
  rows.forEach(row=>{
    const line=row.line||"Sem linha";
    const key=(row.area||"")+"|"+line;
    if(!map[key])map[key]={area:row.area||"",line,date,hour,shift:oeeHourShift(hour),weighted:0,weight:0,values:[]};
    const oee=n(row.overall_equipment_effectiveness ?? row.oee);
    if(!Number.isFinite(oee))return;
    const weight=Math.max(0,n(row.planned_production_minutes ?? row.production_minutes ?? row.runtime_minutes));
    if(weight>0){
      map[key].weighted+=oee*weight;
      map[key].weight+=weight;
    }else{
      map[key].values.push(oee);
    }
  });
  return Object.values(map).map(x=>({
    area:x.area,
    line:x.line,
    date:x.date,
    hour:x.hour,
    shift:x.shift,
    oee:x.weight>0?x.weighted/x.weight:(x.values.length?x.values.reduce((a,b)=>a+b,0)/x.values.length:0)
  }));
}

function aggregateShiftRows(hourlyRows){
  const map={};
  hourlyRows.forEach(row=>{
    let businessDate=row.date;
    // 2º turno cruza a meia-noite: 00h e 01h pertencem ao turno iniciado às 17h do dia anterior.
    if(row.shift==="2"&&Number(row.hour)<2){
      const d=new Date(row.date+"T00:00:00");
      d.setDate(d.getDate()-1);
      businessDate=localIsoDate(d);
    }
    const key=[row.area,row.line,businessDate,row.shift].join("|");
    if(!map[key])map[key]={area:row.area,line:row.line,date:businessDate,shift:row.shift,weighted:0,weight:0,values:[]};

    const value=n(row.oee);
    const weight=Math.max(0,n(row.weight??row.minutes??0));
    if(weight>0){
      map[key].weighted+=value*weight;
      map[key].weight+=weight;
    }else{
      map[key].values.push(value);
    }
  });

  return Object.values(map).map(x=>({
    area:x.area,
    line:x.line,
    date:x.date,
    shift:x.shift,
    oee:x.weight>0
      ? x.weighted/x.weight
      : (x.values.length?x.values.reduce((a,b)=>a+b,0)/x.values.length:0)
  }));
}

function localIsoDate(date){
  const y=date.getFullYear();
  const m=String(date.getMonth()+1).padStart(2,"0");
  const d=String(date.getDate()).padStart(2,"0");
  return y+"-"+m+"-"+d;
}

function pitchesToHourlyRows(pitches){
  const buckets={};

  (Array.isArray(pitches)?pitches:[]).forEach(pitch=>{
    const start=new Date(pitch.pitch_start);
    const end=new Date(pitch.pitch_end);
    const oee=n(pitch.oee);
    if(Number.isNaN(start.getTime())||Number.isNaN(end.getTime())||end<=start||!Number.isFinite(oee))return;

    let cursor=new Date(start);
    while(cursor<end){
      const hourStart=new Date(cursor);
      hourStart.setMinutes(0,0,0);
      const hourEnd=new Date(hourStart);
      hourEnd.setHours(hourEnd.getHours()+1);

      const segStart=new Date(Math.max(start.getTime(),hourStart.getTime()));
      const segEnd=new Date(Math.min(end.getTime(),hourEnd.getTime()));
      const minutes=Math.max(0,(segEnd-segStart)/60000);

      if(minutes>0){
        const hour=hourStart.getHours();
        const date=localIsoDate(hourStart);
        const key=[pitch.area||"",pitch.line||"Sem linha",date,hour].join("|");
        if(!buckets[key]){
          buckets[key]={
            area:pitch.area||"",
            line:pitch.line||"Sem linha",
            date,
            hour,
            shift:oeeHourShift(hour),
            weighted:0,
            weight:0
          };
        }
        buckets[key].weighted+=oee*minutes;
        buckets[key].weight+=minutes;
      }

      cursor=hourEnd;
    }
  });

  return Object.values(buckets).map(x=>({
    area:x.area,
    line:x.line,
    date:x.date,
    hour:x.hour,
    shift:x.shift,
    oee:x.weight?x.weighted/x.weight:0
  }));
}

async function refreshOeeHeatmap(force=false){
  if(oeeHeatmapLoading||currentPage!=="heatmap")return;
  const startDate=heatmapFilterState.startDate||todayISO();
  const endDate=heatmapFilterState.endDate||startDate;
  const startTime=heatmapFilterState.start||"00:00";
  const endTime=heatmapFilterState.end||"23:59";
  const key=[startDate,endDate,startTime,endTime,heatmapFilterState.area,heatmapFilterState.line,heatmapFilterState.shift].join("|");
  if(!force&&oeeHeatmapRows.length&&oeeHeatmapKey===key){
    renderOeeHeatmap();
    return;
  }

  oeeHeatmapLoading=true;
  const mount=document.getElementById("oeeHeatmapMount");
  if(mount&&!oeeHeatmapRows.length){
    mount.innerHTML='<section class="panel oee-heat-panel"><div class="scrap-loading"><div class="scrap-spinner"></div><strong>Consultando OEE diário por turno no L2L...</strong></div></section>';
  }

  try{
    // Quando o período termina no fim do dia, consulta até 02:00 do dia seguinte
    // para completar o 2º turno (17:00–02:00). Em outros horários, respeita a janela exata.
    const queryEndDate=endTime==="23:59"?nextIsoDay(endDate):endDate;
    const queryEndTime=endTime==="23:59"?"02:00":endTime;
    const pitches=await window.L2L.getPitchHeat(startDate,queryEndDate,startTime,queryEndTime);
    const hourly=pitchesToHourlyRows(pitches);
    oeeHourlyHeatmapRows=hourly;
    oeeHeatmapRows=aggregateShiftRows(hourly).filter(r=>r.date>=startDate&&r.date<=endDate);
    oeeHeatmapKey=key;
    l2lLastUpdate=new Date();
    if(currentPage==="heatmap")renderOeeHeatmap();
  }catch(err){
    if(mount)mount.innerHTML='<section class="panel oee-heat-panel"><div class="empty-state"><strong>Não foi possível carregar o OEE diário por turno.</strong><br>'+stockEsc(err.message||"Falha ao consultar L2L")+'</div></section>';
  }finally{
    oeeHeatmapLoading=false;
  }
}

function oeeHeatClass(value){
  if(value<50)return "heat-critical";
  if(value<75)return "heat-warning";
  return "heat-good";
}

function shiftHours(shift){
  return SHIFT_SCHEDULE[shift]?.hours||[];
}

function oeeDailyShiftCard(shift,title,timeRange,icon,rows,lines,dates){
  return `
    <article class="oee-heat-shift compact-shift-card shift-${shift}">
      <div class="oee-heat-shift-head">
        <div class="oee-heat-shift-left">
          <span class="oee-heat-icon">${icon}</span>
          <div><strong>${title}</strong><small>${timeRange}</small></div>
        </div>
      </div>
      <div class="oee-heat-table-wrap compact-heat-scroll">
        <table class="oee-heat-table compact-daily-heat-table">
          <thead><tr><th class="sticky-col">LINHA</th>${dates.map(d=>`<th>${d.label}</th>`).join("")}</tr></thead>
          <tbody>
            ${lines.map(line=>{
              const dayCells=dates.map(day=>{
                const vals=rows.filter(r=>r.shift===shift&&r.line===line&&r.date===day.iso).map(r=>r.oee).filter(Number.isFinite);
                if(!vals.length)return '<td class="heat-empty">—</td>';
                const value=vals.reduce((a,b)=>a+b,0)/vals.length;
                return `<td class="oee-heat-cell ${oeeHeatClass(value)}" title="${line} • ${day.label} • ${title} • ${value.toFixed(1).replace(".",",")}%"><b>${Math.round(value)}%</b></td>`;
              }).join("");
              return `<tr><td class="oee-heat-line sticky-col"><b>${line}</b></td>${dayCells}</tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
    </article>
  `;
}

function renderOeeHeatmap(){
  const mount=document.getElementById("oeeHeatmapMount");
  if(!mount)return;

  let details=oeeHeatmapRows.filter(r=>
    (heatmapFilterState.area==="Todas"||r.area===heatmapFilterState.area) &&
    (heatmapFilterState.line==="Todas"||r.line===heatmapFilterState.line)
  );

  const selectedShift=heatmapFilterState.shift;
  if(selectedShift!=="Todos")details=details.filter(r=>r.shift===selectedShift);

  const startDate=heatmapFilterState.startDate||todayISO();
  const endDate=heatmapFilterState.endDate||startDate;
  const allDates=oeeHeatDateRange(startDate,endDate);
  const weeks=chunkHeatDates(allDates,7);
  if(heatmapWeekIndex>=weeks.length)heatmapWeekIndex=Math.max(0,weeks.length-1);
  const dates=weeks[heatmapWeekIndex]||allDates.slice(0,7);

  const lines=[...new Set(details.map(r=>r.line).filter(Boolean))]
    .sort((a,b)=>oeeLineNumber(a)-oeeLineNumber(b)||String(a).localeCompare(String(b),"pt-BR",{numeric:true,sensitivity:"base"}));

  const visibleDateSet=new Set(dates.map(d=>d.iso));
  const visibleDetails=details.filter(r=>visibleDateSet.has(r.date));
  const values=visibleDetails.map(r=>r.oee).filter(Number.isFinite);
  const overall=values.length?values.reduce((a,b)=>a+b,0)/values.length:0;

  const lineAverages=lines.map(line=>{
    const vals=visibleDetails.filter(r=>r.line===line).map(r=>r.oee).filter(Number.isFinite);
    return {line,value:vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:null};
  });
  const below=lineAverages.filter(x=>x.value!==null&&x.value<75).length;

  const startLabel=startDate.split("-").reverse().join("/");
  const endLabel=endDate.split("-").reverse().join("/");
  const periodLabel=startLabel===endLabel?startLabel:startLabel+" → "+endLabel;

  if(!details.length||!lines.length){
    mount.innerHTML='<section class="panel oee-heat-panel"><div class="oee-heat-top"><div><span>ANÁLISE DIÁRIA POR TURNO</span><h2>Mapa de calor OEE por linha</h2><p>Período '+periodLabel+' • meta de 75%.</p></div></div><div class="empty-state">Nenhuma linha foi encontrada no L2L para os filtros selecionados.</div></section>';
    return;
  }

  const cards=[];
  if(selectedShift==="Todos"||selectedShift==="1")cards.push(oeeDailyShiftCard("1","1º Turno","07:00–17:00","☀",details,lines,dates));
  if(selectedShift==="Todos"||selectedShift==="2")cards.push(oeeDailyShiftCard("2","2º Turno","17:00–02:00","◐",details,lines,dates));
  if(selectedShift==="Todos"||selectedShift==="3")cards.push(oeeDailyShiftCard("3","3º Turno","02:00–07:00","☾",details,lines,dates));

  const weekLabel=heatWeekLabel(dates);
  const hasPrev=heatmapWeekIndex>0;
  const hasNext=heatmapWeekIndex<weeks.length-1;
  const areaLabel=heatmapFilterState.area==="Todas"?"Todas as áreas":heatmapFilterState.area;

  mount.innerHTML=`
    <section class="panel oee-heat-panel compact-heat-panel">
      <div class="oee-heat-top">
        <div><span>ANÁLISE DIÁRIA POR TURNO</span><h2>Mapa de calor OEE por linha</h2><p>${areaLabel} • ${periodLabel} • meta de 75% OEE.</p></div>
        <div class="oee-heat-legend"><div class="oee-heat-legend-title">Escala OEE</div><div class="oee-heat-gradient"></div><div class="oee-heat-legend-labels"><span><b>&lt; 50%</b><small>Crítico</small></span><span><b>50%–74%</b><small>Atenção</small></span><span><b>≥ 75%</b><small>Dentro da meta</small></span></div></div>
      </div>

      <div class="heat-week-nav">
        <button type="button" onclick="changeHeatWeek(-1)" ${hasPrev?"":"disabled"}>‹ Semana anterior</button>
        <div><span>Período exibido</span><strong>${weekLabel}</strong><small>${weeks.length>1?"Semana "+(heatmapWeekIndex+1)+" de "+weeks.length:"7 dias"}</small></div>
        <button type="button" onclick="changeHeatWeek(1)" ${hasNext?"":"disabled"}>Próxima semana ›</button>
      </div>

      <div class="oee-heat-summary">
        <div><span>Média das linhas</span><strong>${overall.toFixed(1).replace(".",",")}%</strong></div>
        <div><span>Linhas abaixo de 75%</span><strong>${below} <small>de ${lines.length}</small></strong></div>
        <div><span>Meta / referência</span><strong>75% OEE</strong></div>
      </div>

      <div class="oee-heat-grid compact-heat-grid">${cards.join("")}</div>
    </section>
  `;
}

function populateHeatmapFilters(){
  const area=document.getElementById("heatArea");
  const line=document.getElementById("heatLine");
  if(!area||!line)return;

  const source=oeeRows.length?oeeRows:l2lRows;
  const areas=[...new Set(source.map(r=>r.area).filter(Boolean))]
    .sort((a,b)=>String(a).localeCompare(String(b),"pt-BR",{numeric:true,sensitivity:"base"}));

  area.innerHTML='<option value="Todas">Todas as áreas</option>'+
    areas.map(a=>'<option value="'+a+'">'+a+'</option>').join("");

  area.value=areas.includes(heatmapFilterState.area)?heatmapFilterState.area:"Todas";
  heatmapFilterState.area=area.value;

  const lines=[...new Set(
    source
      .filter(r=>heatmapFilterState.area==="Todas"||r.area===heatmapFilterState.area)
      .map(r=>r.line)
      .filter(Boolean)
  )].sort((a,b)=>oeeLineNumber(a)-oeeLineNumber(b)||String(a).localeCompare(String(b),"pt-BR",{numeric:true,sensitivity:"base"}));

  line.innerHTML='<option value="Todas">Todas as linhas</option>'+
    lines.map(l=>'<option value="'+l+'">'+l+'</option>').join("");

  line.value=lines.includes(heatmapFilterState.line)?heatmapFilterState.line:"Todas";
  heatmapFilterState.line=line.value;
}

function updateHeatmapContext(){
  const el=document.getElementById("heatContext");
  if(!el)return;
  const shift=heatmapFilterState.shift==="Todos"?"Todos os turnos":shiftDisplay(heatmapFilterState.shift);
  const start=(heatmapFilterState.startDate||todayISO()).split("-").reverse().join("/");
  const end=(heatmapFilterState.endDate||heatmapFilterState.startDate||todayISO()).split("-").reverse().join("/");
  el.textContent=liveStamp()+" • "+(heatmapFilterState.area==="Todas"?"Toda a fábrica":heatmapFilterState.area)+" • "+(heatmapFilterState.line==="Todas"?"Todas as linhas":heatmapFilterState.line)+" • "+shift+" • "+start+(start!==end?" → "+end:"");
}

function initHeatmap(){
  const area=document.getElementById("heatArea");
  const line=document.getElementById("heatLine");
  const shift=document.getElementById("heatShift");
  const startDate=document.getElementById("heatStartDate");
  const endDate=document.getElementById("heatEndDate");
  const apply=document.getElementById("heatApply");
  const reset=document.getElementById("heatReset");
  if(!area||!line||!shift||!startDate||!endDate||!apply||!reset)return;

  if(!heatmapFilterState.endDate)heatmapFilterState.endDate=todayISO();
  if(!heatmapFilterState.startDate)heatmapFilterState.startDate=isoDaysBefore(heatmapFilterState.endDate,6);
  heatmapFilterState.start="00:00";
  heatmapFilterState.end="23:59";

  populateHeatmapFilters();
  shift.value=heatmapFilterState.shift;
  startDate.value=heatmapFilterState.startDate;
  endDate.value=heatmapFilterState.endDate;

  area.addEventListener("change",()=>{
    heatmapFilterState.area=area.value;
    heatmapFilterState.line="Todas";
    populateHeatmapFilters();
  });

  apply.addEventListener("click",async()=>{
    apply.disabled=true;
    apply.classList.add("loading");
    apply.innerHTML='<span>⏳</span> Atualizando...';
    try{
      heatmapFilterState.area=area.value;
      heatmapFilterState.line=line.value;
      heatmapFilterState.shift=shift.value;

      const chosenEnd=endDate.value||todayISO();
      let chosenStart=startDate.value||isoDaysBefore(chosenEnd,6);
      if(chosenStart>chosenEnd)chosenStart=chosenEnd;

      // Se o usuário escolher apenas um dia, transforma em uma janela de 7 dias
      // terminando na data escolhida, igual ao padrão visual do Gemba.
      if(chosenStart===chosenEnd){
        chosenStart=isoDaysBefore(chosenEnd,6);
        startDate.value=chosenStart;
      }

      heatmapFilterState.startDate=chosenStart;
      heatmapFilterState.endDate=chosenEnd;
      heatmapFilterState.start="00:00";
      heatmapFilterState.end="23:59";

      heatmapWeekIndex=0;
      oeeHeatmapRows=[];
      oeeHourlyHeatmapRows=[];
      oeeHeatmapKey="";
      updateHeatmapContext();
      await refreshOeeHeatmap(true);
      updateHeatmapContext();
    }finally{
      apply.disabled=false;
      apply.classList.remove("loading");
      apply.innerHTML='<span>✓</span> Atualizar mapa';
    }
  });

  reset.addEventListener("click",async()=>{
    heatmapFilterState.area="Todas";
    heatmapFilterState.line="Todas";
    heatmapFilterState.shift="Todos";
    heatmapFilterState.endDate=todayISO();
    heatmapFilterState.startDate=isoDaysBefore(heatmapFilterState.endDate,6);
    heatmapFilterState.start="00:00";
    heatmapFilterState.end="23:59";

    shift.value="Todos";
    startDate.value=heatmapFilterState.startDate;
    endDate.value=heatmapFilterState.endDate;
    populateHeatmapFilters();

    heatmapWeekIndex=0;
    oeeHeatmapRows=[];
    oeeHourlyHeatmapRows=[];
    oeeHeatmapKey="";
    await refreshOeeHeatmap(true);
    updateHeatmapContext();
  });

  updateHeatmapContext();
  refreshOeeHeatmap();
}

function renderOeeLive(){
  if(currentPage!=="oee")return;
  populateOeeFilters();

  const rows=getFilteredOeeRows();
  const source=oeeRows.length?oeeRows:l2lRows;
  const groups=groupedByLine(rows);
  const selectedArea=oeeFilterState.area==="Todas"?"Toda a fábrica":oeeFilterState.area;
  const selectedLine=oeeFilterState.line==="Todas"?"Todas as linhas":oeeFilterState.line;
  const selectedShift=oeeFilterState.shift==="Todos"?"Todos os turnos":shiftDisplay(oeeFilterState.shift);

  const oeeValue=avg(rows,"overall_equipment_effectiveness");
  const efficiency=avg(rows,"peff");
  const availability=avg(rows,"operational_availability");
  const quality=avg(rows,"yield");
  const scrapPct=avg(rows,"scrap_percent");

  const cards=document.getElementById("oeeCards");
  if(cards){
    cards.className="line-gauge-grid";
    const ordered=sortOeeCardsByLine(groups);
    cards.innerHTML=ordered.length
      ? ordered.map(lineGaugeCard).join("")
      : '<div class="empty-state">Nenhuma linha encontrada para os filtros selecionados.</div>';
  }

  const ctx=document.getElementById("oeeContext");
  if(ctx)ctx.textContent=liveStamp()+" • "+selectedArea+" • "+selectedLine+" • "+selectedShift+" • "+(oeeFilterState.startDate||"")+(oeeFilterState.endDate&&oeeFilterState.endDate!==oeeFilterState.startDate?" → "+oeeFilterState.endDate:"")+" • "+oeeFilterState.start+"–"+oeeFilterState.end+" • "+groups.length+" linha(s) • OEE oficial L2L";

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
    const productSource=oeeProductRows.length?oeeProductRows:rows;
    const products=groupedProducts(productSource).slice(0,10);
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
    '<div class="oee-filter-head"><div><h2>Filtros de produção</h2><p>Dados reais do L2L para demanda, produção atual e produzido líquido. Turnos: 1º 07:00–17:00 • 2º 17:00–02:00 • 3º 02:00–07:00 • atualização a cada 1 minuto.</p></div><button class="filter-reset" id="prodReset">↺ Limpar filtros</button></div>'+
    '<div class="oee-filters oee-filters-live">'+
      '<label>Setor<select id="prodArea"><option value="Todas">Toda a fábrica</option></select></label>'+
      '<label>Linha<select id="prodLinha"><option value="Todas">Todas as linhas</option></select></label>'+
      '<label>Turno<select id="prodTurno"><option value="Todos">Todos os turnos</option><option value="1">1º Turno • 07:00–17:00</option><option value="2">2º Turno • 17:00–02:00</option><option value="3">3º Turno • 02:00–07:00</option></select></label>'+
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
  const selectedShift=productionFilterState.shift==="Todos"?"Todos os turnos":shiftDisplay(productionFilterState.shift);
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

const STOCK_STAGE={
  foundry:/^(FND)(?!.*ACAB)/i,
  finishing:/ACAB/i,
  downstream:/(USI|USIN|MACH|MECAN)/i
};

let stockRows=[];
let stockLoading=false;
const stockFilterState={startDate:"2026-09-15",endDate:"",model:"Todos"};

function stock(){
  return '<div class="panel stock-filter-panel">'+
    '<div class="stock-filter-head"><div><span>CONTROLE EM TEMPO REAL</span><h2>Estoque da Fundição</h2><p>Selecione a data e o modelo para consultar a posição calculada com os dados do L2L.</p></div><div class="stock-live-badge" id="stockLiveStatus">🟡 L2L: carregando...</div></div>'+
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
  '<div class="panel"><div class="stock-section-head"><div><span>WIP / INACABADO</span><h2>Estoque Inacabado</h2><p>Produção da Fundição − consumo registrado no Acabamento.</p></div></div><div id="stockInacabado"></div></div>'+
  '<div class="panel"><div class="stock-section-head"><div><span>PRODUTO ACABADO</span><h2>Estoque Acabado</h2><p>Produção do Acabamento − saída identificada no processo seguinte.</p></div></div><div id="stockAcabado"></div></div>'+
  '<div class="panel"><div class="stock-section-head"><div><span>DETALHAMENTO POR MODELO</span><h2>Quantidade de cada modelo</h2><p>Visão consolidada de Inacabado, Acabado e Total por modelo no período selecionado.</p></div></div><div id="stockByModel"></div></div>'+
  '<div class="panel"><div class="stock-section-head"><div><span>CONSOLIDADO</span><h2>Resumo do Estoque</h2><p>Resumo calculado para a data e o modelo selecionados.</p></div></div><div id="stockResumo"></div></div>'+
  '<div class="stock-calculation-note"><strong>Atualização:</strong> o painel consulta novamente o L2L a cada <b>1 minuto</b>. Os valores exibidos são calculados com os movimentos de produção retornados pelo L2L para a data selecionada.</div>';
}

function stockStage(area){
  const a=String(area||"").toUpperCase();
  if(STOCK_STAGE.finishing.test(a))return "finishing";
  if(STOCK_STAGE.foundry.test(a))return "foundry";
  if(STOCK_STAGE.downstream.test(a))return "downstream";
  return "";
}

function stockProductRows(row){
  let products=row.products;
  let list=[];
  if(Array.isArray(products))list=products;
  else if(products&&typeof products==="object")list=Object.values(products);

  const normalized=list.filter(x=>x&&typeof x==="object").map(p=>({
    model:String(p.product_name??p.product??p.name??p.model??p.product_code??p.part_number??p.description??"").trim(),
    qty:n(p.actual??p.production_actual??p.quantity??p.qty??0)
  })).filter(x=>x.model);

  if(normalized.length)return normalized;
  return [{model:"GERAL",qty:n(row.actual)}];
}

function calculateL2LStock(rows){
  const flow={};
  rows.forEach(row=>{
    const stage=stockStage(row.area);
    if(!stage)return;
    stockProductRows(row).forEach(p=>{
      const model=p.model||"GERAL";
      if(!flow[model])flow[model]={model,foundry:0,finishing:0,downstream:0};
      flow[model][stage]+=n(p.qty);
    });
  });

  return Object.values(flow).map(x=>({
    ...x,
    inacabado:Math.max(0,x.foundry-x.finishing),
    acabado:Math.max(0,x.finishing-x.downstream)
  })).sort((a,b)=>a.model.localeCompare(b.model));
}

function stockEsc(value){
  return String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}

function populateStockModels(position){
  const select=document.getElementById("stockModel");
  if(!select)return;
  const models=position.map(x=>x.model).filter(Boolean);
  select.innerHTML='<option value="Todos">Todos os modelos</option>'+models.map(m=>'<option value="'+stockEsc(m)+'">'+stockEsc(m)+'</option>').join("");
  if(models.includes(stockFilterState.model))select.value=stockFilterState.model;
  else{
    stockFilterState.model="Todos";
    select.value="Todos";
  }
}

function stockFilteredPosition(position){
  return stockFilterState.model==="Todos"
    ? position
    : position.filter(x=>x.model===stockFilterState.model);
}

function stockQtyStatus(qty){
  if(qty<=0)return '<span class="stock-live-status zero">Sem saldo</span>';
  return '<span class="stock-live-status ok">Disponível</span>';
}

function renderStockTable(rows,type){
  if(!rows.length)return '<div class="empty-state">Nenhum dado encontrado para o modelo/data selecionados.</div>';
  const isWip=type==="inacabado";
  const qtyKey=isWip?"inacabado":"acabado";
  return '<div class="table-scroll"><table class="stock-live-table"><thead><tr><th>Modelo</th>'+
    (isWip?'<th>Produção Fundição</th><th>Consumido no Acabamento</th>':'<th>Produção Acabamento</th><th>Saída processo seguinte</th>')+
    '<th>Quantidade</th><th>Status</th></tr></thead><tbody>'+
    rows.map(x=>'<tr><td><b>'+stockEsc(x.model)+'</b></td>'+
      (isWip?'<td>'+fmt(x.foundry)+'</td><td>'+fmt(x.finishing)+'</td>':'<td>'+fmt(x.finishing)+'</td><td>'+fmt(x.downstream)+'</td>')+
      '<td class="stock-exact-number">'+fmt(x[qtyKey])+'</td><td>'+stockQtyStatus(x[qtyKey])+'</td></tr>').join("")+
    '</tbody></table></div>';
}

async function refreshStockRange(){
  if(stockLoading)return;
  stockLoading=true;
  const status=document.getElementById("stockLiveStatus");
  if(status)status.textContent="🟡 Consultando L2L...";
  try{
    const first=stockFilterState.startDate||"2026-09-15";
    const last=stockFilterState.endDate||todayISO();
    stockRows=await window.L2L.getRange(first,last,"00:00","23:59");
    l2lLastUpdate=new Date();
    l2lError="";
    if(currentPage==="stock")updateStock();
  }catch(err){
    l2lError=err.message||"Falha ao consultar L2L";
    if(currentPage==="stock")updateStock();
  }finally{
    stockLoading=false;
  }
}

function renderStockByModel(rows){
  const el=document.getElementById("stockByModel");
  if(!el)return;
  if(!rows.length){
    el.innerHTML='<div class="empty-state">Nenhum modelo encontrado para o período selecionado.</div>';
    return;
  }
  const ordered=[...rows].sort((a,b)=>(b.inacabado+b.acabado)-(a.inacabado+a.acabado));
  el.innerHTML='<div class="table-scroll"><table class="stock-by-model-table"><thead><tr><th>Modelo</th><th>Inacabado</th><th>Acabado</th><th>Total</th><th>Fundição</th><th>Acabamento</th><th>Saída</th></tr></thead><tbody>'+
    ordered.map(x=>'<tr><td><b>'+stockEsc(x.model)+'</b></td><td><span class="stock-pill stock-pill-wip">'+fmt(x.inacabado)+'</span></td><td><span class="stock-pill stock-pill-fg">'+fmt(x.acabado)+'</span></td><td><b class="stock-total-model">'+fmt(x.inacabado+x.acabado)+'</b></td><td>'+fmt(x.foundry)+'</td><td>'+fmt(x.finishing)+'</td><td>'+fmt(x.downstream)+'</td></tr>').join("")+
    '</tbody></table></div>';
}

function updateStock(){
  const source=stockRows.length?stockRows:l2lRows;
  const position=calculateL2LStock(source);
  populateStockModels(position);
  const visible=stockFilteredPosition(position);

  const totalI=visible.reduce((s,x)=>s+x.inacabado,0);
  const totalA=visible.reduce((s,x)=>s+x.acabado,0);
  const foundry=visible.reduce((s,x)=>s+x.foundry,0);
  const finishing=visible.reduce((s,x)=>s+x.finishing,0);
  const downstream=visible.reduce((s,x)=>s+x.downstream,0);

  const status=document.getElementById("stockLiveStatus");
  if(status)status.textContent=liveStamp();

  const context=document.getElementById("stockContext");
  if(context){
    const startLabel=(stockFilterState.startDate||"2026-09-15").split("-").reverse().join("/");
    const endLabel=(stockFilterState.endDate||todayISO()).split("-").reverse().join("/");
    const modelLabel=stockFilterState.model==="Todos"?"Todos os modelos":stockFilterState.model;
    context.textContent=liveStamp()+" • Acumulado "+startLabel+" → "+endLabel+" • "+modelLabel+" • atualização automática a cada 1 minuto";
  }

  const cards=document.getElementById("stockCards");
  if(cards)cards.innerHTML=
    card("Inacabados",fmt(totalI),totalI>0?"warn":"")+
    card("Acabados",fmt(totalA),totalA>0?"good":"")+
    card("Total",fmt(totalI+totalA))+
    card("Produção Fundição",fmt(foundry))+
    card("Produção Acabamento",fmt(finishing));

  const selected=document.getElementById("stockSelected");
  if(selected){
    if(stockFilterState.model!=="Todos"&&visible.length){
      const x=visible[0];
      selected.innerHTML=
        '<article class="stock-model-focus"><div class="stock-model-focus-head"><div><span>MODELO SELECIONADO</span><h2>'+stockEsc(x.model)+'</h2></div><span class="stock-live-status ok">L2L</span></div>'+
        '<div class="stock-model-values"><div><span>Inacabados</span><strong>'+fmt(x.inacabado)+'</strong><small>Fundição − Acabamento</small></div><div><span>Acabados</span><strong>'+fmt(x.acabado)+'</strong><small>Acabamento − saída</small></div><div><span>Total</span><strong>'+fmt(x.inacabado+x.acabado)+'</strong><small>Posição calculada</small></div></div></article>';
    }else selected.innerHTML="";
  }

  renderStockByModel(visible);

  const inc=document.getElementById("stockInacabado");
  if(inc)inc.innerHTML=renderStockTable(visible.filter(x=>x.foundry||x.finishing),"inacabado");

  const acab=document.getElementById("stockAcabado");
  if(acab)acab.innerHTML=renderStockTable(visible.filter(x=>x.finishing||x.downstream),"acabado");

  const resumo=document.getElementById("stockResumo");
  if(resumo){
    resumo.innerHTML=
      '<div class="stock-summary-grid">'+
        '<div><span>Inacabados</span><strong>'+fmt(totalI)+'</strong><small>'+ (stockFilterState.model==="Todos"?"Todos os modelos":stockEsc(stockFilterState.model)) +'</small></div>'+
        '<div><span>Acabados</span><strong>'+fmt(totalA)+'</strong><small>'+ (stockFilterState.model==="Todos"?"Todos os modelos":stockEsc(stockFilterState.model)) +'</small></div>'+
        '<div><span>Total</span><strong>'+fmt(totalI+totalA)+'</strong><small>Período acumulado</small></div>'+
        '<div><span>Modelos na visão</span><strong>'+fmt(visible.length)+'</strong><small>'+(position.some(x=>x.model!=="GERAL")?"Detalhe de produto disponível":"L2L sem detalhe de produto")+'</small></div>'+
      '</div>'+
      (downstream===0&&totalA>0?'<div class="stock-warning">⚠️ Não foi identificada saída do processo seguinte para esta seleção. O valor de Acabados está baseado no fluxo disponível no L2L.</div>':'');
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

  if(!stockRows.length)refreshStockRange();
  else updateStock();
}
function people(){return '<div class="cards">'+card("Absenteísmo","3,2%","warn")+card("Presentes","94,8%","good")+card("Faltas","11","bad")+card("Afastamentos","4","warn")+card("Efetivo","342")+'</div><div class="panel"><h2>Absenteísmo por área</h2><table><tr><th>Área</th><th>Efetivo</th><th>Ausentes</th><th>%</th><th>Indicador</th></tr><tr><td>Fundição</td><td>120</td><td>4</td><td>3,3%</td><td><div class="bar"><i style="width:33%"></i></div></td></tr><tr><td>Injeção</td><td>85</td><td>2</td><td>2,4%</td><td><div class="bar"><i style="width:24%"></i></div></td></tr><tr><td>Usinagem</td><td>110</td><td>5</td><td>4,5%</td><td><div class="bar"><i style="width:45%"></i></div></td></tr></table></div>'}
function quality(){return '<div class="cards">'+card("Qualidade","98,5%","good")+card("Scrap","1,5%","good")+card("Retrabalho","2,1%","warn")+card("PPM","185","warn")+card("NQ","R$ 12,4 mil","bad")+'</div><div class="section-grid"><div class="panel"><h2>Pareto de defeitos</h2><table><tr><th>Defeito</th><th>%</th><th>Representação</th></tr><tr><td>Porosidade</td><td>38%</td><td><div class="bar"><i style="width:38%"></i></div></td></tr><tr><td>Rebarba</td><td>21%</td><td><div class="bar"><i style="width:21%"></i></div></td></tr><tr><td>Trinca</td><td>15%</td><td><div class="bar"><i style="width:15%"></i></div></td></tr><tr><td>Dimensional</td><td>12%</td><td><div class="bar"><i style="width:12%"></i></div></td></tr></table></div><div class="panel"><h2>Não qualidade por processo</h2><div class="kpis"><div class="mini"><div class="label">Injeção</div><strong>42%</strong></div><div class="mini"><div class="label">Acabamento</div><strong>31%</strong></div><div class="mini"><div class="label">Usinagem</div><strong>18%</strong></div></div></div></div>'}

const SAFETY_PDF_URL="SafetyMomentWeek_Current.pdf";
let safetyPdfDoc=null;
let safetySourceCanvas=null;
let safetySelectedDay=0;
let safetyParsedDays=[];
let safetyWeekInfo={title:"Safety Moments",week:""};

function safetyTodayIndex(){
  const day=new Date().getDay();
  return day>=1&&day<=5?day-1:0;
}

function normalizeSafetyText(value){
  return String(value||"").replace(/\s+/g," ").trim();
}

function safetyTextItems(items){
  return (items||[])
    .map(item=>({
      text:normalizeSafetyText(item.str),
      x:Number(item.transform?.[4]||0),
      y:Number(item.transform?.[5]||0),
      size:Math.abs(Number(item.transform?.[3]||0))||Math.abs(Number(item.height||0))||10
    }))
    .filter(item=>item.text);
}

function groupSafetyTextLines(items){
  const usable=safetyTextItems(items);
  const rows=[];
  usable.forEach(item=>{
    let row=rows.find(r=>Math.abs(r.y-item.y)<=Math.max(1.8,item.size*.22));
    if(!row){
      row={y:item.y,size:item.size,items:[]};
      rows.push(row);
    }
    row.y=(row.y+item.y)/2;
    row.size=Math.max(row.size,item.size);
    row.items.push(item);
  });
  return rows.map(r=>{
    r.items.sort((a,b)=>a.x-b.x);
    return {
      y:r.y,
      size:r.size,
      x:r.items.length?r.items[0].x:0,
      text:normalizeSafetyText(r.items.map(i=>i.text).join(" "))
    };
  }).filter(r=>r.text).sort((a,b)=>b.y-a.y);
}

function groupSafetyColumnLines(items,left,right,maxY){
  const usable=safetyTextItems(items)
    .filter(item=>item.x>=left-3&&item.x<right+3&&(maxY===undefined||item.y<=maxY+2));
  const rows=[];
  usable.forEach(item=>{
    let row=rows.find(r=>Math.abs(r.y-item.y)<=Math.max(1.8,item.size*.22));
    if(!row){
      row={y:item.y,size:item.size,items:[]};
      rows.push(row);
    }
    row.y=(row.y+item.y)/2;
    row.size=Math.max(row.size,item.size);
    row.items.push(item);
  });
  return rows.map(r=>{
    r.items.sort((a,b)=>a.x-b.x);
    return {
      y:r.y,
      size:r.size,
      x:r.items[0]?.x||0,
      text:normalizeSafetyText(r.items.map(i=>i.text).join(" "))
    };
  }).filter(r=>r.text).sort((a,b)=>b.y-a.y);
}

function safetyDayLabel(text){
  const t=normalizeSafetyText(text).toLowerCase();
  if(t.includes("segunda"))return 0;
  if(t.includes("terça")||t.includes("terca"))return 1;
  if(t.includes("quarta"))return 2;
  if(t.includes("quinta"))return 3;
  if(t.includes("sexta"))return 4;
  return -1;
}

function splitSafetySections(lines){
  const clean=lines.map(normalizeSafetyText).filter(Boolean);
  while(clean.length&&safetyDayLabel(clean[0])>=0)clean.shift();

  const markerKey=line=>{
    const t=line.toLowerCase();
    if(/^foco\b/.test(t))return "focus";
    if(/^(pontos[ -]?principais|pontos-chave|pontos chave)\b/.test(t))return "points";
    if(/^resumo\b/.test(t))return "summary";
    if(/^(ação do dia|acao do dia|ação|acao)\b/.test(t))return "action";
    return "";
  };

  const markers=[];
  clean.forEach((line,index)=>{
    const key=markerKey(line);
    if(key)markers.push({key,index,line});
  });

  const firstMarker=markers[0]?.index??clean.length;
  let title=clean.slice(0,firstMarker).join(" ").trim();
  if(!title)title="Momento de Segurança";

  const sections={focus:[],points:[],summary:[],action:[]};
  markers.forEach((m,i)=>{
    const next=i+1<markers.length?markers[i+1].index:clean.length;
    const labelPattern=m.key==="focus"?/^foco\b[:\s-]*/i:
      m.key==="points"?/^(pontos[ -]?principais|pontos-chave|pontos chave)\b[:\s-]*/i:
      m.key==="summary"?/^resumo\b[:\s-]*/i:
      /^(ação do dia|acao do dia|ação|acao)\b[:\s-]*/i;
    const inline=m.line.replace(labelPattern,"").trim();
    if(inline)sections[m.key].push(inline);
    sections[m.key].push(...clean.slice(m.index+1,next));
  });

  // Some PDFs use title + body without explicit "Foco".
  if(!sections.focus.length&&firstMarker===clean.length&&clean.length>1){
    sections.focus=clean.slice(1);
  }

  const points=[];
  let current="";
  sections.points.forEach(line=>{
    const bullet=/^[•·▪◦\-–—]/.test(line);
    const stripped=line.replace(/^[•·▪◦\-–—]\s*/,"").trim();
    if(bullet){
      if(current)points.push(current.trim());
      current=stripped;
    }else if(current){
      current+=" "+stripped;
    }else if(stripped){
      current=stripped;
    }
  });
  if(current)points.push(current.trim());

  const focus=sections.focus.join(" ").replace(/\s+/g," ").trim();
  const summary=sections.summary.join(" ").replace(/\s+/g," ").trim();
  const action=sections.action.join(" ").replace(/\s+/g," ").trim();
  const fullText=clean.join("\n");

  return {title,focus,points,summary,action,fullText};
}

function extractSafetyWeekInfo(lines,dayHeaderY){
  const headerLines=lines.filter(l=>l.y>dayHeaderY).map(l=>l.text);
  const combined=headerLines.join(" ");
  const weekMatch=combined.match(/\bWeek of\s+[^\s]+(?:\s+\d{4})?/i);
  let title=combined.replace(/\bWeek of\s+.*$/i,"").trim();
  if(!title||title.length>120){
    title=headerLines.find(t=>/risco|seguran|mudan|trabalho|preven|aten/i.test(t)&&t.length>8)||"Safety Moments";
  }
  return {title:title||"Safety Moments",week:weekMatch?weekMatch[0]:""};
}

function parseSafetyDays(textContent,pageViewport){
  const labels=["Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira"];
  const shorts=["SEG","TER","QUA","QUI","SEX"];
  const items=safetyTextItems(textContent.items);
  const allLines=groupSafetyTextLines(textContent.items);

  // Locate weekday headers directly from PDF text items. This avoids mixing
  // sentences from neighboring columns when several lines share the same Y.
  const headersByDay=Array(5).fill(null);
  items.forEach(item=>{
    const day=safetyDayLabel(item.text);
    if(day>=0&&!headersByDay[day])headersByDay[day]=item;
  });

  if(headersByDay.every(Boolean)){
    const anchors=headersByDay.map(h=>h.x);
    const gaps=anchors.slice(1).map((x,i)=>x-anchors[i]).filter(x=>x>0);
    const typicalGap=gaps.length?gaps.reduce((a,b)=>a+b,0)/gaps.length:pageViewport.width/5;
    const gutter=Math.max(2,typicalGap*.025);

    const headerY=Math.max(...headersByDay.map(h=>h.y));
    const weekInfo=extractSafetyWeekInfo(allLines,headerY);

    const days=headersByDay.map((header,day)=>{
      const left=day===0?Math.max(0,anchors[0]-typicalGap*.08):anchors[day]-typicalGap*.08;
      const right=day<4?anchors[day+1]-gutter:Math.min(pageViewport.width,anchors[day]+typicalGap);
      const colLines=groupSafetyColumnLines(textContent.items,left,right,header.y+2)
        .map(l=>l.text)
        .filter(Boolean);

      // Ensure the weekday is the first logical line, then remove page-level bleed.
      const cleaned=colLines.filter(text=>
        !/^week\b/i.test(text)&&
        !/^safety moments?$/i.test(text)&&
        !/momento de segurança/i.test(text)&&
        !/^pequenas mudanças, risco diferente\s+week/i.test(text)
      );
      const parsed=splitSafetySections([labels[day],...cleaned.filter(t=>safetyDayLabel(t)<0)]);
      return {day,label:labels[day],short:shorts[day],...parsed};
    });

    return {days,weekInfo};
  }

  // Fallback: use five equal visual columns and still group text inside each
  // column independently, so content never crosses into another weekday.
  const topY=Math.max(...items.map(i=>i.y),0);
  const bodyCutoff=topY*.82;
  const colWidth=pageViewport.width/5;
  const days=[];

  for(let day=0;day<5;day++){
    const colLines=groupSafetyColumnLines(
      textContent.items,
      day*colWidth,
      (day+1)*colWidth,
      bodyCutoff
    ).map(l=>l.text);

    const cleaned=colLines.filter(text=>
      !/^week\b/i.test(text)&&
      !/^safety moments?$/i.test(text)&&
      !/momento de segurança/i.test(text)&&
      !/^pequenas mudanças, risco diferente/i.test(text)
    );
    days.push({day,label:labels[day],short:shorts[day],...splitSafetySections([labels[day],...cleaned])});
  }

  const usable=days.filter(d=>d.title||d.focus||d.points.length||d.summary||d.action);
  const weekInfo={
    title:(allLines.find(l=>l.y>bodyCutoff&&l.text.length>12&&!/^week\b/i.test(l.text))?.text)||"Safety Moments",
    week:(allLines.find(l=>/^week\b/i.test(l.text))?.text)||""
  };
  return {days:usable.length>=3?days:[],weekInfo};
}

function escapeSafetyHtml(value){
  return String(value||"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]));
}

function safetyThemeKey(d){
  const text=[d?.title,d?.focus,d?.summary,d?.action,...(d?.points||[])].join(" ").toLowerCase();

  if(/temporári|temporari|provisóri|provisori|interino|reparo|alternativ|desvio/.test(text))return "temporary";
  if(/pergunta|question|analis|avali|revis|confirm|verific|check|investig/.test(text))return "analysis";
  if(/proteç|protec|barreira|sensor|epi|capacete|luva|óculos|oculos|controle|guard|intertrav/.test(text))return "protection";
  if(/ferrament|dispositivo|equipamento|máquina|maquina|setup|ajuste|manuten|peça|peca/.test(text))return "tools";
  if(/mudanç|mudanc|processo|fluxo|sequência|sequencia|layout|material|rota|método|metodo/.test(text))return "change";
  return "safety";
}

function safetyThemeLabel(key){
  return ({
    change:"Mudança de processo",
    tools:"Ferramentas e dispositivos",
    protection:"Proteções e controles",
    temporary:"Mudança temporária",
    analysis:"Análise antes de executar",
    safety:"Segurança"
  })[key]||"Segurança";
}

function safetyIconSvg(d){
  const key=safetyThemeKey(d);
  const icons={
    change:'<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="28" fill="#fff1f0"/><path d="M17 42h30M20 35h17M27 28h20M20 21h17" stroke="#173a55" stroke-width="4" stroke-linecap="round"/><path d="M38 17l9 4-9 4M26 31l-9 4 9 4" fill="none" stroke="#e2231a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    tools:'<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="28" fill="#eef5fa"/><path d="M19 43l17-17 8 8-17 17z" fill="#173a55"/><path d="M36 18c4-5 11-6 16-2l-8 8 4 4 8-8c4 6 2 13-3 17-4 3-10 3-14 1l-13 13-9-9 13-13c-1-4 1-8 6-11z" fill="#2b84c6"/></svg>',
    protection:'<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="28" fill="#eaf4fb"/><path d="M32 12l17 7v12c0 12-7 19-17 23-10-4-17-11-17-23V19z" fill="#2b84c6"/><path d="M32 18v29" stroke="#fff" stroke-width="4"/><path d="M20 31h24" stroke="#173a55" stroke-width="4"/><path d="M23 27c1-7 5-11 9-11s8 4 9 11" fill="#f3a21b"/></svg>',
    temporary:'<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="28" fill="#fff7e9"/><path d="M25 14h14l8 36H17z" fill="#f3a21b"/><path d="M21 32h22M19 41h26" stroke="#fff" stroke-width="5"/><path d="M12 52h40" stroke="#173a55" stroke-width="4" stroke-linecap="round"/></svg>',
    analysis:'<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="28" fill="#eef7f2"/><circle cx="29" cy="28" r="13" fill="none" stroke="#173a55" stroke-width="5"/><path d="M39 38l12 12" stroke="#173a55" stroke-width="6" stroke-linecap="round"/><path d="M24 28l4 4 7-9" fill="none" stroke="#1c9b5f" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    safety:'<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="28" fill="#fff1f0"/><path d="M21 27h22v20H21z" fill="#173a55"/><path d="M24 26c0-7 4-12 8-12s8 5 8 12" fill="#f3a21b"/><path d="M18 27h28" stroke="#173a55" stroke-width="3"/><path d="M15 44l7-12 7 12z" fill="#e2231a"/><circle cx="22" cy="40" r="1.6" fill="#fff"/></svg>'
  };
  return icons[key]||icons.safety;
}

function safetyHeroSceneSvg(d){
  const key=safetyThemeKey(d);
  const scenes={
    change:'<svg viewBox="0 0 700 520" aria-hidden="true"><rect width="700" height="520" fill="#24495f"/><g opacity=".25" stroke="#f0b03b" stroke-width="8"><path d="M80 90h540M80 210h540M80 330h540M160 40v430M350 40v430M540 40v430"/></g><g transform="translate(390 80)"><rect x="0" y="80" width="170" height="120" rx="12" fill="#dfe8ec"/><path d="M15 120h140M15 150h90" stroke="#7a929f" stroke-width="9"/><circle cx="35" cy="175" r="13" fill="#e2231a"/><path d="M70 250h130v150H70z" fill="#bcc8cf"/><path d="M55 250c10-70 48-110 80-110s70 40 80 110" fill="#f4f6f7"/><path d="M40 255h190" stroke="#cbd4d9" stroke-width="13" stroke-linecap="round"/><path d="M92 302l-45 82 60 36zM179 301l48 83-62 35z" fill="#a9161c"/><path d="M250 90h70M285 55v70" stroke="#e2231a" stroke-width="10" stroke-linecap="round"/><path d="M250 60l35-30 35 30" fill="none" stroke="#e2231a" stroke-width="10"/></g><g transform="translate(70 345)"><rect x="0" y="0" width="250" height="92" rx="12" fill="#0f2e45" opacity=".9"/><path d="M25 46h70M115 46h110" stroke="#fff" stroke-width="9" stroke-linecap="round"/><path d="M85 25l24 21-24 21" fill="none" stroke="#f3a21b" stroke-width="8"/></g></svg>',
    tools:'<svg viewBox="0 0 700 520" aria-hidden="true"><rect width="700" height="520" fill="#234b63"/><g opacity=".22" fill="#ecf2f4"><rect x="70" y="70" width="130" height="110"/><rect x="230" y="70" width="130" height="110"/><rect x="390" y="70" width="130" height="110"/></g><g transform="translate(360 115)"><circle cx="110" cy="120" r="82" fill="#dce5e9"/><path d="M110 33c45 0 82 37 82 82h-164c0-45 37-82 82-82z" fill="#f3f5f6"/><path d="M18 118h185" stroke="#c9d4d9" stroke-width="14" stroke-linecap="round"/><path d="M48 235c28-40 66-60 108-60 45 0 84 22 112 64v160H48z" fill="#c8d2d7"/><path d="M55 274l65 125H55zM260 274l-66 125h66z" fill="#aa171c"/><text x="190" y="350" font-family="Arial" font-weight="700" font-size="42" fill="#aa171c">Astemo</text></g><g transform="translate(85 240) rotate(-8)"><path d="M32 0c34 0 62 28 62 62 0 17-7 33-19 44l52 52-23 23-53-53A62 62 0 1 1 32 0zm0 27a35 35 0 1 0 0 70 35 35 0 0 0 0-70z" fill="#e9f1f5"/><path d="M150 10l70 70-28 28-70-70z" fill="#f3a21b"/><path d="M198 74l43-43 18 18-43 43z" fill="#173a55"/></g></svg>',
    protection:'<svg viewBox="0 0 700 520" aria-hidden="true"><rect width="700" height="520" fill="#234d66"/><g opacity=".22" stroke="#7bb6d8" stroke-width="9"><path d="M70 90h560M70 210h560M70 330h560"/></g><g transform="translate(390 80)"><path d="M125 0l105 42v76c0 98-57 153-105 179-48-26-105-81-105-179V42z" fill="#2d86c3"/><path d="M125 18v245" stroke="#fff" stroke-width="12"/><path d="M65 105h120" stroke="#173a55" stroke-width="14"/><path d="M72 95c4-49 25-76 53-76 28 0 49 27 53 76" fill="#f3a21b"/><path d="M25 322h200v118H25z" fill="#dce6ea"/><path d="M45 350h75M45 382h130" stroke="#173a55" stroke-width="10"/><path d="M156 344l18 18 35-44" fill="none" stroke="#1c9b5f" stroke-width="12"/></g><g transform="translate(90 250)"><rect x="0" y="0" width="210" height="165" rx="18" fill="#eef4f7"/><circle cx="60" cy="70" r="34" fill="#173a55"/><circle cx="60" cy="70" r="16" fill="#fff"/><path d="M120 45h58M120 77h58M120 109h45" stroke="#607d8d" stroke-width="9"/></g></svg>',
    temporary:'<svg viewBox="0 0 700 520" aria-hidden="true"><rect width="700" height="520" fill="#24485e"/><path d="M70 420h560" stroke="#f3b33f" stroke-width="16" stroke-linecap="round"/><g transform="translate(110 135)"><path d="M65 0h70l52 275H13z" fill="#f3a21b"/><path d="M36 125h128M26 185h150" stroke="#fff" stroke-width="20"/><path d="M0 285h200" stroke="#173a55" stroke-width="18" stroke-linecap="round"/></g><g transform="translate(360 80)"><rect x="0" y="0" width="230" height="145" rx="16" fill="#eef4f6"/><path d="M30 45h170M30 80h110" stroke="#6e8795" stroke-width="11"/><path d="M160 95l30 30 60-70" fill="none" stroke="#e2231a" stroke-width="12"/><path d="M40 210h170v150H40z" fill="#cbd5da"/><path d="M25 210c7-58 42-95 100-95s93 37 100 95" fill="#f4f6f7"/><path d="M10 214h230" stroke="#c7d2d7" stroke-width="14" stroke-linecap="round"/></g></svg>',
    analysis:'<svg viewBox="0 0 700 520" aria-hidden="true"><rect width="700" height="520" fill="#234a62"/><g opacity=".2" fill="#d8e4e9"><circle cx="130" cy="100" r="45"/><circle cx="570" cy="95" r="38"/><rect x="80" y="360" width="540" height="70" rx="16"/></g><g transform="translate(90 110)"><circle cx="120" cy="120" r="90" fill="#eef4f7"/><circle cx="120" cy="120" r="58" fill="none" stroke="#173a55" stroke-width="20"/><path d="M165 165l82 82" stroke="#173a55" stroke-width="24" stroke-linecap="round"/><path d="M88 120l24 24 50-65" fill="none" stroke="#1c9b5f" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/></g><g transform="translate(380 145)"><rect x="0" y="0" width="220" height="270" rx="20" fill="#edf3f6"/><path d="M35 60h135M35 105h135M35 150h105M35 195h125" stroke="#657f8e" stroke-width="12"/><path d="M170 50l18 18 30-38M170 140l18 18 30-38" fill="none" stroke="#e2231a" stroke-width="10"/></g></svg>',
    safety:'<svg viewBox="0 0 700 520" aria-hidden="true"><rect width="700" height="520" fill="#234b63"/><g transform="translate(345 70)"><circle cx="140" cy="150" r="100" fill="#dce5e9"/><path d="M40 150c8-80 50-127 100-127s92 47 100 127" fill="#f4f6f7"/><path d="M20 156h240" stroke="#cbd5da" stroke-width="16" stroke-linecap="round"/><path d="M62 275c37-48 84-72 140-72 60 0 110 27 148 81v154H62z" fill="#c8d2d7"/><path d="M68 315l80 123H68zM345 315l-83 123h83z" fill="#aa171c"/></g><g transform="translate(85 190)"><path d="M105 0l95 38v68c0 89-52 139-95 163-43-24-95-74-95-163V38z" fill="#2b84c6"/><path d="M105 22v220" stroke="#fff" stroke-width="11"/><path d="M62 112l28 28 58-76" fill="none" stroke="#f3a21b" stroke-width="13"/></g></svg>'
  };
  return scenes[key]||scenes.safety;
}

function safetyPreviewText(d){
  const base=(d.focus||d.summary||d.action||"").replace(/\s+/g," ").trim();
  if(!base)return "Conteúdo do dia disponível no PDF semanal.";
  return base.length>105?base.slice(0,102).trim()+"…":base;
}

function renderSafetyCards(){
  const box=document.getElementById("safetyDayCards");
  if(!box)return;
  if(!safetyParsedDays.length){
    box.innerHTML='<div class="safety-parse-warning">Não consegui separar automaticamente os 5 dias deste PDF. Use o modo <b>Semanal</b>.</div>';
    return;
  }
  const today=safetyTodayIndex();
  box.innerHTML=safetyParsedDays.map(d=>{
    const active=d.day===safetySelectedDay?" active":"";
    const todayBadge=d.day===today?'<span class="safety-today-badge">HOJE</span>':"";
    return '<button class="safety-day-card'+active+'" data-safety-day="'+d.day+'">'+
      '<div class="safety-day-card-top"><span>'+d.short+'</span>'+todayBadge+'</div>'+
      '<div class="safety-day-icon">'+safetyIconSvg(d)+'</div>'+
      '<strong>'+escapeSafetyHtml(d.title)+'</strong>'+
      '<p class="safety-card-open">Clique para ver o conteúdo completo do dia</p>'+
    '</button>';
  }).join("");
  box.querySelectorAll("[data-safety-day]").forEach(btn=>btn.addEventListener("click",()=>{
    safetySelectedDay=Number(btn.dataset.safetyDay);
    renderSafetyCards();
    renderSafetyDetail();
  }));
}

function renderSafetyDetail(){
  const box=document.getElementById("safetyDayDetail");
  if(!box)return;
  const d=safetyParsedDays.find(x=>x.day===safetySelectedDay);
  if(!d){
    box.innerHTML='<div class="safety-parse-warning">Selecione <b>Semanal</b> para visualizar o PDF oficial.</div>';
    return;
  }

  const focus=(d.focus||"").trim();
  const points=(d.points||[]).filter(Boolean);
  const action=(d.action||"").trim();
  const summary=(d.summary||"").trim();

  const pointHtml=points.length
    ? '<ul>'+points.map(p=>'<li>'+escapeSafetyHtml(p)+'</li>').join("")+'</ul>'
    : '<p class="safety-reading-empty">Este dia não possui uma lista separada de pontos-chave no PDF.</p>';

  const heroCopy=focus||summary||action||"Conteúdo disponível abaixo na leitura completa.";
  const weekMeta=escapeSafetyHtml(safetyWeekInfo.week||"Semana atual");

  const completeSections=[
    {label:"TÍTULO",value:d.title},
    {label:"FOCO",value:focus},
    {label:"PONTOS PRINCIPAIS",value:points},
    {label:"RESUMO",value:summary},
    {label:"AÇÃO",value:action}
  ].filter(section=>Array.isArray(section.value)?section.value.length:Boolean(section.value));

  const completeHtml=completeSections.map(section=>{
    if(Array.isArray(section.value)){
      return '<div class="safety-complete-section"><h4>'+section.label+'</h4><ul>'+
        section.value.map(item=>'<li>'+escapeSafetyHtml(item)+'</li>').join("")+
      '</ul></div>';
    }
    return '<div class="safety-complete-section"><h4>'+section.label+'</h4><p>'+escapeSafetyHtml(section.value)+'</p></div>';
  }).join("");

  box.innerHTML=
    '<div class="safety-feature-grid">'+
      '<section class="safety-hero-card safety-theme-'+safetyThemeKey(d)+'">'+
        '<div class="safety-hero-visual">'+safetyHeroSceneSvg(d)+'</div>'+
        '<div class="safety-hero-overlay"></div>'+
        '<div class="safety-hero-content">'+
          '<div class="safety-hero-top"><span class="safety-weekday-pill">'+d.label.toUpperCase()+'</span><span class="safety-week-date">'+weekMeta+'</span></div>'+
          '<div class="safety-theme-chip"><span>◈</span><div><small>Tema detectado</small><b>'+escapeSafetyHtml(safetyThemeLabel(safetyThemeKey(d)))+'</b></div></div>'+
          '<h2>'+escapeSafetyHtml(d.title)+'</h2>'+
          '<i></i>'+
          '<p>'+escapeSafetyHtml(heroCopy)+'</p>'+
        '</div>'+
      '</section>'+
      '<div class="safety-reading-stack">'+
        (focus?'<section class="safety-reading-card focus-card"><div class="safety-reading-icon">◎</div><div><span>FOCO</span><h3>'+escapeSafetyHtml(d.title)+'</h3><p>'+escapeSafetyHtml(focus)+'</p></div></section>':'')+
        '<section class="safety-reading-card points-card"><div class="safety-reading-icon">⚙</div><div><span>PONTOS-CHAVE</span>'+pointHtml+'</div></section>'+
        (action?'<section class="safety-reading-card action-card"><div class="safety-reading-icon">◉</div><div><span>AÇÃO DO DIA</span><h3>Pense antes de executar</h3><p>'+escapeSafetyHtml(action)+'</p></div></section>':'')+
      '</div>'+
    '</div>'+
    (summary?'<section class="safety-summary-strip"><div class="safety-summary-icon">▣</div><div><span>RESUMO</span><p>'+escapeSafetyHtml(summary)+'</p></div></section>':'')+
    '<section class="safety-fulltext">'+
      '<div class="safety-fulltext-head"><div><span>LEITURA COMPLETA DO DIA</span><strong>'+escapeSafetyHtml(d.label)+'</strong></div><small>Conteúdo integral organizado a partir da coluna deste dia no PDF</small></div>'+
      '<div class="safety-fulltext-body">'+completeHtml+'</div>'+
    '</section>';
}

function showSafetyMode(mode){
  const dynamic=document.getElementById("safetyDynamic");
  const weekly=document.getElementById("safetyWeekly");
  const dynamicBtn=document.getElementById("safetyModeDynamic");
  const weeklyBtn=document.getElementById("safetyModeWeekly");
  const isWeekly=mode==="weekly";
  if(dynamic)dynamic.hidden=isWeekly;
  if(weekly)weekly.hidden=!isWeekly;
  if(dynamicBtn)dynamicBtn.classList.toggle("active",!isWeekly);
  if(weeklyBtn)weeklyBtn.classList.toggle("active",isWeekly);
  if(isWeekly)renderSafetyWeeklyCanvas();
}

function renderSafetyWeeklyCanvas(){
  const canvas=document.getElementById("safetyCanvas");
  if(!canvas||!safetySourceCanvas)return;
  canvas.width=safetySourceCanvas.width;
  canvas.height=safetySourceCanvas.height;
  const ctx=canvas.getContext("2d",{alpha:false});
  ctx.drawImage(safetySourceCanvas,0,0);
}

async function initSafety(){
  const dynamicBtn=document.getElementById("safetyModeDynamic");
  const weeklyBtn=document.getElementById("safetyModeWeekly");
  if(dynamicBtn)dynamicBtn.addEventListener("click",()=>showSafetyMode("dynamic"));
  if(weeklyBtn)weeklyBtn.addEventListener("click",()=>showSafetyMode("weekly"));
  safetySelectedDay=safetyTodayIndex();

  const status=document.getElementById("safetyStatus");
  if(!window.pdfjsLib){
    if(status)status.textContent="Não foi possível carregar o leitor de PDF.";
    return;
  }

  window.pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

  try{
    if(status)status.textContent="Lendo PDF semanal e organizando os dias...";
    safetyPdfDoc=await window.pdfjsLib.getDocument({url:SAFETY_PDF_URL,disableStream:false,disableAutoFetch:false}).promise;
    const page=await safetyPdfDoc.getPage(1);
    const base=page.getViewport({scale:1});
    const textContent=await page.getTextContent();
    const parsed=parseSafetyDays(textContent,base);
    safetyParsedDays=parsed.days;
    safetyWeekInfo=parsed.weekInfo;

    const targetWidth=Math.max(1200,Math.min(2200,(document.getElementById("content")?.clientWidth||1400)*1.6));
    const scale=targetWidth/base.width;
    const viewport=page.getViewport({scale});
    safetySourceCanvas=document.createElement("canvas");
    safetySourceCanvas.width=Math.ceil(viewport.width);
    safetySourceCanvas.height=Math.ceil(viewport.height);
    const ctx=safetySourceCanvas.getContext("2d",{alpha:false});
    await page.render({canvasContext:ctx,viewport}).promise;

    const title=document.getElementById("safetyWeekTitle");
    const meta=document.getElementById("safetyWeekMeta");
    if(title)title.textContent=safetyWeekInfo.title||"Safety Moments — Semana atual";
    if(meta)meta.textContent=safetyWeekInfo.week||"Conteúdo organizado automaticamente a partir do PDF semanal.";
    if(status)status.textContent=safetyParsedDays.length===5?"🟢 PDF semanal lido • visualização dinâmica pronta":"🟡 PDF carregado • use Semanal se algum conteúdo não for separado corretamente";

    renderSafetyCards();
    renderSafetyDetail();
    showSafetyMode("dynamic");
  }catch(err){
    if(status)status.innerHTML='🟠 Arquivo ainda não disponível. Envie <b>SafetyMomentWeek_Current.pdf</b> para o repositório do Gemba Vision.';
    const detail=document.getElementById("safetyDayDetail");
    if(detail)detail.innerHTML='<div class="safety-parse-warning">Aguardando o PDF semanal do Safety Moment.</div>';
  }
}

let homeYesterdayRows=[];
let homeYesterdayProductRows=[];
let homeYesterdayScrapRows=[];
let homeYesterdayContext={pitches:[],dispatches:[]};
let homeYesterdayLoading=false;

function previousDayISO(){
  const d=new Date();
  d.setDate(d.getDate()-1);
  return localIsoDate(d);
}
function nextDayISO(iso){
  const d=new Date((iso||todayISO())+"T00:00:00");
  d.setDate(d.getDate()+1);
  return localIsoDate(d);
}

function homeOperationalWindow(){
  const startDate=previousDayISO();
  const endDate=nextDayISO(startDate);
  return {
    startDate,
    endDate,
    start:startDate+" 07:00",
    end:endDate+" 07:00"
  };
}

function isFndArea(value){
  const text=String(value||"").trim().toUpperCase();
  return text==="FND"||text.startsWith("FND_")||text.includes("FUNDI");
}

function homeFndRows(rows){
  return (Array.isArray(rows)?rows:[]).filter(r=>isFndArea(r.area));
}

function homeProcessFromLine(lineName){
  const line=String(lineName||"").toUpperCase().trim();
  if(line.includes("INJETORA")||/^INJP?_?\d+/.test(line)||line.includes("INJ"))return "injecao";
  if(line.includes("ACAB")||line.startsWith("FND_ACAB"))return "acabamento";
  return "outros";
}

function homePitchProducts(pitches){
  const map={};
  (Array.isArray(pitches)?pitches:[]).forEach(p=>{
    const product=String(p.product||"").trim();
    if(!product||product==="Sem modelo")return;

    const line=String(p.line||"").trim();
    const process=homeProcessFromLine(line);
    if(process==="outros")return;

    const when=p.start?new Date(p.start):null;
    const hour=when&&!Number.isNaN(when.getTime())?when.getHours():null;
    const shift=hour===null?"":shiftFromHour(hour);
    const key=[process,shift,product].join("|");

    if(!map[key])map[key]={
      process,
      shift,
      product,
      actual:0,
      demand:0,
      lines:new Set(),
      first:null,
      last:null
    };

    const item=map[key];
    item.actual+=n(p.actual);
    item.demand+=n(p.demand);
    if(line)item.lines.add(line);

    if(when&&!Number.isNaN(when.getTime())){
      const ts=when.getTime();
      if(item.first===null||ts<item.first)item.first=ts;
      if(item.last===null||ts>item.last)item.last=ts;
    }
  });

  return Object.values(map)
    .map(x=>({...x,lines:[...x.lines]}))
    .sort((a,b)=>{
      if(a.process!==b.process)return a.process.localeCompare(b.process);
      const sa=Number(a.shift||99), sb=Number(b.shift||99);
      if(sa!==sb)return sa-sb;
      return b.actual-a.actual||a.product.localeCompare(b.product,"pt-BR",{numeric:true,sensitivity:"base"});
    });
}

function homeShiftProductGroups(pitches,process){
  const products=homePitchProducts(pitches).filter(p=>p.process===process);
  return ["1","2","3"].map(shift=>({
    shift,
    label:SHIFT_SCHEDULE[shift]?.label||shift+"º Turno",
    time:SHIFT_SCHEDULE[shift]?.time||"",
    products:products.filter(p=>p.shift===shift)
  }));
}

function homeProductSummary(rows){
  const map={};
  homeFndRows(rows).forEach(row=>{
    let products=row.products;
    if(!products)return;
    if(!Array.isArray(products)&&typeof products==="object")products=Object.values(products);
    if(!Array.isArray(products))return;

    products.forEach(p=>{
      if(!p||typeof p!=="object")return;
      const name=String(
        p.product_name??p.product??p.name??p.model??p.product_code??p.part_number??p.description??""
      ).trim();
      if(!name)return;

      if(!map[name])map[name]={name,actual:0,demand:0,lines:new Set()};
      map[name].actual+=n(p.actual??p.production_actual??p.quantity??p.qty??0);
      map[name].demand+=n(p.demand??p.production_demand??0);
      if(row.line)map[name].lines.add(row.line);
    });
  });

  return Object.values(map)
    .map(x=>({...x,lineCount:x.lines.size}))
    .sort((a,b)=>b.actual-a.actual||a.name.localeCompare(b.name,"pt-BR",{numeric:true,sensitivity:"base"}));
}

function homeDefectRows(rows){
  return (Array.isArray(rows)?rows:[]).filter(r=>{
    if(isFndArea(r.area))return true;
    const line=String(r.line||"").toUpperCase();
    return line.includes("INJETORA AL")||line.startsWith("FND_");
  });
}

function homeDefectSummary(rows,pitches=[]){
  const pitchRows=Array.isArray(pitches)?pitches:[];
  const findPitchComment=(row)=>{
    const line=String(row.line||"").trim().toUpperCase();
    const when=row.date?new Date(row.date).getTime():NaN;

    const candidates=pitchRows.filter(p=>
      String(p.line||"").trim().toUpperCase()===line &&
      String(p.comment||"").trim()
    );
    if(!candidates.length)return "";

    if(Number.isFinite(when)){
      const exact=candidates.find(p=>{
        const start=p.start?new Date(p.start).getTime():NaN;
        const end=p.end?new Date(p.end).getTime():NaN;
        return Number.isFinite(start)&&Number.isFinite(end)&&when>=start&&when<=end;
      });
      if(exact)return String(exact.comment||"").trim();
    }
    return String(candidates[0].comment||"").trim();
  };

  const map={};
  homeDefectRows(rows).forEach(r=>{
    const defect=String(r.defect||"Sem descrição").trim()||"Sem descrição";
    const pitchComment=findPitchComment(r);
    const cause=String(r.cause||pitchComment||"Sem causa registrada").trim()||"Sem causa registrada";
    const key=defect+"|"+cause;
    if(!map[key])map[key]={defect,cause,qty:0,lines:new Set(),models:new Set()};
    map[key].qty+=n(r.scrap||1);
    if(r.line)map[key].lines.add(String(r.line));
    if(r.product)map[key].models.add(String(r.product));
  });
  return Object.values(map)
    .map(x=>({...x,lines:[...x.lines],models:[...x.models]}))
    .sort((a,b)=>b.qty-a.qty);
}

function homeTimeLabel(value){
  if(!value)return "-";
  const d=new Date(value);
  if(Number.isNaN(d.getTime()))return String(value);
  return d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
}

function renderHomeEvents(){
  const el=document.getElementById("homeYesterdayEvents");
  if(!el)return;

  const pitches=(homeYesterdayContext?.pitches||[]).filter(p=>String(p.comment||"").trim());
  const dispatches=(homeYesterdayContext?.dispatches||[]).slice().sort((a,b)=>{
    const da=a.created?new Date(a.created).getTime():0;
    const db=b.created?new Date(b.created).getTime():0;
    return db-da;
  });

  const dispatchLines=new Set(dispatches.map(d=>String(d.line||"")).filter(Boolean));
  const commentLines=new Set(pitches.map(p=>String(p.line||"")).filter(Boolean));

  const dispatchHtml=dispatches.length
    ? '<div class="home-event-list home-event-list-pro">'+dispatches.map((d,i)=>{
        const reason=String(d.reason||"").trim();
        const status=String(d.status||"").trim();
        const downtime=n(d.downtime_minutes);
        const priority=i<3?"high":"normal";
        return '<article class="home-event-card dispatch '+priority+'">'+
          '<div class="home-event-rank">'+(i+1)+'</div>'+
          '<div class="home-event-main">'+
            '<div class="home-event-head"><div><span>DISPATCH #'+stockEsc(String(d.number||d.id||"-"))+'</span><h3>'+stockEsc(d.dispatch_type||"Dispatch")+'</h3></div><b>'+homeTimeLabel(d.created)+'</b></div>'+
            '<div class="home-event-meta"><span class="line">'+stockEsc(d.line||"Sem linha")+'</span>'+(d.machine?'<span>'+stockEsc(d.machine)+'</span>':'')+(status?'<span>'+stockEsc(status)+'</span>':'')+'</div>'+
            '<p>'+stockEsc(d.description||"Sem descrição registrada.")+'</p>'+
            (reason?'<div class="home-event-reason"><span>Causa / motivo</span><strong>'+stockEsc(reason)+'</strong></div>':'')+
            (downtime>0?'<div class="home-event-downtime">⏱ '+fmt(downtime)+' min de parada</div>':'')+
          '</div>'+
        '</article>';
      }).join("")+'</div>'
    : '<div class="empty-state">Nenhum Dispatch da FND encontrado para o dia anterior.</div>';

  const commentsHtml=pitches.length
    ? '<div class="home-countermeasure-list home-countermeasure-list-pro">'+pitches.map((p,i)=>
        '<article class="home-countermeasure-card">'+
          '<div class="home-countermeasure-index">'+(i+1)+'</div>'+
          '<div class="home-countermeasure-time">'+homeTimeLabel(p.start)+'</div>'+
          '<div class="home-countermeasure-copy"><span>'+stockEsc(p.line||"Sem linha")+(p.product&&p.product!=="Sem modelo"?" • "+stockEsc(p.product):"")+'</span><p>'+stockEsc(p.comment)+'</p></div>'+
          '<div class="home-countermeasure-production"><span>Real / Demanda</span><b>'+fmt(p.actual)+' / '+fmt(p.demand)+'</b></div>'+
        '</article>'
      ).join("")+'</div>'
    : '<div class="empty-state">Nenhum comentário/contramedida de pitch foi registrado na FND no dia anterior.</div>';

  el.innerHTML=
    '<div class="home-events-toolbar">'+
      '<div class="home-events-summary">'+
        '<div><span>Dispatches</span><strong>'+dispatches.length+'</strong><small>'+dispatchLines.size+' linha(s) afetada(s)</small></div>'+
        '<div><span>Contramedidas</span><strong>'+pitches.length+'</strong><small>'+commentLines.size+' linha(s) com comentário</small></div>'+
        '<div><span>Prioridade</span><strong>'+(dispatches.length?"Acompanhar":"Sem pendência")+'</strong><small>'+(dispatches.length?"Ver Dispatches primeiro":"Nenhum Dispatch no período")+'</small></div>'+
      '</div>'+
      '<div class="home-events-guide"><span>LEITURA RÁPIDA</span><b>1. Dispatches → 2. Causa/Motivo → 3. Contramedidas</b></div>'+
    '</div>'+
    '<div class="home-events-grid home-events-grid-pro">'+
      '<section class="home-events-column dispatch-column"><div class="home-events-subtitle"><div><span>MANUTENÇÃO / OCORRÊNCIAS</span><h3>Dispatches</h3></div><small>Ordenados do mais recente para o mais antigo</small></div>'+dispatchHtml+'</section>'+
      '<section class="home-events-column action-column"><div class="home-events-subtitle"><div><span>PRODUÇÃO / PASSOS</span><h3>Comentários e contramedidas</h3></div><small>Registros feitos durante os pitches</small></div>'+commentsHtml+'</section>'+
    '</div>';
}

function homeProcessMetrics(rows,process,defectRows){
  const processRows=(Array.isArray(rows)?rows:[]).filter(r=>homeProcessFromLine(r.line)===process);
  const processGroups=sortOeeCardsByLine(groupedByLine(processRows));
  const demand=total(processRows,"demand");
  const actual=total(processRows,"actual");
  const scrap=total(processRows,"scrap");
  const net=Math.max(0,actual-scrap);
  const attainment=demand?actual/demand*100:0;
  const avgOee=processGroups.length?processGroups.reduce((s,g)=>s+n(g.oee),0)/processGroups.length:0;
  const defects=homeDefectSummary(
    (Array.isArray(defectRows)?defectRows:[]).filter(r=>homeProcessFromLine(r.line)===process),
    homeYesterdayContext?.pitches||[]
  );
  const defectQty=defects.reduce((s,x)=>s+x.qty,0);
  return {rows:processRows,groups:processGroups,demand,actual,scrap,net,attainment,avgOee,defects,defectQty};
}

function homeProcessKpis(title,subtitle,metrics,processClass){
  return '<section class="home-process-kpi-group '+processClass+'">'+
    '<div class="home-process-kpi-head"><div><span>PROCESSO</span><h3>'+title+'</h3><p>'+subtitle+'</p></div><b>'+metrics.groups.length+' linha(s)</b></div>'+
    '<div class="home-process-kpi-grid">'+
      '<article class="home-exec-kpi primary"><span>Demanda</span><strong>'+fmt(metrics.demand)+'</strong><small>Planejado no período</small></article>'+
      '<article class="home-exec-kpi '+(metrics.attainment>=100?"success":metrics.attainment>=95?"attention":"critical")+'"><span>Produção real</span><strong>'+fmt(metrics.actual)+'</strong><small>'+fmtPct(metrics.attainment)+' de atingimento</small></article>'+
      '<article class="home-exec-kpi"><span>Produzido líquido</span><strong>'+fmt(metrics.net)+'</strong><small>Produção − scrap</small></article>'+
      '<article class="home-exec-kpi '+(metrics.avgOee>=85?"success":metrics.avgOee>=70?"attention":"critical")+'"><span>OEE médio</span><strong>'+fmtPct(metrics.avgOee)+'</strong><small>'+metrics.groups.length+' linha(s) monitorada(s)</small></article>'+
      '<article class="home-exec-kpi '+(metrics.defectQty>0?"critical":"success")+'"><span>Não qualidade</span><strong>'+fmt(metrics.defectQty)+'</strong><small>'+metrics.defects.length+' tipo(s) de defeito</small></article>'+
    '</div>'+
  '</section>';
}

function renderHomeYesterday(){
  if(currentPage!=="home")return;

  const windowRange=homeOperationalWindow();
  const day=windowRange.startDate;
  const dateLabel=day.split("-").reverse().join("/");
  const endLabel=windowRange.endDate.split("-").reverse().join("/");
  const title=document.getElementById("homeYesterdayTitle");
  if(title)title.textContent="Resumo FND • "+dateLabel+" 07:00 → "+endLabel+" 07:00";

  const fndRows=homeFndRows(homeYesterdayRows);
  const groups=sortOeeCardsByLine(groupedByLine(fndRows));
  const demand=total(fndRows,"demand");
  const actual=total(fndRows,"actual");
  const scrap=total(fndRows,"scrap");
  const net=Math.max(0,actual-scrap);
  const attainment=demand?actual/demand*100:0;
  const avgOee=groups.length?groups.reduce((s,g)=>s+n(g.oee),0)/groups.length:0;

  const products=homeProductSummary(homeYesterdayProductRows);
  const injectionShiftProducts=homeShiftProductGroups(homeYesterdayContext?.pitches||[],"injecao");
  const finishingShiftProducts=homeShiftProductGroups(homeYesterdayContext?.pitches||[],"acabamento");
  const defects=homeDefectSummary(homeYesterdayScrapRows,homeYesterdayContext?.pitches||[]);
  const defectQty=defects.reduce((s,x)=>s+x.qty,0);
  const injectionMetrics=homeProcessMetrics(fndRows,"injecao",homeYesterdayScrapRows);
  const finishingMetrics=homeProcessMetrics(fndRows,"acabamento",homeYesterdayScrapRows);

  const bestMachine=groups.length?[...groups].sort((a,b)=>b.oee-a.oee)[0]:null;
  const criticalMachines=groups.filter(g=>g.oee<70).length;
  const topDefect=defects[0]||null;

  const status=document.getElementById("homeYesterdayStatus");
  if(status)status.textContent=liveStamp()+" • FND • "+dateLabel+" 07:00 → "+endLabel+" 07:00";

  const kpis=document.getElementById("homeYesterdayKpis");
  if(kpis)kpis.innerHTML=
    '<div class="home-process-kpi-stack">'+
      homeProcessKpis("Injetoras","Resumo consolidado das linhas de injeção da FND.",injectionMetrics,"injection")+
      homeProcessKpis("Acabamento","Resumo consolidado das linhas de acabamento da FND.",finishingMetrics,"finishing")+
    '</div>';

  const prod=document.getElementById("homeYesterdayProduction");
  if(prod){
    const pct=Math.max(0,Math.min(100,attainment));
    const gap=actual-demand;
    prod.innerHTML=
      '<div class="home-production-hero">'+
        '<div class="home-prod-main"><span>Atingimento</span><strong class="'+(attainment>=100?"good":attainment>=95?"warn":"bad")+'">'+fmtPct(attainment)+'</strong><small>'+(gap>=0?"+":"")+fmt(gap)+' peças vs. demanda</small></div>'+
        '<div class="home-prod-pairs"><div><span>Demanda</span><strong>'+fmt(demand)+'</strong></div><div><span>Produção real</span><strong>'+fmt(actual)+'</strong></div><div><span>Scrap</span><strong>'+fmt(scrap)+'</strong></div><div><span>Líquido</span><strong>'+fmt(net)+'</strong></div></div>'+
      '</div>'+
      '<div class="home-prod-progress"><div class="home-prod-progress-head"><span>Progresso contra demanda</span><b>'+fmtPct(attainment)+'</b></div><div class="home-prod-track"><i style="width:'+pct+'%"></i><em style="left:95%"></em></div><div class="home-prod-scale"><span>0%</span><span>Meta mínima 95%</span><span>100%</span></div></div>';
  }

  const models=document.getElementById("homeYesterdayModels");
  if(models){
    const renderProcess=(title,subtitle,groups,processClass)=>{
      const count=groups.reduce((s,g)=>s+g.products.length,0);
      const actualTotal=groups.reduce((s,g)=>s+g.products.reduce((x,p)=>x+p.actual,0),0);

      return '<section class="home-process-products '+processClass+'">'+
        '<div class="home-process-products-head"><div><span>PROCESSO</span><h3>'+title+'</h3><p>'+subtitle+'</p></div><div><strong>'+count+'</strong><small>produto(s)</small><b>'+fmt(actualTotal)+' peças</b></div></div>'+
        '<div class="home-shift-product-grid">'+groups.map(group=>{
          const total=group.products.reduce((s,p)=>s+p.actual,0);
          return '<section class="home-shift-product-card shift-'+group.shift+'">'+
            '<div class="home-shift-product-head"><div><span>'+group.label+'</span><strong>'+group.time+'</strong></div><b>'+fmt(total)+' peças</b></div>'+
            (group.products.length
              ? '<div class="home-shift-product-list">'+group.products.map((p,i)=>{
                  const share=total?p.actual/total*100:0;
                  return '<div class="home-shift-product-row">'+
                    '<span class="home-model-pos">'+(i+1)+'</span>'+
                    '<div><strong>'+stockEsc(p.product)+'</strong><small>'+stockEsc(p.lines.join(", ")||"Sem linha")+' • '+fmtPct(share)+' do turno</small></div>'+
                    '<b>'+fmt(p.actual)+'</b>'+
                  '</div>';
                }).join("")+'</div>'
              : '<div class="home-shift-product-empty">Nenhum produto registrado neste turno.</div>')+
          '</section>';
        }).join("")+'</div>'+
      '</section>';
    };

    const injectionCount=injectionShiftProducts.reduce((s,g)=>s+g.products.length,0);
    const finishingCount=finishingShiftProducts.reduce((s,g)=>s+g.products.length,0);

    models.innerHTML=(injectionCount||finishingCount)
      ? '<div class="home-process-products-stack">'+
          renderProcess("Injetoras","Produtos registrados nas linhas de injeção da FND.",injectionShiftProducts,"injection")+
          renderProcess("Acabamento","Produtos registrados nas linhas FND_ACAB / acabamento.",finishingShiftProducts,"finishing")+
        '</div>'
      : (products.length
          ? '<div class="home-model-summary"><span>'+products.length+' modelo(s)</span><b>'+fmt(products.reduce((s,p)=>s+p.actual,0))+' peças</b></div>'+
            '<div class="home-model-list">'+products.slice(0,12).map((p,i)=>'<div class="home-model-row"><span class="home-model-pos">'+(i+1)+'</span><div class="home-model-copy"><strong>'+stockEsc(p.name)+'</strong><small>'+p.lineCount+' linha(s)</small></div><b>'+fmt(p.actual)+'</b></div>').join("")+'</div>'
          : '<div class="empty-state">Nenhum produto foi identificado nos pitches da FND para a janela operacional 07:00 → 07:00.</div>');
  }

  const oee=document.getElementById("homeYesterdayOee");
  if(oee){
    oee.innerHTML=groups.length
      ? '<div class="home-machine-summary">'+
          '<div><span>Melhor OEE</span><strong>'+(bestMachine?stockEsc(bestMachine.line)+" • "+fmtPct(bestMachine.oee):"-")+'</strong></div>'+
          '<div><span>Máquinas críticas</span><strong>'+criticalMachines+'</strong></div>'+
          '<div><span>Referência</span><strong>85% OEE</strong></div>'+
        '</div>'+
        '<div class="home-machine-grid">'+groups.map(g=>{
          const cls=g.oee>=85?"good":g.oee>=70?"warn":"bad";
          const status=g.oee>=85?"Dentro da meta":g.oee>=70?"Atenção":"Crítico";
          return '<article class="home-machine-card '+cls+'">'+
            '<div class="home-machine-head"><div><span>'+stockEsc(g.area||"FND")+'</span><h3>'+stockEsc(g.line)+'</h3></div><span class="home-machine-status '+cls+'">'+status+'</span></div>'+
            '<div class="home-machine-oee-main"><span>OEE DA LINHA</span><strong>'+fmtPct(g.oee)+'</strong><small>Meta de referência: 85%</small></div>'+
            '<div class="home-machine-bar"><i style="width:'+Math.min(100,Math.max(0,g.oee))+'%"></i></div>'+
            '<div class="home-machine-metrics"><div><span>OA</span><strong>'+fmtPct(g.availability)+'</strong></div><div><span>PPP</span><strong>'+fmtPct(g.performance)+'</strong></div><div><span>Yield</span><strong>'+fmtPct(g.quality)+'</strong></div><div><span>Produção</span><strong>'+fmt(g.actual)+' / '+fmt(g.demand)+'</strong></div></div>'+
          '</article>';
        }).join("")+'</div>'
      : '<div class="empty-state">Nenhuma máquina da FND encontrada no resumo do dia anterior.</div>';
  }

  const defectsEl=document.getElementById("homeYesterdayDefects");
  if(defectsEl){
    defectsEl.innerHTML=defects.length
      ? '<div class="home-defect-summary home-defect-summary-two">'+
          '<div><span>Total</span><strong>'+fmt(defectQty)+'</strong><small>ocorrências/peças</small></div>'+
          '<div><span>Principal defeito</span><strong>'+stockEsc(topDefect?.defect||"-")+'</strong><small>'+fmt(topDefect?.qty||0)+' registro(s)</small></div>'+
        '</div>'+
        '<div class="table-scroll"><table class="home-defect-table"><thead><tr><th>Prioridade</th><th>Defeito</th><th>Linha(s)</th><th>Modelo(s)</th><th>Qtd.</th></tr></thead><tbody>'+
        defects.map((d,i)=>'<tr><td><span class="defect-priority p'+Math.min(3,i+1)+'">'+(i+1)+'</span></td><td><span class="defect-chip">'+stockEsc(d.defect)+'</span></td><td>'+stockEsc(d.lines.join(", ")||"-")+'</td><td>'+stockEsc(d.models.join(", ")||"-")+'</td><td><b>'+fmt(d.qty)+'</b></td></tr>').join("")+
        '</tbody></table></div>'
      : '<div class="empty-state home-empty-good"><strong>Sem não qualidade registrada.</strong><br>Nenhum defeito/scrap da FND foi encontrado no L2L para o dia anterior.</div>';
  }

  renderHomeEvents();
}

async function refreshHomeYesterday(){
  if(homeYesterdayLoading)return;
  homeYesterdayLoading=true;
  const status=document.getElementById("homeYesterdayStatus");
  if(status)status.textContent="🟡 Consultando FND • janela operacional 07:00 → 07:00...";

  const windowRange=homeOperationalWindow();
  try{
    const [summaryResult,productResult,scrapResult,contextResult]=await Promise.allSettled([
      window.L2L.getOeeSummaryWindow(windowRange.start,windowRange.end),
      window.L2L.getDailyWindow(windowRange.start,windowRange.end),
      window.L2L.getScrapDetailsWindow(windowRange.start,windowRange.end),
      window.L2L.getHomeContextWindow(windowRange.start,windowRange.end)
    ]);

    homeYesterdayRows=summaryResult.status==="fulfilled"?summaryResult.value:[];
    homeYesterdayProductRows=productResult.status==="fulfilled"?productResult.value:[];
    homeYesterdayScrapRows=scrapResult.status==="fulfilled"?scrapResult.value:[];
    homeYesterdayContext=contextResult.status==="fulfilled"?contextResult.value:{pitches:[],dispatches:[]};

    if(summaryResult.status==="rejected")throw summaryResult.reason;
    l2lLastUpdate=new Date();
    if(currentPage==="home")renderHomeYesterday();
  }catch(err){
    if(status)status.textContent="🔴 Não foi possível carregar o resumo FND 07:00 → 07:00: "+(err.message||"falha no L2L");
    if(currentPage==="home")renderHomeYesterday();
  }finally{
    homeYesterdayLoading=false;
  }
}

function initHome(){
  renderHomeYesterday();
  refreshHomeYesterday();
}

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
    if(currentPage==="home")await refreshHomeYesterday();
    if(currentPage==="oee"){
      await refreshOeeRange();
      await refreshOeeHeatmap(true);
    }
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

function weightedMetric(rows,key,weightKey){
  let weighted=0,totalWeight=0;
  rows.forEach(r=>{
    const value=n(r[key]);
    const weight=Math.max(0,n(r[weightKey]));
    if(weight>0){
      weighted+=value*weight;
      totalWeight+=weight;
    }
  });
  if(totalWeight>0)return weighted/totalWeight;
  const values=rows.map(r=>n(r[key])).filter(Number.isFinite);
  return values.length?values.reduce((a,b)=>a+b,0)/values.length:0;
}

function groupedByLine(rows){
  const map={};

  rows.forEach(r=>{
    const key=r.line||"Sem linha";
    if(!map[key])map[key]={
      line:key,
      area:r.area||"",
      rows:[],
      demand:0,
      actual:0,
      scrap:0,
      plannedMinutes:0,
      downtimeMinutes:0,
      theoreticalParts:0
    };

    const g=map[key];
    g.rows.push(r);
    g.demand+=n(r.demand);
    g.actual+=n(r.actual);
    g.scrap+=n(r.scrap);
    g.plannedMinutes+=n(r.planned_production_minutes);
    g.downtimeMinutes+=n(r.downtime_minutes);
    g.theoreticalParts+=n(r.theoretical_parts);
  });

  return Object.values(map).map(g=>{
    if(g.rows.length===1){
      const r=g.rows[0];
      return {
        line:g.line,
        area:g.area,
        demand:g.demand,
        actual:g.actual,
        scrap:g.scrap,
        oee:n(r.overall_equipment_effectiveness),
        availability:n(r.operational_availability),
        performance:n(r.ppp),
        quality:n(r.yield),
        source:"L2L"
      };
    }

    const availability=g.plannedMinutes>0
      ? Math.max(0,(g.plannedMinutes-g.downtimeMinutes)/g.plannedMinutes*100)
      : 0;

    const performance=g.theoreticalParts>0
      ? (g.actual+g.scrap)/g.theoreticalParts*100
      : weightedMetric(g.rows,"ppp","planned_production_minutes");

    const quality=(g.actual+g.scrap)>0
      ? g.actual/(g.actual+g.scrap)*100
      : weightedMetric(g.rows,"yield","planned_production_minutes");

    const oee=(availability*performance*quality)/10000;

    return {
      line:g.line,
      area:g.area,
      demand:g.demand,
      actual:g.actual,
      scrap:g.scrap,
      oee,
      availability,
      performance,
      quality,
      source:"Agregado"
    };
  }).sort((a,b)=>a.line.localeCompare(b.line));
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

  if(page==="home")renderHomeYesterday();

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
  if(page==="home")initHome();
  if(page==="stock")initStock();
  if(page==="oee")initOee();
  if(page==="heatmap")initHeatmap();
  if(page==="production")initProduction();
  if(page==="safety")initSafety();
  applyLiveData(page);
}
document.querySelectorAll(".nav").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".nav").forEach(x=>x.classList.remove("active"));b.classList.add("active");render(b.dataset.page)}));
function tick(){const d=new Date();document.getElementById("date").textContent=d.toLocaleDateString("pt-BR",{weekday:"long",day:"2-digit",month:"long",year:"numeric"});document.getElementById("time").textContent=d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
render("home");tick();setInterval(tick,1000);refreshL2L();setInterval(refreshL2L,60000);
