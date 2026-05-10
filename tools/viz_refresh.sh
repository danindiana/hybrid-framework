#!/bin/bash
# viz_refresh.sh - Automatically refreshes all DOT diagrams in the repository.

echo "--- Refreshing Architectural Diagrams ---"

# Refresh root diagrams
for f in *.dot; do
    if [ -f "$f" ]; then
        echo "Processing $f..."
        dot -Tpng "$f" -o "${f%.dot}.png"
        dot -Tsvg "$f" -o "${f%.dot}.svg"
    fi
done

# Refresh diagrams directory
if [ -d "diagrams" ]; then
    for f in diagrams/*.dot; do
        if [ -f "$f" ]; then
            echo "Processing $f..."
            dot -Tpng "$f" -o "${f%.dot}.png"
            dot -Tsvg "$f" -o "${f%.dot}.svg"
        fi
    done
fi

echo "--- Refresh Complete ---"
