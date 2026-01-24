#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复 ResultPage 和 TypeBrowserPage 之间的 CSS 类名冲突

功能：
- 将 ResultPage 组件中与 TypeBrowserPage 冲突的类名添加 result- 前缀
- 同时更新 JSX 和 CSS 文件

作者：AI Assistant
日期：2026-01-23
"""

from pathlib import Path
import re

# 需要重命名的类名映射（冲突的类名）
CLASS_RENAMES = {
    # TypeDetailTabs 相关
    'tab-buttons': 'result-tab-buttons',
    'tab-button': 'result-tab-button',
    'tab-content': 'result-tab-content',
    'tab-content-list': 'result-tab-content-list',
    'content-item': 'result-content-item',
    'item-icon': 'result-item-icon',
    'item-text': 'result-item-text',
    'type-detail-tabs': 'result-type-detail-tabs',
}

def replace_class_names(content, class_map):
    """替换类名，确保不会误替换"""
    for old_class, new_class in class_map.items():
        # 替换 className="old-class"
        content = re.sub(
            rf'className="([^"]*\b){old_class}(\b[^"]*)"',
            rf'className="\1{new_class}\2"',
            content
        )
        # 替换 className={`...${old-class}...`}
        content = re.sub(
            rf'(\$\{{[^}}]*\b){old_class}(\b[^}}]*\}})',
            rf'\1{new_class}\2',
            content
        )
        # 替换 CSS 选择器 .old-class
        content = re.sub(
            rf'\.{old_class}(\s|:|,|\{{)',
            rf'.{new_class}\1',
            content
        )
    return content

def main():
    print("=" * 60)
    print("修复 CSS 类名冲突")
    print("=" * 60)
    
    # 需要处理的文件
    files_to_process = [
        'src/components/ResultPage/TypeDetailTabs.jsx',
        'src/components/ResultPage/TypeDetailTabs.css',
    ]
    
    for file_path in files_to_process:
        path = Path(file_path)
        if not path.exists():
            print(f"[-] 文件不存在: {file_path}")
            continue
        
        print(f"\n[*] 处理文件: {file_path}")
        
        # 读取文件
        content = path.read_text(encoding='utf-8')
        original_content = content
        
        # 替换类名
        content = replace_class_names(content, CLASS_RENAMES)
        
        # 检查是否有变化
        if content != original_content:
            # 写回文件
            path.write_text(content, encoding='utf-8')
            print(f"    [+] 已更新")
            
            # 统计替换次数
            for old_class, new_class in CLASS_RENAMES.items():
                old_count = original_content.count(old_class)
                new_count = content.count(new_class)
                if new_count > 0:
                    print(f"        {old_class} -> {new_class} ({new_count} 处)")
        else:
            print(f"    [=] 无需更新")
    
    print("\n" + "=" * 60)
    print("[+] 完成！")
    print("=" * 60)

if __name__ == '__main__':
    main()

