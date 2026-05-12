# Services & Port Reference

Quick reference for the active services in the Agentic Quant stack.

## System Services (systemd)
| Service Name | Description | Status Check |
| :--- | :--- | :--- |
| `ollama` | LLM API & Model Host | `systemctl status ollama` |
| `kalshi-auto-trader` | Active Trading Bot | `systemctl status kalshi-auto-trader` |
| `openclaw-gateway` | AI Proxy / Orchestrator | `ps aux | grep openclaw` |

## Networking & Ports
| Port | Service | Access |
| :--- | :--- | :--- |
| `11434` | Ollama API | Localhost / Internal |
| `[TBD]` | OpenClaw Gateway | Internal Proxy |
| `SSH` | RPi4 Sensor Node | `ssh rpi4` |

## Important Paths
- **Scripts:** `/usr/local/bin/gpu-evict`, `/usr/local/bin/gpu-status`
- **Workaround Files:** `classifier_device.py`, `train_classifier_with_orderbook.py`
- **Logs:** `journalctl -u kalshi-auto-trader -f`
