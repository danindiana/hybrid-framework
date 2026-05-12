#!/usr/bin/env bash
set -Eeuo pipefail

TARGET_DIR="${1:-/mnt/raid0/monolithic_pdf_folder/Incoming_Pdfsv10/nips_21}"
DB_DIR="/var/lib/clamav"
OUT_DIR="$HOME/clamav_triage_$(date +%Y%m%d_%H%M%S)"

mkdir -p "$OUT_DIR"

RESULTS_LOG="$OUT_DIR/results.log"
ERROR_LOG="$OUT_DIR/errors.log"
CRASH_LOG="$OUT_DIR/crash.log"

echo "Target: $TARGET_DIR"
echo "DB: $DB_DIR"
echo "Out: $OUT_DIR"

find -L "$TARGET_DIR" -type f -iname '*.pdf' -print0 |
while IFS= read -r -d '' f; do
    echo "SCAN $f"
    timeout 120s clamscan \
        --database="$DB_DIR" \
        --bytecode=no \
        --infected \
        --no-summary \
        --max-filesize=100M \
        --max-scansize=400M \
        "$f" >>"$RESULTS_LOG" 2>>"$ERROR_LOG"
    rc=$?

    case "$rc" in
        0) ;;  # clean
        1) echo "INFECTED $f" >>"$CRASH_LOG" ;;   # clamscan uses 1 when infected
        124) echo "TIMEOUT  $f" >>"$CRASH_LOG" ;;
        139) echo "SEGV     $f" >>"$CRASH_LOG" ;;
        *) echo "RC=$rc   $f" >>"$CRASH_LOG" ;;
    esac
done

echo
echo "Done."
echo "Results: $RESULTS_LOG"
echo "Errors:  $ERROR_LOG"
echo "Crash:   $CRASH_LOG"
