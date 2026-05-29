# Maintenance & Troubleshooting Guide for Custom Compiled Services

This guide outlines operational procedures, troubleshooting steps, and safety warnings for the custom upstream binaries compiled on the `worlock` host.

---

## 1. Directory Structure Reference

- **OpenSSL 3.5.6 (LTS):** `/usr/local/ssl` (Libraries in `lib64`)
- **zlib-ng 2.3.3:** `/usr/local/zlib-ng` (Libraries in `lib`)
- **cURL 8.20.0:** `/usr/local/curl`
- **OpenSSH 10.3p1:** `/usr/local/ssh`
- **Nginx 1.30.2:** `/usr/local/sbin/nginx` (Config in `/etc/nginx`)

---

## 2. Dealing with System Package Upgrades (`apt-get`)

If system security updates are installed via `apt-get upgrade`, the package manager may modify service configurations.

### 2.1. Systemd Service Overrides
Our configuration uses **systemd drop-in overrides** in `/etc/systemd/system/` (rather than editing `/lib/systemd/system/` directly).
- If `apt` updates the base service file, the overrides at `/etc/systemd/system/ssh.service.d/override.conf` and `/etc/systemd/system/nginx.service.d/override.conf` will **remain active** and take priority.
- If a service reverts to the old version after an update, verify the override is still loaded:
  ```bash
  systemctl status nginx
  # Check for: Drop-In: /etc/systemd/system/nginx.service.d/override.conf
  ```

### 2.2. Nginx Dynamic Module Re-enabling
An Nginx package update might recreate the dynamic module configuration symlinks in `/etc/nginx/modules-enabled/`. If this happens, Nginx will fail to start/reload due to binary version mismatches.
- **Symptom:** `nginx: [emerg] module "..." version 1018000 instead of 1030002`
- **Fix:** Move the conflicting `.conf` files to the disabled folder again:
  ```bash
  sudo mv /etc/nginx/modules-enabled/*.conf /etc/nginx/modules-disabled/
  sudo systemctl restart nginx
  ```

---

## 3. Linking Third-Party Runtimes (e.g. Python, Go)

Since the new OpenSSL 3.5.6 is **not** registered in the global system libraries cache (to prevent breaking the system's package manager), default user binaries will load the standard OpenSSL 3.0.2.

### 3.1. Enforcing OpenSSL 3.5.6 for Python Scripts
To run a Python script or other program using the newer OpenSSL version, pass the `LD_LIBRARY_PATH` environment variable:
```bash
LD_LIBRARY_PATH=/usr/local/ssl/lib64 python3 your_script.py
```
- **Verify inside Python:**
  ```python
  import ssl
  print(ssl.OPENSSL_VERSION)
  # Outputs: OpenSSL 3.5.6 7 Apr 2026
  ```

### 3.2. Compiling Future Software Against Custom Libraries
When compiling other tools (such as Node.js, Go, or Python from source) that need the updated OpenSSL, use:
```bash
LDFLAGS="-Wl,-rpath,/usr/local/ssl/lib64" ./configure --with-openssl=/usr/local/ssl
```

---

## 4. Operational Health Checks

Run these commands to verify that all custom components are running with their correct libraries:

### 4.1. Version & Library Verification
```bash
# Check cURL and its linked libs:
curl --version
# Output should show: OpenSSL/3.5.6 zlib/1.3.1.zlib-ng

# Check SSH Client:
ssh -V
# Output should show: OpenSSH_10.3p1, OpenSSL 3.5.6

# Check Nginx Binary and compilation info:
nginx -V
# Output should show: nginx/1.30.2 and OpenSSL 3.5.6
```

### 4.2. Verify Dynamic Library Bindings (ldd)
To ensure the binaries are correctly resolving libraries via `rpath` rather than system-wide library folders:
```bash
ldd /usr/local/curl/bin/curl | grep -E "ssl|crypto|z"
# Should resolve to files under /usr/local/ssl/lib64 and /usr/local/zlib-ng/lib
```

---

## 5. Automated Upstream Version Auditing

A helper script has been created inside the session directory to automate checking for newer releases:
- **Script Path:** [check_upstream_versions.sh](file:///home/jeb/programs/gemini_cli_workspace/session_20260529_123444/check_upstream_versions.sh)
- **To Run:**
  ```bash
  /home/jeb/programs/gemini_cli_workspace/session_20260529_123444/check_upstream_versions.sh
  ```
The script will query GitHub and project portals, parse release versions, and output a comparison list alerting you if any custom-compiled software has a pending security/patch update upstream.

