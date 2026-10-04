import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const BASE="https://ahmedsaturki.github.io/numuw-studio/";
const NAV=["","solutions/","industries/","tools/","products/","pages/proof/","pages/"];
const FAIL=[],WARN=[];
const files=[];
function walk(dir){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if([".git","node_modules",".autoresearch"].includes(e.name)) continue;
    const f=path.join(dir,e.name);
    if(e.isDirectory()) walk(f); else files.push(path.relative(ROOT,f).split(path.sep).join("/"));
  }
}
function attrs(tag){
  const out={};
  for(const m of tag.matchAll(/([A-Za-z_:][A-Za-z0-9_:.-]*)\s*=\s*["']([^"']*)["']/g)) out[m[1].toLowerCase()]=m[2];
  return out;
}
function tagList(h,name){return h.match(new RegExp("<"+name+"\\b[^>]*>","gi"))||[];}
function route(file){return BASE+(file==="index.html"?"":file.replace(/\/index\.html$/,"/"));}
const BASE_URL=new URL(BASE);
function target(file,ref,set){
  const raw=ref.split("#")[0].split("?")[0];
  if(!raw || raw.startsWith("//") || /^[a-z][a-z0-9+.-]*:/i.test(raw)) return null;
  const base=new URL(route(file));
  const resolved=new URL(raw,base);
  if(resolved.origin!==BASE_URL.origin) return null;
  const prefix=BASE_URL.pathname.endsWith("/")?BASE_URL.pathname.slice(0,-1):BASE_URL.pathname;
  if(!resolved.pathname.startsWith(prefix)) return null;
  let p=resolved.pathname.slice(prefix.length).replace(/^\/+/,"");
  if(p==="") p="index.html";
  if(p.endsWith("/")) p+="index.html";
  if(!path.posix.extname(p) && set.has(p+"/index.html")) p+="/index.html";
  return p;
}
function navKey(p){
  if(p==="index.html") return "";
  if(p.endsWith("/index.html")) return p.slice(0,-10)+"/";
  return p;
}
walk(ROOT); files.sort();
const set=new Set(files);
const html=files.filter(f=>f.endsWith(".html"));
const pages=html.filter(f=>f!=="404.html");
const bodies=new Map(html.map(f=>[f,fs.readFileSync(path.join(ROOT,f),"utf8")]));
const inbound=new Map(pages.map(f=>[f,0]));
const titleSeen=new Map(),descSeen=new Map();

for(const file of html){
  const h=bodies.get(file), notFound=file==="404.html";
  const titleTags=h.match(/<title\b[^>]*>[\s\S]*?<\/title>/gi)||[];
  const title=(titleTags[0]||"").replace(/<[^>]+>/g,"").trim();
  const metas=tagList(h,"meta");
  const desc=metas.filter(t=>(attrs(t).name||"").toLowerCase()==="description");
  const links=tagList(h,"a");
  const canonical=tagList(h,"link").filter(t=>String(attrs(t).rel||"").toLowerCase().split(/\s+/).includes("canonical"));
  const htmlTag=h.match(/<html\b[^>]*>/i)?.[0]||"";
  if(!/^<!doctype html>/i.test(h)) FAIL.push(file+": missing doctype");
  if(titleTags.length!==1||!title) FAIL.push(file+": invalid title");
  if(!notFound&&desc.length!==1) FAIL.push(file+": description count");
  if(!notFound&&canonical.length!==1) FAIL.push(file+": canonical count");
  if(!attrs(htmlTag).lang) FAIL.push(file+": lang missing");
  if(!/\bdir\s*=\s*["'](rtl|ltr)["']/i.test(htmlTag)) FAIL.push(file+": dir missing");
  if(!/<main\b/i.test(h)) FAIL.push(file+": main missing");
  if(!notFound&&(h.match(/<h1\b/gi)||[]).length!==1) FAIL.push(file+": H1 count");
  if(notFound&&!/name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(h)) FAIL.push(file+": 404 must be noindex");

  if(!notFound){
    const can=attrs(canonical[0]).href||"";
    if(can!==route(file)) FAIL.push(file+": canonical mismatch");
    const required=[["property","og:type"],["property","og:site_name"],["property","og:title"],["property","og:description"],["property","og:url"],["property","og:image"],["name","twitter:card"],["name","twitter:title"],["name","twitter:description"],["name","twitter:image"]];
    for(const pair of required) if(!metas.some(t=>{const a=attrs(t);return (a[pair[0]]||"").toLowerCase()===pair[1] && !!a.content;})) FAIL.push(file+": missing "+pair[1]);
    const og=metas.find(t=>(attrs(t).property||"").toLowerCase()==="og:url");
    if(og && (attrs(og).content||"")!==can) FAIL.push(file+": og:url mismatch");
    if((attrs(desc[0]).content||"").length<50) WARN.push(file+": short meta description");
    titleSeen.set(title.toLowerCase(),[...(titleSeen.get(title.toLowerCase())||[]),file]);
    descSeen.set((attrs(desc[0]).content||"").trim().toLowerCase(),[...(descSeen.get((attrs(desc[0]).content||"").trim().toLowerCase())||[]),file]);
  }

  const ids=new Set();
  for(const m of h.matchAll(/\bid=["']([^"']+)["']/gi)){if(ids.has(m[1])) FAIL.push(file+": duplicate id="+m[1]);ids.add(m[1]);}
  for(const img of tagList(h,"img")) if(!/\balt\s*=\s*["'][^"']*["']/i.test(img)) FAIL.push(file+": img alt missing");
  if(/<[^>]+\s+on[a-z]+\s*=/i.test(h)) FAIL.push(file+": inline event handler");
  if(/<script\b[^>]*src=["']https?:\/\//i.test(h)) FAIL.push(file+": external script");
  if(/<link\b[^>]*rel=["'][^"']*stylesheet[^"']*["'][^>]*href=["']https?:\/\//i.test(h)) FAIL.push(file+": external stylesheet");

  const nav=h.match(/<nav\b[^>]*>[\s\S]*?<\/nav>/i)?.[0]||"";
  if(!notFound && !/data-nav|class=["'][^"']*navlinks/i.test(nav)) FAIL.push(file+": canonical nav missing");
  if(!notFound){
    const currentUrl=new URL(route(file));
    const expectedUrls=NAV.map(function(p){return new URL(p||"./",BASE).href;});
    const navUrls=[...nav.matchAll(/<a\b[^>]*href=["']([^"']+)/gi)].map(function(m){try{return new URL(m[1],currentUrl).href;}catch{return null;}}).filter(Boolean);
    for(const e of expectedUrls) if(!navUrls.includes(e)) FAIL.push(file+": nav missing "+e);
    const expectedStart=new URL(file==="start/index.html"?"./":(file==="index.html"?"start/":"../".repeat(file.split("/").length-1)+"start/"),currentUrl).href;
    if(!h.includes('href="'+(file==="index.html"?"start/":"../".repeat(file.split("/").length-1)+"start/")+'"') && file!=="start/index.html"){
      FAIL.push(file+": Start CTA missing from header");
    }
  }

  for(const a of links){
    const aa=attrs(a);
    if((aa.target||"")==="_blank"&&!String(aa.rel||"").toLowerCase().split(/\s+/).includes("noopener")) FAIL.push(file+": _blank without noopener");
  }
  for(const ref of [...h.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map(m=>m[1])){
    const t=target(file,ref,set);
    if(t&&!set.has(t)) FAIL.push(file+": broken local reference -> "+ref);
    if(ref.startsWith("#")&&ref.length>1&&!ids.has(ref.slice(1))) FAIL.push(file+": broken anchor "+ref);
    if(t&&t!==file&&inbound.has(t)) inbound.set(t,inbound.get(t)+1);
  }

  const controls=[...tagList(h,"input"),...tagList(h,"select"),...tagList(h,"textarea")];
  for(const c of controls){
    const a=attrs(c); if((a.type||"").toLowerCase()==="hidden") continue;
    if(!a.id) WARN.push(file+": form control without id");
  }
  for(const b of tagList(h,"button")){
    const a=attrs(b);
    if(!a.type && /<form\\b/i.test(h)) WARN.push(file+": button in form without explicit type");
    if(a["aria-controls"]){
      for(const targetId of String(a["aria-controls"]).split(/\\s+/).filter(Boolean)){
        if(!ids.has(targetId)) FAIL.push(file+": aria-controls target missing #"+targetId);
      }
    }
  }

  const schemas=[...h.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  if(!notFound&&schemas.length===0) FAIL.push(file+": JSON-LD missing");
  for(const s of schemas){try{JSON.parse(s[1]);}catch{FAIL.push(file+": invalid JSON-LD");}}
  
  const headings=[...h.matchAll(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi)]
    .map(m=>m[1].replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim().toLowerCase());
  if(file.startsWith("products/")&&file!=="products/index.html"){
    const has=r=>headings.some(x=>r.test(x))||r.test(h);
    const req=[
      [/مناسب|fit/i,"fit"],
      [/لا نبدأ|non[-\\s]?fit|غير مناسب/i,"non-fit"],
      [/داخل النطاق|خارج النطاق|boundar|scope|مخرجات|deliverables/i,"scope"],
      [/قبول|acceptance/i,"acceptance"],
      [/ملكية|ownership/i,"ownership"],
      [/دعم|support/i,"support"],
      [/next|التالي|ابدأ|ناقش|اطلب|تواصل/i,"next action"]
    ];
    const missing=req.filter(x=>!has(x[0])).map(x=>x[1]);
    if(missing.length) FAIL.push(file+": incomplete product contract ("+missing.join(", ")+")");
  }
  if(file.startsWith("tools/")&&file!=="tools/index.html"){
    const has=r=>headings.some(x=>r.test(x))||r.test(h);
    const req=[
      [/purpose|الغرض/i,"purpose"],
      [/inputs?\\s*(?:&|and)\\s*assumptions|الافتراضات|inputs/i,"inputs/assumptions"],
      [/limits?\\s*(?:&|and)\\s*privacy|الحدود والخصوصية|الحدود/i,"limits/privacy"],
      [/next action|الخطوة التالية/i,"next action"]
    ];
    const missing=req.filter(x=>!has(x[0])).map(x=>x[1]);
    if(missing.length) FAIL.push(file+": incomplete tool contract ("+missing.join(", ")+")");
  }
}
for(const [k,v] of titleSeen) if(v.length>1) FAIL.push(v[0]+": duplicate title");
for(const [k,v] of descSeen) if(k&&v.length>1) FAIL.push(v[0]+": duplicate description");

const sitemap=fs.existsSync(path.join(ROOT,"sitemap.xml"))?fs.readFileSync(path.join(ROOT,"sitemap.xml"),"utf8"):"";
const locs=[...sitemap.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map(m=>m[1].trim());
const uniqueLocs=new Set(locs);
if(uniqueLocs.size!==locs.length) FAIL.push("sitemap contains duplicate <loc> entries");
for(const p of pages) if(!locs.includes(route(p))) FAIL.push("sitemap missing "+route(p));
for(const u of locs){
  if(!u.startsWith(BASE)) FAIL.push("sitemap non-canonical "+u);
  const rel=u.slice(BASE.length), t=rel===""?"index.html":rel.endsWith("/")?rel+"index.html":rel;
  if(!set.has(t)&&!set.has(rel)) FAIL.push("sitemap target missing "+u);
}
if(locs.some(u=>/\/404\.html$/i.test(u))) FAIL.push("sitemap lists 404");

for(const file of files.filter(f=>f.endsWith(".css"))){
  const css=fs.readFileSync(path.join(ROOT,file),"utf8");
  if(/@import\s+(?:url\()?["']?https?:\/\//i.test(css)) FAIL.push(file+": remote CSS @import detected");
  if(/url\(\s*["']?https?:\/\//i.test(css)) FAIL.push(file+": remote CSS asset dependency detected");
}

const robots=fs.existsSync(path.join(ROOT,"robots.txt"))?fs.readFileSync(path.join(ROOT,"robots.txt"),"utf8"):"";
if(!/Sitemap:\s*https:\/\/ahmedsaturki\.github\.io\/numuw-studio\/sitemap\.xml/i.test(robots)) FAIL.push("robots sitemap declaration missing");
if(!fs.existsSync(path.join(ROOT,"SECURITY.md"))) FAIL.push("SECURITY.md missing");
if(!fs.existsSync(path.join(ROOT,".well-known/security.txt"))) FAIL.push("security.txt missing");

for(const p of ["solutions/index.html","industries/index.html","start/index.html"]) if(!set.has(p)) FAIL.push(p+": required hub missing");
for(const [p,n] of inbound) if(!["index.html","solutions/index.html","industries/index.html","tools/index.html","products/index.html"].includes(p)&&n===0) WARN.push(p+": orphaned from local HTML links");

console.log("NUMUW WHOLE-SYSTEM AUDIT");
console.log("HTML pages: "+pages.length);
console.log("Sitemap locs: "+locs.length);
console.log("Failures: "+FAIL.length);
console.log("Warnings: "+WARN.length);
WARN.forEach(x=>console.warn("WARN:",x));
FAIL.forEach(x=>console.error("FAIL:",x));
if(FAIL.length) process.exit(1);
console.log("PASS: whole-system contracts are healthy.");
