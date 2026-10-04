import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const BASE="https://ahmedsaturki.github.io/numuw-studio/";
const FAIL=[];
const WARN=[];

function walk(dir,out=[]){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if([".git","node_modules",".autoresearch"].includes(e.name)) continue;
    const p=path.join(dir,e.name);
    if(e.isDirectory()) walk(p,out); else out.push(path.relative(ROOT,p).split(path.sep).join("/"));
  }
  return out.sort();
}
function tagList(html,name){
  return html.match(new RegExp("<"+name+"\\b[^>]*>","gi"))||[];
}
function attrMap(tag){
  const out={};
  const body=tag.replace(/^<[A-Za-z0-9:-]+/,"").replace(/>$/,"");
  const re=/([A-Za-z_:][A-Za-z0-9_:.~-]*)\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'=<>]+))/g;
  for(const m of body.matchAll(re)) out[m[1].toLowerCase()]=m[2]??m[3]??m[4]??"";
  return out;
}
function pageText(html){
  return html
    .replace(/<script[\\s\\S]*?<\\/script>/gi," ")
    .replace(/<style[\\s\\S]*?<\\/style>/gi," ")
    .replace(/<header[\\s\\S]*?<\\/header>/gi," ")
    .replace(/<footer[\\s\\S]*?<\\/footer>/gi," ")
    .replace(/<[^>]+>/g," ")
    .replace(/\\s+/g," ")
    .trim()
    .toLowerCase();
}
function add(set,file,msg){set.push(file+": "+msg);}

const all=walk(ROOT);
const set=new Set(all);
const htmlFiles=all.filter(f=>f.endsWith(".html"));
const pages=htmlFiles.filter(f=>f!=="404.html");
const contents=new Map(pages.map(f=>[f,fs.readFileSync(path.join(ROOT,f),"utf8")]));
const titleMap=new Map();
const descMap=new Map();

for(const file of htmlFiles){
  const html=fs.readFileSync(path.join(ROOT,file),"utf8");
  const is404=file==="404.html";
  const htmlTag=tagList(html,"html")[0]||"";
  const root=attrMap(htmlTag);
  const titles=tagList(html,"title");
  const metas=tagList(html,"meta");
  const desc=metas.filter(t=>attrMap(t).name?.toLowerCase()==="description");
  const canon=tagList(html,"link").filter(t=>(attrMap(t).rel||"").toLowerCase().split(/\\s+/).includes("canonical"));
  const hs=[...html.matchAll(/<h([1-6])\\b[^>]*>/gi)].map(m=>Number(m[1]));

  if(!/^<!doctype html>/i.test(html)) add(FAIL,file,"missing doctype");
  if(titles.length!==1) add(FAIL,file,"exactly one title required");
  if(titles.length===1 && !titles[0].replace(/<[^>]+>/g,"").trim()) add(FAIL,file,"title empty");
  if(!is404 && desc.length!==1) add(FAIL,file,"exactly one meta description required");
  if(!is404 && canon.length!==1) add(FAIL,file,"exactly one canonical required");
  if(!root.lang) add(FAIL,file,"html lang missing");
  if(!/^(rtl|ltr)$/i.test(root.dir||"")) add(FAIL,file,"html dir invalid/missing");
  if(!tagList(html,"main").length) add(FAIL,file,"main landmark missing");
  if(!is404 && tagList(html,"h1").length!==1) add(FAIL,file,"exactly one h1 required");
  if(is404 && !/noindex/i.test(metas.map(attrMap).filter(a=>a.name==="robots").map(a=>a.content).join(" "))) add(FAIL,file,"404 must be noindex");

  if(!is404){
    const expected=BASE+(file==="index.html"?"":file.replace(/\\/index\\.html$/,"/"));
    if(attrMap(canon[0]).href!==expected) add(FAIL,file,"canonical mismatch");
    const mustMeta=[
      ["og:title","property"],["og:description","property"],["og:url","property"],
      ["og:image","property"],["twitter:card","name"],["twitter:title","name"],
      ["twitter:description","name"],["twitter:image","name"]
    ];
    for(const [key,kind] of mustMeta){
      const ok=metas.some(t=>{
        const a=attrMap(t);
        return (kind==="property"?a.property:a.name)?.toLowerCase()===key && typeof a.content==="string" && a.content.trim()!=="";
      });
      if(!ok) add(FAIL,file,key+" metadata contract failed");
    }
  }

  for(const tag of metas){
    if(/\\b(?:content|href|rel|name|property)[A-Za-z0-9]+\\s*=/i.test(tag)) add(FAIL,file,"malformed metadata attribute");
  }
  for(const tag of tagList(html,"link")){
    if(/<h[1-6][A-Za-z]/i.test(tag)) add(FAIL,file,"malformed link tag name");
  }
  if(/<h[1-6][A-Za-z]/i.test(html)) add(FAIL,file,"malformed heading tag name");
  if(/<[^>]*\\s+on[a-z]+\\s*=/i.test(html)) add(FAIL,file,"inline event handler detected");

  for(let i=1;i<hs.length;i++) if(hs[i]>hs[i-1]+1) add(FAIL,file,"heading hierarchy skips a level");

  const ids=new Set();
  for(const m of html.matchAll(/\\bid=["']([^"']+)["']/gi)){
    if(ids.has(m[1])) add(FAIL,file,"duplicate id="+m[1]); else ids.add(m[1]);
  }

  const hasStaticSkip=/<a\\b[^>]*href=["']#main["'][^>]*class=["'][^"']*skip/i.test(html);
  const hasSharedSkipFallback=/<script\\b[^>]*src=["'][^"']*assets\\/js\\/numuw\\.js["'][^>]*>/i.test(html);
  if(!is404 && !hasStaticSkip && !hasSharedSkipFallback) add(FAIL,file,"skip navigation contract missing");
  if(!is404 && !hasStaticSkip && hasSharedSkipFallback) WARN.push(file+": skip link is injected by shared JS; prefer static markup for no-script resilience");
  if(!is404 && !/data-nav|class=["'][^"']*navlinks/i.test(html)) add(FAIL,file,"primary navigation missing");

  const menu=tagList(html,"button").find(t=>/data-menu|menu-btn|class=["'][^"']*menu/i.test(t));
  if(menu){
    const a=attrMap(menu);
    if(a.type && a.type.toLowerCase()!=="button") add(FAIL,file,"menu button type must be button");
    if(!a["aria-controls"]) add(FAIL,file,"menu aria-controls missing");
    if(!a["aria-expanded"]) add(FAIL,file,"menu aria-expanded missing");
  }

  for(const tag of tagList(html,"a")){
    const a=attrMap(tag);
    if(a.target==="_blank" && !(a.rel||"").toLowerCase().split(/\\s+/).includes("noopener")) add(FAIL,file,"target blank without noopener");
  }

  for(const name of ["input","select","textarea"]){
    for(const tag of tagList(html,name)){
      const a=attrMap(tag);
      if(a.type==="hidden") continue;
      if(!a.id) add(FAIL,file,name+" missing id");
    }
  }

  for(const block of [...html.matchAll(/<script\\b[^>]*type=["']application\\/ld\\+json["'][^>]*>([\\s\\S]*?)<\\/script>/gi)]){
    try{JSON.parse(block[1]);}catch{add(FAIL,file,"invalid JSON-LD");}
  }

  for(const ref of [...html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map(m=>m[1])){
    const raw=ref.split("#")[0].split("?")[0];
    if(!raw || raw.startsWith("#") || raw.startsWith("//") || /^[A-Za-z][A-Za-z0-9+.-]*:/.test(raw)) continue;
    let target=raw;
    if(raw.startsWith("/")){
      if(!raw.startsWith("/numuw-studio/")) continue;
      target=raw.slice("/numuw-studio/".length);
    }else{
      target=path.posix.normalize(path.posix.join(path.posix.dirname(file),raw));
    }
    if(target.endsWith("/")) target+="index.html";
    if(!path.posix.extname(target) && set.has(target+"/index.html")) target+="/index.html";
    if(!set.has(target)) add(FAIL,file,"broken local reference -> "+ref);
  }

  const text=pageText(html);
  if(file.startsWith("products/") && file!=="products/index.html"){
    for(const key of ["مناسب","نطاق","مخرجات"]) if(!text.includes(key)) add(FAIL,file,"product contract missing "+key);
  }
  if(file.startsWith("tools/") && file!=="tools/index.html" && !/(ليس|ليست|ضمان|توقع|لا )/i.test(text)){
    WARN.push(file+": tool limitations/assumptions should be explicit");
  }

  const title=(titles[0]||"").replace(/<[^>]+>/g,"").trim().toLowerCase();
  const description=desc.length?attrMap(desc[0]).content.trim().toLowerCase():"";
  if(title) titleMap.set(title,[...(titleMap.get(title)||[]),file]);
  if(description) descMap.set(description,[...(descMap.get(description)||[]),file]);
}

for(const [v,items] of titleMap) if(items.length>1) add(FAIL,items[0],"duplicate title with "+items.slice(1).join(", "));
for(const [v,items] of descMap) if(items.length>1) add(FAIL,items[0],"duplicate description with "+items.slice(1).join(", "));

const required=["solutions/index.html","industries/index.html","start/index.html"];
for(const p of required) if(!set.has(p)) add(FAIL,p,"required system hub missing");

const sitemap=fs.existsSync(path.join(ROOT,"sitemap.xml"))?fs.readFileSync(path.join(ROOT,"sitemap.xml"),"utf8"):"";
const locs=[...sitemap.matchAll(/<loc>\\s*([^<]+)\\s*<\\/loc>/g)].map(m=>m[1].trim());
for(const file of pages){
  const expected=BASE+(file==="index.html"?"":file.replace(/\\/index\\.html$/,"/"));
  if(!locs.includes(expected)) add(FAIL,"sitemap.xml","missing "+expected);
}
if(locs.some(u=>u.endsWith("/404.html"))) add(FAIL,"sitemap.xml","404 must not be listed");
if(!/Sitemap:\\s*https:\\/\\/ahmedsaturki\\.github\\.io\\/numuw-studio\\/sitemap\\.xml/i.test(fs.existsSync(path.join(ROOT,"robots.txt"))?fs.readFileSync(path.join(ROOT,"robots.txt"),"utf8"):"")) add(FAIL,"robots.txt","canonical sitemap declaration missing");

const css=fs.existsSync(path.join(ROOT,"assets/css/numuw.css"))?fs.readFileSync(path.join(ROOT,"assets/css/numuw.css"),"utf8"):"";
if(!/:focus-visible\\{[^}]*outline:2px solid var\\(--navy\\)/.test(css)) add(FAIL,"assets/css/numuw.css","focus-visible contract missing");

console.log("NUMUW SYSTEM AUDIT");
console.log("Pages: "+pages.length);
console.log("Failures: "+FAIL.length);
console.log("Warnings: "+WARN.length);
for(const x of WARN) console.warn("WARN:",x);
for(const x of FAIL) console.error("FAIL:",x);
if(FAIL.length) process.exit(1);
console.log("PASS: whole-system release contracts are healthy.");
