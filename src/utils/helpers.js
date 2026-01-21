/**
 * 格式化日期时间
 * @param {Number} timestamp - 时间戳
 * @returns {String} 格式化后的日期时间字符串
 */
export function formatDateTime(timestamp) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

/**
 * 生成唯一 ID
 * @returns {String} 唯一 ID
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 检查数据是否过期
 * @param {Number} timestamp - 时间戳
 * @param {Number} expiryDays - 过期天数
 * @returns {Boolean} 是否过期
 */
export function isExpired(timestamp, expiryDays = 7) {
  const expiryTime = expiryDays * 24 * 60 * 60 * 1000
  return Date.now() - timestamp > expiryTime
}

/**
 * 深拷贝对象
 * @param {*} obj - 要拷贝的对象
 * @returns {*} 拷贝后的对象
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  
  const clonedObj = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key])
    }
  }
  return clonedObj
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {Number} wait - 等待时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait = 300) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {Number} limit - 时间限制（毫秒）
 * @returns {Function} 节流后的函数
 */
export function throttle(func, limit = 300) {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * 计算百分比
 * @param {Number} value - 数值
 * @param {Number} total - 总数
 * @param {Number} decimals - 小数位数
 * @returns {Number} 百分比
 */
export function calculatePercentage(value, total, decimals = 0) {
  if (total === 0) return 0
  const percentage = (value / total) * 100
  return decimals > 0 ? parseFloat(percentage.toFixed(decimals)) : Math.round(percentage)
}

/**
 * 安全的 JSON 解析
 * @param {String} jsonString - JSON 字符串
 * @param {*} defaultValue - 默认值
 * @returns {*} 解析后的对象或默认值
 */
export function safeJSONParse(jsonString, defaultValue = null) {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    console.error('JSON 解析失败:', error)
    return defaultValue
  }
}

/**
 * 安全的 JSON 字符串化
 * @param {*} obj - 要字符串化的对象
 * @param {String} defaultValue - 默认值
 * @returns {String} JSON 字符串或默认值
 */
export function safeJSONStringify(obj, defaultValue = '{}') {
  try {
    return JSON.stringify(obj)
  } catch (error) {
    console.error('JSON 字符串化失败:', error)
    return defaultValue
  }
}

/**
 * 延迟执行
 * @param {Number} ms - 延迟时间（毫秒）
 * @returns {Promise} Promise 对象
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 数组去重
 * @param {Array} arr - 数组
 * @param {String} key - 对象数组的唯一键
 * @returns {Array} 去重后的数组
 */
export function uniqueArray(arr, key = null) {
  if (!key) {
    return [...new Set(arr)]
  }
  const seen = new Set()
  return arr.filter(item => {
    const k = item[key]
    if (seen.has(k)) {
      return false
    }
    seen.add(k)
    return true
  })
}

