#!/usr/bin/env python3
import subprocess
import json
import os

# Get the project root (parent of numuw-studio)
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))

# Run the Node.js harness from the project root
result = subprocess.run(
    ["node", os.path.join(project_root, "bench/site-quality.mjs")],
    capture_output=True,
    text=True,
    timeout=300,
    cwd=project_root
)

# Initialize metrics dict
metrics = {}

# Parse the metric lines (ignore non-METRIC lines like "issues: 106")
for line in result.stdout.split('\n'):
    line = line.strip()
    if line.startswith('METRIC '):
        key, value = line.split('=', 1)
        key = key.replace('METRIC ', '', 1)
        metrics[key.strip()] = float(value.strip())

# Output metrics in the format expected by autoresearch
print(f"combined: {int(metrics.get('issues * 1e6 + html_bytes', 0))}")
