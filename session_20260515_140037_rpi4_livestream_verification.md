# Session Report: rpi4 Livestream Verification
**Date:** 2026-05-15 14:00:37
**Device:** rpi4 (192.168.1.165)

## Objective
Verify if `rpi4` is currently livestreaming to YouTube and confirm the feed status.

## Investigation Details

### 1. Process Check
Identified an active `ffmpeg` process:
- **PID:** 72984
- **Command:** `/usr/bin/ffmpeg -nostdin -nostats -hide_banner -loglevel info -fflags +genpts -rtsp_transport tcp -i rtsp://localhost:8554/camera_main -f lavfi -i aevalsrc=0:sample_rate=44100 -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 32k -progress /tmp/youtube-ffmpeg-progress -f flv rtmp://a.rtmp.youtube.com/live2/w9xg-9k05-g5wp-t936-a7u4`
- **Source:** RTSP stream from localhost (Mediamtx or similar).
- **Audio:** Generated silent audio (aevalsrc).

### 2. Network Activity
Checked active connections on port 1935 (RTMP):
- **Status:** `ESTABLISHED`
- **Remote Address:** `[2607:f8b0:4023:1002::86]:1935` (YouTube Ingest Server)
- **Local Address:** `[2600:1700:269:450::44]:35184`

### 3. Stream Progress
Analyzed `/tmp/youtube-ffmpeg-progress` on `rpi4`:
- **Current Bitrate:** ~4021.3 kbits/s
- **Stream Duration:** ~00:06:57
- **Speed:** 1.0x (Optimal for realtime streaming)
- **Frame Rate:** ~20 fps
- **Progress Status:** `continue`

## Conclusion
**Status:** **CONFIRMED LIVE**

The `rpi4` device is successfully streaming to YouTube. The connection is stable, and data is being transmitted at approximately 4 Mbps.
