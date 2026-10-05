#!/usr/bin/env node
// NUMUW architecture contract audit.
// Complements R1-R17 with cross-site consistency and maintainability invariants.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = "https://ahmedsaturki.github.io/numuw-studio/";
const failures = [];
const warnings = [];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === ".git" || entry.name === "node_modules") return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const files = walk(ROOT)
  .map((f) => path.relative(ROOT, f).split(path.sep).join("/"))
  .sort();

const htmlFiles = files.filter((f) => f.endsWith(".html"));
const indexable = htmlFiles.filter((f) => f !== "404.html");

const expectedNav = [
  "/numuw-studio/landing/",
  "/numuw-studio/tools/",
  "/numuw-studio/products/",
  "/numuw-studio/pages/proof/",
  "/numuw-studio/pages/"
];

function report(file, rule, detail) {
  failures.push(\`\${file}: \${rule}: \${detail}\`);
}

function warn(file, rule, detail) {
  warnings.push(\`\${file}: \${rule}: \${detail}\`);
}

function findTags(html, name) {
  return html.match(new RegExp(\`<\${name}\\b[^>]*>\`, "gi")) ?? [];
}

function attr(tag, name) {
  const re = new RegExp(\`\\b\${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))\`, "i");
  const m = tag.match(re);
  return (m?.[1] ?? m?.[2] ?? m?.[3] ?? "").trim();
}

function hasClass(tag, cls) {
  return new RegExp(\`\\bclass=["'][^"']*\\b\${cls}\\b[^"']*["']\`, "i").test(tag);
}

function hasInlineHandler(tag) {
  return /\\s+on[a-z]+\\s*=\\s*/i.test(tag);
}

function isExecutableInlineScript(tag) {
  if (/\\btype\\s*=\\s*["']application\\/ld\\+json["']/i.test(tag)) return false;
  return !/\\bsrc\\s*=/i.test(tag);
}

for (const file of indexable) {
  const html = fs.readFileSync(path.join(ROOT, file), "utf8");
  const isHome = file === "index.html";

  if (!html.includes("assets/css/numuw.css")) report(file, "A1", "missing shared design-system CSS");
  if (!html.includes("assets/js/numuw.js")) report(file, "A2", "missing shared runtime JS");
  if (!isHome && html.includes("assets/css/home.css")) report(file, "A3", "homepage CSS loaded outside homepage");
  if (isHome && !html.includes("assets/css/home.css")) report(file, "A4", "homepage composition CSS missing");
  if (html.includes("assets/js/home.js")) report(file, "A5", "legacy homepage runtime reference detected");

  const headers = findTags(html, "header").filter((tag) => hasClass(tag, "site-header"));
  const footers = findTags(html, "footer");
  if (headers.length !== 1) report(file, "A6", \`expected one shared site-header, found \${headers.length}\`);
  if (footers.length !== 1) report(file, "A7", \`expected one footer, found \${footers.length}\`);

  const nav = findTags(html, "nav").find((tag) => hasClass(tag, "navlinks"));
  if (!nav) {
    report(file, "A8", "shared primary navigation missing");
  } else {
    const hrefs = [...nav.matchAll(/<a\\b[^>]*\\bhref=["']([^"']+)["']/gi)].map((m) => m[1]);
    if (hrefs.length !== expectedNav.length) report(file, "A8", \`expected \${expectedNav.length} primary links, found \${hrefs.length}\`);
    for (const expected of expectedNav) {
      if (!hrefs.includes(expected)) report(file, "A8", \`missing primary link \${expected}\`);
    }
  }

  const brand = findTags(html, "a").find((tag) => hasClass(tag, "brand"));
  if (!brand || attr(brand, "href") !== "/numuw-studio/") {
    report(file, "A9", "brand must link to /numuw-studio/");
  }

  for (const tag of findTags(html, "button")) {
    if (!attr(tag, "type")) report(file, "A10", "button without explicit type");
  }

  for (const tag of findTags(html, "a")) {
    if (attr(tag, "target") === "_blank") {
      const rel = attr(tag, "rel").toLowerCase().split(/\\s+/).filter(Boolean);
      if (!rel.includes("noopener")) report(file, "A11", 'target="_blank" link missing rel="noopener"');
    }
  }

  for (const name of ["a", "area", "button", "body", "div", "form", "img", "input", "select", "textarea", "details", "summary"]) {
    for (const tag of findTags(html, name)) {
      if (hasInlineHandler(tag)) report(file, "A12", \`inline event handler on <\${name}>\`);
    }
  }

  for (const tag of findTags(html, "script")) {
    if (isExecutableInlineScript(tag)) report(file, "A13", "executable inline script detected; move runtime to assets/js");
  }

  const formMatches = [...html.matchAll(/<form\\b[^>]*>[\\s\\S]*?<\\/form>/gi)];
  for (const match of formMatches) {
    const formHtml = match[0];
    const formTag = formHtml.slice(0, formHtml.indexOf(">") + 1);
    if (attr(formTag, "data-generated-labels") === "true") {
      const runtime = "assets/js/tools/website-readiness.js";
      if (!files.includes(runtime)) report(file, "A14", "generated-label form missing runtime module");
      else {
        const js = fs.readFileSync(path.join(ROOT, runtime), "utf8");
        if (!js.includes("htmlFor") || !js.includes(".id")) {
          report(file, "A14", "generated-label runtime lacks explicit control association");
        }
      }
      continue;
    }

    const labelFor = new Set(
      [...formHtml.matchAll(/<label\\b[^>]*\\bfor=["']([^"']+)["']/gi)].map((m) => m[1])
    );

    for (const control of formHtml.matchAll(/<(input|select|textarea)\\b([^>]*)>/gi)) {
      const attrs = control[2];
      const id = attrs.match(/\\bid=["']([^"']+)["']/i)?.[1];
      const accessibleName =
        /\\baria-label=["'][^"']+["']/i.test(attrs) ||
        /\\baria-labelledby=["'][^"']+["']/i.test(attrs);
      if (!id || (!labelFor.has(id) && !accessibleName)) {
        report(file, "A14", \`form control \${control[1]} lacks an explicit accessible label\`);
      }
    }
  }

  const title = html.match(/<title\\b[^>]*>([\\s\\S]*?)<\\/title>/i)?.[1]?.trim() ?? "";
  const ogTitle = findTags(html, "meta").find((tag) => attr(tag, "property").toLowerCase() === "og:title");
  const twTitle = findTags(html, "meta").find((tag) => attr(tag, "name").toLowerCase() === "twitter:title");
  if (ogTitle && attr(ogTitle, "content") !== title) report(file, "A15", "og:title must equal document title");
  if (twTitle && attr(twTitle, "content") !== title) report(file, "A15", "twitter:title must equal document title");

  const metaDesc = findTags(html, "meta").find((tag) => attr(tag, "name").toLowerCase() === "description");
  const ogDesc = findTags(html, "meta").find((tag) => attr(tag, "property").toLowerCase() === "og:description");
  const twDesc = findTags(html, "meta").find((tag) => attr(tag, "name").toLowerCase() === "twitter:description");
  if (metaDesc && ogDesc && attr(metaDesc, "content") !== attr(ogDesc, "content")) {
    warn(file, "A16", "og:description differs from meta description");
  }
  if (metaDesc && twDesc && attr(metaDesc, "content") !== attr(twDesc, "content")) {
    warn(file, "A16", "twitter:description differs from meta description");
  }

  const canonical = findTags(html, "link").find((tag) => attr(tag, "rel").toLowerCase().split(/\\s+/).includes("canonical"));
  const ogUrl = findTags(html, "meta").find((tag) => attr(tag, "property").toLowerCase() === "og:url");
  if (!canonical || !ogUrl || attr(canonical, "href") !== attr(ogUrl, "content")) {
    report(file, "A17", "canonical href and og:url must match");
  }

  if (!isHome && html.includes("home.css")) report(file, "A18", "non-home page references homepage stylesheet");
}

const homeCss = fs.readFileSync(path.join(ROOT, "assets/css/home.css"), "utf8");
for (const forbidden of [":root", "*{", "body{", "a{", "button{", "h1{", "h2{", ".nav{", ".navlinks{", ".btn{", ".card{"]) {
  if (homeCss.includes(forbidden)) report("assets/css/home.css", "A19", \`unscoped foundation selector detected: \${forbidden}\`);
}
if (!homeCss.includes(".home-page")) report("assets/css/home.css", "A19", "homepage composition is not explicitly scoped");

if (files.includes("assets/js/home.js")) report("assets/js/home.js", "A5", "legacy homepage runtime file still exists");

const sitemap = fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8");
for (const file of indexable) {
  const dir = path.posix.dirname(file);
  const expected = dir === "." ? BASE : BASE + dir + "/";
  if (!sitemap.includes(\`<loc>\${expected}</loc>\`)) report(file, "A20", "route absent from sitemap");
}

console.log(\`NUMUW architecture audit: \${indexable.length} indexable HTML files checked\`);
console.log(\`Failures: \${failures.length} | Warnings: \${warnings.length}\`);
for (const line of warnings.sort()) console.warn("WARN:", line);
for (const line of failures.sort()) console.error("FAIL:", line);
if (failures.length) process.exit(1);
console.log("PASS: shared architecture, navigation, runtime, forms and metadata contracts are healthy.");
