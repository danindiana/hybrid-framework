import os
import subprocess
import time

def get_gpu_data():
    query = "index,name,pstate,utilization.gpu,memory.used,power.draw,clocks.current.memory,clocks.current.graphics"
    cmd = f"nvidia-smi --query-gpu={query} --format=csv,noheader,nounits"
    output = subprocess.check_output(cmd.split()).decode('utf-8').strip().split('\n')
    return [line.split(', ') for line in output]

def color_pstate(pstate):
    if pstate in ['P8', 'P12']:
        return f"\033[92m{pstate}\033[0m"  # Green
    if pstate == 'P0' or pstate == 'P2':
        return f"\033[91m{pstate}\033[0m"  # Red
    return f"\033[93m{pstate}\033[0m"  # Yellow

def color_power(power, index):
    power = float(power)
    if index == '1': # 3080
        if power < 50: return f"\033[92m{power:>6}W\033[0m"
        if power > 100: return f"\033[91m{power:>6}W\033[0m"
    return f"{power:>6}W"

def clear():
    os.system('clear')

def main():
    try:
        while True:
            clear()
            data = get_gpu_data()
            print("\033[95m" + "="*70 + "\033[0m")
            print("\033[95m" + "  AMPERE/BLACKWELL HYBRID DASHBOARD".ljust(70) + "\033[0m")
            print("\033[95m" + "="*70 + "\033[0m")
            print(f"{'ID':<3} {'Name':<22} {'PState':<8} {'Util':<6} {'VRAM':<10} {'Power':<8} {'MemClk':<8}")
            print("-" * 70)
            
            for gpu in data:
                idx, name, pstate, util, vram, pwr, mclk, gclk = gpu
                # Shorten name
                short_name = name.replace("NVIDIA GeForce RTX ", "")
                
                p_colored = color_pstate(pstate)
                pwr_colored = color_power(pwr, idx)
                
                print(f"{idx:<3} {short_name:<22} {p_colored:<17} {util:>3}%   {vram:>5}MB   {pwr_colored:<17} {mclk:>5}MHz")
            
            print("-" * 70)
            print("\n\033[90mPress Ctrl+C to exit\033[0m")
            time.sleep(2)
    except KeyboardInterrupt:
        print("\nExiting Dashboard.")

if __name__ == "__main__":
    main()
