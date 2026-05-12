# Investigation: Sublime Text Plugin Host (PID 10223)
**Date:** January 27, 2026
**Status:** Closed (Software Removed)

## 1. Initial Discovery
*   **Target:** PID 10223
*   **Command:** `/opt/sublime_text/plugin_host-3.3`
*   **Parent Process:** `sublime_text` (PID 10132)
*   **User:** `jeb`

## 2. Process Details
*   **State:** Sleeping (S) - The process is currently idle.
*   **Memory Usage:** 
    *   **Virtual Size:** ~58 MB
    *   **RSS (Resident Set Size):** ~21 MB
*   **Working Directory:** `/opt/sublime_text`
*   **Communication:** 
    *   Uses shared memory objects in `/dev/shm` (`subl_arecv`, `subl_send`, `subl_recv`) for high-speed Inter-Process Communication (IPC) with the main editor.
*   **Open Files:** 
    *   Standard libraries (`libc`, `libm`, `libpthread`)
    *   Sublime-specific libraries (`libsqlite3`, `libcrypto`, `libssl`)
    *   Python locale archives.

## 3. Analysis
This process is the **plugin host** for Sublime Text, specifically running the Python 3.3 environment.
*   **Origin:** `plugin_host-3.3` is a core, default component of the Sublime Text installation. It is not a plugin itself, but the *container* that runs them.
*   **Function:** It executes all active plugins compatible with Python 3.3 in a single shared process to protect the main editor from crashing.

## 5. Identified Plugins
The following plugins were installed and running within this process:
*   **Package Control:** The standard package manager for Sublime Text.
*   **Colorsublime:** A plugin for previewing and installing color schemes.
*   **Mermaid:** A plugin for rendering Mermaid diagrams.

## 6. Resolution
*   **Action:** User requested removal of Sublime Text.
*   **Execution:** 
    *   Process terminated.
    *   Package `sublime-text` removed via `apt`.
    *   User configuration (`~/.config/sublime-text-3`) and cache (`~/.cache/sublime-text-3`) directories removed.
    *   Verified no leftover apt sources.
*   **Outcome:** Sublime Text and its plugin host process are no longer present on the system.