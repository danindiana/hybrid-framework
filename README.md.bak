<p align="center">
  <img src="./diagrams/logo_graphic.png" width="550" alt="Secure Axis Logo">
</p>

# Human-AI Hybrid Development & Compilation Framework

Welcome to the **Human-AI Hybrid Loop** workspace on the `worlock` host. This repository houses specialized modules for automated security auditing, local model telemetry, network analytics, and a custom compilation pipeline designed to securely build, deploy, and maintain core system software from upstream sources.

---

## 1. Core Philosophies & Loop Integration

This workspace operates on a transfinite synergy loop:
- **The Human ($+1$):** Directs high-level objectives, provides heuristic pruning based on semantic context, and handles anomaly triage outside formal bounds.
- **The AI ($\omega$):** Handles exhaustive source code checks, validation logic, system-level dependency tracing, and regression testing.

---

## 2. Upstream Compilation Hub

To resolve dependencies, obtain CVE security patches, and enable modern protocols (like TLS 1.3 or HTTP/3), this workspace compiles core libraries from source with strict **Rpath Isolation**. By avoiding global cache modification (`ld.so.conf.d`), we prevent version mismatches from breaking system packages.

### Component Layout
1. **OpenSSL 3.5.6 (LTS):** Installed to `/usr/local/ssl` with `rpath` baked in to point to `/usr/local/ssl/lib64`.
2. **zlib-ng 2.3.3:** Installed to `/usr/local/zlib-ng` in `zlib-compat` mode to provide standard compression symbols.
3. **cURL 8.20.0:** Installed to `/usr/local/curl` and linked dynamically to the custom OpenSSL and zlib-ng.
4. **OpenSSH 10.3p1:** Installed to `/usr/local/ssh`, compiled `--with-pam`, overriding `/usr/sbin/sshd` via systemd drop-ins.
5. **Nginx 1.30.2:** Installed to `/usr/local/sbin/nginx`, resolving custom dynamic headers, and overriding the default Ubuntu service via systemd overrides.

---

## 3. Visual Mechanics & Architecture Matrices

### 3.1. Systems & Operations Matrix (5x5)

Detailed operations, lessons, workflows, and pipelines of our compilation architecture are mapped below:

| Pillar | S.1 | S.2 | S.3 | S.4 | S.5 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Architecture** | ![OpenSSL Rpath](./diagrams/compilations/arch_openssl_rpath.svg) | ![zlib-ng Compat](./diagrams/compilations/arch_zlibng_compat.svg) | ![cURL Linkage](./diagrams/compilations/arch_curl_linkage.svg) | ![OpenSSH PAM](./diagrams/compilations/arch_openssh_pam.svg) | ![Nginx Static](./diagrams/compilations/arch_nginx_static.svg) |
| **Lessons** | ![Version Mismatch](./diagrams/compilations/lesson_version_mismatch.svg) | ![Rpath Isolation](./diagrams/compilations/lesson_rpath_isolation.svg) | ![Umask Perms](./diagrams/compilations/lesson_umask_permissions.svg) | ![PAM Dep](./diagrams/compilations/lesson_pam_dependency.svg) | ![Dyn Modules](./diagrams/compilations/lesson_dynamic_modules.svg) |
| **Future** | ![QUIC HTTP3](./diagrams/compilations/future_quic_http3.svg) | ![Auditing](./diagrams/compilations/future_automated_auditing.svg) | ![Python SSL](./diagrams/compilations/future_python_openssl_migration.svg) | ![Log Aggregation](./diagrams/compilations/future_log_aggregation.svg) | ![Static Compile](./diagrams/compilations/future_static_compilation.svg) |
| **Workflows** | ![Lifecycle](./diagrams/compilations/workflow_compilation_lifecycle.svg) | ![Dependencies](./diagrams/compilations/workflow_dependency_check.svg) | ![Deconfliction](./diagrams/compilations/workflow_deconfliction.svg) | ![Verification](./diagrams/compilations/workflow_verification_pipeline.svg) | ![Override](./diagrams/compilations/workflow_service_override.svg) |
| **Pipelines** | ![OpenSSL Test](./diagrams/compilations/pipeline_openssl_test.svg) | ![Nginx Val](./diagrams/compilations/pipeline_nginx_config_validation.svg) | ![SSH PAM](./diagrams/compilations/pipeline_ssh_pam_auth.svg) | ![cURL Flow](./diagrams/compilations/pipeline_curl_request_flow.svg) | ![Version Check](./diagrams/compilations/pipeline_version_check.svg) |

---

## 4. Maintenance & Diagnostic Tools

### 4.1. Upstream Version Auditor
To verify your running software against the latest remote releases, execute:
```bash
./session_20260529_123444/check_upstream_versions.sh
```
This script queries GitHub APIs and official releases to output a status report:
- `[OK] OpenSSL is up to date.`
- `[OK] cURL is up to date.`
- `[OK] OpenSSH is up to date.`
- `[OK] Nginx is up to date.`

### 4.2. Diagnostic Guides
Refer to our custom session folders for detailed steps:
- [Session Summary](file:///home/jeb/programs/gemini_cli_workspace/session_20260529_123444/session_summary.md): Step-by-step compilation walkthrough.
- [Maintenance & Troubleshooting Guide](file:///home/jeb/programs/gemini_cli_workspace/session_20260529_123444/maintenance_guide.md): Tips on overriding dynamic modules, editing systemd files, and using custom library paths in Python via `LD_LIBRARY_PATH`.
