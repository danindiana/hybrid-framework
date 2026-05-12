#!/usr/bin/env python3
import pkg_resources
import sys

def get_packages():
    system_packages = []
    user_packages = []
    
    for dist in pkg_resources.working_set:
        try:
            location = dist.location
            if location.startswith('/usr/lib/python') or location.startswith('/usr/lib/pkgconfig'):
                # Likely system package (apt)
                system_packages.append((dist.project_name, dist.version))
            elif location.startswith('/usr/local/lib') or location.startswith('/home'):
                # Likely user package (pip install --global)
                user_packages.append((dist.project_name, dist.version))
            else:
                # Other (e.g. .local)
                user_packages.append((dist.project_name, dist.version, location))
        except Exception:
            pass

    print(f"Total Packages: {len(system_packages) + len(user_packages)}")
    print(f"System Packages (APT/OS-managed): {len(system_packages)}")
    print(f"User Packages (pip/Manually installed): {len(user_packages)}")
    
    if user_packages:
        print("\n=== User Packages (Candidates for Removal) ===")
        for name, version, *loc in sorted(user_packages):
            print(f"{name}=={version}")

if __name__ == "__main__":
    get_packages()