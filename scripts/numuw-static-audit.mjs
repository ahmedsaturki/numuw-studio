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
function escRegex(s) { return s.replace(/[.*+?^$&{}()|[\]\\]/g, "\\$&"); }
function attr(html, re) { return (html.match(re)?.[1] ?? "").trim(); }
function resolveLocalHref(sourcePath, href) {
  const clean = href.split("#")[0].split("?")[0];
  if (!clean || clean.startsWith("/") || /^[a-z][a-z0-9+.-]*:/i.test(clean)) return null;
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

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const is404 = file === "404.html";
  const titleCount = (html.match(/<title>/gi) || []).length;
  const descCount = (html.match(/<meta\s+name=["']description["']/gi) || []).length;
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const canonicalCount = (html.match(/rel=["']canonical["']/gi) || []).length;
  const schemaBlocks = [...html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  const localLinks = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map(m => m[1]);

  if (!/^<!doctype html>/i.test(html)) failures.push(`${file}: missing HTML5 doctype`);
  if (titleCount !== 1) failures.push(`${file}: expected exactly one <title>, found ${titleCount}`);
  if (!is404 && descCount !== 1) failures.push(`${file}: expected exactly one meta description, found ${descCount}`);
  if (!is404 && h1Count !== 1) failures.push(`${file}: expected exactly one <h1>, found ${h1Count}`);
  if (!is404 && canonicalCount !== 1) failures.push(`${file}: expected exactly one canonical link, found ${canonicalCount}`);
  if (!/<meta\s+name=["']viewport["']/i.test(html)) failures.push(`${file}: missing viewport meta`);
  if (!/<main\b/i.test(html)) failures.push(`${file}: missing <main>`);
  if (!/<html\b[^>]*lang=["'][a-z-]+["']/i.test(html)) failures.push(`${file}: missing html lang`);
  if (!is404 && !/property=["']og:title["']/i.test(html)) failures.push(`${file}: missing og:title`);
  if (!is404 && !/property=["']og:image["']/i.test(html)) failures.push(`${file}: missing og:image`);
  if (!is404 && !/name=["']twitter:card["']/i.test(html)) failures.push(`${file}: missing twitter:card`);
  if (/href=["']javascript:/i.test(html)) failures.push(`${file}: javascript: URL detected`);

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
  }
}

const sitemap = fs.existsSync(path.join(root, "sitemap.xml"))
  ? fs.readFileSync(path.join(root, "sitemap.xml"), "utf8")
  : "";
if (!sitemap) failures.push("sitemap.xml: missing or empty");
if (!sitemap.includes(PUBLIC_ORIGIN)) failures.push("sitemap.xml: canonical origin missing");
if (!existsPublic("og-image.png")) failures.push("og-image.png: missing shared social image");

const indexable = htmlFiles.filter(f => f !== "404.html");
const canonicalOrigin = /^https:\/\/ahmedsaturki\.github\.io\/numuw-studio\/$/;
for (const file of indexable) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1];
  if (!canonical || (!canonicalOrigin.test(canonical) && !canonical.startsWith(PUBLIC_ORIGIN))) {
    failures.push(`${file}: canonical is outside the configured Pages origin`);
    continue;
  }
  if (!sitemap.includes(`<loc>${canonical}</loc>`)) {
    failures.push(`${file}: canonical URL is missing from sitemap.xml`);
  }
}

console.log(`NUMUW static audit: ${htmlFiles.length} HTML files checked`);
console.log(`Failures: ${failures.length} | Warnings: ${warnings.length}`);
for (const item of warnings) console.warn("WARN:", item);
if (failures.length) {
  for (const item of failures) console.error("FAIL:", item);
  process.exit(1);
}
console.log("PASS: static structure, metadata, JSON-LD, links and release invariants are healthy.");