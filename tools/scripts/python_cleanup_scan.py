#!/usr/bin/env python3
import os
import re
import subprocess
import sys
import argparse
import json

def find_python_executables(start_dir):
    """Finds all Python executables in a given directory."""
    print("Searching for Python executables...")
    python_executables = set()
    python_regex = re.compile(r"^python(3(\.\d{1,2})?)?$")
    for dirpath, dirnames, filenames in os.walk(start_dir):
        print(f"  Scanning: {dirpath}", end="\r")
        if ".git" in dirnames:
            dirnames.remove(".git")
        for filename in filenames:
            filepath = os.path.join(dirpath, filename)
            if python_regex.match(filename) and os.access(filepath, os.X_OK) and os.path.isfile(filepath):
                python_executables.add(filepath)
    print("\nDone.")
    return list(python_executables)

def get_user_installed_packages(python_executable):
    """Gets a list of user-installed packages for a given Python executable."""
    print(f"  Getting packages for: {python_executable}")
    try:
        result = subprocess.run(
            [python_executable, "-m", "pip", "list", "--user"],
            capture_output=True,
            text=True,
            check=True,
        )
        return result.stdout.strip().split("\n")[2:]
    except subprocess.CalledProcessError:
        return []

def find_broken_shebangs(start_dir):
    """Finds Python scripts with broken shebangs."""
    print("Searching for broken shebangs...")
    broken_shebangs = []
    for dirpath, dirnames, filenames in os.walk(start_dir):
        print(f"  Scanning: {dirpath}", end="\r")
        if ".git" in dirnames:
            dirnames.remove(".git")
        for filename in filenames:
            if filename.endswith(".py"):
                filepath = os.path.join(dirpath, filename)
                try:
                    with open(filepath, "r") as f:
                        first_line = f.readline().strip()
                    if first_line.startswith("#!/") and "python" in first_line:
                        interpreter = first_line[2:].strip()
                        if not os.path.exists(interpreter):
                            broken_shebangs.append(filepath)
                except Exception:
                    pass
    print("\nDone.")
    return broken_shebangs

def main():
    """Scans for Python environment issues and outputs to JSON."""
    parser = argparse.ArgumentParser(description="Scan for Python environment issues.")
    parser.add_argument("start_dir", help="The directory to start scanning from.")
    parser.add_argument("--output", help="The path to the output JSON file.")
    args = parser.parse_args()

    print(f"Scanning for Python environment issues in {args.start_dir}...")

    results = {
        "python_executables": find_python_executables(args.start_dir),
        "globally_installed_packages": {},
        "broken_shebangs": find_broken_shebangs(args.start_dir),
    }

    print("\n--- Processing globally installed packages ---")
    for executable in results["python_executables"]:
        packages = get_user_installed_packages(executable)
        if packages:
            results["globally_installed_packages"][executable] = packages

    if args.output:
        with open(args.output, "w") as f:
            json.dump(results, f, indent=4)
        print(f"\nScan complete. Results saved to {args.output}")
    else:
        print(json.dumps(results, indent=4))

if __name__ == "__main__":
    main()
