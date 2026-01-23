#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""检查类型文件的缩进"""

from pathlib import Path

TYPES = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
]

types_dir = Path('src/constants/mbti/types')

print("Checking indentation...")
print("=" * 60)

needs_fix = []

for type_name in TYPES:
    file_path = types_dir / f'{type_name}.js'
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # 检查第二行
    if len(lines) >= 2:
        line2 = lines[1]
        if line2.startswith('name:'):
            print(f"{type_name}: NEEDS FIX (no indent)")
            needs_fix.append(type_name)
        elif line2.startswith('  name:'):
            print(f"{type_name}: OK")
        else:
            print(f"{type_name}: UNKNOWN - {line2[:30]}")

print("=" * 60)
print(f"Total: {len(TYPES)}, Needs fix: {len(needs_fix)}")
if needs_fix:
    print(f"Files to fix: {', '.join(needs_fix)}")

