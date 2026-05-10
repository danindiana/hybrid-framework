#!/bin/bash
# forensic_run.sh - A wrapper for Ollama to capture and log token metrics.

MODEL=$1
PROMPT=$2

if [ -z "$MODEL" ] || [ -z "$PROMPT" ]; then
    echo "Usage: ./forensic_run.sh <model> <prompt>"
    exit 1
fi

LOG_FILE="forensics_$(date +%Y%m%d_%H%M%S).json"

echo "--- Initializing Forensic Session: $MODEL ---"
echo "Prompt: $PROMPT"

# Run with verbose and capture output
ollama run "$MODEL" "$PROMPT" --verbose 2>&1 | tee "raw_output.tmp"

# Extract metrics for forensic logging
echo "--- Extracting Metrics ---"
TOTAL_DUR=$(grep "total duration" raw_output.tmp | awk '{print $3}')
LOAD_DUR=$(grep "load duration" raw_output.tmp | awk '{print $3}')
PROMPT_EVAL=$(grep "prompt eval count" raw_output.tmp | awk '{print $4}')
EVAL_COUNT=$(grep "eval count" raw_output.tmp | awk '{print $3}')
EVAL_RATE=$(grep "eval rate" raw_output.tmp | awk '{print $3}')

# Build JSON log
cat <<EOF > "$LOG_FILE"
{
  "timestamp": "$(date -Iseconds)",
  "model": "$MODEL",
  "prompt": "$PROMPT",
  "metrics": {
    "total_duration": "$TOTAL_DUR",
    "load_duration": "$LOAD_DUR",
    "prompt_tokens": "$PROMPT_EVAL",
    "output_tokens": "$EVAL_COUNT",
    "tokens_per_second": "$EVAL_RATE"
  }
}
EOF

echo "Forensic log saved to: $LOG_FILE"
rm raw_output.tmp
