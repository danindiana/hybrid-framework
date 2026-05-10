#!/bin/bash
# viz_refresh.sh - Automatically refreshes all DOT diagrams in the repository recursively.

echo "--- Refreshing Architectural Diagrams (Recursive) ---"

# Find all .dot files and process them
find . -name "*.dot" -not -path "*/.*" | while read -r f; do
    echo "Processing $f..."
    dot -Tpng "$f" -o "${f%.dot}.png"
    dot -Tsvg "$f" -o "${f%.dot}.svg"
done

echo "--- Refresh Complete ---"
