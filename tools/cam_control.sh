#!/usr/bin/env bash
# Ampere Vision — Unified Camera Control
# Manages RPI4 streaming and Worlock archival

RECORD_DIR="/home/jeb/hikvision_camera_donely"
RPI_HOST="rpi4"

log() { echo -e "\033[1;36m[CAM]\033[0m $*"; }
error() { echo -e "\033[1;31m[ERROR]\033[0m $*"; exit 1; }

get_status() {
    local worlock_svc=$(systemctl is-active hikvision-record.service)
    local rpi_svc=$(ssh "$RPI_HOST" "systemctl is-active go2rtc.service")
    
    echo "--- Ampere Vision Status ---"
    echo "Worlock Recorder: $worlock_svc"
    echo "RPI4 Streamer:    $rpi_svc"
    echo "Storage Usage:    $(du -sh "$RECORD_DIR" | cut -f1)"
    echo "Segment Count:    $(ls "$RECORD_DIR"/seg_*.mkv 2>/dev/null | wc -l)"
    echo "---------------------------"
}

case "${1:-status}" in
    on)
        log "Initializing Camera Stack..."
        sudo systemctl start hikvision-record.service
        ssh "$RPI_HOST" "sudo systemctl start go2rtc.service"
        log "Stack is now ON."
        get_status
        ;;
    off)
        log "Deactivating Camera Stack..."
        sudo systemctl stop hikvision-record.service
        ssh "$RPI_HOST" "sudo systemctl stop go2rtc.service"
        log "Stack is now OFF."
        get_status
        ;;
    flush)
        get_status
        echo "Are you sure you want to FLUSH all archival data? (y/N)"
        read confirm
        if [[ "$confirm" == [yY] ]]; then
            log "Flushing archival data..."
            rm -f "$RECORD_DIR"/seg_*.mkv
            log "Archival data cleared."
        else
            log "Flush cancelled."
        fi
        ;;
    status)
        get_status
        ;;
    *)
        echo "Usage: $0 {on|off|status|flush}"
        exit 1
        ;;
esac
