#!/usr/bin/env node
// Deterministic static site-quality scanner for the NUMUW marketing site.
// Emits three METRIC lines on stdout; all human-readable detail goes to stderr.
// Exit 0 on a successful measurement (any issue count), exit 1 on harness errors.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = "https://ahmedsaturki.github.io/numuw-studio/";
const SKIP_DIRS = new Set([".git", "node_modules", "bench", ".autoresearch"]);
const SKIP_FILES = new Set(["autoresearch.sh", "site-quality.mjs"]);
const SITEMAP = "sitemap.xml";
const NOT_FOUND_PAGE = "404.html";

const problems = [];
let issues = 0;
let totalBytes = 0;
let htmlBytes = 0;

function fail(message) {
  process.stderr.write(`HARNESS ERROR: ${message}\n`);
  process.exit(1);
}

function report(file, rule, detail) {
  issues += 1;
  problems.push(`${file}: ${rule}: ${detail}`);
}

function toPosix(rel) {
  return rel.split(path.sep).join("/");
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function truncate(s) {
  return s.length > 80 ? `${s.slice(0, 77)}...` : s;
}

// ---------------------------------------------------------------------------
// File walk (deterministic: sorted dirs and files, explicit skips)
// ---------------------------------------------------------------------------
function walk(dir, out) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    fail(`walk failed at ${toPosix(path.relative(ROOT, dir)) || "."}: ${err.message}`);
  }
  const dirs = [];
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory()) dirs.push(entry.name);
    else if (entry.isFile()) files.push(entry.name);
  }
  dirs.sort();
  files.sort();
  for (const name of dirs) {
    if (SKIP_DIRS.has(name)) continue;
    walk(path.join(dir, name), out);
  }
  for (const name of files) {
    if (SKIP_FILES.has(name)) continue;
    out.push(path.join(dir, name));
  }
  return out;
}

const walked = walk(ROOT, []);
const allFiles = walked.map((abs) => toPosix(path.relative(ROOT, abs)));
allFiles.sort();

for (const rel of allFiles) {
  let stat;
  try {
    stat = fs.statSync(path.join(ROOT, rel));
  } catch (err) {
    fail(`unreadable file ${rel}: ${err.message}`);
  }
  totalBytes += stat.size;
  if (rel.toLowerCase().endsWith(".html")) htmlBytes += stat.size;
}

const htmlFiles = allFiles.filter((f) => f.toLowerCase().endsWith(".html"));
const fileSet = new Set(allFiles);

// ---------------------------------------------------------------------------
// Route + reference resolution
// ---------------------------------------------------------------------------
// index.html -> BASE + dir path with trailing slash; root index.html -> BASE.
function routeUrl(rel) {
  const dir = path.posix.dirname(rel);
  if (dir === ".") return BASE;
  return BASE + dir + "/";
}

// Resolve a site-relative reference to a repo-relative file, or null.
function resolveTarget(fromRel, ref) {
  const joined = path.posix.join(path.posix.dirname(fromRel), ref);
  if (joined.startsWith("..")) return null;
  if (fileSet.has(joined)) return joined;
  const viaIndex = path.posix.join(joined, "index.html");
  if (fileSet.has(viaIndex)) return viaIndex;
  return null;
}

// Skip anything that is not a same-repo relative reference.
function isExternal(raw) {
  const v = raw.trim();
  if (v === "") return true;
  if (v.startsWith("//")) return true;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(v)) return true;
  return false;
}

// An href assembled by JavaScript, e.g. `href="'+url+'"` or `href="${url}"`.
// The final value only exists at runtime, so R10 cannot resolve it statically.
// Deliberately narrow: a literal `+` in a real path (`../a+b/`) is still a
// link that must be checked.
function isRuntimeExpression(raw) {
  if (/^\s*'.*\+.*'\s*$/.test(raw)) return true;
  return /\$\{[^}]*\}/.test(raw);
}

// ---------------------------------------------------------------------------
// Minimal tag / attribute parsing
// ---------------------------------------------------------------------------
function attrsOf(tag) {
  const inner = tag.slice(1, -1);
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*("([^"]*)"|'([^']*)'|([^\s"'`=<>]+)))?/g;
  const attrs = {};
  let m;
  while ((m = re.exec(inner)) !== null) {
    const name = m[1].toLowerCase();
    if (!(name in attrs)) attrs[name] = m[3] ?? m[4] ?? m[5] ?? "";
  }
  return attrs;
}

function findTags(html, tagName) {
  return html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) ?? [];
}

function metaTag(html, name) {
  for (const tag of findTags(html, "meta")) {
    const a = attrsOf(tag);
    if (a.name && a.name.toLowerCase() === name) return tag;
  }
  return null;
}

function idSetHas(html, id) {
  const re = /id\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
  for (const m of html.matchAll(re)) {
    if ((m[1] ?? m[2] ?? m[3] ?? "") === id) return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Sitemap
// ---------------------------------------------------------------------------
if (!fileSet.has(SITEMAP)) fail(`missing ${SITEMAP}`);
let sitemapRaw;
try {
  sitemapRaw = fs.readFileSync(path.join(ROOT, SITEMAP), "utf8");
} catch (err) {
  fail(`unreadable ${SITEMAP}: ${err.message}`);
}

const sitemapLocs = [];
for (const m of sitemapRaw.matchAll(/<loc>\s*([^<]*?)\s*<\/loc>/g)) sitemapLocs.push(m[1].trim());
const sitemapSet = new Set(sitemapLocs);

// ---------------------------------------------------------------------------
// Per-page rules R1-R13
// ---------------------------------------------------------------------------
const titles = new Map();
const descriptions = new Map();

for (const rel of htmlFiles) {
  let html;
  try {
    html = fs.readFileSync(path.join(ROOT, rel), "utf8");
  } catch (err) {
    fail(`unreadable file ${rel}: ${err.message}`);
  }
  const is404 = rel === NOT_FOUND_PAGE;
  const expected = routeUrl(rel);

  // R1 <title> present and non-empty
  const titleMatch = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const titleText = titleMatch ? titleMatch[1].trim() : "";
  if (!titleText) {
    report(rel, "R1", "missing or empty <title>");
  } else if (!titles.has(titleText)) {
    titles.set(titleText, [rel]);
  } else {
    titles.get(titleText).push(rel);
  }

  // R2 <meta name="description"> present and non-empty
  let description = null;
  for (const tag of findTags(html, "meta")) {
    const a = attrsOf(tag);
    if (a.name && a.name.toLowerCase() === "description") {
      description = (a.content ?? "").trim();
      break;
    }
  }
  if (!description) {
    report(rel, "R2", "missing or empty meta description");
  } else if (!descriptions.has(description)) {
    descriptions.set(description, [rel]);
  } else {
    descriptions.get(description).push(rel);
  }

  // R3 <html lang>
  const htmlTags = findTags(html, "html");
  const lang = htmlTags.length ? (attrsOf(htmlTags[0]).lang ?? "").trim() : "";
  if (!lang) report(rel, "R3", "missing <html lang>");

  // R4 <meta charset>
  if (!findTags(html, "meta").some((t) => /\bcharset\s*=/i.test(t))) {
    report(rel, "R4", "missing <meta charset>");
  }

  // R5 <meta name="viewport">
  if (!metaTag(html, "viewport")) report(rel, "R5", "missing <meta name=viewport>");

  // R6 exactly one <h1>
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  if (h1Count !== 1) report(rel, "R6", `expected exactly 1 <h1>, found ${h1Count}`);

  // R7 canonical equals expected route URL (404 exempt)
  if (!is404) {
    let canonical = null;
    for (const tag of findTags(html, "link")) {
      const a = attrsOf(tag);
      const rel = (a.rel ?? "").toLowerCase().trim();
      if (rel.split(/\s+/).includes("canonical")) {
        canonical = (a.href ?? "").trim();
        break;
      }
    }
    if (canonical === null) {
      report(rel, "R7", "missing <link rel=canonical>");
    } else if (canonical !== expected) {
      report(rel, "R7", `canonical mismatch: expected ${expected}, found ${canonical || "(empty)"}`);
    }
  }

  // R8 at least one JSON-LD block; every block must parse
  const ldBlocks = [];
  const ldRe = /<script\b[^>]*\btype\s*=\s*(?:"application\/ld\+json"|'application\/ld\+json')[^>]*>([\s\S]*?)<\/script>/gi;
  for (const m of html.matchAll(ldRe)) ldBlocks.push(m[1]);
  if (ldBlocks.length === 0) {
    report(rel, "R8", "missing JSON-LD structured data");
  } else {
    let idx = 0;
    for (const block of ldBlocks) {
      idx += 1;
      const text = block.trim();
      if (!text) {
        report(rel, "R8", `JSON-LD block ${idx} is empty`);
        continue;
      }
      try {
        JSON.parse(text);
      } catch (err) {
        report(rel, "R8", `JSON-LD block ${idx} is not valid JSON: ${err.message}`);
      }
    }
  }

  // R9 every <img> has an alt attribute
  for (const tag of findTags(html, "img")) {
    if (!("alt" in attrsOf(tag))) report(rel, "R9", `<img> without alt attribute`);
  }

  // R10 internal href targets exist; R12 same-page anchors resolve
  for (const tag of [...findTags(html, "a"), ...findTags(html, "link"), ...findTags(html, "area")]) {
    const a = attrsOf(tag);
    if (!("href" in a)) continue;
    const raw = a.href.trim();
    if (raw === "" || isExternal(raw) || isRuntimeExpression(raw)) continue;
    if (raw.startsWith("#")) {
      const id = decodeURIComponent(raw.slice(1));
      if (id !== "" && !idSetHas(html, id)) report(rel, "R12", `href="${raw}" has no matching id in this page`);
      continue;
    }
    const clean = raw.split("#")[0].split("?")[0];
    if (clean === "") continue;
    if (resolveTarget(rel, clean) === null) report(rel, "R10", `internal href target does not exist: ${raw}`);
  }

  // R11 internal src targets exist
  const seenSrcTags = new Set();
  for (const name of ["img", "script", "iframe", "source", "video", "audio", "embed", "track"]) {
    for (const tag of findTags(html, name)) {
      if (seenSrcTags.has(tag)) continue;
      seenSrcTags.add(tag);
      const a = attrsOf(tag);
      if (!("src" in a)) continue;
      const raw = a.src.trim();
      if (raw === "" || isExternal(raw)) continue;
      const clean = raw.split("#")[0].split("?")[0];
      if (clean === "") continue;
      if (resolveTarget(rel, clean) === null) report(rel, "R11", `internal src target does not exist: ${raw}`);
    }
  }

  // R13 page listed in sitemap under its expected route URL (404 exempt)
  if (!is404 && !sitemapSet.has(expected)) {
    report(rel, "R13", `not listed in ${SITEMAP} as ${expected}`);
  }
}

// ---------------------------------------------------------------------------
// R14 sitemap integrity
// ---------------------------------------------------------------------------
{
  const routes = new Set(htmlFiles.map(routeUrl));
  const notFoundUrl = BASE + NOT_FOUND_PAGE;
  for (const url of sitemapLocs) {
    if (routes.has(url)) continue;
    if (url === NOT_FOUND_PAGE || url === notFoundUrl) {
      report(SITEMAP, "R14", `sitemap must not list ${NOT_FOUND_PAGE}`);
      continue;
    }
    if (!url.startsWith(BASE)) {
      report(SITEMAP, "R14", `loc outside base URL: ${url}`);
      continue;
    }
    const rest = url.slice(BASE.length);
    if (rest === "" || rest.endsWith("/")) {
      report(SITEMAP, "R14", `loc has no matching page: ${url}`);
      continue;
    }
    // A non-HTML asset (PDF, image, stylesheet, ...) has no HTML route but is
    // still a resolvable, deployed sitemap target when the file exists.
    if (fileSet.has(rest)) continue;
    report(SITEMAP, "R14", `loc has no matching page: ${url}`);
  }
}

// ---------------------------------------------------------------------------
// R15 / R16 duplicate metadata
// ---------------------------------------------------------------------------
function reportDuplicates(map, rule, label) {
  const keys = [...map.keys()].sort();
  for (const key of keys) {
    const files = map.get(key);
    for (let i = 1; i < files.length; i += 1) {
      report(files[i], rule, `duplicate ${label} shared with ${files[0]}: ${truncate(key)}`);
    }
  }
}
reportDuplicates(titles, "R15", "<title>");
reportDuplicates(descriptions, "R16", "meta description");

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------
problems.sort();
for (const line of problems) process.stderr.write(`${line}\n`);

process.stdout.write(`METRIC issues=${issues}\n`);
process.stdout.write(`METRIC total_bytes=${totalBytes}\n`);
process.stdout.write(`METRIC html_bytes=${htmlBytes}\n`);

// Combined metric for autoresearch runner
process.stdout.write(`METRIC issues * 1e6 + html_bytes=${issues * 1e6 + htmlBytes}\n`);


// Legacy single-metric form ("<metric>: <value>") for consumers that parse
// one primary metric per line via prefix match.
process.stdout.write(`issues: ${issues}\n`);