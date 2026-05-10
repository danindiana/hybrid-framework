#!/bin/bash
# tokenize_text.sh - Quick interface for the Ollama /api/tokenize endpoint.

MODEL=${1:-"qwen2.5:3b"}
TEXT=$2

if [ -z "$TEXT" ]; then
    echo "Usage: ./tokenize_text.sh [model] <text_to_tokenize>"
    exit 1
fi

curl -s http://localhost:11434/api/tokenize -d "{
  \"model\": \"$MODEL\",
  \"prompt\": \"$TEXT\"
}" | jq .
