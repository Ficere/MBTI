// MBTI 常量统一导出
export { DIMENSIONS } from './dimensions'

// 类型描述缓存
const typeCache = {}

// 辅助函数：根据类型代码获取描述（异步按需加载）
export async function getTypeDescription(type) {
  // 如果已缓存，直接返回
  if (typeCache[type]) {
    return typeCache[type]
  }

  // 动态导入类型描述
  const typeModule = await import(`./types/${type}.js`)
  const description = typeModule[type]

  // 缓存结果
  typeCache[type] = description

  return description
}

// 同步版本：用于需要立即获取所有类型的场景（如类型浏览器）
export async function getAllTypeDescriptions() {
  const types = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
  ]

  const descriptions = {}
  await Promise.all(
    types.map(async (type) => {
      descriptions[type] = await getTypeDescription(type)
    })
  )

  return descriptions
}

