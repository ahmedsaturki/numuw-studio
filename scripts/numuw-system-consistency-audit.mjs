import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === ".git" || entry.name === "node_modules") return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function rel(file) {
  return path.relative(root, file).split(path.sep).join("/");
}

function strip(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function routeFrom(sourcePath, href) {
  const clean = href.split("#")[0].split("?")[0];
  if (!clean || /^[a-z][a-z0-9+.-]*:/i.test(clean)) return null;

  const stack = sourcePath.split("/");
  stack.pop();

  let relative = clean;
  if (relative.startsWith("/numuw-studio/")) {
    return normalize(relative.slice("/numuw-studio/".length));
  }
  if (relative.startsWith("/")) return null;

  for (const part of relative.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") stack.pop();
    else stack.push(part);
  }
  return normalize(stack.join("/"));
}

function normalize(route) {
  let value = route.replace(/^\/+/, "");
  if (!value) return "index.html";
  if (value.endsWith("/")) value += "index.html";
  else if (!value.includes(".")) value += "/index.html";
  return value;
}

function navEntries(html) {
  const nav = html.match(/<nav\b[^>]*data-nav[^>]*>[\s\S]*?<\/nav>/i)?.[0] || "";
  return [...nav.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map((match) => ({
    attrs: match[1],
    text: strip(match[2]),
    href: match[1].match(/\bhref=["']([^"']+)["']/i)?.[1] || "",
    ar: match[1].match(/\bdata-ar=["']([^"']*)["']/i)?.[1] || null,
    en: match[1].match(/\bdata-en=["']([^"']*)["']/i)?.[1] || null,
  }));
}

const canonicalNav = [
  { route: "landing/index.html", ar: "الحلول", en: "Solutions" },
  { route: "landing/index.html", ar: "القطاعات", en: "Industries" },
  { route: "tools/index.html", ar: "الأدوات", en: "Tools" },
  { route: "pages/case-studies/index.html", ar: "العمل والإثبات", en: "Work & Proof" },
  { route: "resources/index.html", ar: "المصادر", en: "Resources" },
  { route: "pages/index.html", ar: "الشركة", en: "Company" },
];

const products = [
  ["NUMUW Diagnostic", "products/diagnostic/index.html"],
  ["Digital Kickoff", "products/digital-kickoff/index.html"],
  ["Automation Sprint", "products/automation-sprint/index.html"],
  ["Growth System", "products/growth-system/index.html"],
  ["Growth Partner", "products/growth-partner/index.html"],
];

const tools = [
  ["tools/automation-finder/index.html", "assets/js/tools/automation-finder.js"],
  ["tools/brief-builder/index.html", "assets/js/tools/brief-builder.js"],
  ["tools/diagnostic/index.html", "assets/js/tools/diagnostic.js"],
  ["tools/estimator/index.html", "assets/js/tools/estimator.js"],
  ["tools/roadmap/index.html", "assets/js/tools/roadmap.js"],
  ["tools/roi-calculator/index.html", "assets/js/tools/roi-calculator.js"],
  ["tools/solution-finder/index.html", "assets/js/tools/solution-finder.js"],
  ["tools/website-readiness/index.html", "assets/js/tools/website-readiness.js"],
];

const htmlFiles = walk(root).filter((file) => file.endsWith(".html")).map(rel).sort();

for (const file of htmlFiles) {
  if (file === "404.html") continue;
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const entries = navEntries(html);

  if (entries.length !== canonicalNav.length) {
    failures.push(file + ": shared navigation must contain exactly six items");
    continue;
  }

  entries.forEach((entry, index) => {
    const expected = canonicalNav[index];
    const actualRoute = routeFrom(file, entry.href);
    if (
      !expected ||
      actualRoute !== expected.route ||
      entry.ar !== expected.ar ||
      entry.en !== expected.en
    ) {
      failures.push(file + ": navigation item " + (index + 1) + " differs from the canonical contract");
    }
  });

  const navText = entries.map((entry) => entry.text).join(" ");
  if (navText.includes("Landing Pages") || navText.includes("Documents") || navText.includes("Products")) {
    failures.push(file + ": legacy English-only navigation label detected");
  }

  if (file === "index.html") {
    if (!/<html\b[^>]*data-localized=["']true["']/i.test(html)) {
      failures.push("index.html: homepage must be data-localized=true");
    }
  } else if (/<html\b[^>]*data-localized=["']true["']/i.test(html)) {
    failures.push(file + ": only index.html may be data-localized=true");
  }

  if (/تشخيص مجاني|free diagnostic/i.test(strip(html))) {
    failures.push(file + ": free Fit Conversation must not be conflated with paid Diagnostic");
  }
}

const home = strip(fs.readFileSync(path.join(root, "index.html"), "utf8"));
for (const [name] of products) {
  if (!home.includes(name)) failures.push("index.html: missing product ladder item " + name);
}

const productIndex = fs.readFileSync(path.join(root, "products/index.html"), "utf8");
for (const [name, route] of products) {
  if (!strip(productIndex).includes(name)) failures.push("products/index.html: missing " + name);
  const productLinks = [...productIndex.matchAll(/<a\b([^>]*)>/gi)]
    .map((match) => match[1].match(/\bhref=["']([^"']+)["']/i)?.[1])
    .filter(Boolean)
    .map((href) => routeFrom("products/index.html", href));
  if (!productLinks.includes(route)) {
    failures.push("products/index.html: missing route for " + name);
  }
}

for (const [page, runtime] of tools) {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  if (!html.includes(runtime)) failures.push(page + ": missing dedicated runtime " + runtime);
  if (html.includes("assets/js/tools.js")) failures.push(page + ": legacy tools.js reference detected");
}

const growthPartner = fs.readFileSync(path.join(root, "products/growth-partner/index.html"), "utf8");
const estimator = fs.readFileSync(path.join(root, "assets/js/tools/estimator.js"), "utf8");
if (!growthPartner.includes("6,500 ج.م شهريًا")) failures.push("Growth Partner: monthly reference price missing or changed");
if (!estimator.includes("Growth Partner شهري") || !estimator.includes("6500")) {
  failures.push("Estimator: Growth Partner monthly reference price missing or changed");
}

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const sitemapCount = [...sitemap.matchAll(/<loc>/gi)].length;
if (sitemapCount !== 54) failures.push("sitemap.xml: expected 54 URLs, found " + sitemapCount);

console.log("NUMUW system consistency audit");
console.log("HTML routes checked:", htmlFiles.filter((file) => file !== "404.html").length);
console.log("Products checked:", products.length);
console.log("Tools checked:", tools.length);
console.log("Failures:", failures.length);
for (const failure of failures) console.error("FAIL:", failure);
if (failures.length) process.exit(1);
console.log("PASS: navigation, i18n, commercial naming, product references and tool mappings are consistent.");
