#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MBTI 类型定义迁移脚本

功能：
- 从 src/constants/mbti.js 中提取 TYPE_DESCRIPTIONS 对象
- 为每个 MBTI 类型生成独立的 .js 文件
- 保存到 src/constants/mbti/types/ 目录

作者：AI Assistant
日期：2026-01-23
"""

import re
import os
from pathlib import Path

# 16 种 MBTI 类型
TYPES = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
]

def read_mbti_file():
    """读取 mbti.js 文件"""
    file_path = 'src/constants/mbti.js'
    print(f"[*] 读取文件: {file_path}")

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    print(f"[+] 文件读取成功 ({len(content)} 字符)")
    return content

def extract_type_descriptions(content):
    """提取 TYPE_DESCRIPTIONS 对象内容"""
    print("\n[*] 提取 TYPE_DESCRIPTIONS 对象...")

    # 匹配 TYPE_DESCRIPTIONS = { ... }
    pattern = r'export const TYPE_DESCRIPTIONS = \{(.*?)\n\}'
    match = re.search(pattern, content, re.DOTALL)

    if not match:
        raise ValueError("[-] 无法找到 TYPE_DESCRIPTIONS 对象")

    type_descriptions_content = match.group(1)
    print(f"[+] 提取成功 ({len(type_descriptions_content)} 字符)")

    return type_descriptions_content

def extract_single_type(type_descriptions_content, type_name):
    """提取单个类型的定义"""
    print(f"  [*] 提取 {type_name}...")
    
    # 查找类型定义的开始位置
    # 匹配: INTJ: {
    start_pattern = rf'\n  {type_name}: \{{'
    start_match = re.search(start_pattern, type_descriptions_content)
    
    if not start_match:
        raise ValueError(f"[-] 无法找到 {type_name} 的定义")

    start_pos = start_match.end()

    # 从开始位置查找匹配的闭合大括号
    # 需要正确处理嵌套的大括号
    brace_count = 1
    pos = start_pos

    while pos < len(type_descriptions_content) and brace_count > 0:
        char = type_descriptions_content[pos]
        if char == '{':
            brace_count += 1
        elif char == '}':
            brace_count -= 1
        pos += 1

    if brace_count != 0:
        raise ValueError(f"[-] {type_name} 的大括号不匹配")

    # 提取类型内容（不包括最后的闭合大括号）
    type_content = type_descriptions_content[start_pos:pos-1]

    # 移除开头和结尾的空白行
    type_content = type_content.strip()

    print(f"    [+] 提取成功 ({len(type_content)} 字符)")
    
    return type_content

def generate_type_file(type_name, type_content):
    """生成类型文件内容"""
    # 确保第一行有正确的缩进
    # 原始内容的第一行可能缺少缩进，需要添加
    lines = type_content.split('\n')
    if lines and not lines[0].startswith('  '):
        lines[0] = '  ' + lines[0]
    type_content = '\n'.join(lines)

    # 生成文件内容
    file_content = f"export const {type_name} = {{\n{type_content}\n}}\n"

    return file_content

def save_type_file(type_name, file_content):
    """保存类型文件"""
    # 创建目录
    output_dir = Path('src/constants/mbti/types')
    output_dir.mkdir(parents=True, exist_ok=True)

    # 保存文件
    file_path = output_dir / f'{type_name}.js'

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(file_content)

    print(f"    [+] 保存到: {file_path}")
    
    return file_path

def main():
    """主函数"""
    print("=" * 60)
    print("MBTI Type Definitions Migration Script")
    print("=" * 60)

    try:
        # 1. 读取文件
        content = read_mbti_file()

        # 2. 提取 TYPE_DESCRIPTIONS
        type_descriptions_content = extract_type_descriptions(content)

        # 3. 提取并保存每个类型
        print(f"\n[*] 开始提取 {len(TYPES)} 个类型定义...\n")

        for type_name in TYPES:
            # 提取类型内容
            type_content = extract_single_type(type_descriptions_content, type_name)

            # 生成文件内容
            file_content = generate_type_file(type_name, type_content)

            # 保存文件
            save_type_file(type_name, file_content)

        print("\n" + "=" * 60)
        print("[+] 所有类型文件生成成功！")
        print("=" * 60)
        print(f"\n[*] 输出目录: src/constants/mbti/types/")
        print(f"[*] 生成文件数: {len(TYPES)}")
        print("\n[!] 下一步:")
        print("   1. 检查生成的文件格式是否正确")
        print("   2. 验证每个文件只包含一个 export const 语句")
        print("   3. 确认没有多余的函数定义")

    except Exception as e:
        print(f"\n[-] 错误: {e}")
        import traceback
        traceback.print_exc()
        return 1

    return 0

if __name__ == '__main__':
    exit(main())

