# System Architecture: Agentic Quant

This document outlines the closed-loop capital allocation system, focusing on autonomous trading, model self-improvement, and resource management.

## 1. System Overview
The stack is designed as a multi-layered autonomous system that explores, evaluates, and exploits edges in prediction markets (Kalshi). It balances high-compute LLM tasks with low-latency execution and GPU-intensive model training.

## 2. Core Layers

### A. Sensor Layer (Data Acquisition)
- **Primary Hardware:** Raspberry Pi 4 (accessible via `ssh rpi4`).
- **Function:** 24/7 collection of orderbook snapshots, candle feeds, and settlement data.
- **Goal:** Decouple IO-bound data collection from compute-bound execution to ensure high availability and data integrity.

### B. Model Layer (XGBoost & Frontier LLMs)
- **Execution Model:** XGBoost trained on orderbook features for signal generation.
- **Meta-Layer:** Frontier models (Claude, GPT) used for hypothesis generation, performance diagnosis, and code generation.
- **Training Pipeline:** Triggered by performance drift (AUC drop) rather than a fixed schedule.

### C. Execution Layer (Kalshi Auto-Trader)
- **Service:** `kalshi-auto-trader.service`
- **Logic:** Uses `pick_device()` to dynamically select between GPU and CPU based on VRAM availability.
- **Control:** Includes drawdown halts and position sizing based on P&L feedback.

### D. Resource Management (GPU Orchestration)
- **Hardware:**
    - GPU 0: NVIDIA RTX 5080 (Primary, 16GB)
    - GPU 1: NVIDIA RTX 3080 (Secondary, 10GB)
- **Utilities:**
    - `gpu-evict`: Polls Ollama to clear VRAM for training jobs.
    - `gpu-status`: Real-time monitoring of VRAM and active models.
- **Integration:** Training scripts call `evict_and_claim()` to ensure GPU priority over LLM services.

## 3. Key Services
- **Ollama:** Serves LLMs for the Meta-Layer and research.
- **OpenClaw Gateway:** Active AI proxy handling generation requests.
- **Kalshi API:** Interface for orderbook data and trade execution.

## 4. Maintenance & Operations
- **Eviction Timeout:** 60-second polling for active generations to finish before claiming GPU.
- **Service Management:** `systemctl` managed units for persistent operations.
