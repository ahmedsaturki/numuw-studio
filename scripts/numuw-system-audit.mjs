#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const BASE="https://ahmedsaturki.github.io/numuw-studio/";
const failures=[];

function walk(dir,out=[]){
  for(const e of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){
    if(e.name===".git"||e.name==="node_modules"||e.name==="bench"||e.name===".autoresearch") continue;
    const full=path.join(dir,e.name);
    if(e.isDirectory()) walk(full,out); else out.push(path.relative(ROOT,full).split(path.sep).join("/"));
  }
  return out;
}
function get(rel){return fs.readFileSync(path.join(ROOT,rel),"utf8");}
function count(h,re){return (h.match(re)||[]).length;}
function attr(h,selector){
  const m=h.match(selector);
  return m?.[1]?.trim()||"";
}
function add(file,rule,detail){failures.push(file+" | "+rule+" | "+detail);}

const files=walk(ROOT);
const html=files.filter(f=>f.endsWith(".html")).sort();

for(const file of html){
  const src=get(file);
  const is404=file==="404.html";

  if(!is404){
    if(!/<header\b/i.test(src)) add(file,"S1","missing site header");
    if(!/<nav\b/i.test(src)) add(file,"S2","missing navigation");
    if(!/<footer\b/i.test(src)) add(file,"S3","missing footer");
    if(!/(assets\/css\/numuw\.css|assets\/css\/home\.css|\.\.\/assets\/css\/numuw\.css|\.\.\/assets\/css\/home\.css)/i.test(src)){
      add(file,"S4","missing shared stylesheet contract");
    }
    if(!/(assets\/js\/numuw\.js|assets\/js\/home\.js|\.\.\/assets\/js\/numuw\.js|\.\.\/assets\/js\/home\.js)/i.test(src)){
      add(file,"S5","missing shared behavior contract");
    }
    const canonical=attr(src,/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
    const ogUrl=attr(src,/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i);
    if(canonical&&ogUrl&&canonical!==ogUrl) add(file,"S6","canonical and og:url differ");
    if(file.startsWith("products/")&&!/https:\/\/wa\.me\/201127788810|tools\/solution-finder|tools\/diagnostic/i.test(src)){
      add(file,"S7","product page has no conversion route");
    }
    if(file.startsWith("landing/")&&file!=="landing/index.html"&&!/https:\/\/wa\.me\/201127788810|tools\/diagnostic|products\//i.test(src)){
      add(file,"S8","landing page has no conversion route");
    }
    if(file.startsWith("documents/")&&!/data-print|Print \/ Save PDF/i.test(src)){
      add(file,"S9","business document is not printable");
    }
  }

  const tags=[...src.matchAll(/<\/?h([1-6])\b[^>]*>/gi)];
  let open=null;
  for(const m of tags){
    const level=Number(m[1]);
    if(m[0][1]==="/"){
      if(open!==null&&open!==level) add(file,"S10",`heading tag mismatch: opened h${open}, closed h${level}`);
      open=null;
    }else{
      if(open!==null) add(file,"S10",`nested heading token before closing h${open}`);
      open=level;
    }
  }

  const ids=[...src.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map(m=>m[1]);
  const seen=new Set();
  for(const id of ids){
    if(seen.has(id)) add(file,"S11",`duplicate id: ${id}`);
    seen.add(id);
  }

  if(!is404){
    const htmlOpen=src.match(/<html\b[^>]*>/i)?.[0]||"";
    if(!/\blang=["'][a-z-]+["']/i.test(htmlOpen)) add(file,"S12","missing html lang");
    if(!/\bdir=["'](rtl|ltr)["']/i.test(htmlOpen)) add(file,"S12","missing html dir");
  }
}

const robots=files.includes("robots.txt")?get("robots.txt"):"";
if(!/Sitemap:\s*https:\/\/ahmedsaturki\.github\.io\/numuw-studio\/sitemap\.xml/i.test(robots)){
  add("robots.txt","S13","missing canonical sitemap declaration");
}

if(!files.includes(".well-known/security.txt")) add(".well-known/security.txt","S14","missing security.txt");
if(!files.includes("SECURITY.md")) add("SECURITY.md","S15","missing security policy");

process.stdout.write(`NUMUW system audit: ${html.length} HTML pages checked\n`);
process.stdout.write(`Failures: ${failures.length}\n`);
if(failures.length){
  failures.sort().forEach(x=>process.stderr.write("FAIL: "+x+"\n"));
  process.exit(1);
}
process.stdout.write("PASS: system shell, architecture, semantic and conversion invariants are healthy.\n");
