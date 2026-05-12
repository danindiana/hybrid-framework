#!/usr/bin/env bash
set -Eeuo pipefail

TARGET_DIR="/mnt/raid0/monolithic_pdf_folder"
WORKSPACE_DIR="/home/jeb/programs/gemini_cli_workspace"
DB_DIR="$WORKSPACE_DIR/.clamav"
RESULTS_LOG="$WORKSPACE_DIR/clam_scan_$(date +%Y%m%d_%H%M%S).log"

echo "--- Starting ClamAV Scan ---"
echo "Target: $TARGET_DIR"
echo "DB: $DB_DIR"
echo "Results log: $RESULTS_LOG"
echo "------------------------------------------"

if [ ! -d "$DB_DIR" ]; then
    echo "ERROR: Database directory not found: $DB_DIR"
    exit 1
fi

echo "Testing database..."
if ! clamscan --database="$DB_DIR" --no-summary /etc/hosts >/dev/null 2>&1; then
    echo "ERROR: ClamAV database test failed."
    echo "Rebuild it with:"
    echo "  rm -f \"$DB_DIR\"/main.* \"$DB_DIR\"/daily.* \"$DB_DIR\"/bytecode.*"
    echo "  freshclam --datadir=\"$DB_DIR\""
    exit 1
fi

echo "Counting PDFs..."
TOTAL_FILES=$(find -L "$TARGET_DIR" -type f -iname '*.pdf' | wc -l)
echo "Total PDFs: $TOTAL_FILES"

echo "Running single-process recursive scan..."
nice -n 10 ionice -c2 -n7 \
clamscan -r \
  --database="$DB_DIR" \
  --infected \
  --log="$RESULTS_LOG" \
  --max-filesize=100M \
  --max-scansize=400M \
  "$TARGET_DIR"

STATUS=$?

echo "------------------------------------------"
echo "Finished with exit code: $STATUS"
echo "Results log: $RESULTS_LOG"
exit $STATUS
