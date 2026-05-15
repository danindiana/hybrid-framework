# Session Report: Telemetry Utility Deployment
**Date:** 2026-05-15 14:20:00
**Device:** rpi4 (192.168.1.165)

## New Utility: `stream-telemetry.sh`
Created an ultralightweight monitoring script on the `rpi4` that provides real-time feedback on the livestream circuit.

### Features
- **Circuit Status:** Monitors both `go2rtc` (source) and `ffmpeg` (ingest) service states.
- **Socket Tracking:** Checks RTMP connection status on port 1935.
- **Performance Metrics:** Parses `/tmp/youtube-ffmpeg-progress` for:
    - Uptime
    - Current Bitrate
    - Total Data Transferred (MB)
    - Real-time Framerate
    - Encoding Speed
    - Dropped Frames

### How to use
1. Open a separate terminal and SSH into `rpi4`.
2. Run the utility:
   ```bash
   ./stream-telemetry.sh
   ```
3. The dashboard will update every 2 seconds.

### MOTD Integration
Added the command to the system MOTD so it is visible upon every login.
