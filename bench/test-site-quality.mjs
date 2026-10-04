#!/usr/bin/env node
// Regression suite for bench/site-quality.mjs.
//
// The scanner is the metric definition for an autoresearch loop: if a rule
// silently stops firing, the loop starts making decisions on a number that no
// longer means what it claims. Each test builds a throwaway site tree,
// copies the real scanner into it, and asserts on the rules that fire.
//
// Run: node bench/test-site-quality.mjs
// Exit 0 on all-pass, 1 on any failure.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SCANNER = path.join(HERE, "site-quality.mjs");
const BASE = "https://ahmedsaturki.github.io/numuw-studio/";

let passed = 0;
const failures = [];

// A page that satisfies every structural rule, so a test can remove exactly one
// thing and attribute the resulting violation to that rule alone.
function goodPage(route, overrides = {}) {
  const {
    title = `Title ${route}`,
    description = `Description for ${route}`,
    lang = "en",
    charset = true,
    viewport = true,
    h1 = "<h1>Heading</h1>",
    canonical = `${BASE}${route}`,
    jsonLd = '{"@context":"https://schema.org","@type":"WebSite"}',
    extraHead = "",
    body = "<p>Body</p>",
  } = overrides;
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
${charset ? '<meta charset="utf-8">' : ""}
${viewport ? '<meta name="viewport" content="width=device-width, initial-scale=1">' : ""}
<title>${title}</title>
<meta name="description" content="${description}">
${canonical === null ? "" : `<link rel="canonical" href="${canonical}">`}
${jsonLd === null ? "" : `<script type="application/ld+json">${jsonLd}</script>`}
${extraHead}
</head>
<body>
${h1}
${body}
</body>
</html>
`;
}

// Build a temp site, run the real scanner in it, return { issues, stderr, root }.
function scan(pages, opts = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "sq-"));
  const benchDir = path.join(root, "bench");
  fs.mkdirSync(benchDir);
  fs.copyFileSync(SCANNER, path.join(benchDir, "site-quality.mjs"));

  const routes = [];
  for (const [rel, content] of Object.entries(pages)) {
    const abs = path.join(root, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content, "utf8");
    routes.push(rel);
  }

  // Sitemap defaults to listing every non-404 page, so R13/R14 stay satisfied
  // unless a test is specifically targeting them.
  const locs = opts.sitemapLoc ?? routes.filter((r) => r !== "404.html")
    .map((r) => `${BASE}${r === "index.html" ? "" : r.replace(/index\.html$/, "")}`);
  fs.writeFileSync(path.join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${locs.map((l) => `  <url><loc>${l}</loc></url>`).join("\n")}
</urlset>
`, "utf8");

  // spawnSync, not execFileSync: the scanner exits 0 even when it reports
  // violations, so nothing throws and execFileSync discards stderr entirely.
  const res = spawnSync(process.execPath, [path.join(benchDir, "site-quality.mjs")], {
    cwd: root,
    encoding: "utf8",
  });
  const code = res.status ?? 1;
  const stdout = res.stdout ?? "";
  const stderr = res.stderr ?? "";
  const issues = Number(/^issues: (\d+)$/m.exec(stdout)?.[1] ?? NaN);
  return { issues, stderr, stdout, code, root };
}

function rulesFired(stderr) {
  return [...stderr.matchAll(/^\S+: (R\d+):/gm)].map((m) => m[1]);
}

function check(name, fn) {
  const tmpRoots = [];
  try {
    const r = fn((pages, opts) => {
      const out = scan(pages, opts);
      tmpRoots.push(out.root);
      return out;
    });
    if (r === undefined) throw new Error("test returned undefined");
    passed += 1;
    process.stdout.write(`  ok  ${name}\n`);
  } catch (err) {
    failures.push({ name, message: err.message });
    process.stdout.write(`FAIL  ${name}\n        ${err.message}\n`);
  } finally {
    for (const dir of tmpRoots) fs.rmSync(dir, { recursive: true, force: true });
  }
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertIncludes(hay, needle, label) {
  if (!hay.includes(needle)) {
    throw new Error(`${label}: expected to find ${JSON.stringify(needle)} in ${JSON.stringify(hay)}`);
  }
}

// A baseline page that must produce zero violations. Every other test depends on
// this being right, so it is asserted first and on its own.
const CLEAN = { "index.html": goodPage("") };

process.stdout.write("bench/site-quality.mjs rule regression suite\n\n");

check("clean page produces zero issues", (run) => {
  const r = run(CLEAN);
  assertEqual(r.issues, 0, "issues");
  assertEqual(r.code, 0, "exit code");
  return true;
});

check("R1 fires when <title> is missing", (run) => {
  const r = run({ "index.html": goodPage("", { title: "" }) });
  assertIncludes(rulesFired(r.stderr).join(","), "R1", "rules fired");
  return true;
});

check("R2 fires when meta description is missing", (run) => {
  const r = run({ "index.html": goodPage("", { description: "" }) });
  assertIncludes(rulesFired(r.stderr).join(","), "R2", "rules fired");
  return true;
});

check("R3 fires when html lang is missing", (run) => {
  const r = run({ "index.html": goodPage("", { lang: "" }) });
  assertIncludes(rulesFired(r.stderr).join(","), "R3", "rules fired");
  return true;
});

check("R4 fires when meta charset is missing", (run) => {
  const r = run({ "index.html": goodPage("", { charset: false }) });
  assertIncludes(rulesFired(r.stderr).join(","), "R4", "rules fired");
  return true;
});

check("R5 fires when viewport is missing", (run) => {
  const r = run({ "index.html": goodPage("", { viewport: false }) });
  assertIncludes(rulesFired(r.stderr).join(","), "R5", "rules fired");
  return true;
});

check("R6 fires when there are zero <h1>", (run) => {
  const r = run({ "index.html": goodPage("", { h1: "<p>no heading</p>" }) });
  assertIncludes(rulesFired(r.stderr).join(","), "R6", "rules fired");
  return true;
});

check("R6 fires when there are two <h1>", (run) => {
  const r = run({ "index.html": goodPage("", { h1: "<h1>One</h1><h1>Two</h1>" }) });
  assertIncludes(rulesFired(r.stderr).join(","), "R6", "rules fired");
  return true;
});

check("R7 fires when canonical is missing", (run) => {
  const r = run({ "index.html": goodPage("", { canonical: null }) });
  assertIncludes(rulesFired(r.stderr).join(","), "R7", "rules fired");
  return true;
});

check("R7 fires when canonical points at the wrong URL", (run) => {
  const r = run({ "index.html": goodPage("", { canonical: `${BASE}somewhere-else/` }) });
  assertIncludes(rulesFired(r.stderr).join(","), "R7", "rules fired");
  return true;
});

check("R8 fires when JSON-LD is absent", (run) => {
  const r = run({ "index.html": goodPage("", { jsonLd: null }) });
  assertIncludes(rulesFired(r.stderr).join(","), "R8", "rules fired");
  return true;
});

check("R8 fires when a JSON-LD block does not parse", (run) => {
  const r = run({ "index.html": goodPage("", { jsonLd: "{not valid json" }) });
  assertIncludes(rulesFired(r.stderr).join(","), "R8", "rules fired");
  return true;
});

check("R9 fires on an <img> without alt", (run) => {
  const r = run({ "index.html": goodPage("", { body: '<img src="a.png">' }) });
  assertIncludes(rulesFired(r.stderr).join(","), "R9", "rules fired");
  return true;
});

check("R9 accepts an empty alt (decorative image) but R11 still checks src", (run) => {
  const missing = run({ "index.html": goodPage("", { body: '<img src="a.png" alt="">' }) });
  const fired = rulesFired(missing.stderr);
  if (fired.includes("R9")) throw new Error("empty alt must satisfy R9");
  assertIncludes(fired.join(","), "R11", "missing image file must still fail R11");
  const present = run({
    "index.html": goodPage("", { body: '<img src="a.png" alt="">' }),
    "a.png": "not really a png",
  });
  assertEqual(present.issues, 0, "issues when the image exists");
  return true;
});

check("R10 fires on an internal href with no target", (run) => {
  const r = run({ "index.html": goodPage("", { body: '<a href="missing/">x</a>' }) });
  assertIncludes(rulesFired(r.stderr).join(","), "R10", "rules fired");
  return true;
});

check("R10 accepts an href to a directory containing index.html", (run) => {
  const r = run({
    "index.html": goodPage("", { body: '<a href="sub/">x</a>' }),
    "sub/index.html": goodPage("sub/"),
  });
  assertEqual(r.issues, 0, "issues");
  return true;
});

check("R10 ignores external, mailto, tel and anchor hrefs", (run) => {
  const r = run({
    "index.html": goodPage("", {
      body: `<a href="https://example.com/">a</a><a href="mailto:x@y.z">b</a>
             <a href="tel:+20100">c</a><a href="#top">d</a><div id="top"></div>`,
    }),
  });
  assertEqual(r.issues, 0, "issues");
  return true;
});

check("R11 fires on an internal src with no target", (run) => {
  const r = run({ "index.html": goodPage("", { body: '<img src="missing.png" alt="">' }) });
  assertIncludes(rulesFired(r.stderr).join(","), "R11", "rules fired");
  return true;
});

check("R12 fires when a same-page anchor has no target", (run) => {
  const r = run({ "index.html": goodPage("", { body: '<a href="#nowhere">x</a>' }) });
  assertIncludes(rulesFired(r.stderr).join(","), "R12", "rules fired");
  return true;
});

check("R12 passes when the anchor target exists", (run) => {
  const r = run({ "index.html": goodPage("", { body: '<a href="#here">x</a><div id="here"></div>' }) });
  assertEqual(r.issues, 0, "issues");
  return true;
});

check("R13 fires when a page is missing from the sitemap", (run) => {
  const r = run(CLEAN, { sitemapLoc: [] });
  assertIncludes(rulesFired(r.stderr).join(","), "R13", "rules fired");
  return true;
});

check("R14 fires when a sitemap loc resolves to nothing", (run) => {
  const r = run(CLEAN, { sitemapLoc: [`${BASE}`, `${BASE}ghost/`] });
  assertIncludes(rulesFired(r.stderr).join(","), "R14", "rules fired");
  return true;
});

check("R15 fires on a duplicate <title> across pages", (run) => {
  const r = run({
    "index.html": goodPage("", { title: "Same" }),
    "sub/index.html": goodPage("sub/", { title: "Same" }),
  });
  assertIncludes(rulesFired(r.stderr).join(","), "R15", "rules fired");
  return true;
});

check("R16 fires on a duplicate meta description across pages", (run) => {
  const r = run({
    "index.html": goodPage("", { description: "Identical copy" }),
    "sub/index.html": goodPage("sub/", { description: "Identical copy" }),
  });
  assertIncludes(rulesFired(r.stderr).join(","), "R16", "rules fired");
  return true;
});

check("R17 fires on an h1 -> h3 level skip", (run) => {
  const r = run({ "index.html": goodPage("", { h1: "<h1>A</h1><h3>B</h3>" }) });
  assertIncludes(rulesFired(r.stderr).join(","), "R17", "rules fired");
  return true;
});

check("R17 ignores an upward jump but still catches a two-level skip", (run) => {
  // Going up (h2 -> h1) or staying one level apart is never a skip.
  const up = run({ "index.html": goodPage("", { h1: "<h2>A</h2><h1>B</h1><h2>C</h2>" }) });
  assertEqual(up.issues, 0, "issues for an upward jump");
  const skip = run({ "index.html": goodPage("", { h1: "<h1>A</h1><h2>B</h2><h4>C</h4>" }) });
  assertIncludes(rulesFired(skip.stderr).join(","), "R17", "h2 -> h4 must fire");
  return true;
});

check("R17 exempts the first heading regardless of level", (run) => {
  const r = run({ "index.html": goodPage("", { h1: "<h1>A</h1><div></div><h2>B</h2>" }) });
  assertEqual(r.issues, 0, "issues");
  return true;
});

check("R17 does not fire on a heading inside a card grid link", (run) => {
  const r = run({
    "index.html": goodPage("", { h1: "<h1>A</h1>", body: '<a class="card" href="sub/"><h3>B</h3></a>' }),
    "sub/index.html": goodPage("sub/"),
  });
  assertEqual(r.issues, 0, "issues");
  return true;
});

check("R17 still fires on a heading inside a non-grid prose link", (run) => {
  const r = run({
    "index.html": goodPage("", { h1: "<h1>A</h1>", body: '<a href="sub/"><h3>B</h3></a>' }),
    "sub/index.html": goodPage("sub/"),
  });
  assertIncludes(rulesFired(r.stderr).join(","), "R17", "rules fired");
  return true;
});

check("R17 does not fire inside a live region", (run) => {
  const r = run({
    "index.html": goodPage("", { h1: "<h1>A</h1>", body: '<h3 role="status" aria-live="polite">-</h3>' }),
  });
  assertEqual(r.issues, 0, "issues");
  return true;
});

check("404.html is exempt from R7 and R13 but still needs R1/R6", (run) => {
  const r = run({ "404.html": goodPage("", { canonical: null }) });
  const fired = rulesFired(r.stderr);
  if (fired.includes("R7") || fired.includes("R13")) {
    throw new Error(`404 should be exempt from R7/R13, but fired: ${fired.join(",")}`);
  }
  assertEqual(r.issues, 0, "issues for an otherwise-complete 404 page");
  const r2 = run({ "404.html": goodPage("", { canonical: null, title: "" }) });
  assertIncludes(rulesFired(r2.stderr).join(","), "R1", "404 still needs a title");
  return true;
});

check("R14 fires when 404.html is listed in the sitemap", (run) => {
  const r = run(
    { "index.html": goodPage(""), "404.html": goodPage("") },
    { sitemapLoc: [`${BASE}`, `${BASE}404.html`] }
  );
  assertIncludes(rulesFired(r.stderr).join(","), "R14", "rules fired");
  return true;
});

check("each violation is counted once", (run) => {
  const r = run({ "index.html": goodPage("", { title: "", description: "", lang: "" }) });
  assertEqual(r.issues, 3, "three distinct violations");
  return true;
});

check("output is deterministic across runs", (run) => {
  const a = run(CLEAN).stdout;
  const b = run(CLEAN).stdout;
  assertEqual(a, b, "stdout");
  return true;
});

check("scanner exits 1 when sitemap.xml is missing", (run) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "sq-nositemap-"));
  const benchDir = path.join(root, "bench");
  fs.mkdirSync(benchDir);
  fs.copyFileSync(SCANNER, path.join(benchDir, "site-quality.mjs"));
  fs.writeFileSync(path.join(root, "index.html"), goodPage(""), "utf8");
  const res = spawnSync(process.execPath, [path.join(benchDir, "site-quality.mjs")], {
    cwd: root, encoding: "utf8",
  });
  const code = res.status ?? 1;
  assertEqual(code, 1, "exit code without sitemap.xml");
  fs.rmSync(root, { recursive: true, force: true });
  return true;
});

process.stdout.write(`\n${passed} passed, ${failures.length} failed\n`);
if (failures.length) {
  for (const f of failures) process.stdout.write(`  - ${f.name}: ${f.message}\n`);
  process.exit(1);
}