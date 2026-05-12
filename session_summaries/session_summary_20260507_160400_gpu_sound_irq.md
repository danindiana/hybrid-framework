# Session Summary - GPU Sound Card IRQ Investigation
Date: Thursday, May 7, 2026
Timestamp: 20260507_160400

## Hardware Identification
The system contains an NVIDIA RTX 5080 and an NVIDIA RTX 3080 GPU.

### RTX 5080
- **VGA Controller:** `0d:00.0` [10de:2c02] (IRQ 129)
- **Audio Device:** `0d:00.1` [10de:22e9] (IRQ 143 - **Disabled**)

### RTX 3080
- **VGA Controller:** `0e:00.0` [10de:2206] (IRQ 128)
- **Audio Device:** `0e:00.1` [10de:1aef] (IRQ 144 - **Disabled**)

## Actions Taken
1. **Immediate Disable:** Both GPU audio devices were manually removed from the PCI bus for the current session:
   - RTX 5080: `echo 1 | sudo tee /sys/bus/pci/devices/0000:0d:00.1/remove`
   - RTX 3080: `echo 1 | sudo tee /sys/bus/pci/devices/0000:0e:00.1/remove`

2. **Persistent Prevention:** A udev rule was created/updated at `/etc/udev/rules.d/99-disable-gpu-audio.rules` to automatically remove these devices whenever they are detected (e.g., during boot):
   ```text
   ACTION=="add", SUBSYSTEM=="pci", ATTR{vendor}=="0x10de", ATTR{device}=="0x22e9", ATTR{remove}="1"
   ACTION=="add", SUBSYSTEM=="pci", ATTR{vendor}=="0x10de", ATTR{device}=="0x1aef", ATTR{remove}="1"
   ```

3. **Verification:** `lspci` confirmed that only the VGA controllers remain visible. The audio devices are no longer present on the bus and are not consuming IRQs.

## Conclusion
The sound card IRQs for both the RTX 5080 (143) and RTX 3080 (144) are now disabled and blocked from future allocation.
