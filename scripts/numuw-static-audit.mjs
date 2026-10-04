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

const htmlFiles = walk(root)
  .filter(f => f.endsWith(".html"))
  .map(rel)
  .sort();

const sitemap = fs.existsSync(path.join(root, "sitemap.xml"))
  ? fs.readFileSync(path.join(root, "sitemap.xml"), "utf8")
  : "";
const robots = fs.existsSync(path.join(root, "robots.txt"))
  ? fs.readFileSync(path.join(root, "robots.txt"), "utf8")
  : "";

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const is404 = file === "404.html";
  const titleCount = (html.match(/<title>/gi) || []).length;
  const descCount = (html.match(/<meta\s+name=["']description["']/gi) || []).length;
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const canonicalCount = (html.match(/rel=["']canonical["']/gi) || []).length;
  const schemaBlocks = [...html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  const localLinks = [...markup.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map(m => m[1]);
  const markup = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  const images = [...html.matchAll(/<img\b([^>]*)>/gi)].map(m => m[1]);

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
  if (!is404 && !/name=["']twitter:card["']/i.test(html)) failures.push(`${file}: missing twitter:card`);
  if (!is404 && !/name=["']twitter:image["']/i.test(html)) failures.push(`${file}: missing twitter:image`);
  if (is404 && !/<meta\s+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) failures.push("404.html: missing noindex robots meta");
  if (/href=["']javascript:/i.test(html)) failures.push(`${file}: javascript: URL detected`);
  if (/<(?:a|area|button|body|div|form|img|input|select|textarea)[^>]+\s+on[a-z]+\s*=/i.test(markup)) failures.push(`${file}: inline event handler detected`);

  if (/\bstyle\s*=/i.test(markup)) failures.push(file + ": inline style detected");
  const buttonTags = [...markup.matchAll(/<button\b[^>]*>/gi)].map(m => m[0]);
  for (const tag of buttonTags) if (!/\btype\s*=/i.test(tag)) failures.push(file + ": button missing explicit type");
  for (const image of images) {
    if (!/\balt\s*=\s*["'][^"']*["']/i.test(image)) failures.push(`${file}: <img> without alt attribute`);
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

  if (!is404) {
    const description = attr(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)/i);
    if (description.length < 50) warnings.push(`${file}: meta description is short (${description.length} chars)`);

    const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1];
    const ogUrl = html.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i)?.[1];
    if (canonical && ogUrl && canonical !== ogUrl) failures.push(`${file}: og:url does not match canonical`);
    if (!canonical || !canonical.startsWith(PUBLIC_ORIGIN)) {
      failures.push(`${file}: canonical is outside the configured Pages origin`);
    } else if (!sitemap.includes(`<loc>${canonical}</loc>`)) {
      failures.push(`${file}: canonical URL is missing from sitemap.xml`);
    }
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

console.log(`NUMUW static audit: ${htmlFiles.length} HTML files checked`);
console.log(`Failures: ${failures.length} | Warnings: ${warnings.length}`);
for (const item of warnings) console.warn("WARN:", item);
if (failures.length) {
  for (const item of failures) console.error("FAIL:", item);
  process.exit(1);
}
console.log("PASS: static structure, metadata, JSON-LD, links and release invariants are healthy.");
