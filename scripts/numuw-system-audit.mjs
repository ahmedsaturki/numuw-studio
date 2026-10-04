import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const BASE="https://ahmedsaturki.github.io/numuw-studio/";
const failures=[];
const warnings=[];

function walk(dir,out=[]){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if([".git","node_modules",".autoresearch"].includes(e.name)) continue;
    const full=path.join(dir,e.name);
    if(e.isDirectory()) walk(full,out); else out.push(path.relative(ROOT,full).split(path.sep).join("/"));
  }
  return out.sort();
}
function getTags(html,name){
  return html.match(new RegExp("<"+name+"\\b[^>]*>","gi"))||[];
}
function getAttrs(tag){
  const out={};
  const body=tag.slice(tag.indexOf(" ")+1,-1);
  const re=/([A-Za-z_:][A-Za-z0-9_:.-]*)\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))/g;
  for(const m of body.matchAll(re)) out[m[1].toLowerCase()]=m[2]??m[3]??m[4]??"";
  return out;
}
function bodyText(html){
  return html.replace(/<script[\\s\\S]*?<\\/script>/gi," ").replace(/<style[\\s\\S]*?<\\/style>/gi," ").replace(/<header[\\s\\S]*?<\\/header>/gi," ").replace(/<footer[\\s\\S]*?<\\/footer>/gi," ").replace(/<[^>]+>/g," ").replace(/\\s+/g," ").trim().toLowerCase();
}
function add(file,msg){failures.push(file+": "+msg);}
const files=walk(ROOT);
const set=new Set(files);
const htmlFiles=files.filter(f=>f.endsWith(".html"));
const pages=htmlFiles.filter(f=>f!=="404.html");
const contents=new Map(pages.map(f=>[f,fs.readFileSync(path.join(ROOT,f),"utf8")]));

for(const file of htmlFiles){
  const html=fs.readFileSync(path.join(ROOT,file),"utf8");
  const is404=file==="404.html";
  const htmlTag=getTags(html,"html")[0]||"";
  const htmlA=getAttrs(htmlTag);
  const titles=getTags(html,"title");
  const metas=getTags(html,"meta");
  const desc=metas.filter(t=>getAttrs(t).name?.toLowerCase()==="description");
  const canon=getTags(html,"link").filter(t=>(getAttrs(t).rel||"").toLowerCase().split(/\\s+/).includes("canonical"));
  if(!/^<!doctype html>/i.test(html)) add(file,"missing doctype");
  if(titles.length!==1 || !titles[0].replace(/<[^>]+>/g,"").trim()) add(file,"title contract failed");
  if(!is404 && desc.length!==1) add(file,"description contract failed");
  if(!is404 && canon.length!==1) add(file,"canonical contract failed");
  if(!htmlA.lang) add(file,"html lang missing");
  if(!/^(rtl|ltr)$/i.test(htmlA.dir||"")) add(file,"html dir missing/invalid");
  if(!getTags(html,"main").length) add(file,"main landmark missing");
  if(!is404 && getTags(html,"h1").length!==1) add(file,"exactly one h1 required");
  if(is404 && !/noindex/i.test(metas.map(getAttrs).filter(a=>a.name==="robots").map(a=>a.content).join(" "))) add(file,"404 must be noindex");
  const headings=[...html.matchAll(/<h([1-6])\\b[^>]*>/gi)].map(m=>Number(m[1]));
  for(let i=1;i<headings.length;i++) if(headings[i]>headings[i-1]+1) add(file,"heading hierarchy skip");
  for(const tag of metas){
    const a=getAttrs(tag);
    if(a.name || a.property){
      const key=(a.name||a.property).toLowerCase();
      if(!["charset","viewport"].includes(key) && !("content" in a)) add(file,"metadata missing content: "+key);
    }
    if(/\\b(?:content|href|rel|name|property)[A-Za-z0-9]+\\s*=/i.test(tag)) add(file,"malformed metadata attribute");
  }
  for(const tag of getTags(html,"link")){
    if(/<h[1-6][A-Za-z]/i.test(tag) || /<[^>]+[A-Za-z]+ink\\s/i.test(tag)) add(file,"malformed link tag/attribute");
  }
  for(const tag of [...getTags(html,"a"),...getTags(html,"area")]){
    const a=getAttrs(tag);
    if(a.target==="_blank" && !(a.rel||"").toLowerCase().split(/\\s+/).includes("noopener")) add(file,"target=_blank missing noopener");
  }
  const ids=new Set();
  for(const m of html.matchAll(/\\bid=["']([^"']+)["']/gi)){
    if(ids.has(m[1])) add(file,"duplicate id="+m[1]); else ids.add(m[1]);
  }
  for(const tag of getTags(html,"img")) if(!("alt" in getAttrs(tag))) add(file,"img without alt");
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
    if(!set.has(target)) add(file,"broken local reference -> "+ref);
  }
  for(const tag of getTags(html,"script")){
    const a=getAttrs(tag);
    if(a.src && /^https?:/i.test(a.src)) add(file,"remote runtime script");
  }
}
const titleMap=new Map();
const descMap=new Map();
for(const file of pages){
  const html=contents.get(file);
  const t=(getTags(html,"title")[0]||"").replace(/<[^>]+>/g,"").trim().toLowerCase();
  const d=getTags(html,"meta").map(getAttrs).find(a=>a.name?.toLowerCase()==="description")?.content?.trim().toLowerCase()||"";
  if(t) titleMap.set(t,[...(titleMap.get(t)||[]),file]);
  if(d) descMap.set(d,[...(descMap.get(d)||[]),file]);
}
for(const [value,items] of titleMap) if(items.length>1) add(items[0],"duplicate title: "+items.slice(1).join(", "));
for(const [value,items] of descMap) if(items.length>1) add(items[0],"duplicate description: "+items.slice(1).join(", "));

for(const file of pages.filter(f=>f.startsWith("products/") && f!=="products/index.html")){
  const t=bodyText(contents.get(file));
  for(const key of ["مناسب","نطاق","مخرجات"]) if(!t.includes(key)) add(file,"product contract missing: "+key);
}
for(const file of pages.filter(f=>f.startsWith("tools/") && f!=="tools/index.html")){
  const t=bodyText(contents.get(file));
  if(!/(ليس|ليست|لا |ضمان|توقع)/i.test(t)) warnings.push(file+": tool limitation/assumption language should be reviewed");
}
const sitemap=fs.existsSync(path.join(ROOT,"sitemap.xml"))?fs.readFileSync(path.join(ROOT,"sitemap.xml"),"utf8"):"";
const locs=[...sitemap.matchAll(/<loc>\\s*([^<]+)\\s*<\\/loc>/g)].map(m=>m[1].trim());
if(!locs.length) add("sitemap.xml","no loc entries");
if(locs.some(u=>!u.startsWith(BASE))) add("sitemap.xml","non-canonical origin found");
for(const file of pages){
  const expected=BASE+(file==="index.html"?"":file.replace(/\\/index\\.html$/,"/"));
  if(!locs.includes(expected)) add("sitemap.xml","missing "+expected);
}
if(locs.some(u=>u.endsWith("/404.html"))) add("sitemap.xml","404 listed");
if(!fs.existsSync(path.join(ROOT,"SECURITY.md"))) add("SECURITY.md","missing");
if(!fs.existsSync(path.join(ROOT,".well-known/security.txt"))) add(".well-known/security.txt","missing");
console.log("NUMUW SYSTEM AUDIT");
console.log("Pages: "+pages.length);
console.log("Failures: "+failures.length);
console.log("Warnings: "+warnings.length);
for(const x of warnings) console.warn("WARN:",x);
for(const x of failures) console.error("FAIL:",x);
if(failures.length) process.exit(1);
console.log("PASS: whole-system release contracts are healthy.");
