# LiveKit E2EE Worker Investigation & Chrome Debugging Summary

## 1. Chrome Debugging Status
**Issue:** You attempted to start Chrome with `--remote-debugging-port=9222`, but the debugger was not accessible.
**Root Cause:** Chrome processes are "singletons." If a standard Chrome instance is already running, executing `google-chrome --remote-debugging-port=9222` will merely open a new window in the *existing* process (which has debugging disabled), effectively ignoring the flag.
**Verification:**
- Process `26115` was running with the flag, but `ss -tlnp` confirmed **no process was listening on port 9222**.
- Attempts to launch a fresh instance with a custom user data directory also failed to bind the port in GUI mode, suggesting a system-level configuration issue or conflict.

## 2. File Analysis: `livekit-client.e2ee.worker`
Since live debugging was unavailable, the worker file (`livekit-client.e2ee.worker-CnFd6278.js`) was downloaded and analyzed statically.

### **Purpose**
This is a **Web Worker** responsible for **End-to-End Encryption (E2EE)** of media streams (Insertable Streams) in a LiveKit client. It runs off the main thread to prevent blocking the UI during heavy encryption operations.

### **Key Technical Details**
*   **Encryption Algorithm:** **AES-GCM** is used for all operations (`G="AES-GCM"`).
*   **Initialization Vector (IV):** Uses a **12-byte IV** (`ne=12`).
*   **Key Management (Ratcheting):**
    *   The worker implements a **self-healing key ratchet** mechanism.
    *   If decryption fails (e.g., `decryptionFailure`), it attempts to "ratchet" the key forward (`ratchetKey`) to resync with the sender.
    *   This is crucial for handling packet loss or out-of-order delivery in real-time media.

### **Frame Handling Logic**
The worker has specific handling for different codecs:
*   **VP8 / VP9 / H.264:** It parses these video formats to find the payload and safe insertion points for the IV.
*   **AV1:** Explicitly unsupported (`"av1 is not yet supported..."`).
*   **Process:**
    1.  **Incoming Frame:** Checks for a "trailer" containing the Key Index.
    2.  **Decryption:** Extracts the IV and attempts to decrypt the payload using the key at the specified index.
    3.  **Failure Recovery:** If the key is invalid, it triggers the ratchet logic to derive the next likely key.

### **Potential Debugging Signals**
If you are debugging this in a console, look for these specific log messages defined in the worker:
-   `"decoding frame failed"`
-   `"missing key at index <N>"`
-   `"maximum ratchet attempts exceeded"` (Critical: indicates total desync)
-   `"setting new participant on cryptor"`

## 3. Local Machine Context
*   **Network Latency:** Previous investigations (`netwatch`) identified high latency (~66ms) caused by a VS Code remote tunnel (`code-tunnel`), not local network issues.
*   **NIC Status:** The network interface `enp3s0f0` is operating correctly at 1 Gbps.
