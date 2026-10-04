#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const BASE="https://ahmedsaturki.github.io/numuw-studio/";
const failures=[];

function walk(dir){
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(function(e){
    if(e.name===".git"||e.name==="node_modules") return [];
    const p=path.join(dir,e.name);
    return e.isDirectory()?walk(p):[p];
  });
}
function rel(p){return path.relative(ROOT,p).split(path.sep).join("/");}

const files=walk(ROOT).map(rel).sort();
const html=files.filter(function(f){return f.endsWith(".html")});
const indexable=html.filter(function(f){return f!=="404.html"});

if(html.length!==52) failures.push("expected 52 tracked HTML files, found "+html.length);
if(indexable.length!==51) failures.push("expected 51 indexable HTML files, found "+indexable.length);

const toolRoutes=["automation-finder","brief-builder","diagnostic","estimator","roadmap","roi-calculator","solution-finder","website-readiness"];
const productRoutes=["automation-sprint","diagnostic","digital-kickoff","growth-partner","growth-system"];
const landingRoutes=["ai","automation","b2b","brand","ecommerce","growth-partner","manufacturing","real-estate","seo-local","website"];

function routeFile(prefix,route){return prefix+"/"+route+"/index.html"}

for(const route of toolRoutes){
  const f=routeFile("tools",route);
  if(!files.includes(f)) failures.push("missing tool route "+f);
  else{
    const c=fs.readFileSync(path.join(ROOT,f),"utf8");
    if(!c.includes("assets/js/tools.js")) failures.push(f+": shared tools.js missing");
    if(/\binnerHTML\b/.test(c)) failures.push(f+": innerHTML remains in tool page");
    if(/<script\b(?![^>]*\bsrc\s*=)[^>]*>[\s\S]*?<\/script>/i.test(c) && !/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>/.test(c)){
      failures.push(f+": executable inline script remains");
    }
  }
}

for(const route of productRoutes) if(!files.includes(routeFile("products",route))) failures.push("missing product route "+routeFile("products",route));
for(const route of landingRoutes) if(!files.includes(routeFile("landing",route))) failures.push("missing landing route "+routeFile("landing",route));

function mainFingerprint(file){
  const c=fs.readFileSync(path.join(ROOT,file),"utf8");
  const body=(c.match(/<main\b[\s\S]*?<\/main>/i)?.[0]||c)
    .replace(/<script[\s\S]*?<\/script>/gi,"")
    .replace(/\s+/g," ").trim();
  return crypto.createHash("sha256").update(body).digest("hex");
}
function duplicates(routes,group){
  const map=new Map();
  for(const route of routes){
    const f=routeFile(group,route);
    const fp=mainFingerprint(f);
    if(map.has(fp)) failures.push("duplicate "+group+" main content: "+map.get(fp)+" == "+f);
    else map.set(fp,f);
  }
}
duplicates(landingRoutes,"landing");
duplicates(productRoutes,"products");

for(const f of indexable){
  const c=fs.readFileSync(path.join(ROOT,f),"utf8");
  if(/<(?:a|area|button|body|div|form|img|input|select|textarea)[^>]+\s+on[a-z]+\s*=/i.test(c)) failures.push(f+": inline event handler");
  if(/\binnerHTML\b/.test(c)) failures.push(f+": innerHTML in public page");

  for(const tag of c.matchAll(/<script\b([^>]*)>/gi)){
    const attrs=tag[1];
    const start=tag.index+tag[0].length;
    const end=c.indexOf("</script>",start);
    const body=end<0?"":c.slice(start,end);
    const external=/\bsrc\s*=/.test(attrs);
    const json=/\btype\s*=\s*["']application\/ld\+json["']/i.test(attrs);
    if(!external&&!json&&body.trim()) failures.push(f+": executable inline script");
  }

  const badPaths=[
    /C:\\Users\\/i,
    /\/home\/[^\s"']+/i,
    /localhost:\d+/i,
    /127\.0\.0\.1/i,
    /DESKTOP-[A-Z0-9-]+/i
  ];
  if(badPaths.some(function(re){return re.test(c)})) failures.push(f+": local environment reference");
}

const sourceTextFiles=files.filter(function(f){return /\.(md|yml|yaml|txt|mjs|js|sh|cfg|html|xml)$/i.test(f)});
for(const f of sourceTextFiles){
  const c=fs.readFileSync(path.join(ROOT,f),"utf8");
  if(/\b(AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|AIza[0-9A-Za-z_-]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)\b/.test(c)){
    failures.push(f+": secret-like material detected");
  }
}

const sitemap=fs.readFileSync(path.join(ROOT,"sitemap.xml"),"utf8");
if((sitemap.match(/<loc>/g)||[]).length!==54) failures.push("sitemap: expected 54 loc entries");
for(const pdf of [
  "documents/exports/NUMUW-Company-Profile.pdf",
  "documents/exports/NUMUW-Capability-Statement.pdf",
  "documents/exports/NUMUW-Service-Catalog.pdf"
]){
  if(!sitemap.includes(BASE+pdf)) failures.push("sitemap: missing "+pdf);
}

console.log("NUMUW content integrity: "+html.length+" HTML files scanned");
console.log("Failures: "+failures.length);
for(const failure of failures) console.error("FAIL:",failure);
if(failures.length) process.exit(1);
console.log("PASS: route inventory, differentiation, script safety, environment hygiene and sitemap invariants are healthy.");
