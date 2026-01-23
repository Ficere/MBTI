import re
import os

# ⚠️ 历史脚本：此脚本用于从旧的 mbti.js 文件中提取类型定义
# 已完成使命，旧文件已删除，此脚本仅作为参考保留

# 读取原文件（已不存在）
# with open('src/constants/mbti.js', 'r', encoding='utf-8') as f:
#     content = f.read()

# 提取 TYPE_DESCRIPTIONS 部分
match = re.search(r'export const TYPE_DESCRIPTIONS = \{(.*)\}$', content, re.DOTALL)
if not match:
    print("Cannot find TYPE_DESCRIPTIONS")
    exit(1)

type_descriptions_content = match.group(1)

# 16种类型
types = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 
         'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP']

# 创建目录
os.makedirs('src/constants/mbti/types', exist_ok=True)

# 提取每个类型
for i, type_name in enumerate(types):
    # 查找类型定义的开始
    pattern = rf'{type_name}:\s*\{{'
    start_match = re.search(pattern, type_descriptions_content)
    
    if not start_match:
        print(f"Cannot find {type_name}")
        continue
    
    start_pos = start_match.start()
    
    # 查找下一个类型或结束
    if i < len(types) - 1:
        next_type = types[i + 1]
        next_pattern = rf'\n  {next_type}:'
        end_match = re.search(next_pattern, type_descriptions_content[start_pos:])
        if end_match:
            end_pos = start_pos + end_match.start()
        else:
            end_pos = len(type_descriptions_content)
    else:
        end_pos = len(type_descriptions_content)
    
    # 提取类型内容
    type_content = type_descriptions_content[start_pos:end_pos]
    
    # 移除类型名称和最后的逗号/大括号
    type_content = re.sub(rf'^{type_name}:\s*\{{', '', type_content)
    type_content = re.sub(r'\n  \},?\s*$', '', type_content)
    
    # 生成文件内容
    file_content = f'export const {type_name} = {{\n{type_content}\n}}\n'
    
    # 写入文件
    file_path = f'src/constants/mbti/types/{type_name}.js'
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(file_content)
    
    print(f"Created {type_name}.js")

print("\nAll type files created!")

