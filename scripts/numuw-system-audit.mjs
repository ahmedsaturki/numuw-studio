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
  if (!tag) return "";
  const re = new RegExp("\\b" + name + "\\s*=\\s*[\"']([^\"']*)[\"']", "i");
  return tag.match(re)?.[1] || "";
}

function bodyText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<header[\s\S]*?<\/header>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function add(file, message) {
  failures.push(file + ": " + message);
}

const files = walk(ROOT);
const fileSet = new Set(files);
const htmlFiles = files.filter(file => file.endsWith(".html"));
const pages = htmlFiles.filter(file => file !== "404.html");
const contents = new Map();

for (const file of htmlFiles) {
  contents.set(file, fs.readFileSync(path.join(ROOT, file), "utf8"));
}

const titleMap = new Map();
const descriptionMap = new Map();

for (const file of htmlFiles) {
  const html = contents.get(file);
  const is404 = file === "404.html";
  const titleTags = html.match(/<title\b[^>]*>[\s\S]*?<\/title>/gi) || [];
  const metaTags = tags(html, "meta");
  const descriptionTags = metaTags.filter(tag => attr(tag, "name").toLowerCase() === "description");
  const canonicalTags = tags(html, "link").filter(tag => attr(tag, "rel").toLowerCase().split(/\s+/).includes("canonical"));

  if (!/^<!doctype html>/i.test(html)) add(file, "missing HTML5 doctype");
  if (titleTags.length !== 1 || !titleTags[0].replace(/<[^>]+>/g, "").trim()) add(file, "title contract failed");
  if (!is404 && descriptionTags.length !== 1) add(file, "exactly one meta description required");
  if (!is404 && canonicalTags.length !== 1) add(file, "exactly one canonical required");

  const htmlOpen = html.match(/<html\b[^>]*>/i)?.[0] || "";
  if (!attr(htmlOpen, "lang")) add(file, "html lang missing");
  if (!/dir\s*=\s*["'](rtl|ltr)["']/i.test(htmlOpen)) add(file, "html dir missing/invalid");

  if (!/<main\b/i.test(html)) add(file, "main landmark missing");
  if (!is404 && (html.match(/<h1\b/gi) || []).length !== 1) add(file, "exactly one h1 required");
  if (is404 && !/name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) add(file, "404 must be noindex");

  if (!is404) {
    const expected = BASE + (file === "index.html" ? "" : file.replace(/\/index\.html$/, "/"));
    const canonical = attr(canonicalTags[0], "href");
    if (canonical !== expected) add(file, "canonical mismatch");

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
      const ok = metaTags.some(tag => attr(tag, kind).toLowerCase() === value && attr(tag, "content").trim() !== "");
      if (!ok) add(file, "missing or malformed " + value);
    }

    const ogUrl = metaTags.find(tag => attr(tag, "property").toLowerCase() === "og:url");
    if (attr(ogUrl, "content") !== canonical) add(file, "og:url must equal canonical");
  }

  for (const tag of metaTags) {
    if (/(?:content|href|rel|name|property)[A-Za-z0-9]+\s*=/i.test(tag)) add(file, "malformed metadata attribute");
  }

  for (const tag of tags(html, "link")) {
    if (/h[1-6][A-Za-z]/i.test(tag)) add(file, "malformed link/tag attribute");
  }

  if (/<h[1-6][A-Za-z]/i.test(html)) add(file, "malformed heading tag name");
  if (/<[^>]+\s+on[a-z]+\s*=/i.test(html)) add(file, "inline event handler detected");

  const headingLevels = [...html.matchAll(/<h([1-6])\b[^>]*>/gi)].map(match => Number(match[1]));
  for (let i = 1; i < headingLevels.length; i++) {
    if (headingLevels[i] > headingLevels[i - 1] + 1) add(file, "heading hierarchy skips a level");
  }

  const ids = new Set();
  for (const match of html.matchAll(/\bid=["']([^"']+)["']/gi)) {
    if (ids.has(match[1])) add(file, "duplicate id=" + match[1]);
    ids.add(match[1]);
  }

  const staticSkip = /<a\b[^>]*class=["'][^"']*skip[^"']*["'][^>]*href=["']#main["']/i.test(html);
  const sharedSkip = /<script\b[^>]*src=["'][^"']*assets\/js\/numuw\.js["'][^>]*>/i.test(html);
  if (!is404 && !staticSkip && !sharedSkip) add(file, "skip navigation contract missing");
  if (!is404 && !staticSkip && sharedSkip) warnings.push(file + ": skip link depends on shared JS");

  if (!is404 && !/data-nav|class=["'][^"']*navlinks/i.test(html)) add(file, "primary navigation missing");

  const menu = tags(html, "button").find(tag => /data-menu|menu-btn|class=["'][^"']*menu/i.test(tag));
  if (menu) {
    if (attr(menu, "type") && attr(menu, "type").toLowerCase() !== "button") add(file, "menu must use type=button");
    if (!attr(menu, "aria-controls") || !attr(menu, "aria-expanded")) {
      const runtimeMenu = /<script\b[^>]*src=["'][^"']*assets\/js\/numuw\.js["'][^>]*>/i.test(html);
      if (!runtimeMenu) add(file, "menu accessibility state missing without shared runtime");
      else warnings.push(file + ": menu ARIA state is supplied by shared runtime");
    }
  }

  for (const tag of tags(html, "a")) {
    if (attr(tag, "target") === "_blank" && !attr(tag, "rel").toLowerCase().split(/\s+/).includes("noopener")) {
      add(file, "target=_blank missing noopener");
    }
  }

  const staticMarkup = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ");
  for (const name of ["input", "select", "textarea"]) {
    for (const tag of tags(staticMarkup, name)) {
      const type = attr(tag, "type").toLowerCase();
      if (type === "hidden") continue;
      if (!attr(tag, "id")) add(file, name + " missing id");
    }
  }

  for (const block of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(block[1]);
    } catch {
      add(file, "invalid JSON-LD");
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
    if (target === "." || target === "") target = "index.html";
    if (target === "." || target === "") target = "index.html";
    if (!path.posix.extname(target) && fileSet.has(target + "/index.html")) target += "/index.html";
    if (!fileSet.has(target)) add(file, "broken local reference -> " + ref);
  }

  const title = titleTags[0].replace(/<[^>]+>/g, "").trim().toLowerCase();
  const description = descriptionTags.length ? attr(descriptionTags[0], "content").trim().toLowerCase() : "";
  if (title) titleMap.set(title, [...(titleMap.get(title) || []), file]);
  if (description) descriptionMap.set(description, [...(descriptionMap.get(description) || []), file]);

  const text = bodyText(html);
  if (file.startsWith("products/") && file !== "products/index.html") {
    for (const word of ["مناسب", "نطاق", "مخرجات"]) {
      if (!text.includes(word)) add(file, "product contract missing " + word);
    }
  }
}

for (const [value, items] of titleMap) {
  if (items.length > 1) add(items[0], "duplicate title with " + items.slice(1).join(", "));
}

for (const [value, items] of descriptionMap) {
  if (items.length > 1) add(items[0], "duplicate description with " + items.slice(1).join(", "));
}

const sitemap = fs.existsSync(path.join(ROOT, "sitemap.xml"))
  ? fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8")
  : "";
const locs = [...sitemap.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map(match => match[1].trim());

if (!locs.length) add("sitemap.xml", "no loc entries");
if (locs.some(url => !url.startsWith(BASE))) add("sitemap.xml", "non-canonical origin found");
for (const file of pages) {
  const expected = BASE + (file === "index.html" ? "" : file.replace(/\/index\.html$/, "/"));
  if (!locs.includes(expected)) add("sitemap.xml", "missing " + expected);
}
if (locs.some(url => /\/404\.html$/i.test(url))) add("sitemap.xml", "404 must not be listed");
if (!fs.existsSync(path.join(ROOT, "SECURITY.md"))) add("SECURITY.md", "missing");
if (!fs.existsSync(path.join(ROOT, ".well-known/security.txt"))) add(".well-known/security.txt", "missing");

const css = fs.existsSync(path.join(ROOT, "assets/css/numuw.css"))
  ? fs.readFileSync(path.join(ROOT, "assets/css/numuw.css"), "utf8")
  : "";
if (!/:focus-visible\{[^}]*outline:2px solid var\(--navy\)/.test(css)) {
  add("assets/css/numuw.css", "visible focus contract missing");
}

const requiredHubs = ["solutions/index.html", "industries/index.html", "start/index.html"];
for (const hub of requiredHubs) {
  if (!fileSet.has(hub)) add(hub, "required system hub missing");
}

console.log("NUMUW SYSTEM AUDIT");
console.log("Pages: " + pages.length);
console.log("Failures: " + failures.length);
console.log("Warnings: " + warnings.length);
for (const item of warnings) console.warn("WARN:", item);
for (const item of failures) console.error("FAIL:", item);
if (failures.length) process.exit(1);
console.log("PASS: whole-system release contracts are healthy.");
