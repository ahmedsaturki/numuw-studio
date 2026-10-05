#!/usr/bin/env node
// Regression tests for scripts/numuw-static-audit.mjs.
// The release audit is intentionally tested with throwaway minimal sites so
// changes to the guard itself cannot silently make bad HTML look healthy.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const HERE = new URL(".", import.meta.url).pathname;
const scanner = path.resolve(HERE, "numuw-static-audit.mjs");
const base = "https://ahmedsaturki.github.io/numuw-studio/";

let passed = 0;
let failed = 0;

function fixture(overrides = {}) {
  const {
    heading = "<h1>NUMUW",
    metaExtra = "",
    malformedHead = "",
    body = "<p>Body</p>",
    closing = "</h1>",
  } = overrides;
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>NUMUW Test</title>
<meta name="description" content="A valid test description for the NUMUW release audit fixture.">
<link rel="canonical" href="${base}">
<meta property="og:title" content="NUMUW Test">
<meta property="og:description" content="A valid test description for the NUMUW release audit fixture.">
<meta property="og:type" content="website">
<meta property="og:url" content="${base}">
<meta property="og:image" content="${base}og-image.png">
<meta property="og:site_name" content="NUMUW | نُمو">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="NUMUW Test">
<meta name="twitter:description" content="A valid test description for the NUMUW release audit fixture.">
<meta name="twitter:image" content="${base}og-image.png">
<link rel="stylesheet" href="assets/css/numuw.css">
${metaExtra}
${malformedHead}
</head>
<body>
${heading}${closing}
${body}
</body>
</html>`;
}

function run(overrides = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "numuw-audit-"));
  fs.mkdirSync(path.join(root, "assets", "css"), { recursive: true });
  fs.mkdirSync(path.join(root, "scripts"), { recursive: true });
  fs.copyFileSync(scanner, path.join(root, "scripts", "numuw-static-audit.mjs"));
  fs.writeFileSync(path.join(root, "assets", "css", "numuw.css"),
    ":root{--teal:#08766e}:focus-visible{outline:2px solid var(--navy);box-shadow:0 0 0 4px #fff}");
  fs.writeFileSync(path.join(root, "og-image.png"), "fixture");
  fs.writeFileSync(path.join(root, "robots.txt"), `User-agent: *
Allow: /
Sitemap: ${base}sitemap.xml
`);
  fs.mkdirSync(path.join(root, ".well-known"), { recursive: true });
  fs.writeFileSync(path.join(root, ".well-known", "security.txt"),
    "Contact: https://example.com/security\nPolicy: https://example.com/policy\nExpires: 2027-04-01T00:00:00Z\n");
  fs.writeFileSync(path.join(root, "sitemap.xml"),
    `<?xml version="1.0"?><urlset><url><loc>${base}</loc></url></urlset>`);
  fs.writeFileSync(path.join(root, "index.html"), fixture(overrides));
  const result = spawnSync(process.execPath, [path.join(root, "scripts", "numuw-static-audit.mjs")], {
    cwd: root, encoding: "utf8"
  });
  const output = (result.stdout || "") + (result.stderr || "");
  fs.rmSync(root, { recursive: true, force: true });
  return { code: result.status ?? 1, output };
}

function check(name, fn) {
  try { fn(); passed++; console.log(`ok  ${name}`); }
  catch (err) { failed++; console.error(`FAIL ${name}\n    ${err.message}`); }
}

check("clean fixture passes", () => {
  const r = run({ heading: "<h1>NUMUW</h1>", closing: "</h1>" });
  if (r.code !== 0) throw new Error(r.output);
});

check("R18 catches mismatched heading closing tags", () => {
  const r = run({ heading: "<h1>NUMUW</h1><h2>Section", closing: "</h3>" });
  if (!/mismatched heading closing tag/i.test(r.output)) throw new Error(r.output);
});

check("R18 catches unclosed headings", () => {
  const r = run({ heading: "<h1>NUMUW", closing: "" });
  if (!/unclosed heading tag/i.test(r.output)) throw new Error(r.output);
});

check("R19 catches empty social metadata", () => {
  const r = run({ metaExtra: '<meta property="og:title" content="">' });
  if (!/missing or empty meta property og:title/i.test(r.output)) throw new Error(r.output);
});

check("R19 catches mangled metadata attribute names", () => {
  const r = run({ metaExtra: '<meta name="twitter:title" coh2tent="NUMUW">' });
  if (!/unknown meta attribute/i.test(r.output)) throw new Error(r.output);
});

check("R20 catches stray head text", () => {
  const r = run({ malformedHead: "h2meta property="og:site_name"" });
  if (!/unexpected text in <head>/i.test(r.output)) throw new Error(r.output);
});

check("R20 catches unknown head tag names", () => {
  const r = run({ malformedHead: '<metah2property="og:title" content="NUMUW">' });
  if (!/unexpected <head> tag <metah2property>/i.test(r.output)) throw new Error(r.output);
});

check("R20 catches mangled metadata values", () => {
  const r = run({ metaExtra: '<meta name="twitter:title" content="NUMUW Conh2ersion">' });
  if (!/suspicious h2 corruption token/i.test(r.output)) throw new Error(r.output);
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
