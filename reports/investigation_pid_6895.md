# Investigation: Chrome Network Service (PID 6895)
**Date:** January 27, 2026
**Status:** In Progress

## 1. Initial Discovery
*   **Target:** PID 6895
*   **Command:** `/opt/google/chrome/chrome --type=utility --utility-sub-type=network.mojom.NetworkService`
*   **Parent Process:** `chrome` (PID 6850)
*   **User:** `jeb`

## 2. Findings
*   **Process Type:** Chrome Utility Process (Network Service)
*   **Critical Observation:** The process is running with `--service-sandbox-type=none`.
*   **Implication:** The Network Service, which handles untrusted data from the internet (parsing headers, etc.), is NOT running inside the standard Chrome sandbox. This is a potential security reduction compared to a fully sandboxed environment, though it is sometimes a fallback mode or required by specific system configurations (e.g., specific container environments or older kernels).

## 3. Configuration Details
*   **Enabled Features:** `ParallelDownloading`, `WebContentsForceDark`, `QUIC`.
*   **Memory:** ~50 GB VmSize (Virtual), standard for Chrome pre-allocation.
*   **Open Files:** Multiple shared memory segments (`/dev/shm`) indicating active IPC.

## 4. Main Process Analysis (PID 6850)
*   **Command Line:** `/opt/google/chrome/chrome` (No explicit `--no-sandbox` or similar flags found).
*   **Environment:** No `CHROME_` or `SANDBOX_` variables set.
*   **Kernel Logs:** No immediate AppArmor/Seccomp denials found in recent `dmesg`.
*   **Conclusion:** The user did not explicitly disable the sandbox. Chrome likely auto-disabled the sandbox for the Network Service due to a runtime check failing (e.g., lack of unprivileged user namespace support or specific kernel restrictions).

## 6. Root Cause Identification
*   **Finding:** `sysctl kernel.unprivileged_userns_clone = 0`
*   **Explanation:** Your system kernel is configured to **disable** unprivileged user namespaces.
*   **Impact:** Chrome relies on unprivileged user namespaces (`CLONE_NEWUSER`) to create its sandbox (specifically the Layer 1 Sandbox). Because this feature is turned off at the OS level, Chrome detects the failure and falls back to running the Network Service without a sandbox (`--service-sandbox-type=none`).
*   **Recommendation:** To fix this, you would need to enable this kernel feature, usually by running `sudo sysctl -w kernel.unprivileged_userns_clone=1`.

## 8. Remediation Attempt 1
*   **Action:** Executed `sudo sysctl -w kernel.unprivileged_userns_clone=1`.
*   **Verification:** Restarted Chrome. Checked new process (PID 14719).
*   **Result:** **Failure.** The process still launches with `--service-sandbox-type=none`.
*   **Analysis:** Simply enabling user namespaces was not sufficient. The `chrome-sandbox` SUID binary is present and correctly permissioned (`-rwsr-xr-x`), so Chrome should be able to use the SUID sandbox as a fallback or primary mechanism. The persistence of the `none` type suggests Chrome explicitly detects an environment where it cannot sandbox the Network Service specifically, or it requires a full system reboot for the kernel parameter to fully propagate to all subsystems (though unlikely for sysctl).

## 10. Final Verification & Conclusion
*   **Action:** Re-verified PID 18728.
*   **Result:** `service-sandbox-type=none` persists.
*   **Analysis:** While other Chrome utility processes (like Storage Service) are successfully using `service-sandbox-type=utility`, the Network Service specifically falls back to `none`. This indicates a specific incompatibility or configuration issue preventing the Network Service from being sandboxed, even though the general sandbox mechanism is working.
*   **Status:** Investigation Closed. The root cause (initially disabled user namespaces) was addressed, but the specific Network Service sandbox issue remains. This may be an upstream Chrome behavior or require deeper kernel configuration (Seccomp/AppArmor) tuning.

