#!/bin/bash
# self_correction_loop.sh - Automates the cycle of Implementation -> Audit -> Alignment -> Shift.

OBJECTIVE_FILE=$1
MODEL=${2:-"qwen2.5:3b"}

if [ -z "$OBJECTIVE_FILE" ]; then
    echo "Usage: ./tools/self_correction_loop.sh <objective.md> [model]"
    exit 1
fi

echo "--- Initializing Autonomous Self-Correction Loop ---"
echo "Objective: $(cat $OBJECTIVE_FILE | head -n 2)"

# Phase 1: Formal Execution
echo "[Step 1] Generating Implementation..."
IMPLEMENTATION_FILE="autogen_impl_$(date +%Y%m%d_%H%M%S).py"
# Simulation of AI generation for the loop logic
./tools/forensic_run.sh "$MODEL" "Generate a python script to solve the objective in $OBJECTIVE_FILE. Output ONLY the code." > "$IMPLEMENTATION_FILE"

# Phase 2: Forensic Audit
echo "[Step 2] Auditing Complexity..."
python3 ./tools/complexity_audit.py "$IMPLEMENTATION_FILE"

# Phase 3: Semantic Alignment
echo "[Step 3] Checking Alignment..."
./tools/semantic_check.py "$OBJECTIVE_FILE" "$IMPLEMENTATION_FILE" "$MODEL" > alignment_report.tmp
ALIGNMENT_SCORE=$(grep "alignment" alignment_report.tmp | grep -o '[0-9]\+')

echo "Alignment Score: ${ALIGNMENT_SCORE}%"

# Phase 4: Decision Tree
if [ "$ALIGNMENT_SCORE" -lt 80 ]; then
    echo "[CRITICAL] Semantic Drift Detected. Initializing Axiom Shift..."
    ./tools/axiom_shift.sh "low_alignment_correction"
else
    echo "[SUCCESS] Alignment within bounds. Finalizing artifact."
fi

rm alignment_report.tmp
echo "--- Loop Complete ---"
