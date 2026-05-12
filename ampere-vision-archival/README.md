# AMPERE VISION
<p align="center">
  <img src="./logo.svg" width="400" alt="Ampere Vision Logo">
</p>

## Overview
**Ampere Vision** is a high-performance, low-latency Hikvision camera streaming and archival system. It leverages a Raspberry Pi 4 as a delivery node and a primary workstation (Worlock) for continuous high-fidelity archival.

## Architecture

### System Topology
![System Topology](./diagrams/arch_topology.svg)

The system is distributed across three primary nodes:
1.  **Hikvision Camera:** The source of truth (H.264 streams via ISAPI/RTSP).
2.  **Raspberry Pi 4:** The real-time delivery edge node running go2rtc and Nginx.
3.  **Worlock Desktop:** The archival node running a continuous ffmpeg segmentation loop.

### Data Flow
![Data Flow](./diagrams/data_flow.svg)

## Optimization Stack
![Optimization Stack](./diagrams/optimization_stack.svg)

To ensure smooth operation on RPI4 hardware, the camera firmware has been tuned to the following lightweight profiles:
- **Main Stream:** 1080p @ 12fps (2Mbps VBR)
- **Sub Stream:** 360p @ 6fps (256Kbps VBR)

## Network Ingress
![Network Ingress](./diagrams/network_ingress.svg)

The RPI4 provides a unified interface via Nginx proxy:
- **Web UI:** http://rpi4/camera/
- **WebRTC:** http://rpi4/camera/webrtc.html?src=camera_main
- **API:** http://rpi4/camera/api/

## Archival Logic
![Archival Logic](./diagrams/recorder_logic.svg)

The hikvision-record.service on Worlock ensures zero-loss archival by splitting the stream into 3-minute MKV segments with a 2-day rolling retention policy.

---
*Maintained by danindiana*
