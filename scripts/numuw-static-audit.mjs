import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_ORIGIN = "https://ahmedsaturki.github.io/numuw-studio/";
const failures = [];
const warnings = [];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (entry.name === ".git" || entry.name === "node_modules") return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
function rel(file) { return path.relative(root, file).split(path.sep).join("/"); }
function attr(html, re) { return (html.match(re)?.[1] ?? "").trim(); }
function isNoIndex(html) {
  return /<meta\s+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
}
function expectedCanonical(file) {
  if (file === "index.html") return PUBLIC_ORIGIN;
  return PUBLIC_ORIGIN + file.replace(/\/index\.html$/, "");
}
function resolveLocalHref(sourcePath, href) {
  const clean = href.split("#")[0].split("?")[0];
  if (!clean || /^[a-z][a-z0-9+.-]*:/i.test(clean)) return null;

  if (clean.startsWith("/")) {
    if (!clean.startsWith("/numuw-studio/")) return null;
    let absolute = clean.slice("/numuw-studio/".length);
    if (!absolute) absolute = "index.html";
    if (absolute.endsWith("/")) absolute += "index.html";
    if (!path.posix.extname(absolute)) absolute += "/index.html";
    return absolute;
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
function existsPublic(p) { return fs.existsSync(path.join(root, p)); }

const htmlFiles = walk(root).filter(f => f.endsWith(".html")).map(rel).sort();
const sitemap = fs.existsSync(path.join(root, "sitemap.xml"))
  ? fs.readFileSync(path.join(root, "sitemap.xml"), "utf8")
  : "";
const robots = fs.existsSync(path.join(root, "robots.txt"))
  ? fs.readFileSync(path.join(root, "robots.txt"), "utf8")
  : "";

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const is404 = file === "404.html";
  const noindex = isNoIndex(html);
  const fullI18n = /<html\b[^>]*data-i18n=["']full["']/i.test(html);
  const titleCount = (html.match(/<title>/gi) || []).length;
  const descCount = (html.match(/<meta\s+name=["']description["']/gi) || []).length;
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const canonicalCount = (html.match(/rel=["']canonical["']/gi) || []).length;
  const schemaBlocks = [...html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  const localLinks = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map(m => m[1]);
  const images = [...html.matchAll(/<img\b([^>]*)>/gi)].map(m => m[1]);
  const buttons = [...html.matchAll(/<button\b([^>]*)>/gi)].map(m => m[1]);
  const controls = [...html.matchAll(/<(input|select|textarea)\b([^>]*)>/gi)].map(m => ({ tag:m[1], attrs:m[2] }));
  const malformedMeta = /<(meta|link)\b[^>]*(?:metah2property|contenh2|coh2tent|h2UMUW|Pah2tner|Bh2and|Conh2ersion|Practical h2I|h2property)[^>]*>/i.test(html)
    || /<meta\b[^>]*\b(?:content|property|name)=["'][^"']*h2[A-Za-z][^"']*["'][^>]*>/i.test(html);

  if (!/^<!doctype html>/i.test(html)) failures.push(`${file}: missing HTML5 doctype`);
  if (titleCount !== 1) failures.push(`${file}: expected exactly one <title>, found ${titleCount}`);
  if (!is404 && descCount !== 1) failures.push(`${file}: expected exactly one meta description, found ${descCount}`);
  if (!is404 && h1Count !== 1) failures.push(`${file}: expected exactly one <h1>, found ${h1Count}`);
  if (!is404 && canonicalCount !== 1) failures.push(`${file}: expected exactly one canonical link, found ${canonicalCount}`);
  if (!/<meta\s+name=["']viewport["']/i.test(html)) failures.push(`${file}: missing viewport meta`);
  if (!/<html\b[^>]*lang=["'][a-z-]+["']/i.test(html)) failures.push(`${file}: missing html lang`);
  if (!/<html\b[^>]*dir=["'](rtl|ltr)["']/i.test(html)) failures.push(`${file}: missing html dir`);
  if (!/<main\b/i.test(html)) failures.push(`${file}: missing <main>`);
  if (!is404 && !/property=["']og:title["']/i.test(html)) failures.push(`${file}: missing og:title`);
  if (!is404 && !/property=["']og:image["']/i.test(html)) failures.push(`${file}: missing og:image`);
  if (!is404 && !/property=["']og:url["']/i.test(html)) failures.push(`${file}: missing og:url`);
  if (!is404 && !/property=["']og:site_name["']\s+content=["']NUMUW \| نُمو["']/i.test(html)) failures.push(`${file}: og:site_name is missing or inconsistent`);
  if (!is404 && !/name=["']twitter:card["']/i.test(html)) failures.push(`${file}: missing twitter:card`);
  if (!is404 && !/name=["']twitter:image["']/i.test(html)) failures.push(`${file}: missing twitter:image`);
  if (is404 && !/<meta\s+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) failures.push("404.html: missing noindex robots meta");
  if (/href=["']javascript:/i.test(html)) failures.push(`${file}: javascript: URL detected`);
  if (/<(?:a|area|button|body|div|form|img|input|select|textarea)[^>]+\s+on[a-z]+\s*=/i.test(html)) failures.push(`${file}: inline event handler detected`);
  if (malformedMeta) failures.push(`${file}: suspicious metadata corruption token detected`);

  for (const button of buttons) {
    if (!/\btype\s*=\s*["'](?:button|submit|reset)["']/i.test(button)) failures.push(`${file}: button without explicit type`);
  }

  for (const image of images) {
    if (!/\balt\s*=\s*["'][^"']*["']/i.test(image)) failures.push(`${file}: <img> without alt attribute`);
  }

  const inputIds = new Set();
  for (const control of controls) {
    const id = control.attrs.match(/\bid=["']([^"']+)["']/i)?.[1];
    const aria = /\baria-label(?:ledby)?=["'][^"']+["']/i.test(control.attrs);
    if (id) inputIds.add(id);
    if (!aria && !id) failures.push(`${file}: form control without id or aria label`);
    if (!aria && id) {
      const labelRe = new RegExp(`<label\\b[^>]*for=["']${id.replace(/[.*+?^$&{}()|[\\]\\\\]/g, "\\\\$&")}["']`, "i");
      const wrapped = new RegExp(`<label\\b[^>]*>\\s*<(?:input|select|textarea)\\b[^>]*\\bid=["']${id.replace(/[.*+?^$&{}()|[\\]\\\\]/g, "\\\\$&")}["']`, "i");
      if (!labelRe.test(html) && !wrapped.test(html)) warnings.push(`${file}: form control #${id} may not have an associated label`);
    }
  }

  if (!is404) {
    const description = attr(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)/i);
    if (description.length < 50) warnings.push(`${file}: meta description is short (${description.length} chars)`);
    if (isNoIndex(html) && !/<meta\s+name=["']robots["'][^>]*content=["'][^"']*follow/i.test(html)) {
      warnings.push(`${file}: noindex page does not explicitly state follow`);
    }

    const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1];
    const ogUrl = html.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i)?.[1];
    const expected = expectedCanonical(file);
    if (canonical && canonical !== expected) failures.push(`${file}: canonical is not the expected route URL`);
    if (canonical && ogUrl && canonical !== ogUrl) failures.push(`${file}: og:url does not match canonical`);
    if (!canonical || !canonical.startsWith(PUBLIC_ORIGIN)) failures.push(`${file}: canonical is outside configured Pages origin`);

    if (!fullI18n && /data-lang-btn/i.test(html)) {
      warnings.push(`${file}: language button exists on a page without full i18n; CSS/JS policy should keep it hidden`);
    }
    if (fullI18n && (html.match(/data-ar=["']/g) || []).length < 8) {
      failures.push(`${file}: data-i18n=full but too few localized fields are present`);
    }

    if (!noindex && canonical && !sitemap.includes(`<loc>${canonical}</loc>`)) {
      failures.push(`${file}: indexable canonical URL is missing from sitemap.xml`);
    }
    if (noindex && canonical && sitemap.includes(`<loc>${canonical}</loc>`)) {
      failures.push(`${file}: noindex URL must not appear in sitemap.xml`);
    }
  }

  for (const block of schemaBlocks) {
    try { JSON.parse(block); }
    catch { failures.push(`${file}: invalid JSON-LD block`); }
  }
  if (!is404 && schemaBlocks.length === 0) failures.push(`${file}: missing JSON-LD`);

  for (const href of localLinks) {
    const target = resolveLocalHref(file, href);
    if (target && !existsPublic(target)) failures.push(`${file}: broken local reference -> ${href}`);
  }

  const badBlankLinks = [...html.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi)]
    .map(m => m[0])
    .filter(tag => !/rel=["'][^"']*noopener/i.test(tag));
  if (badBlankLinks.length) failures.push(`${file}: target="_blank" link without rel="noopener"`);
  if ((html.match(/\bstyle=/gi)||[]).length > 0) {
    warnings.push(`${file}: inline style attributes present (${(html.match(/\bstyle=/gi)||[]).length}); prefer shared classes`);
  }
}

if (!sitemap) failures.push("sitemap.xml: missing or empty");
if (!sitemap.includes(PUBLIC_ORIGIN)) failures.push("sitemap.xml: canonical origin missing");
if (!/Sitemap:\s*https:\/\/ahmedsaturki\.github\.io\/numuw-studio\/sitemap\.xml/i.test(robots)) {
  failures.push("robots.txt: expected sitemap declaration is missing");
}
if (!existsPublic("og-image.png")) failures.push("og-image.png: missing shared social image");

if (!existsPublic(".well-known/security.txt")) failures.push(".well-known/security.txt: missing");
else {
  const securityTxt = fs.readFileSync(path.join(root, ".well-known/security.txt"), "utf8");
  if (!/^Contact:\s*https:\/\//mi.test(securityTxt)) failures.push(".well-known/security.txt: missing HTTPS Contact");
  if (!/^Policy:\s*https:\/\//mi.test(securityTxt)) failures.push(".well-known/security.txt: missing HTTPS Policy");
  if (!/^Expires:\s*\d{4}-\d{2}-\d{2}T/mi.test(securityTxt)) failures.push(".well-known/security.txt: missing Expires");
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  if (/<script\b[^>]*src=["']https?:\/\//i.test(html)) failures.push(file + ": external script dependency detected");
  if (/<link\b[^>]*rel=["'][^"']*stylesheet[^"']*["'][^>]*href=["']https?:\/\//i.test(html)) failures.push(file + ": external stylesheet dependency detected");
  if (/@import\s+url\((?:["']?)https?:\/\//i.test(html)) failures.push(file + ": external CSS import detected");
}

function hexLuminance(hex) {
  const value = hex.replace("#", "");
  const rgb = [0, 2, 4].map(i => Number.parseInt(value.slice(i, i + 2), 16) / 255);
  const linear = rgb.map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}
function contrastRatio(a, b) {
  const la = hexLuminance(a);
  const lb = hexLuminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}
for (const file of ["assets/css/numuw.css", "index.html"]) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const teal = source.match(/--teal:\s*(#[0-9a-f]{6})/i)?.[1];
  if (teal && contrastRatio(teal, "#ffffff") < 4.5) failures.push(file + ": --teal fails 4.5:1 contrast against white");
}
const sharedCss = fs.readFileSync(path.join(root, "assets/css/numuw.css"), "utf8");
if (!/:focus-visible\{[^}]*outline:2px solid var\(--navy\)[^}]*box-shadow:0 0 0 4px #fff/i.test(sharedCss)) {
  warnings.push("assets/css/numuw.css: two-tone focus ring pattern not detected");
}

const sitemapLocs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const indexablePageCount = htmlFiles.filter(file => file !== "404.html" && !isNoIndex(fs.readFileSync(path.join(root, file), "utf8"))).length;
const sitemapPageCount = sitemapLocs.filter(u => /\/numuw-studio\/(?!documents\/exports\/)[^?]+\/$/.test(u)).length;
if (sitemapLocs.length !== sitemapPageCount + sitemapLocs.filter(u => /\.pdf$/i.test(u)).length) {
  warnings.push("sitemap.xml: contains unexpected non-page/non-PDF locations");
}
if (sitemapPageCount !== indexablePageCount) {
  failures.push(`sitemap.xml: expected ${indexablePageCount} indexable pages, found ${sitemapPageCount}`);
}

console.log(`NUMUW static audit: ${htmlFiles.length} HTML files checked`);
console.log(`Failures: ${failures.length} | Warnings: ${warnings.length}`);
for (const item of warnings) console.warn("WARN:", item);
if (failures.length) {
  for (const item of failures) console.error("FAIL:", item);
  process.exit(1);
}
console.log("PASS: structure, metadata, indexability, JSON-LD, links, controls and release invariants are healthy.");