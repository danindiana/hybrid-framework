#!/bin/bash

# Ollama Console Wizard - A tool to monitor Ollama model output and status

# Colors for better readability
BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

show_status() {
    echo -e "${BLUE}=== Ollama Loaded Models ===${NC}"
    ollama ps
    echo ""
    if command -v nvidia-smi &> /dev/null; then
        echo -e "${BLUE}=== GPU Usage ===${NC}"
        nvidia-smi --query-gpu=index,name,utilization.gpu,memory.used,memory.total --format=csv,noheader | sed 's/,/ | /g'
    fi
}

show_logs() {
    local lines=${1:-50}
    echo -e "${BLUE}=== Recent Ollama Logs (Last $lines lines) ===${NC}"
    journalctl -u ollama -n "$lines" --no-pager
}

follow_logs() {
    echo -e "${GREEN}=== Monitoring Ollama Logs (Ctrl+C to exit) ===${NC}"
    journalctl -u ollama -f
}

case "$1" in
    status)
        show_status
        ;;
    logs)
        show_logs "$2"
        ;;
    follow)
        follow_logs
        ;;
    help|--help|-h)
        echo "Ollama Console Wizard"
        echo "Usage:"
        echo "  $0 status      - Show loaded models and GPU usage"
        echo "  $0 logs [n]    - Show the last [n] log lines (default 50)"
        echo "  $0 follow      - Follow logs in real-time"
        echo "  $0             - Show status and instructions"
        ;;
    *)
        show_status
        echo ""
        echo -e "${GREEN}Tip:${NC} Run '${BLUE}$0 follow${NC}' to monitor model output in real-time."
        ;;
esac
