import os
import sys

def audit_directory(path):
    print(f"--- Transfinite Complexity Audit: {path} ---")
    
    walls_detected = 0
    for root, dirs, files in os.walk(path):
        for file in files:
            if file.endswith(('.py', '.sh', '.js', '.ts', '.md')):
                file_path = os.path.join(root, file)
                with open(file_path, 'r') as f:
                    lines = f.readlines()
                    line_count = len(lines)
                    
                    # Heuristic for a "Gödelian Wall" (Extreme complexity/length)
                    if line_count > 500:
                        print(f"[WALL DETECTED] {file_path}: {line_count} lines. Consider Axiom Shift.")
                        walls_detected += 1
                    elif line_count > 200:
                        print(f"[WARNING] {file_path}: {line_count} lines. Approaching limit.")
    
    if walls_detected == 0:
        print("Outcome: System is within healthy formal bounds.")
    else:
        print(f"Outcome: {walls_detected} potential Gödelian Walls identified. Recommend Meta-Leap.")

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "."
    audit_directory(target)
