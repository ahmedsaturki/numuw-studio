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
function target(file,ref,set){
  const raw=ref.split("#")[0].split("?")[0];
  if(!raw || raw.startsWith("//") || /^[a-z][a-z0-9+.-]*:/i.test(raw)) return null;
  let p=raw;
  if(raw.startsWith("/")){
    if(!raw.startsWith("/numuw-studio/")) return null;
    p=raw.slice("/numuw-studio/".length);
  }else p=path.posix.normalize(path.posix.join(path.posix.dirname(file),raw));
  if(p==="."||p==="") p="index.html";
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
    const expected=NAV;
    const nt=[];
    for(const a of nav.matchAll(/<a\b[^>]*href=["']([^"']+)/gi)){
      const t=target(file,a[1],set); if(t) nt.push(navKey(t));
    }
    for(const e of expected) if(!nt.includes(e)) FAIL.push(file+": nav missing "+e);
    const startPath=(file==="index.html"?"start/":"../".repeat(file.split("/").length-1)+"start/");
    if(!h.includes('href="'+startPath+'"')) FAIL.push(file+": Start CTA missing from header");
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

  const schemas=[...h.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  if(!notFound&&schemas.length===0) FAIL.push(file+": JSON-LD missing");
  for(const s of schemas){try{JSON.parse(s[1]);}catch{FAIL.push(file+": invalid JSON-LD");}}
  
  if(file.startsWith("products/")&&file!=="products/index.html"){
    const req=[/مناسب|fit/i,/لا نبدأ|not\s+fit|غير مناسب/i,/مخرجات|deliverables/i,/لا يشمل|exclusion|scope/i,/قبول|acceptance/i,/ملكية|ownership/i,/دعم|support/i,/خطوة تالية|next step/i];
    if(req.some(r=>!r.test(h))) FAIL.push(file+": incomplete product contract");
  }
  if(file.startsWith("tools/")&&file!=="tools/index.html"){
    const req=[/أداة|tool|حسبة|تشخيص|خريطة|brief/i,/افتراض|assumption|input/i,/ليس|ليست|لا يحسب|does\s+not|not\s+/i,/ابدأ|تواصل|next|whatsapp|products/i];
    if(req.some(r=>!r.test(h))) FAIL.push(file+": incomplete tool contract");
  }
}
for(const [k,v] of titleSeen) if(v.length>1) FAIL.push(v[0]+": duplicate title");
for(const [k,v] of descSeen) if(k&&v.length>1) FAIL.push(v[0]+": duplicate description");

const sitemap=fs.existsSync(path.join(ROOT,"sitemap.xml"))?fs.readFileSync(path.join(ROOT,"sitemap.xml"),"utf8"):"";
const locs=[...sitemap.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map(m=>m[1].trim());
for(const p of pages) if(!locs.includes(route(p))) FAIL.push("sitemap missing "+route(p));
for(const u of locs){
  if(!u.startsWith(BASE)) FAIL.push("sitemap non-canonical "+u);
  const rel=u.slice(BASE.length), t=rel===""?"index.html":rel.endsWith("/")?rel+"index.html":rel;
  if(!set.has(t)&&!set.has(rel)) FAIL.push("sitemap target missing "+u);
}
if(locs.some(u=>/\/404\.html$/i.test(u))) FAIL.push("sitemap lists 404");

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
