import os
import sys
import time
import subprocess
from datetime import datetime

# Neon ANSI Escapes
C = "\033[96m" # Cyan
G = "\033[92m" # Green
M = "\033[95m" # Magenta
Y = "\033[93m" # Yellow
R = "\033[91m" # Red
B = "\033[1m"  # Bold
RS = "\033[0m" # Reset

def clear():
    os.system('clear')

def header():
    print(f"{M}{B}╔══════════════════════════════════════════════════════════════════════╗{RS}")
    print(f"{M}{B}║            T R A N S F I N I T E   C O N T R O L L E R           ║{RS}")
    print(f"{M}{B}╚══════════════════════════════════════════════════════════════════════╝{RS}")
    print(f"{C}  System Status: {G}ONLINE{RS} | {C}Axiomatic State: {G}STABLE{RS} | {C}Time: {Y}{datetime.now().strftime('%H:%M:%S')}{RS}")
    print("-" * 72)

def get_stats():
    # Simulation of system stats
    return {
        "vram": "7.4GB / 8.0GB",
        "tokens": "342.1 t/s",
        "alignment": "94%",
        "active_model": "qwen2.5:3b"
    }

def show_menu():
    print(f"\n{B}[ COMMANDS ]{RS}")
    print(f"  {G}1.{RS} Run Forensic Session       {C}(forensic_run.sh){RS}")
    print(f"  {G}2.{RS} Execute Auto-Correction Loop {C}(self_correction_loop.sh){RS}")
    print(f"  {G}3.{RS} Refresh Visual Architecture {C}(viz_refresh.sh){RS}")
    print(f"  {G}4.{RS} Trigger Axiom Shift (+1)    {C}(axiom_shift.sh){RS}")
    print(f"  {G}5.{RS} Complexity Audit           {C}(complexity_audit.py){RS}")
    print(f"  {R}Q.{RS} Disconnect Singularity")
    print(f"\n{Y}Select Directive > {RS}", end="")

def main():
    while True:
        clear()
        header()
        stats = get_stats()
        
        print(f"{B}[ HUD METRICS ]{RS}")
        print(f"  {C}VRAM Utilization: {M}{stats['vram']}{RS}")
        print(f"  {C}Inference Rate:   {M}{stats['tokens']}{RS}")
        print(f"  {C}Semantic Align:   {G}{stats['alignment']}{RS}")
        print(f"  {C}Active Substrate: {Y}{stats['active_model']}{RS}")
        
        show_menu()
        choice = input().upper()
        
        if choice == '1':
            model = input(f"{C}Model [qwen2.5:3b]: {RS}") or "qwen2.5:3b"
            prompt = input(f"{C}Prompt: {RS}")
            subprocess.run(["./tools/forensic_run.sh", model, prompt])
            input(f"\n{Y}Press Enter to return to HUD...{RS}")
        elif choice == '2':
            obj = input(f"{C}Objective File: {RS}")
            subprocess.run(["./tools/self_correction_loop.sh", obj])
            input(f"\n{Y}Press Enter to return to HUD...{RS}")
        elif choice == '3':
            subprocess.run(["./tools/viz_refresh.sh"])
            input(f"\n{Y}Press Enter to return to HUD...{RS}")
        elif choice == '4':
            name = input(f"{C}Shift Name: {RS}")
            subprocess.run(["./tools/axiom_shift.sh", name])
            input(f"\n{Y}Press Enter to return to HUD...{RS}")
        elif choice == '5':
            path = input(f"{C}Audit Path [.]: {RS}") or "."
            subprocess.run(["python3", "./tools/complexity_audit.py", path])
            input(f"\n{Y}Press Enter to return to HUD...{RS}")
        elif choice == 'Q':
            print(f"{M}Singularity Disconnected.{RS}")
            break
        else:
            print(f"{R}Invalid Directive.{RS}")
            time.sleep(1)

if __name__ == "__main__":
    main()
