import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_ORIGIN = "https://ahmedsaturki.github.io/numuw-studio/";
const OPERATING_ROUTES = new Set([
  "documents/proposal-template/index.html",
  "documents/onboarding/index.html",
  "documents/handover/index.html",
  "documents/terms/index.html",
  "documents/playbooks/index.html",
  "documents/playbooks/sales-discovery/index.html",
  "documents/playbooks/delivery-qa/index.html"
]);
const failures = [];
const warnings = [];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === ".git" || entry.name === "node_modules") return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function rel(file) {
  return path.relative(root, file).split(path.sep).join("/");
}

function attr(html, re) {
  return (html.match(re)?.[1] ?? "").trim();
}

function attrsOfTag(tag) {
  const body = tag.replace(/^<[a-z][a-z0-9:-]*\s*/i, "").replace(/>$/i, "");
  const attrs = [];
  const re = /([^\s"'=<>/]+)(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/g;
  let match;
  while ((match = re.exec(body))) attrs.push(match[1].toLowerCase());
  return attrs;
}

function checkDuplicateAttributes(file, html) {
  for (const match of html.matchAll(/<[a-z][^>]*>/gi)) {
    const seen = new Set();
    for (const name of attrsOfTag(match[0])) {
      if (seen.has(name)) failures.push(file + ': duplicate HTML attribute "' + name + '"');
      seen.add(name);
    }
  }
}

function checkHeadingPairs(file, html) {
  let open = null;
  for (const match of html.matchAll(/<(\/?)h([1-6])\b[^>]*>/gi)) {
    const closing = match[1] === "/";
    const level = Number(match[2]);
    if (!closing) {
      if (open !== null) failures.push(file + ": heading h" + level + " opened before h" + open + " closed");
      open = level;
    } else if (open !== level) {
      failures.push(file + ": closing h" + level + " does not match open h" + (open === null ? "none" : open));
    } else {
      open = null;
    }
  }
  if (open !== null) failures.push(file + ": h" + open + " is not closed");
}

function checkDuplicateIds(file, html) {
  const seen = new Set();
  for (const match of html.matchAll(/\bid=["']([^"']+)["']/gi)) {
    if (seen.has(match[1])) failures.push(file + ': duplicate id "' + match[1] + '"');
    seen.add(match[1]);
  }
}

function checkMetaAttributes(file, html) {
  const allowed = new Set(["charset", "content", "name", "http-equiv", "property", "itemprop", "media"]);
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    for (const name of attrsOfTag(match[0])) {
      if (!allowed.has(name)) failures.push(file + ': malformed meta attribute "' + name + '"');
    }
  }
}

function checkFormSemantics(file, html) {
  for (const match of html.matchAll(/<button\b([^>]*)>/gi)) {
    if (!/\btype\s*=\s*["'][^"']+["']/i.test(match[1])) {
      failures.push(file + ": button missing explicit type");
    }
  }

  for (const match of html.matchAll(/<(input|select|textarea)\b([^>]*)>/gi)) {
    const tagName = match[1].toLowerCase();
    const attrs = match[2];
    const type = attrs.match(/\btype\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase();
    if (tagName === "input" && type === "hidden") continue;

    const id = attrs.match(/\bid\s*=\s*["']([^"']+)["']/i)?.[1];
    const labelled = /\baria-label\s*=|\baria-labelledby\s*=/i.test(attrs);

    if (!id && !labelled) {
      failures.push(file + ": " + tagName + " control needs id/label/aria label");
      continue;
    }

    if (id && !labelled) {
      const explicitFor = html.includes('for="' + id + '"') || html.includes("for='" + id + "'");
      if (!explicitFor) warnings.push(file + ": control #" + id + " has no explicit label-for; verify wrapped labels");
    }
  }
}

function resolveLocalHref(sourcePath, href) {
  const clean = href.split("#")[0].split("?")[0];
  if (!clean || /^[a-z][a-z0-9+.-]*:/i.test(clean)) return null;

  if (clean.startsWith("/")) {
    if (!clean.startsWith("/numuw-studio/")) return null;
    let p = clean.slice("/numuw-studio/".length);
    if (!p) p = "index.html";
    if (p.endsWith("/")) p += "index.html";
    if (!path.posix.extname(p)) p += "/index.html";
    return p;
  }

  const sourceDir = path.posix.dirname("/" + sourcePath);
  let p = path.posix.normalize(path.posix.join(sourceDir, clean));
  if (p.startsWith("/")) p = p.slice(1);
  if (p.endsWith("/")) p += "index.html";
  if (!path.posix.extname(p)) {
    if (fs.existsSync(path.join(root, p))) return p;
    p += "/index.html";
  }
  return p;
}

function existsPublic(p) {
  return fs.existsSync(path.join(root, p));
}
function expectedCanonical(file) {
  return file==="index.html" ? PUBLIC_ORIGIN : PUBLIC_ORIGIN + file.replace(/\\/g,"/").replace(/index\\.html$/,"");
}
function checkGlobalNav(file, html) {
  const nav = html.match(/<nav\\b[^>]*data-nav[^>]*>([\\s\\S]*?)<\\/nav>/i)?.[1] || "";
  if(!nav){ failures.push(file + ": canonical data-nav missing"); return; }
  const required=["index.html","landing/index.html","tools/index.html","products/index.html","pages/index.html","resources/index.html","pages/contact/index.html"];
  const targets=new Set();
  for(const match of nav.matchAll(/<a\\b[^>]*href=["']([^"']+)["'][^>]*>/gi)){
    const target=resolveLocalHref(file,match[1]);
    if(target)targets.add(target);
  }
  for(const target of required) if(!targets.has(target)) failures.push(file + ": global navigation missing route " + target);
  if(targets.size!==required.length) failures.push(file + ": global navigation contains unexpected or duplicate route targets");
}
function checkSamePageAnchors(file, html) {
  const ids=new Set([...html.matchAll(/\\bid=["']([^"']+)["']/gi)].map(m=>m[1]));
  for(const match of html.matchAll(/<a\\b[^>]*href=["']#([^"']+)["'][^>]*>/gi)){
    if(!ids.has(match[1])) failures.push(file + ": same-page anchor target missing #" + match[1]);
  }
}

const htmlFiles = walk(root).filter((f) => f.endsWith(".html")).map(rel).sort();
const titleValues = new Map();
const descriptionValues = new Map();
const sitemap = fs.existsSync(path.join(root, "sitemap.xml")) ? fs.readFileSync(path.join(root, "sitemap.xml"), "utf8") : "";
const robots = fs.existsSync(path.join(root, "robots.txt")) ? fs.readFileSync(path.join(root, "robots.txt"), "utf8") : "";

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const is404 = file === "404.html";
  const titleCount = (html.match(/<title>/gi) || []).length;
  const descriptionCount = (html.match(/<meta\s+name=["']description["']/gi) || []).length;
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const canonicalCount = (html.match(/<link\s+rel=["']canonical["']/gi) || []).length;
  const charsetCount = (html.match(/<meta\s+charset=/gi) || []).length;
  const viewportCount = (html.match(/<meta\s+name=["']viewport["']/gi) || []).length;
  const mainCount = (html.match(/<main\b/gi) || []).length;
  const headerCount = (html.match(/<header\b/gi) || []).length;
  const footerCount = (html.match(/<footer\b/gi) || []).length;
  const navCount = (html.match(/<nav\b/gi) || []).length;
  const jsonLd = [...html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const noindex = /<meta\s+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
  const fullI18n = /<html\b[^>]*data-i18n=["']full["']/i.test(html);
  const localLinks = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map((m) => m[1]);
  const images = [...html.matchAll(/<img\b([^>]*)>/gi)].map((m) => m[1]);

  if (!/^<!doctype html>/i.test(html)) failures.push(file + ": missing HTML5 doctype");
  if (titleCount !== 1) failures.push(file + ": expected one title, found " + titleCount);
  if (!is404 && descriptionCount !== 1) failures.push(file + ": expected one description, found " + descriptionCount);
  if (!is404 && h1Count !== 1) failures.push(file + ": expected one h1, found " + h1Count);
  if (canonicalCount !== (is404 ? 0 : 1)) failures.push(file + ": canonical count is " + canonicalCount);
  if (charsetCount !== 1) failures.push(file + ": expected one charset meta");
  if (viewportCount !== 1) failures.push(file + ": expected one viewport meta");
  if (!/<html\b[^>]*lang=["'][a-z-]+["']/i.test(html)) failures.push(file + ": missing html lang");
  if (!/<html\b[^>]*dir=["'](rtl|ltr)["']/i.test(html)) failures.push(file + ": missing html dir");
  if ((html.match(/<head\b/gi) || []).length !== 1 || (html.match(/<\/head>/gi) || []).length !== 1) failures.push(file + ": invalid head structure");
  if ((html.match(/<body\b/gi) || []).length !== 1 || (html.match(/<\/body>/gi) || []).length !== 1) failures.push(file + ": invalid body structure");
  if (mainCount !== 1) failures.push(file + ": expected one main");
  if (!is404 && headerCount !== 1) failures.push(file + ": expected one header");
  if (!is404 && footerCount !== 1) failures.push(file + ": expected one footer");
  if (!is404 && navCount < 1) failures.push(file + ": expected navigation landmark");

  if (!is404 && !/property=["']og:title["']/i.test(html)) failures.push(file + ": missing og:title");
  if (!is404 && !/property=["']og:image["']/i.test(html)) failures.push(file + ": missing og:image");
  if (!is404 && !/property=["']og:url["']/i.test(html)) failures.push(file + ": missing og:url");
  if (!is404 && !/name=["']twitter:card["']/i.test(html)) failures.push(file + ": missing twitter:card");
  if (!is404 && !/name=["']twitter:image["']/i.test(html)) failures.push(file + ": missing twitter:image");
  if (!is404 && !/property=["']og:site_name["']\s+content=["']NUMUW \| نُمو["']/i.test(html)) failures.push(file + ": missing or inconsistent og:site_name");
  if (!is404 && file!=="index.html" && !/class=["'][^"']*breadcrumbs[^"']*["']/i.test(html)) failures.push(file + ": source breadcrumb missing");
  if (!is404) checkGlobalNav(file,html);
  if (!is404) checkSamePageAnchors(file,html);
  if (is404 && !/<meta\s+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) failures.push("404.html: missing noindex");

  checkDuplicateAttributes(file, html);
  checkHeadingPairs(file, html);
  checkDuplicateIds(file, html);
  checkMetaAttributes(file, html);
  checkFormSemantics(file, html);
  if (/(?:<a|<area|<button|<body|<div|<form|<img|<input|<select|<textarea)[^>]+\s+on[a-z]+\s*=/i.test(html)) failures.push(file + ": inline event handler detected");
  if (!is404 && !fullI18n && /data-lang-btn/i.test(html)) failures.push(file + ": language switch present without data-i18n=full");
  if (!is404 && fullI18n && !/data-lang-btn/i.test(html)) failures.push(file + ": full-localized page missing language switch");
  if (!is404 && fullI18n && !/<title[^>]+data-ar=["'][^"']+["'][^>]+data-en=["'][^"']+["']/i.test(html)) failures.push(file + ": localized title contract missing");
  if (!is404 && fullI18n && !/<meta\s+name=["']description["'][^>]+data-ar=["'][^"']+["'][^>]+data-en=["'][^"']+["']/i.test(html)) failures.push(file + ": localized description contract missing");

  for (const image of images) {
    if (!/\balt\s*=\s*["'][^"']*["']/i.test(image)) failures.push(file + ": img without alt attribute");
  }

  for (const block of jsonLd) {
    try { JSON.parse(block); }
    catch { failures.push(file + ": invalid JSON-LD block"); }
  }
  if (!is404 && jsonLd.length === 0) failures.push(file + ": missing JSON-LD");

  for (const href of localLinks) {
    const target = resolveLocalHref(file, href);
    if (target && !existsPublic(target)) failures.push(file + ": broken local reference -> " + href);
  }

  const blankLinks = [...html.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi)].map((m) => m[0]);
  for (const tag of blankLinks) {
    if (!/rel=["'][^"']*noopener/i.test(tag)) failures.push(file + ': target="_blank" without noopener');
  }

  if (!is404) {
    const title = attr(html, /<title>([\s\S]*?)<\/title>/i).replace(/\s+/g, " ").trim();
    const description = attr(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)/i);
    titleValues.set(file, title);
    descriptionValues.set(file, description);

    if (description.length < 50) warnings.push(file + ": meta description is short (" + description.length + " chars)");

    const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1];
    const ogUrl = html.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i)?.[1];
    if (canonical && ogUrl && canonical !== ogUrl) failures.push(file + ": og:url does not match canonical");
    if (canonical && canonical !== expectedCanonical(file)) failures.push(file + ": canonical is not the expected route URL");
    if (!canonical || !canonical.startsWith(PUBLIC_ORIGIN)) failures.push(file + ": canonical outside configured Pages origin");
    else if (!noindex && !sitemap.includes("<loc>" + canonical + "</loc>")) failures.push(file + ": indexable canonical missing from sitemap");
    if (noindex && sitemap.includes("<loc>" + canonical + "</loc>")) failures.push(file + ": noindex URL must not appear in sitemap");
    if (OPERATING_ROUTES.has(file) && !noindex) failures.push(file + ": operating document must be noindex");
  }

  const toolName = html.match(/<main\b[^>]*\bdata-tool=["']([^"']+)["']/i)?.[1];
  if (toolName) {
    if (!/assets\/js\/tools\.js/i.test(html)) failures.push(file + ': data-tool="' + toolName + '" missing tools runtime');
    const inlineExecutable = [...html.matchAll(/<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/gi)]
      .filter((m) => !/type=["']application\/ld\+json["']/i.test(m[0]) && m[1].trim());
    if (inlineExecutable.length) failures.push(file + ": tool page contains inline executable script");
  }

  if (/(?:h2UMUW|Conh2ersion|properh2y|metah2property|�)/i.test(html)) {
    failures.push(file + ": suspicious corruption token detected");
  }
}

function duplicateValues(values, label) {
  const reverse = new Map();
  for (const [file, value] of values) {
    if (!reverse.has(value)) reverse.set(value, []);
    reverse.get(value).push(file);
  }
  for (const [value, files] of reverse) {
    if (files.length > 1) failures.push(label + ": duplicate value across pages -> " + files.join(", ") + " :: " + value.slice(0, 100));
  }
}

duplicateValues(titleValues, "duplicate title");
duplicateValues(descriptionValues, "duplicate description");

if (!sitemap) failures.push("sitemap.xml: missing or empty");
if (!sitemap.includes(PUBLIC_ORIGIN)) failures.push("sitemap.xml: configured origin missing");
if (!/Sitemap:\s*https:\/\/ahmedsaturki\.github\.io\/numuw-studio\/sitemap\.xml/i.test(robots)) failures.push("robots.txt: sitemap declaration missing");
if (!existsPublic("og-image.png")) failures.push("og-image.png: missing");
if (existsPublic("assets/js/home.js")) failures.push("system contract: obsolete assets/js/home.js still exists");
if (!existsPublic(".well-known/security.txt")) failures.push("security.txt: missing");

if (existsPublic(".well-known/security.txt")) {
  const securityTxt = fs.readFileSync(path.join(root, ".well-known/security.txt"), "utf8");
  if (!/^Contact:\s*https:\/\//mi.test(securityTxt)) failures.push("security.txt: missing HTTPS Contact");
  if (!/^Policy:\s*https:\/\//mi.test(securityTxt)) failures.push("security.txt: missing HTTPS Policy");
  if (!/^Expires:\s*\d{4}-\d{2}-\d{2}T/mi.test(securityTxt)) failures.push("security.txt: missing Expires");
}

for (const file of ["assets/css/numuw.css", "assets/css/home.css"]) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const teal = source.match(/--teal:\s*(#[0-9a-f]{6})/i)?.[1];
  if (teal && contrastRatio(teal, "#ffffff") < 4.5) failures.push(file + ": teal fails 4.5:1 contrast");
}

function hexLuminance(hex) {
  const value = hex.replace("#", "");
  const rgb = [0, 2, 4].map((i) => Number.parseInt(value.slice(i, i + 2), 16) / 255);
  const linear = rgb.map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(a, b) {
  const la = hexLuminance(a);
  const lb = hexLuminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

const sharedCss = fs.readFileSync(path.join(root, "assets/css/numuw.css"), "utf8");
if (!/:focus-visible\{[^}]*outline:2px solid var\(--navy\)[^}]*box-shadow:0 0 0 4px #fff/i.test(sharedCss)) {
  warnings.push("assets/css/numuw.css: two-tone focus ring exact pattern not detected");
}


// Canonical NUMUW system contract checks
const requiredFiles = [
  "assets/css/numuw.css",
  "assets/js/numuw.js",
  "assets/css/home.css",
  "docs/SYSTEM-CONTRACT.md"
];
for (const file of requiredFiles) {
  if (!existsPublic(file)) failures.push("system contract: missing " + file);
}

const homepage = fs.readFileSync(path.join(root, "index.html"), "utf8");
if (!/data-nav/.test(homepage)) failures.push("system contract: homepage missing data-nav");
if (!/href="products\/diagnostic\//.test(homepage) || !/href="products\/digital-kickoff\//.test(homepage) || !/href="products\/automation-sprint\//.test(homepage) || !/href="products\/growth-system\//.test(homepage) || !/href="products\/growth-partner\//.test(homepage)) {
  failures.push("system contract: homepage missing one or more canonical products");
}
if (/\bPresence\b/.test(homepage)) failures.push("system contract: obsolete Presence offer remains on homepage");
if (/7,900/.test(homepage)) failures.push("system contract: obsolete 7,900 EGP price remains on homepage");

for (const file of htmlFiles.filter(f => f !== "404.html")) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  if (!/data-nav/.test(html)) failures.push(file + ": canonical data-nav missing");
  if (!/data-menu/.test(html)) failures.push(file + ": canonical data-menu missing");
  if (!/data-lang-btn/.test(html)) failures.push(file + ": canonical data-lang-btn missing");
  if (file === "index.html") {
    if (!html.includes("assets/css/home.css")) failures.push(file + ": home.css missing");
    if (!html.includes("assets/js/home.js")) failures.push(file + ": home.js missing");
  } else {
    if (!html.includes("assets/css/numuw.css")) failures.push(file + ": shared numuw.css missing");
    if (!html.includes("assets/js/numuw.js")) failures.push(file + ": shared numuw.js missing");
  }
}

const productContracts = {
  "products/digital-kickoff/index.html": "8,000",
  "products/automation-sprint/index.html": "8,000",
  "products/growth-system/index.html": "24,900",
  "products/growth-partner/index.html": "6,500"
};
for (const [file, price] of Object.entries(productContracts)) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  if (!html.includes("COMMERCIAL FIT")) failures.push(file + ": commercial-fit section missing");
  if (!html.includes(price)) failures.push(file + ": canonical reference price " + price + " missing");
}
const diagnosticProduct = fs.readFileSync(path.join(root, "products/diagnostic/index.html"), "utf8");
if (!diagnosticProduct.includes("COMMERCIAL FIT")) failures.push("products/diagnostic/index.html: commercial-fit section missing");

const finder = fs.readFileSync(path.join(root, "tools/solution-finder/index.html"), "utf8");
if (!/value="ecommerce"/i.test(finder)) failures.push("tools/solution-finder/index.html: ecommerce sector route missing");

const homeCss = fs.readFileSync(path.join(root, "assets/css/home.css"), "utf8");
for (const token of ["--navy:#081321","--navy2:#10243d","--teal:#08766e","--teal2:#21c6b6","--gold:#d9a441","--bg:#f5f7fa","--paper:#fff","--ink:#122033","--muted:#5f7084","--line:#dfe6ee","--soft:#e8f7f5","--max:1160px"]) {
  if (!homeCss.includes(token)) failures.push("assets/css/home.css: canonical token missing -> " + token);
}
if (homeCss.includes("--teal2:#19c4b4") || homeCss.includes("--gold:#d8a33b") || homeCss.includes("--max:1120px")) {
  failures.push("assets/css/home.css: competing legacy design-token value detected");
}

for(const file of ["assets/js/numuw.js","assets/js/tools.js"]){
  const check=spawnSync(process.execPath,["--check",path.join(root,file)],{encoding:"utf8"});
  if(check.status!==0) failures.push(file + ": JavaScript syntax check failed" + (check.stderr?": "+check.stderr.trim():""));
}
console.log("NUMUW master static audit: " + htmlFiles.length + " HTML files checked");
console.log("Failures: " + failures.length + " | Warnings: " + warnings.length);
for (const item of warnings) console.warn("WARN:", item);
if (failures.length) {
  for (const item of failures) console.error("FAIL:", item);
  process.exit(1);
}
console.log("PASS: structure, semantics, metadata, links, tools, security and design-system invariants are healthy.");
