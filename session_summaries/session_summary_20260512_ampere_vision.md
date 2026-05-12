# Session Summary: Ampere Vision Implementation — 2026-05-12

## Objectives
- Deploy optimized Hikvision camera streaming to RPI4.
- Implement 'Human-in-the-Loop' (intentional) camera control.
- Document system architecture with Graphviz.

## Key Accomplishments
1.  **Optimized Streaming:**
    - Configured Hikvision DS-2CD2742FWD-IZS via ISAPI.
    - Set 1080p @ 12fps (2Mbps) for RPI4 compatibility.
    - Aligned GOP to 24 (2s keyframes) for instant WebRTC loading.
2.  **RPI4 Edge Node:**
    - Deployed go2rtc with WebRTC and MSE support.
    - Configured Nginx as a secure WebSocket/HTTP proxy.
    - Fixed hostname resolution via local `/etc/hosts`.
3.  **Intentional Control:**
    - Created `tools/cam_control.sh` for multi-node on/off/flush management.
    - Set system default to **OFF** to preserve disk health.
4.  **Archival:**
    - Maintained worlock continuous recorder (3m segments, 2-day rolling).
5.  **Documentation:**
    - Created `ampere-vision-archival/` with 5 architecture diagrams and a comprehensive README.

## Final State
- **URL:** http://rpi4/camera/
- **Control:** `./tools/cam_control.sh {on|off|status|flush}`
- **Repo:** [danindiana/hybrid-framework](https://github.com/danindiana/hybrid-framework)

---
*Human Context: jeb | AI Context: Gemini CLI*

## Gemini CLI Source Installation (RPI4)
- **Repo:** https://github.com/google-gemini/gemini-cli
- **Version:** 0.42.0-nightly
- **Fix:** Used temporary 2GB swap file to handle `esbuild` compilation on 1GB RAM.
- **Link:** Global `gemini` command now points to `~/programs/gemini-cli/bundle/gemini.js`.
- **Optimization:** Restricted API to 127.0.0.1 and enabled 256-color support.

---
*Status: All systems operational.*

## Memory & Swap Expansion (RPI4)
- **Primary Swap:** 1GB zram (Compressed RAM, Priority 100).
- **Extended Swap:** 6GB file-based swap on SSD (Priority 10).
- **Total Capacity:** ~7GB.
- **Persistence:** Configured in `/etc/fstab`.
- **Swappiness:** Increased to 60 to optimize use of SSD-based overflow.

---
*Operational status: High-compute edge node ready.*

## Final Optimization: Stream Relay (Fan-Out)
- **Change:** Pointed Worlock `record.sh` to `rtsp://rpi4:8554/camera_main` instead of the camera's IP.
- **Benefit:** The Hikvision camera now only has to handle ONE outbound connection. 
- **Role:** The RPI4 now acts as the central relay (Fan-Out) node, distributing the feed to browsers and archival storage simultaneously.
