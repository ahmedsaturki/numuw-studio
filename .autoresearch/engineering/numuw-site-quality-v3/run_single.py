#!/usr/bin/env python3
import subprocess
import sys

# Change to numuw-studio directory
import os
os.chdir(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))))

# Run the runner
result = subprocess.run(
    ["py", "-3", r"C:\Users\powertech\AppData\Roaming\MstyStudio\skills\autoresearch-agent\scripts\run_experiment.py", "--experiment", "engineering/numuw-site-quality-v3", "--single"],
    capture_output=True,
    text=True
)

print(result.stdout)
print(result.stderr)
sys.exit(result.returncode)
