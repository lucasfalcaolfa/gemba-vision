/* Consolidated DIRECT L2L API — server-side only.
 * GET /api/l2l-all?start=YYYY-MM-DD%20HH:mm&end=YYYY-MM-DD%20HH:mm
 * Header: Authorization: Bearer <POWERBI_API_TOKEN>
 * Returns source datasets without inferring inventory or fabricating missing values.
 */
const {timingSafeEqual}=require("node:crypto");
const ENDPOINTS={
 production:"/api/1.0/reporting/production/daily_summary_data_by_line/",
 oee_sites:"/api/1.0/reporting/production/oee_sites/",
 sites:"/api/1.0/sites/",
 products:"/api/1.0/productcomponents/",
 lines:"/api/1.0/lines/",
 areas:"/api/1.0/areas/",
 pitches:"/api/1.0/pitches/",
 dispatch_types:"/api/1.0/dispatchtypes/",
 dispatches:"/api/1.0/dispatches/",
 scrap_details:"/api/1.0/scrapdetail/",
 scrap_categories:"/api/1.0/scrapcategory/",
 shifts:"/api/1.0/resourceshifts/"
};
const isRecord=x=>x&&typeof x==="object"&&!Array.isArray(x);
function constantEqual(a,b){
 const x=Buffer.from(String(a||"")),y=Buffer.from(String(b||""));
 return x.length===y.length&&x.length>0&&timingSafeEqual(x,y);
}
module.exports=async function handler(req,res){
 res.setHeader("Cache-Control","private, no-store");
 if(req.method!=="GET")return res.status(405).json({success:false,error:"Method not allowed"});
 const key=process.env.POWERBI_API_TOKEN;
 if(!key||key.length<32)return res.status(503).json({success:false,error:"Set POWERBI_API_TOKEN (32+ chars) in Vercel environment."});
 const authorization=String(req.headers?.authorization||"");
 if(!authorization.startsWith("Bearer ")||!constantEqual(authorization.slice(7),key))
  return res.status(401).json({success:false,error:"Unauthorized"});
 const base=String(process.env.L2L_BASE_URL||"").replace(/\/$/,"");
 const auth=process.env.L2L_API_KEY,siteCode=process.env.L2L_SITE_CODE;
 if(!/^https:\/\//.test(base)||!auth||!siteCode)
  return res.status(503).json({success:false,error:"L2L_BASE_URL, L2L_API_KEY or L2L_SITE_CODE is not configured."});
 const start=String(req.query?.start||"").trim(),end=String(req.query?.end||"").trim();
 const regex=/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
 const first=new Date(start.replace(" ","T")),last=new Date(end.replace(" ","T"));
 if(!regex.test(start)||!regex.test(end)||!Number.isFinite(first.getTime())||!Number.isFinite(last.getTime())||first>=last||last-first>86400000)
  return res.status(400).json({success:false,error:"Use start/end YYYY-MM-DD HH:mm, with up to 24 hours per request."});
 const selected=String(req.query?.include||"all").split(",").map(x=>x.trim()).filter(Boolean);
 if(selected.some(x=>x!=="all"&&!Object.hasOwn(ENDPOINTS,x)))
  return res.status(400).json({success:false,error:"Unknown dataset requested.",available:Object.keys(ENDPOINTS)});
 const names=selected.includes("all")?Object.keys(ENDPOINTS):[...new Set(selected)];
 async function get(path,params){
  const url=new URL(base+path);
  for(const [name,value] of Object.entries(params||{}))if(value!==undefined&&value!==null&&value!=="")url.searchParams.set(name,String(value));
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),18000);
  try{
   const response=await fetch(url,{headers:{L2LAUTH:auth,Accept:"application/json"},signal:controller.signal});
   if(!response.ok)throw new Error("L2L HTTP "+response.status);
   const body=await response.json();
   if(body?.success===false)throw new Error("L2L rejected this query");
   return body;
  }finally{clearTimeout(timer)}
 }
 // Master-data and row APIs can require numeric site ID; daily summary uses site code.
 let numericSite=String(process.env.L2L_SITE_ID||"").trim();
 const failures={};
 if(!/^\d+$/.test(numericSite)){
  try{
   const payload=await get(ENDPOINTS.sites,{limit:2000});
   const sites=Array.isArray(payload?.data)?payload.data:[];
   const match=sites.find(s=>[s.code,s.name,s.externalid,s.external_id].some(v=>String(v||"").toLowerCase()===String(siteCode).toLowerCase()));
   if(match?.id!=null)numericSite=String(match.id);
  }catch(err){failures.site_resolution=String(err.message||err)}
 }
 if(!/^\d+$/.test(numericSite)){
  try{
   const payload=await get(ENDPOINTS.production,{site:siteCode,start,end});
   const row=(Array.isArray(payload?.data)?payload.data:[]).find(r=>r.site!=null);
   if(row)numericSite=String(row.site);
  }catch(err){failures.site_resolution=String(err.message||err)}
 }
 if(!/^\\d+$/.test(numericSite) && names.some(name=>!["sites","production","oee_sites"].includes(name))){
  return res.status(502).json({success:false,error:"Numeric L2L site ID could not be resolved. Set L2L_SITE_ID in Vercel.",errors:failures});
 }
 const timeStart=start.replace(" ","T")+":00",timeEnd=end.replace(" ","T")+":00";
 const timeSeries=new Set(["pitches","dispatches","scrap_details"]);
 const executions=await Promise.allSettled(names.map(async name=>{
   const daily=name==="production"||name==="oee_sites";
   const params=daily?{site:siteCode,start,end,show_shifts:true,show_products:true}:
    {site:/^\d+$/.test(numericSite)?numericSite:undefined,limit:2000};
   if(timeSeries.has(name)){
     Object.assign(params,{start__gte:timeStart,start__lt:timeEnd,limit:2000});
   }
   const raw=await get(ENDPOINTS[name],params);
   const data=Array.isArray(raw?.data)?raw.data:(isRecord(raw?.data)?raw.data:[]);
   const count=Array.isArray(data)?data.length:null;
   return {source:ENDPOINTS[name],data,count,possibly_truncated:count===2000,
     next_page:raw?.next??raw?.next_page??null};
 }));
 const datasets={};
 executions.forEach((item,i)=>{
  const name=names[i];
  if(item.status==="fulfilled")datasets[name]=item.value;
  else failures[name]=String(item.reason?.message||"Fetch failed");
 });
 if(!Object.keys(datasets).length)return res.status(502).json({success:false,error:"No L2L endpoints returned data.",errors:failures});
 return res.status(200).json({
  success:true,partial:Object.keys(failures).length>0,
  source:"L2L direct server-to-server",window:{start,end,endExclusive:true},
  site:siteCode,generated_at:new Date().toISOString(),
  datasets,errors:failures,
  warnings:["Some record endpoints may not support these time filters; validate timestamps before aggregation.",
   "Results may be truncated at 2000 records; check possibly_truncated/next_page.",
   "Do not add production and pitch totals together; they may represent the same parts.",
   "Physical inventory requires opening balances and model reconciliation."]
 });
};
