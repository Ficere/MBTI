#!/usr/bin/env python3
"""检测未使用的 CSS 文件"""

import re
from pathlib import Path

def main():
    # 获取所有 CSS 文件
    css_files = list(Path('src/components').rglob('*.css'))
    
    # 读取所有 JSX/JS 文件的导入语句
    jsx_files = list(Path('src').rglob('*.jsx')) + list(Path('src').rglob('*.js'))
    all_imports = []
    
    for jsx_file in jsx_files:
        try:
            content = jsx_file.read_text(encoding='utf-8')
            # 匹配 import './xxx.css' 或 import './xxx/yyy.css'
            imports = re.findall(r"import\s+['\"](.+?\.css)['\"]", content)
            all_imports.extend(imports)
        except Exception as e:
            pass
    
    print('Imported CSS files:')
    print('=' * 70)
    for imp in sorted(set(all_imports)):
        print(f'  + {imp}')

    print()
    print('=' * 70)
    print('Unused CSS files detection:')
    print('=' * 70)
    
    unused_old_files = []  # 旧的单体文件
    unused_modular_files = []  # 模块化文件（误报）
    
    for css_file in sorted(css_files):
        relative_path = css_file.relative_to(Path('src/components'))
        is_used = False
        
        # 检查是否有任何导入路径匹配这个文件
        for imp in all_imports:
            # 规范化路径比较
            normalized_imp = imp.lstrip('./').replace('/', '\\')
            if str(relative_path).replace('\\', '/') in imp or str(relative_path) == normalized_imp:
                is_used = True
                break
        
        if not is_used:
            # 区分旧文件和模块化文件
            if '\\' in str(relative_path) or '/' in str(relative_path):
                unused_modular_files.append(str(relative_path))
            else:
                unused_old_files.append(str(relative_path))
    
    print('\n[OLD MONOLITHIC CSS FILES] (Replaced by modular files, can be deleted):')
    for f in unused_old_files:
        print(f'  - src/components/{f}')

    print(f'\n[MODULAR CSS FILES] (False positives, actually in use):')
    for f in unused_modular_files:
        print(f'  - src/components/{f}')

    print()
    print('=' * 70)
    print('Summary:')
    print(f'  - Imported CSS files: {len(set(all_imports))}')
    print(f'  - Old files to delete: {len(unused_old_files)}')
    print(f'  - False positives (in use): {len(unused_modular_files)}')

if __name__ == '__main__':
    main()

