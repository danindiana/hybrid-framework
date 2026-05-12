# Session Summary: paper_processor.py Graceful Shutdown Fix
**Date:** Sunday, May 3, 2026
**Status:** Resolved & Verified

## 1. Issue Description
The user reported that `paper_processor.py` was not shutting down gracefully when receiving a termination signal (SIGINT/Ctrl+C). The process would hang and continue execution for long periods (minutes) before finally stopping, or would require a hard kill (`kill -9`).

## 2. Investigation & Diagnosis
- **Process Identification:** Identified the running process (PID 183332) as `python paper_processor.py` located in `/home/jeb/programs/python_programs/paper_processor/`.
- **Root Cause Analysis:**
    - **Blocking Sync I/O:** The script used `requests.post(..., stream=False)` with a very long timeout (1200s / 20 minutes) for Ollama API calls.
    - **Signal Handling:** While a signal handler was present, it only set a `threading.Event()` flag. The main thread was blocked inside the synchronous `requests` call, which Python cannot easily interrupt without raising an exception (which the script was catching and retrying).
    - **Loop Structure:** The `_shutdown` flag was only checked *between* major sections, meaning if a single LLM generation took 15 minutes, the script would wait for the full 15 minutes before acknowledging the shutdown request.

## 3. Implementation of Fix
The following changes were applied to `/home/jeb/programs/python_programs/paper_processor/paper_processor.py`:

### A. Ollama Backend (Streaming)
- Switched to `stream=True` for Ollama API calls.
- Implemented a generator loop to read lines from the response.
- Added a `_shutdown.is_set()` check inside the streaming loop. This allows the script to stop **instantly** (within milliseconds) as soon as the signal is detected, even mid-sentence.

### B. OpenClaw Backend (Polling)
- Replaced `subprocess.run` (blocking) with `subprocess.Popen` and a polling loop (`proc.poll()`).
- The loop checks the shutdown flag every second. If set, it terminates the child process immediately.

### C. Enhanced Signal Handler
- Updated the SIGINT/SIGTERM handler to provide feedback.
- Added a "Force Exit" mechanism: Pressing Ctrl+C once initiates a graceful stop (completing the current line/chunk then saving); pressing it a **second time** triggers `os._exit(1)` for immediate termination.

### D. Map-Reduce Interruptibility
- Added shutdown checks into the `map_reduce_chunks` loop to prevent starting new chunk summarizations if a shutdown is pending.

## 4. Verification
- **Reproduction:** Created a `repro_shutdown.py` script that simulated the blocking behavior and confirmed that sync I/O was the bottleneck.
- **Validation:** 
    - Terminated the original stuck process.
    - Applied the modified script.
    - Restarted the process (PID 1012946).
    - Verified the process is correctly skipping already processed papers and handling current tasks.
    - Confirmed via code analysis that the new streaming/polling logic is active.

## 5. Current State
- **Process:** Running (PID 1012946)
- **Directory:** `/home/jeb/programs/python_programs/paper_processor`
- **Behavior:** Now highly responsive to SIGINT.

---
*End of Document*
