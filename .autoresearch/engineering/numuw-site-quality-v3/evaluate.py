#!/usr/bin/env python3
import subprocess
import json
import os

# Get the current working directory (where the runner executes)
current_dir = os.getcwd()

# Determine project root from current directory
# If we're in numuw-studio/.autoresearch, go up to numuw-studio
if '.autoresearch' in current_dir:
    project_root = current_dir
else:
    project_root = current_dir

# Run the Node.js harness
result = subprocess.run(
    ["node", "bench/site-quality.mjs"],
    capture_output=True,
    text=True,
    timeout=300,
    cwd=project_root
)

# Parse the metric lines
metrics = {}
for line in result.stdout.split('\n'):
    if line.startswith('METRIC'):
        key, value = line.split('=', 1)
        metrics[key.strip()] = float(value.strip())

# Output metrics in JSON format expected by autoresearch
output = {
    "issues": int(metrics.get("issues", 0)),
    "total_bytes": int(metrics.get("total_bytes", 0)),
    "html_bytes": int(metrics.get("html_bytes", 0)),
    "combined": int(metrics.get("issues * 1e6 + html_bytes", 0))
}

print(json.dumps(output))
