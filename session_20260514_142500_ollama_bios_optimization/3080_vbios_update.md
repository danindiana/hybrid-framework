# ASUS RTX 3080 VBIOS Update Guide (Linux)

## Current Status
- **RTX 5080:** Resizable BAR is **Enabled** (16GB window).
- **RTX 3080:** Resizable BAR is **Disabled** (256MB window).
- **VBIOS Version:** `94.02.42.40.66` (Subsystem: ASUSTeK Computer Inc.)

Research confirms that while your VBIOS version *should* support Resizable BAR, it often remains disabled on 30-series cards until a specific "ReBAR-ready" firmware is flashed or the motherboard BIOS is correctly toggled.

---

## Phase 1: Motherboard BIOS (Try This First)
Before flashing the GPU firmware, ensure your **ASRock X570 Taichi** is correctly configured.
1.  **Boot to BIOS (F2/Del).**
2.  **Advanced > PCI Subsystem Settings:**
    - **Above 4G Decoding:** Enabled.
    - **Re-size BAR Support:** Enabled.
3.  **Boot > CSM (Compatibility Support Module):**
    - **CSM:** **Disabled**. (Resizable BAR *requires* UEFI mode and will not work if CSM is enabled).
4.  **Save and Exit (F10).**

If `nvidia-smi -q | grep -i bar` still shows `256 MiB` after this, proceed to Phase 2.

---

## Phase 2: VBIOS Update via Linux
Since ASUS only provides a Windows `.exe` updater, you must extract the ROM and use the Linux version of `nvflash`.

### 1. Download Tools
- **nvflash (Linux):** [TechPowerUp Download](https://www.techpowerup.com/download/nvidia-nvflash/)
- **ASUS VBIOS Tool:** Go to the [ASUS Support Site](https://www.asus.com/support/Download-Center/), search for your specific RTX 3080 model (TUF/Strix), and download the **Resizable BAR Firmware Update Tool**.

### 2. Extract the ROM
```bash
# Install 7zip if needed
sudo apt install p7zip-full

# Extract the ASUS tool
7z x RTX3080_V5.exe -oasus_vbios
```
Look inside the `asus_vbios` folder for a file ending in `.rom`.

### 3. Flash the VBIOS (CRITICAL)
**Warning:** Flashing VBIOS carries a risk of bricking the card. Ensure you have a stable power supply.
```bash
# 1. Stop your display manager (e.g., gdm, sddm)
sudo systemctl stop gdm 

# 2. Unload NVIDIA drivers
sudo modprobe -r nvidia_uvm nvidia_drm nvidia_modeset nvidia

# 3. BACKUP CURRENT VBIOS (Do not skip this!)
sudo ./nvflash --save backup_3080.rom

# 4. Flash the new ROM
sudo ./nvflash -6 your_extracted_file.rom
```
Type `YES` (case-sensitive) when prompted.

### 4. Verification
Reboot and run:
```bash
nvidia-smi -q | grep -i bar -A 3
```
You should see **BAR1 Memory Usage Total: 10240 MiB**.

---

## Summary of Benefits for Ollama
By enabling Resizable BAR on the RTX 3080, you remove the 256MB "choke point." During multi-GPU inference, the RTX 5080 will be able to move data into the RTX 3080's memory pool at full PCIe Gen 4 speeds, significantly reducing token latency in large models.
