#!/bin/bash
# axiom_shift.sh - Facilitates the "Meta-Leap" process in transfinite development.

SHIFT_NAME=$1

if [ -z "$SHIFT_NAME" ]; then
    echo "Usage: ./axiom_shift.sh <shift_name>"
    exit 1
fi

DATE=$(date +%Y%m%d_%H%M%S)
TARGET_FILE="axiom_shift_${SHIFT_NAME}_${DATE}.md"

cp templates/axiom_shift.md "$TARGET_FILE"

echo "--- Axiom Shift Initialized: $SHIFT_NAME ---"
echo "Template created: $TARGET_FILE"
echo "Please edit this file to document the Gödelian Limit and the new Transfinite Axioms."

# Add to git if in repo
if [ -d ".git" ]; then
    git add "$TARGET_FILE"
fi

# Visual trigger
if [ -f "./tools/viz_refresh.sh" ]; then
    echo "Remember to run ./tools/viz_refresh.sh if this shift changes the system architecture."
fi
