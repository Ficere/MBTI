// MBTI 常量统一导出
export { DIMENSIONS } from './dimensions'

// 所有 16 种 MBTI 类型
export const ALL_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
]

// 常见/热门类型（用于优先预加载）
const POPULAR_TYPES = ['INTJ', 'INFP', 'ENFP', 'INTP', 'INFJ', 'ENTJ']

// 类型描述缓存
const typeCache = {}

// 预加载状态
let preloadPromise = null

/**
 * 获取类型描述（异步按需加载）
 * @param {String} type - MBTI 类型代码
 * @returns {Promise<Object>} 类型描述对象
 */
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

/**
 * 预加载热门类型描述（在后台静默加载）
 * 可在 Welcome 页面调用，提升后续体验
 */
export function preloadPopularTypes() {
  if (preloadPromise) return preloadPromise

  preloadPromise = Promise.all(
    POPULAR_TYPES.map(type => getTypeDescription(type).catch(() => null))
  )

  return preloadPromise
}

/**
 * 预加载所有类型描述
 */
export function preloadAllTypes() {
  return Promise.all(
    ALL_TYPES.map(type => getTypeDescription(type).catch(() => null))
  )
}

/**
 * 获取所有类型描述（用于类型浏览器）
 * @returns {Promise<Object>} 所有类型的描述对象
 */
export async function getAllTypeDescriptions() {
  const descriptions = {}
  await Promise.all(
    ALL_TYPES.map(async (type) => {
      descriptions[type] = await getTypeDescription(type)
    })
  )

  return descriptions
}

/**
 * 检查类型是否已缓存
 * @param {String} type - MBTI 类型代码
 * @returns {Boolean} 是否已缓存
 */
export function isTypeCached(type) {
  return !!typeCache[type]
}

