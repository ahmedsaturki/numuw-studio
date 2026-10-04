# Bug Fixes Applied

## Fix 1: Metric Parsing (extract_metric function)

**Issue:** `extract_metric` failed to parse metric values when metric name contained `=`.

**Root Cause:** `rstrip(":=")` stripped the trailing `=` from the prefix, causing the extracted tail to start with `=value` instead of `value`.

**Before:**
```python
prefix = metric_grep.lstrip("^").rstrip(":=").strip()  # Removes trailing =
tail = stripped[len(prefix):].strip()  # Results in "=value"
```

**After:**
```python
prefix = metric_grep.lstrip("^").rstrip("=").strip()  # Keep trailing =
tail = stripped[len(prefix):].strip()  # Results in "value"
if tail.startswith(("=", ":")):
    tail = tail[1:].strip()  # Remove separator if present
```

**Impact:** Fixes 98 crash entries in results.tsv with `metric_parse_failed`.

## Fix 2: Result Logging on Revert Failure

**Issue:** When `revert_attempt` failed to revert (returned False), the function returned early without logging the result, creating incomplete records.

**Root Cause:** All error paths returned after calling `revert_attempt`, even when it returned False.

**Before:**
```python
if ret_code == -1:
    if revert_attempt(...):
        return "crash"  # Only logs if revert succeeds
    return "crash"  # But this never reached due to early return
```

**After:**
```python
if ret_code == -1:
    if revert_attempt(...):
        return "crash"
    log_result(..., "crash", ...)  # Always log
    return "crash"
```

**Impact:** Ensures all experiment outcomes are logged, even when revert conditions prevent resetting the branch.
