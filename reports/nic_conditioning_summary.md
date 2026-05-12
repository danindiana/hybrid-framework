# NIC Conditioning Summary: enp7s0 (Updated)

## 1. Physical Link Status
- **Current Speed:** 100Mb/s (Full Duplex)
- **Status:** **Bottlenecked**. 
- **Action Taken:** Attempted software reset of auto-negotiation; link remained at 100Mb/s.
- **Root Cause:** Physical layer limitation. 
- **Recommendation:** Replace Ethernet cable with a verified Cat5e or Cat6 cable. Ensure the router/switch port supports Gigabit.

## 2. Interrupt Coalescing
- **Original:** 3us
- **Current:** 50us
- **Status:** **Optimized**. This change reduces CPU interrupts during high-bandwidth activity, improving overall system responsiveness during downloads.

## 3. OS Network Stack (sysctl)
- **Window Scaling:** Enabled
- **Max TCP Buffers:** 16MB
- **Status:** **Optimal**. The Linux kernel is already configured to handle Gigabit throughput efficiently.

## 4. Ring Buffers
- **Status:** **Optimal**. Already at maximum hardware capacity (4096).
