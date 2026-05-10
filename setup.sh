#!/bin/bash
# setup.sh - Verifies the "Pile of Parts" (Dependencies)

echo "--- Transfinite Framework: Dependency Audit ---"

check_dep() {
    if command -v "$1" >/dev/null 2>&1; then
        echo -e "[\033[92mOK\033[0m] $1 is installed."
    else
        echo -e "[\033[91mFAIL\033[0m] $1 not found. Please install $2."
    fi
}

# 1970s Parts
check_dep "bash" "Bourne Again Shell"
check_dep "jq" "JSON Processor (apt install jq)"
check_dep "curl" "CURL (apt install curl)"

# 1990s Parts
check_dep "dot" "Graphviz (apt install graphviz)"

# 2020s Parts
check_dep "ollama" "Ollama (visit ollama.com)"
check_dep "python3" "Python 3.x"

# Framework Permissions
echo "--- Finalizing Permissions ---"
chmod +x tools/*.sh
chmod +x tools/*.py

echo "--- Audit Complete ---"
echo "To initialize the HUD, run: python3 tools/controller.py"
