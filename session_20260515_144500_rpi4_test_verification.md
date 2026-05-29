# Test Report: RPI4 Livestream & Telemetry Features
**Date:** 2026-05-15 14:45:00

## 1. Livestream Control
- **Start Test:** `sudo systemctl start hikvision-youtube.service` successfully initiated the stream.
- **Stop Test:** `sudo systemctl stop hikvision-youtube.service` successfully terminated the stream.
- **Service Status:** Confirmed transition from `failed/inactive` to `active (running)` and back.

## 2. Telemetry Verification
- **Data Flow:** Confirmed `/tmp/youtube-ffmpeg-progress` is populated during active streaming.
- **Metrics Observed:**
    - Bitrate: ~4000 kbps
    - Framerate: ~21 FPS
    - Speed: ~1.05x
- **State Handling:** `stream-telemetry.sh` correctly identifies "OFFLINE" state when ffmpeg is not running.

## 3. Instructions for Operator
To monitor the livestream telemetry in real-time, open a new terminal and run:
```bash
ssh -t rpi4 "./stream-telemetry.sh"
```
The dashboard will update every 2 seconds.
