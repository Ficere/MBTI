#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复类型文件的缩进问题

功能：
- 修复 src/constants/mbti/types/ 目录下所有文件的缩进
- 确保第一个属性 (name) 有正确的缩进

作者：AI Assistant
日期：2026-01-23
"""

import os
from pathlib import Path

# 16 种 MBTI 类型
TYPES = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
]

def fix_file_indentation(file_path):
    """修复单个文件的缩进"""
    print(f"  [*] 修复: {file_path.name}")

    # 读取文件内容
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 使用正则表达式替换：在 { 后面紧跟 \nname: 的情况下，添加缩进
    import re

    # 匹配模式：{ 后面跟换行符，然后是 name:（没有缩进）
    pattern = r'(\{\n)(name:)'
    replacement = r'\1  \2'

    new_content = re.sub(pattern, replacement, content)

    if new_content != content:
        # 写回文件
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"    [+] 已修复缩进")
        return True
    else:
        print(f"    [=] 缩进正确，无需修复")
        return False

def main():
    """主函数"""
    print("=" * 60)
    print("Fix Type Files Indentation")
    print("=" * 60)
    
    types_dir = Path('src/constants/mbti/types')
    
    if not types_dir.exists():
        print(f"[-] 错误: 目录不存在 {types_dir}")
        return 1
    
    print(f"\n[*] 开始修复 {len(TYPES)} 个类型文件的缩进...\n")
    
    fixed_count = 0
    
    for type_name in TYPES:
        file_path = types_dir / f'{type_name}.js'
        
        if not file_path.exists():
            print(f"  [-] 警告: 文件不存在 {file_path}")
            continue
        
        if fix_file_indentation(file_path):
            fixed_count += 1
    
    print("\n" + "=" * 60)
    print(f"[+] 完成！已处理 {fixed_count}/{len(TYPES)} 个文件")
    print("=" * 60)
    
    return 0

if __name__ == '__main__':
    exit(main())

