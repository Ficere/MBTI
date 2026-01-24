#!/usr/bin/env python3
"""启动开发服务器前检查并关闭已有实例"""

import subprocess
import sys
import re
from pathlib import Path

def get_vite_processes():
    """获取所有正在运行的 Vite 进程"""
    try:
        # Windows: 使用 netstat 查找占用 5173-5200 端口的进程
        result = subprocess.run(
            ['netstat', '-ano'],
            capture_output=True,
            text=True,
            encoding='gbk'  # Windows 使用 GBK 编码
        )

        if result.returncode != 0:
            return []

        # 解析输出,查找 5173-5200 端口
        processes = {}
        lines = result.stdout.split('\n')

        for line in lines:
            # 匹配 TCP 连接行,例如: TCP    0.0.0.0:5173    0.0.0.0:0    LISTENING    12345
            match = re.search(r'TCP\s+[\d.:]+:(\d+)\s+.*?LISTENING\s+(\d+)', line)
            if match:
                port = int(match.group(1))
                pid = match.group(2)

                # 只关注 Vite 常用端口范围
                if 5173 <= port <= 5200:
                    if pid not in processes:
                        processes[pid] = {'pid': pid, 'ports': []}
                    processes[pid]['ports'].append(port)

        return list(processes.values())
    except Exception as e:
        print(f"Error detecting processes: {e}")
        return []

def kill_process(pid):
    """终止指定 PID 的进程"""
    try:
        subprocess.run(['taskkill', '/F', '/PID', pid], 
                      capture_output=True, 
                      check=True)
        return True
    except subprocess.CalledProcessError:
        return False

def main():
    print("=" * 70)
    print("Starting MBTI Development Server")
    print("=" * 70)
    print()

    # 检查是否有正在运行的 Vite 进程
    print("[*] Checking for existing Vite instances...")
    processes = get_vite_processes()

    if not processes:
        print("[+] No existing Vite instances found.")
        print()
    else:
        print(f"[!] Found {len(processes)} process(es) using Vite ports:")
        print()
        for i, proc in enumerate(processes, 1):
            ports_str = ', '.join(str(p) for p in proc['ports'])
            print(f"    {i}. PID: {proc['pid']}, Ports: {ports_str}")
        print()

        # 询问用户是否关闭
        while True:
            choice = input("Do you want to close them? (y/n/q): ").strip().lower()

            if choice == 'q':
                print("\n[*] Cancelled. Exiting...")
                sys.exit(0)
            elif choice == 'y':
                print("\n[*] Closing existing instances...")
                success_count = 0
                for proc in processes:
                    ports_str = ', '.join(str(p) for p in proc['ports'])
                    if kill_process(proc['pid']):
                        print(f"    [+] Closed PID {proc['pid']} (Ports: {ports_str})")
                        success_count += 1
                    else:
                        print(f"    [-] Failed to close PID {proc['pid']}")

                print(f"\n[+] Successfully closed {success_count}/{len(processes)} process(es).")
                print()
                break
            elif choice == 'n':
                print("\n[!] Warning: New instance may use a different port.")
                print()
                break
            else:
                print("Invalid choice. Please enter 'y', 'n', or 'q'.")

    # 启动新的开发服务器
    print("[*] Starting new Vite development server...")
    print("=" * 70)
    print()

    try:
        subprocess.run(['npm', 'run', 'dev'], check=True)
    except KeyboardInterrupt:
        print("\n\n[*] Development server stopped by user.")
    except subprocess.CalledProcessError as e:
        print(f"\n[!] Error starting development server: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()

