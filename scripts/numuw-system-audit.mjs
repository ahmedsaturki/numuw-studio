import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = "https://ahmedsaturki.github.io/numuw-studio/";
const failures = [];
const warnings = [];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules", ".autoresearch"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(path.relative(ROOT, full).split(path.sep).join("/"));
  }
  return out.sort();
}

function tags(html, name) {
  return html.match(new RegExp("<" + name + "\\b[^>]*>", "gi")) || [];
}

function attr(tag, name) {
  const re = new RegExp("\\b" + name + "\\s*=\\s*[\"']([^\"']*)[\"']", "i");
  return tag.match(re)?.[1] || "";
}

function bodyText(html) {
  return html
    .replace(/<script[\\s\\S]*?<\\/script>/gi, " ")
    .replace(/<style[\\s\\S]*?<\\/style>/gi, " ")
    .replace(/<header[\\s\\S]*?<\\/header>/gi, " ")
    .replace(/<footer[\\s\\S]*?<\\/footer>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\\s+/g, " ")
    .trim()
    .toLowerCase();
}

function fail(file, message) {
  failures.push(file + ": " + message);
}

const files = walk(ROOT);
const fileSet = new Set(files);
const htmlFiles = files.filter(file => file.endsWith(".html"));
const pages = htmlFiles.filter(file => file !== "404.html");
const contents = new Map(pages.map(file => [file, fs.readFileSync(path.join(ROOT, file), "utf8")]));
const titles = new Map();
const descriptions = new Map();

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(ROOT, file), "utf8");
  const is404 = file === "404.html";

  if (!/^<!doctype html>/i.test(html)) fail(file, "missing HTML5 doctype");

  const titleTags = html.match(/<title\\b[^>]*>[\\s\\S]*?<\\/title>/gi) || [];
  if (titleTags.length !== 1 || !titleTags[0].replace(/<[^>]+>/g, "").trim()) {
    fail(file, "title contract failed");
  }

  const metaDescription = tags(html, "meta").filter(tag => attr(tag, "name").toLowerCase() === "description");
  if (!is404 && metaDescription.length !== 1) fail(file, "exactly one meta description required");

  const canonical = tags(html, "link").filter(tag => attr(tag, "rel").toLowerCase().split(/\\s+/).includes("canonical"));
  if (!is404 && canonical.length !== 1) fail(file, "exactly one canonical required");

  const htmlOpen = html.match(/<html\\b[^>]*>/i)?.[0] || "";
  if (!attr(htmlOpen, "lang")) fail(file, "html lang missing");
  if (!/\\bdir\\s*=\\s*[\"'](?:rtl|ltr)[\"']/i.test(htmlOpen)) fail(file, "html dir missing/invalid");

  if (!/<main\\b/i.test(html)) fail(file, "main landmark missing");
  if (!is404 && (html.match(/<h1\\b/gi) || []).length !== 1) fail(file, "exactly one h1 required");
  if (is404 && !/name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) fail(file, "404 must be noindex");

  if (!is404) {
    const canonicalUrl = attr(canonical[0], "href");
    const expected = BASE + (file === "index.html" ? "" : file.replace(/\\/index\\.html$/, "/"));
    if (canonicalUrl !== expected) fail(file, "canonical mismatch");

    const requiredMeta = [
      ["property", "og:title"],
      ["property", "og:description"],
      ["property", "og:url"],
      ["property", "og:image"],
      ["name", "twitter:card"],
      ["name", "twitter:title"],
      ["name", "twitter:description"],
      ["name", "twitter:image"]
    ];

    for (const [kind, value] of requiredMeta) {
      const found = tags(html, "meta").some(tag =>
        attr(tag, kind).toLowerCase() === value && attr(tag, "content").trim() !== ""
      );
      if (!found) fail(file, "missing or malformed " + value);
    }

    if (attr(tags(html, "meta").find(tag => attr(tag, "property").toLowerCase() === "og:url") || "", "content") !== canonicalUrl) {
      fail(file, "og:url must equal canonical");
    }
  }

  for (const tag of tags(html, "meta")) {
    if (/\\b(?:content|href|rel|name|property)[A-Za-z0-9]+\\s*=/i.test(tag)) {
      fail(file, "malformed metadata attribute");
    }
  }

  for (const tag of tags(html, "link")) {
    if (/<h[1-6][A-Za-z]/i.test(tag)) fail(file, "malformed link/tag attribute");
  }

  if (/<h[1-6][A-Za-z]/i.test(html)) fail(file, "malformed heading tag name");
  if (/<[^>]+\\s+on[a-z]+\\s*=/i.test(html)) fail(file, "inline event handler detected");

  const headingLevels = [...html.matchAll(/<h([1-6])\\b[^>]*>/gi)].map(match => Number(match[1]));
  for (let i = 1; i < headingLevels.length; i++) {
    if (headingLevels[i] > headingLevels[i - 1] + 1) fail(file, "heading hierarchy skips a level");
  }

  const ids = new Set();
  for (const match of html.matchAll(/\\bid=["']([^"']+)["']/gi)) {
    if (ids.has(match[1])) fail(file, "duplicate id=" + match[1]);
    ids.add(match[1]);
  }

  const staticSkip = /<a\\b[^>]*href=["']#main["'][^>]*class=["'][^"']*skip/i.test(html);
  const sharedSkipFallback = /<script\\b[^>]*src=["'][^"']*assets\\/js\\/numuw\\.js["'][^>]*>/i.test(html);
  if (!is404 && !staticSkip && !sharedSkipFallback) fail(file, "skip navigation contract missing");
  if (!is404 && !staticSkip && sharedSkipFallback) warnings.push(file + ": skip link depends on shared runtime");

  const nav = tags(html, "nav").some(tag => /data-nav|navlinks/i.test(tag));
  if (!is404 && !nav) fail(file, "primary navigation missing");

  const menu = tags(html, "button").find(tag => /data-menu|menu-btn|class=["'][^"']*menu/i.test(tag));
  if (menu) {
    if (attr(menu, "type") && attr(menu, "type").toLowerCase() !== "button") fail(file, "menu must use type=button");
    if (!attr(menu, "aria-controls")) fail(file, "menu aria-controls missing");
    if (!attr(menu, "aria-expanded")) fail(file, "menu aria-expanded missing");
  }

  for (const tag of tags(html, "a")) {
    const a = attr(tag, "target");
    if (a === "_blank" && !attr(tag, "rel").toLowerCase().split(/\\s+/).includes("noopener")) {
      fail(file, "target=_blank missing noopener");
    }
  }

  for (const block of html.matchAll(/<script\\b[^>]*type=["']application\\/ld\\+json["'][^>]*>([\\s\\S]*?)<\\/script>/gi)) {
    try {
      JSON.parse(block[1]);
    } catch {
      fail(file, "invalid JSON-LD");
    }
  }

  for (const ref of [...html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map(match => match[1])) {
    const raw = ref.split("#")[0].split("?")[0];
    if (!raw || raw.startsWith("#") || raw.startsWith("//") || /^[A-Za-z][A-Za-z0-9+.-]*:/.test(raw)) continue;

    let target = raw;
    if (raw.startsWith("/")) {
      if (!raw.startsWith("/numuw-studio/")) continue;
      target = raw.slice("/numuw-studio/".length);
    } else {
      target = path.posix.normalize(path.posix.join(path.posix.dirname(file), raw));
    }

    if (target.endsWith("/")) target += "index.html";
    if (!path.posix.extname(target) && fileSet.has(target + "/index.html")) target += "/index.html";
    if (!fileSet.has(target)) fail(file, "broken local reference -> " + ref);
  }

  const title = (titleTags[0] || "").replace(/<[^>]+>/g, "").trim().toLowerCase();
  const desc = metaDescription.length ? attr(metaDescription[0], "content").trim().toLowerCase() : "";
  if (title) titles.set(title, [...(titles.get(title) || []), file]);
  if (desc) descriptions.set(desc, [...(descriptions.get(desc) || []), file]);

  const text = bodyText(html);
  if (file.startsWith("products/") && file !== "products/index.html") {
    for (const keyword of ["مناسب", "نطاق", "مخرجات"]) {
      if (!text.includes(keyword)) fail(file, "product contract missing " + keyword);
    }
  }
}

for (const [value, items] of titles) {
  if (items.length > 1) fail(items[0], "duplicate title with " + items.slice(1).join(", "));
}
for (const [value, items] of descriptions) {
  if (items.length > 1) fail(items[0], "duplicate description with " + items.slice(1).join(", "));
}

const sitemap = fs.existsSync(path.join(ROOT, "sitemap.xml")) ? fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8") : "";
const locs = [...sitemap.matchAll(/<loc>\\s*([^<]+)\\s*<\\/loc>/gi)].map(match => match[1].trim());
if (!locs.length) fail("sitemap.xml", "no loc entries");
if (locs.some(url => !url.startsWith(BASE))) fail("sitemap.xml", "non-canonical origin found");
for (const file of pages) {
  const expected = BASE + (file === "index.html" ? "" : file.replace(/\\/index\\.html$/, "/"));
  if (!locs.includes(expected)) fail("sitemap.xml", "missing " + expected);
}
if (locs.some(url => /\\/404\\.html$/i.test(url))) fail("sitemap.xml", "404 must not be listed");

if (!fs.existsSync(path.join(ROOT, "SECURITY.md"))) fail("SECURITY.md", "missing");
if (!fs.existsSync(path.join(ROOT, ".well-known/security.txt"))) fail(".well-known/security.txt", "missing");

const css = fs.existsSync(path.join(ROOT, "assets/css/numuw.css")) ? fs.readFileSync(path.join(ROOT, "assets/css/numuw.css"), "utf8") : "";
if (!/:focus-visible\\{[^}]*outline:2px solid var\\(--navy\\)/.test(css)) fail("assets/css/numuw.css", "visible focus contract missing");

console.log("NUMUW SYSTEM AUDIT");
console.log("Pages: " + pages.length);
console.log("Failures: " + failures.length);
console.log("Warnings: " + warnings.length);
for (const item of warnings) console.warn("WARN:", item);
for (const item of failures) console.error("FAIL:", item);
if (failures.length) process.exit(1);
console.log("PASS: whole-system release contracts are healthy.");
