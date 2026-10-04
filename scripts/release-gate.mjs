#!/usr/bin/env node
import { spawnSync } from "node:child_process";

function run(label, command, args) {
  const result = spawnSync(command, args, { encoding: "utf8" });
  const stdout = result.stdout ?? "";
  const stderr = result.stderr ?? "";
  process.stdout.write("\n=== " + label + " ===\n");
  if (stdout) process.stdout.write(stdout);
  if (stderr) process.stderr.write(stderr);
  if ((result.status ?? 1) !== 0) return { ok: false, reason: "process exited " + (result.status ?? "unknown") };
  return { ok: true, stdout, stderr };
}

const results = [];

const staticAudit = run("Production static audit", process.execPath, ["scripts/numuw-static-audit.mjs"]);
results.push(["Production static audit", staticAudit.ok]);
if (!staticAudit.ok) process.exitCode = 1;

const benchmark = run("R1-R17 research benchmark", process.execPath, ["bench/site-quality.mjs"]);
const issueMatch = benchmark.stdout.match(/^issues:\s*(\d+)$/m);
const researchIssues = issueMatch ? Number(issueMatch[1]) : NaN;
if (!benchmark.ok || !Number.isFinite(researchIssues) || researchIssues !== 0) {
  results.push(["R1-R17 research benchmark", false]);
  process.exitCode = 1;
} else {
  results.push(["R1-R17 research benchmark", true]);
}

const integrity = run("Holistic content integrity", process.execPath, ["scripts/content-integrity-audit.mjs"]);
results.push(["Holistic content integrity", integrity.ok]);
if (!integrity.ok) process.exitCode = 1;

const regression = run("R1-R17 regression suite", process.execPath, ["bench/test-site-quality.mjs"]);
results.push(["R1-R17 regression suite", regression.ok]);
if (!regression.ok) process.exitCode = 1;

process.stdout.write("\n=== Release gate summary ===\n");
for (const [name, ok] of results) process.stdout.write((ok ? "PASS  " : "FAIL  ") + name + "\n");
if (!results.every(([, ok]) => ok)) {
  process.stderr.write("\nRELEASE BLOCKED: one or more source-quality gates failed.\n");
  process.exitCode = 1;
} else {
  process.stdout.write("\nRELEASE GATE PASS: source, benchmark and rule-regression layers are green.\n");
}
