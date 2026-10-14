/**
 * GET /api/powerbi?start=YYYY-MM-DD%20HH:mm&end=YYYY-MM-DD%20HH:mm
 * Private server-side aggregation. Requires POWERBI_API_TOKEN in Vercel.
 * Authorization: Bearer <token>. Never put credentials in the URL.
 * Reuses the existing L2L server proxy; raw L2L secrets never leave Vercel.
 */
const { timingSafeEqual } = require("node:crypto");
const l2lHandler = require("./l2l");
function equalToken(input,expected){
  const a=Buffer.from(String(input||"")), b=Buffer.from(String(expected||""));
  return a.length===b.length && a.length>0 && timingSafeEqual(a,b);
}
function invoke(report,start,end){
  return new Promise((resolve,reject)=>{
    let complete=false;
    const res={
      statusCode:200,
      setHeader(){return this;},
      status(code){this.statusCode=code;return this;},
      json(body){
        if(complete)return this;
        complete=true;
        if(this.statusCode>=400||body?.success===false){
          const err=new Error(body?.error||"L2L unavailable");err.status=this.statusCode;reject(err);
        }else resolve(body?.data??[]);
        return this;
      }
    };
    Promise.resolve(l2lHandler({method:"GET",query:{report,start,end,show_shifts:"1",show_products:"1"}},res))
      .catch(reject);
  });
}
module.exports=async function handler(req,res){
  res.setHeader("Cache-Control","private, no-store");
  res.setHeader("Content-Type","application/json; charset=utf-8");
  if(req.method!=="GET")return res.status(405).json({success:false,error:"Method not allowed"});
  const secret=process.env.POWERBI_API_TOKEN;
  if(!secret||secret.length<32)return res.status(503).json({success:false,error:"Power BI API access has not been configured by the administrator."});
  const auth=String(req.headers?.authorization||"");
  if(!auth.startsWith("Bearer ")||!equalToken(auth.slice(7),secret))return res.status(401).json({success:false,error:"Unauthorized"});
  const start=String(req.query?.start||"").trim(),end=String(req.query?.end||"").trim();
  const pattern=/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
  if(!pattern.test(start)||!pattern.test(end)||start>=end)return res.status(400).json({success:false,error:"Provide valid start and end as YYYY-MM-DD HH:mm with start before end"});
  const a=new Date(start.replace(" ","T")),b=new Date(end.replace(" ","T"));
  if(!Number.isFinite(a.getTime())||!Number.isFinite(b.getTime())||b-a>7*86400000)
    return res.status(400).json({success:false,error:"Range is limited to seven days per request."});
  const reports=["daily","stockpitches","scrapdetail","homecontext","productcatalog"];
  const result=await Promise.allSettled(reports.map(report=>invoke(report,start,end)));
  const output={},errors={};
  result.forEach((x,i)=>{if(x.status==="fulfilled")output[reports[i]]=x.value;else errors[reports[i]]=String(x.reason?.message||"Unavailable");});
  if(!Object.keys(output).length)return res.status(502).json({success:false,error:"No L2L datasets could be retrieved.",sources:errors});
  const rows=Array.isArray(output.daily)?output.daily:[];
  const sum=key=>rows.reduce((a,r)=>a+(Number(r?.[key])||0),0);
  const demand=sum("demand"),actual=sum("actual"),scrap=sum("scrap");
  const products=Array.isArray(output.stockpitches)?output.stockpitches:[];
  const defects=Array.isArray(output.scrapdetail)?output.scrapdetail:[];
  const context=output.homecontext&&typeof output.homecontext==="object"?output.homecontext:{pitches:[],dispatches:[]};
  return res.status(200).json({
    success:true,partial:Object.keys(errors).length>0,
    window:{start,end,endExclusive:true},
    generated_at:new Date().toISOString(),
    sources:errors,
    kpis:{demand,actual,scrap,attainment_percent:demand?100*actual/demand:null,
      scrap_percent:actual?100*scrap/actual:null,ppm:actual?1e6*scrap/actual:null},
    datasets:{
      production:rows,
      stock_pitches:products,
      scrap_details:defects,
      pitches:Array.isArray(context.pitches)?context.pitches:[],
      dispatches:Array.isArray(context.dispatches)?context.dispatches:[],
      product_catalog:Array.isArray(output.productcatalog)?output.productcatalog:[]
    },
    stock_notice:"Stock balances are NOT established by this endpoint: opening inventory and model reconciliation are required.",
    notes:["Returned values reflect L2L records for the selected range.","Missing product IDs remain unattributed; do not duplicate totals."]
  });
};
