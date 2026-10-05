#!/usr/bin/env node
// NUMUW architecture contract audit.
// This complements the structural R1-R17 scanner with product/system invariants.

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

function report(file, rule, detail) {
  failures.push(`${file}: ${rule}: ${detail}`);
}

function warn(file, rule, detail) {
  warnings.push(`${file}: ${rule}: ${detail}`);
}

function tags(html, name) {
  return html.match(new RegExp(`<${name}\\\\b[^>]*>`, "gi")) ?? [];
}

function attr(tag, name) {
  const re = new RegExp(`\\\\b${name}\\\\s*=\\\\s*(?:["']([^"']*)["']|([^\\\\s>]+))`, "i");
  const m = tag.match(re);
  return (m?.[1] ?? m?.[2] ?? "").trim();
}

function hasClass(tag, cls) {
  return new RegExp(`\\\\bclass=["'][^"']*\\\\b${cls}\\\\b`, "i").test(tag);
}

function hasInlineHandler(tag) {
  return /\\s+on[a-z]+\\s*=\\s*/i.test(tag);
}

function hasExecutableInlineScript(tag) {
  if (/\\btype\\s*=\\s*["']application\\/ld\\+json["']/i.test(tag)) return false;
  return !/\\bsrc\\s*=/i.test(tag);
}

const expectedNav = [
  "/numuw-studio/landing/",
  "/numuw-studio/tools/",
  "/numuw-studio/products/",
  "/numuw-studio/pages/proof/",
  "/numuw-studio/pages/"
];

for (const file of indexable) {
  const html = fs.readFileSync(path.join(ROOT, file), "utf8");
  const isHome = file === "index.html";

  // One shared shell, one homepage composition layer.
  if (!html.includes("assets/css/numuw.css")) report(file, "A1", "missing shared design-system CSS");
  if (!html.includes("assets/js/numuw.js")) report(file, "A2", "missing shared runtime JS");
  if (!isHome && html.includes("assets/css/home.css")) report(file, "A3", "homepage CSS loaded outside homepage");
  if (isHome && !html.includes("assets/css/home.css")) report(file, "A4", "homepage composition CSS missing");
  if (html.includes("assets/js/home.js")) report(file, "A5", "legacy homepage runtime reference detected");

  const header = tags(html, "header");
  const footer = tags(html, "footer");
  if (header.filter((t) => hasClass(t, "site-header")).length !== 1) report(file, "A6", "expected exactly one shared site-header");
  if (footer.length !== 1) report(file, "A7", "expected exactly one footer");

  const nav = tags(html, "nav").find((t) => hasClass(t, "navlinks"));
  if (!nav) {
    report(file, "A8", "shared primary navigation missing");
  } else {
    const hrefs = [...nav.matchAll(/<a\\\\b[^>]*\\\\bhref=["']([^"']+)["']/gi)].map((m) => m[1]);
    if (hrefs.length !== expectedNav.length) report(file, "A8", `primary navigation expected ${expectedNav.length} links, found ${hrefs.length}`);
    expectedNav.forEach((href) => {
      if (!hrefs.includes(href)) report(file, "A8", `primary navigation missing ${href}`);
    });
  }

  const brand = tags(html, "a").find((t) => hasClass(t, "brand"));
  if (!brand || attr(brand, "href") !== "/numuw-studio/") report(file, "A9", "brand must link to the canonical site root");

  const buttons = tags(html, "button");
  for (const tag of buttons) {
    const type = attr(tag, "type");
    if (!type) report(file, "A10", "button without explicit type");
  }

  for (const tag of tags(html, "a")) {
    if (attr(tag, "target") === "_blank") {
      const rel = attr(tag, "rel").toLowerCase().split(/\\s+/).filter(Boolean);
      if (!rel.includes("noopener")) report(file, "A11", 'target="_blank" link missing rel="noopener"');
    }
    if (hasInlineHandler(tag)) report(file, "A12", "inline event handler on <a>");
  }

  for (const name of ["button", "body", "div", "form", "img", "input", "select", "textarea", "details", "summary"]) {
    for (const tag of tags(html, name)) {
      if (hasInlineHandler(tag)) report(file, "A12", `inline event handler on <${name}>`);
    }
  }

  const scriptTags = tags(html, "script");
  for (const tag of scriptTags) {
    if (hasExecutableInlineScript(tag)) report(file, "A13", "executable inline script detected; move runtime to assets/js");
  }

  // Forms: every static control must have a real label association.
  const forms = [...html.matchAll(/<form\\\\b[^>]*>([\\s\\S]*?)<\\/form>/gi)];
  for (const formMatch of forms) {
    const formTag = formMatch[0].slice(0, formMatch[0].indexOf(">") + 1);
    if (attr(formTag, "data-generated-labels") === "true") {
      const jsPath = "assets/js/tools/website-readiness.js";
      if (!files.includes(jsPath)) report(file, "A14", "generated-label form has no runtime module");
      else {
        const js = fs.readFileSync(path.join(ROOT, jsPath), "utf8");
        if (!js.includes("htmlFor") || !js.includes(".id")) report(file, "A14", "generated-label runtime lacks explicit label/control association");
      }
      continue;
    }

    const form = formMatch[0];
    const labelFor = new Set([...form.matchAll(/<label\\\\b[^>]*\\\\bfor=["']([^"']+)["']/gi)].map((m) => m[1]));
    const controls = [...form.matchAll(/<(input|select|textarea)\\\\b([^>]*)>/gi)];
    for (const control of controls) {
      const attrs = control[2];
      const id = attrs.match(/\\\\bid=["']([^"']+)["']/i)?.[1];
      const ariaLabel = attrs.match(/\\\\baria-label=["'][^"']+["']/i);
      const ariaLabelledby = attrs.match(/\\\\baria-labelledby=["'][^"']+["']/i);
      if (!id || (!labelFor.has(id) && !ariaLabel && !ariaLabelledby)) {
        report(file, "A14", `form control ${control[1]} must have an associated label or accessible name`);
      }
    }
  }

  // Metadata system must agree across the major social fields.
  const title = html.match(/<title\\\\b[^>]*>([\\s\\S]*?)<\\/title>/i)?.[1]?.trim() ?? "";
  const ogTitle = html.match(/<meta\\\\b[^>]*\\\\bproperty=["']og:title["'][^>]*>/i);
  const twTitle = html.match(/<meta\\\\b[^>]*\\\\bname=["']twitter:title["'][^>]*>/i);
  if (ogTitle && attr(ogTitle[0], "content") !== title) report(file, "A15", "og:title must match <title>");
  if (twTitle && attr(twTitle[0], "content") !== title) report(file, "A15", "twitter:title must match <title>");

  const metaDesc = html.match(/<meta\\\\b[^>]*\\\\bname=["']description["'][^>]*>/i);
  const ogDesc = html.match(/<meta\\\\b[^>]*\\\\bproperty=["']og:description["'][^>]*>/i);
  const twDesc = html.match(/<meta\\\\b[^>]*\\\\bname=["']twitter:description["'][^>]*>/i);
  if (metaDesc && ogDesc && attr(metaDesc[0], "content") !== attr(ogDesc[0], "content")) warn(file, "A16", "og:description differs from meta description");
  if (metaDesc && twDesc && attr(metaDesc[0], "content") !== attr(twDesc[0], "content")) warn(file, "A16", "twitter:description differs from meta description");

  // One canonical and same canonical as og:url.
  const canonical = html.match(/<link\\\\b[^>]*\\\\brel=["']canonical["'][^>]*>/i)?.[0];
  const ogUrl = html.match(/<meta\\\\b[^>]*\\\\bproperty=["']og:url["'][^>]*>/i)?.[0];
  if (!canonical || !ogUrl || attr(canonical, "href") !== attr(ogUrl, "content")) report(file, "A17", "canonical and og:url must match");

  // Home-only CSS is composition, not a second design system.
  if (!isHome && /assets\\/css\\/home\\.css/.test(html)) report(file, "A18", "non-home page references homepage CSS");
}

const homeCss = fs.readFileSync(path.join(ROOT, "assets/css/home.css"), "utf8");
for (const forbidden of [":root", "*{", "body{", "a{", "button{", "h1{", "h2{", ".nav{", ".navlinks{", ".btn{", ".card{"]) {
  if (homeCss.includes(forbidden)) report("assets/css/home.css", "A19", `found second-system foundation selector ${forbidden}`);
}
if (!homeCss.includes(".home-page")) report("assets/css/home.css", "A19", "homepage CSS is not explicitly scoped");

for (const file of ["assets/js/home.js"]) {
  if (files.includes(file)) report(file, "A5", "legacy homepage runtime file still exists");
}

const sitemap = fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8");
for (const file of indexable) {
  const dir = path.posix.dirname(file);
  const expected = dir === "." ? BASE : BASE + dir + "/";
  if (!sitemap.includes(`<loc>${expected}</loc>`)) report(file, "A20", "canonical route absent from sitemap");
}

console.log(`NUMUW architecture audit: ${indexable.length} indexable HTML files checked`);
console.log(`Failures: ${failures.length} | Warnings: ${warnings.length}`);
for (const line of warnings.sort()) console.warn("WARN:", line);
for (const line of failures.sort()) console.error("FAIL:", line);
if (failures.length) process.exit(1);
console.log("PASS: shared architecture, navigation, runtime boundaries, forms and metadata contracts are healthy.");
