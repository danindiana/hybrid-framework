#!/usr/bin/env python3
import os
import sys
import subprocess
import shutil
import socket
from pathlib import Path

# ANSI colors for premium terminal aesthetics
BLUE = "\033[1;34m"
GREEN = "\033[1;32m"
YELLOW = "\033[1;33m"
RED = "\033[1;31m"
MAGENTA = "\033[1;35m"
CYAN = "\033[1;36m"
BOLD = "\033[1m"
RESET = "\033[0m"

def print_header(title):
    print(f"\n{MAGENTA}================================================================================{RESET}")
    print(f"{BOLD}{CYAN}🚀 {title}{RESET}")
    print(f"{MAGENTA}================================================================================{RESET}")

def print_step(num, desc):
    print(f"\n{BOLD}{BLUE}Step {num}: {desc}{RESET}")

def ask_yes_no(question, default=True):
    suffix = " [Y/n]" if default else " [y/N]"
    val = input(f"{BOLD}{question}{RESET}{suffix}: ").strip().lower()
    if not val:
        return default
    return val.startswith('y')

def get_free_port(default_port=7686):
    port = default_port
    while True:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("0.0.0.0", port))
                return port
            except OSError:
                print(f"{YELLOW}⚠️  Port {port} is occupied.{RESET}")
                port += 1

def check_port_free(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(("0.0.0.0", port))
            return True
        except OSError:
            return False

def main():
    print_header("GRAPHIFY ONBOARDING WIZARD")
    print(f"{BOLD}Welcome to the Graphify Onboarding Guide!{RESET}")
    print("This wizard will help you index your codebase and spin up a local graph visualizer.")

    # Step 1: Environment Precheck
    print_step(1, "Environment Pre-flight Check")
    venv_path = Path("/home/jeb/programs/gemini_cli_workspace/session_20260607_163152/graphify/.venv")
    python_exe = venv_path / "bin" / "python"
    graphify_exe = venv_path / "bin" / "graphify"

    if not venv_path.exists() or not python_exe.exists() or not graphify_exe.exists():
        print(f"{RED}❌ Virtual environment or graphify executable not found!{RESET}")
        print("Please ensure Graphify is set up in `session_20260607_163152/graphify/`.")
        sys.exit(1)
    
    print(f"{GREEN}✓ Python virtual environment: Found ({python_exe}){RESET}")
    print(f"{GREEN}✓ Graphify CLI executable: Found ({graphify_exe}){RESET}")

    # Step 2: Select Target Directory
    print_step(2, "Select Target Codebase Directory")
    print("What directory do you want to scan and index into a knowledge graph?")
    default_dir = "/home/jeb/programs/gemini_cli_workspace"
    target_input = input(f"Target path [{default_dir}]: ").strip()
    target_path = Path(target_input if target_input else default_dir).resolve()

    if not target_path.exists():
        print(f"{RED}❌ Path '{target_path}' does not exist!{RESET}")
        sys.exit(1)
    print(f"{GREEN}✓ Target path verified: {target_path}{RESET}")

    # Step 3: Setup Ignores & Exclusions
    print_step(3, "Exclusions and Performance Settings")
    
    ignore_file = target_path / ".graphifyignore"
    has_ignore = ignore_file.exists()
    
    print("To make the extraction fast, free, and avoid common crashes:")
    print("1. We will configure a code-only AST extraction (ignoring images, PDFs, docs) so no LLM API keys are needed.")
    print("2. We will ignore massive subfolders (like `ai-agent-architectures/`) to prevent stack overflow segfaults.")

    setup_ignore = True
    if has_ignore:
        setup_ignore = ask_yes_no(f"An existing .graphifyignore was found. Do you want to overwrite it with optimized settings?", default=True)

    if setup_ignore:
        ignore_rules = """# Code-only extraction ignore list
*.[sS][vV][gG]
*.[pP][nN][gG]
*.[jJ][pP][gG]
*.[jJ][pP][eE][gG]
*.[gG][iI][fF]
*.[wW][eE][bB][pP]
*.[pP][dD][fF]
*.[mM][dD]
*.[mM][dD][xX]
*.[qQ][mM][dD]
*.[tT][xX][tT]
*.[rR][sS][tT]
*.[hH][tT][mM][lL]
*.[yY][aA][mM][lL]
*.[yY][mM][lL]
*.[dD][oO][cC][xX]
*.[xX][lL][sS][xX]
*.[mM][pP]4
*.[mM][oO][vV]
*.[wW][eE][bB][mM]
*.[mM][kK][vV]
*.[aA][vV][iI]
*.[mM]4[vV]
*.[mM][pP]3
*.[wW][aA][vV]
*.[mM]4[aA]
*.[oO][gG][gG]
*.[zZ][iI][pP]
*.[tT][aA][rR]
*.[gG][zZ]
*.[lL][oO][gG]
*.[bB][aA][kK]

# Massive subfolders (to prevent python segfaults)
ai-agent-architectures/
session_*
2026-06-06_1332_CDT/
hermes-agent-commissioning-20260401_175500/
net-watchdog-forensics-20260327/
archive/
logs/
.clamav/
venv/
templates/
reports/
expansions/
diagrams/
cad_export/
"""
        ignore_file.write_text(ignore_rules, encoding="utf-8")
        print(f"{GREEN}✓ Created/Updated {ignore_file}{RESET}")

    # Step 4: Extract Code Graph
    print_step(4, "Extracting Code Graph (AST)")
    print("We will now run the extraction. This resolves code structures recursively.")
    
    cmd_extract = [str(graphify_exe), "extract", str(target_path), "--max-workers", "4"]
    print(f"{YELLOW}Running: {' '.join(cmd_extract)}{RESET}")
    
    try:
        subprocess.run(cmd_extract, check=True)
        print(f"{GREEN}✓ AST extraction finished successfully!{RESET}")
    except subprocess.CalledProcessError as e:
        print(f"{RED}❌ Extraction failed! Exit code: {e.returncode}{RESET}")
        sys.exit(1)

    # Step 5: Clustering & HTML Generation
    print_step(5, "Clustering Communities & HTML Graph Generation")
    print("Now building communities and rendering graph.html...")
    
    cmd_cluster = [str(graphify_exe), "cluster-only", str(target_path)]
    print(f"{YELLOW}Running: {' '.join(cmd_cluster)}{RESET}")
    
    try:
        subprocess.run(cmd_cluster, check=True)
        print(f"{GREEN}✓ HTML visualization & community mapping finished!{RESET}")
    except subprocess.CalledProcessError as e:
        print(f"{RED}❌ Clustering failed! Exit code: {e.returncode}{RESET}")
        sys.exit(1)

    # Step 6: Start Web Server
    print_step(6, "Host the Interactive Node Graph")
    host_server = ask_yes_no("Do you want to host the interactive visualization on your LAN?", default=True)

    if host_server:
        port_input = input("Enter port to host on [7686]: ").strip()
        port = int(port_input) if port_input else 7686
        
        if not check_port_free(port):
            free_port = get_free_port(port)
            print(f"{YELLOW}⚠️  Port {port} is occupied. Using next free port: {free_port}{RESET}")
            port = free_port
        
        # Kill any existing server running on this port using fuser/kill
        subprocess.run(f"fuser -k {port}/tcp", shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        # Start the Python web server in the background
        serve_dir = target_path / "graphify-out"
        print(f"{YELLOW}Starting HTTP server on port {port} serving {serve_dir}...{RESET}")
        
        # Start server process
        server_process = subprocess.Popen(
            [sys.executable, "-m", "http.server", str(port), "--directory", str(serve_dir)],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        
        print(f"\n{GREEN}🎉 HOSTING SUCCESSFUL!{RESET}")
        print(f"{BOLD}Access your codebase interactive graph at:{RESET}")
        print(f"👉 {CYAN}http://worlock:{port}/graph.html{RESET}\n")
    else:
        print("Skipped web server hosting. You can open the file manually at:")
        print(f"👉 file://{target_path}/graphify-out/graph.html\n")

    print_header("ONBOARDING WIZARD COMPLETED!")
    print(f"{BOLD}Created Files under {target_path}/graphify-out/:{RESET}")
    print(f"  • {BOLD}graph.html{RESET}         <- The interactive D3 map (open in browser)")
    print(f"  • {BOLD}GRAPH_REPORT.md{RESET}    <- High-level summaries & key code architecture")
    print(f"  • {BOLD}graph.json{RESET}         <- The raw schema graph representation")
    print("Enjoy exploring your codebase architecture!")

if __name__ == "__main__":
    main()
