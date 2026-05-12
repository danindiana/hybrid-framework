# Diagnostic Investigation Report: Toshiba e-STUDIO356 Printer

**Date of Investigation:** Wednesday, March 25, 2026
**Target Device:** 192.168.1.50
**Status:** Reachable but Degraded / Not Printing

---

## 1. Executive Summary
The investigation into the Toshiba networked printer at `192.168.1.50` reveals that the device is online and responding to network requests. However, it is currently in an error state primarily due to **toner depletion (1%)** and a **full waste toner box**. Additionally, the printer's internal system clock is **stuck/frozen** at March 19th, despite the current date being March 25th. Network instability and potential IP conflicts were also observed on the host machine.

---

## 2. Device Information
| Attribute | Detail |
| :--- | :--- |
| **Model** | TOSHIBA e-STUDIO356 |
| **Serial Number** | C2FC44470 |
| **Device Name** | H163 |
| **IP Address** | 192.168.1.50 |
| **MAC Address** | reported as `00-00-00-00-00-00` via SNMP / `da:ec:5e:3e:ab:3a` (Suspect) |
| **Web Interface** | TopAccess (Apache Server) |

---

## 3. Detailed Findings

### 3.1 Consumables Status
*   **Black Toner (K):** **EMPTY**. 
    *   `RemainingQuantity`: 100% (reported incorrectly by some sensors).
    *   `RemainingQuantityDetails`: **1%** (Actual level).
    *   `BlackTonerEmpty`: **True**.
*   **Waste Toner:** **FULL**.
    *   `TonerBagFull`: **True**.
*   **Paper Trays:**
    *   **Drawer 1:** LETTER Plain - 100% Full.
    *   **Drawer 2:** LETTER Plain - **Empty**.
    *   **Large Capacity Feeder:** LETTER Plain - 100% Full.
    *   **Bypass Tray:** **Empty**.

### 3.2 System Integrity & Logs
*   **System Clock:** The internal clock is frozen at `2026-03-19T09:22:22`. 
    *   *Observation:* Recent print jobs are being logged with timestamps in the "future" relative to this clock (e.g., jobs on March 25th), indicating the system time is not advancing or is out of sync.
*   **Job History:** Recent jobs for user `jeb` (e.g., `ogham_taxonomy.md`) are marked as **Completed (Code 4000)**.
    *   *Inference:* The printer is processing the logic of the jobs but is likely failing to produce physical output due to the 1% toner level or the waste toner alert.

### 3.3 Network Diagnostics
*   **Connectivity:** Reachable via Ping, HTTP (80), PJL (9100), and SNMP (161).
*   **Stability:** High latency was observed (up to **1255ms**). The ARP entry for `192.168.1.50` occasionally enters a `FAILED` state.
*   **Conflict:** The MAC address `da:ec:5e:3e:ab:3a` was detected on both local interfaces (`enp3s0f0` and `enp3s0f1`), suggesting a potential routing conflict or IP duplication on the network.

---

## 4. Root Cause Analysis
The primary reason for the "not printing" symptom is a combination of:
1.  **Critical Toner Depletion:** The 1% toner level and "BlackTonerEmpty" flag typically halt the printing process to prevent damage to the developer unit.
2.  **Waste Toner Limit:** The full waste toner box is a hard-stop condition for most Toshiba e-STUDIO models.
3.  **System Glitch:** The frozen clock suggests the controller may need a cold reboot to resynchronize and clear transient errors.

---

## 5. Recommendations

### Immediate Actions
1.  **Replace Black Toner Cartridge:** Install a new T-4590 or compatible toner.
2.  **Empty/Replace Waste Toner Box:** The printer will remain in an alert state until this is addressed.
3.  **Cold Reboot:** Power off the printer using the main switch, wait 30 seconds, and restart to clear the frozen clock and refresh the network interface.
4.  **Refill Drawer 2:** Add LETTER paper to Drawer 2 to clear the "Paper Empty" alert.

## 6. Maintenance & Reset Procedures

For full visual guides, see:
- [Maintenance Flow Diagram (PNG)](./toshiba_maintenance_flow.png)
- [Maintenance Flow Diagram (SVG)](./toshiba_maintenance_flow.svg)

### 6.1 Waste Toner Box Recovery
1.  **Extract:** Open front panel and release the waste container.
2.  **Clean:** Empty toner into a bag. Wipe the **clear plastic windows** (optical eyes) on the box and the sensors inside the printer chassis.
3.  **Reset (if needed):** Use 08 Mode -> Code 4539 -> Set to 0.

### 6.2 Fatal/Inside Error Reset (08 Mode)
1.  **Enter Mode:** Power OFF. Hold **[0]** and **[8]** while powering ON.
2.  **Clear Error Flag:** Type **2002**, press **[START]**, change value to **0**, press **[SET/OK]**.
3.  **Exit:** Power cycle the machine normally.

### 6.3 Consumable References
- **Black Toner:** T-4590
- **Waste Toner Box:** TB-4530
- **Page Yield:** ~36,600 (5% coverage)
