import Taro from '@tarojs/taro'

// localStorage 键名
const PROGRESS_KEY = 'mbti_progress'
const HISTORY_KEY = 'mbti_history'

// 生成唯一 ID
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// 格式化日期时间
const formatDateTime = (timestamp) => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// ========== 进度管理 ==========

// 保存答题进度
export const saveProgress = (answers, currentQuestion) => {
  try {
    const progress = {
      answers,
      currentQuestion,
      timestamp: Date.now()
    }
    Taro.setStorageSync(PROGRESS_KEY, progress)
    return true
  } catch (error) {
    console.error('保存进度失败:', error)
    return false
  }
}

// 加载答题进度
export const loadProgress = () => {
  try {
    const progress = Taro.getStorageSync(PROGRESS_KEY)
    if (!progress) return null
    
    // 检查进度是否过期（超过7天）
    const sevenDays = 7 * 24 * 60 * 60 * 1000
    if (Date.now() - progress.timestamp > sevenDays) {
      clearProgress()
      return null
    }
    
    return progress
  } catch (error) {
    console.error('加载进度失败:', error)
    return null
  }
}

// 清除答题进度
export const clearProgress = () => {
  try {
    Taro.removeStorageSync(PROGRESS_KEY)
    return true
  } catch (error) {
    console.error('清除进度失败:', error)
    return false
  }
}

// ========== 历史记录管理 ==========

// 保存测试结果到历史
export const saveTestResult = (mbtiType, answers, scores) => {
  try {
    const history = getTestHistory()
    
    const newRecord = {
      id: generateId(),
      date: formatDateTime(Date.now()),
      timestamp: Date.now(),
      mbtiType,
      answers,
      scores
    }
    
    history.unshift(newRecord) // 添加到开头
    
    // 最多保存 50 条记录
    if (history.length > 50) {
      history.splice(50)
    }
    
    Taro.setStorageSync(HISTORY_KEY, history)
    
    // 测试完成后清除进度
    clearProgress()
    
    return newRecord
  } catch (error) {
    console.error('保存测试结果失败:', error)
    return null
  }
}

// 获取所有历史记录
export const getTestHistory = () => {
  try {
    const history = Taro.getStorageSync(HISTORY_KEY)
    return history || []
  } catch (error) {
    console.error('获取历史记录失败:', error)
    return []
  }
}

// 删除某条历史记录
export const deleteTestHistory = (id) => {
  try {
    const history = getTestHistory()
    const filtered = history.filter(record => record.id !== id)
    Taro.setStorageSync(HISTORY_KEY, filtered)
    return true
  } catch (error) {
    console.error('删除历史记录失败:', error)
    return false
  }
}

// 清空所有历史记录
export const clearAllHistory = () => {
  try {
    Taro.removeStorageSync(HISTORY_KEY)
    return true
  } catch (error) {
    console.error('清空历史记录失败:', error)
    return false
  }
}

// 获取单条历史记录
export const getTestHistoryById = (id) => {
  try {
    const history = getTestHistory()
    return history.find(record => record.id === id) || null
  } catch (error) {
    console.error('获取历史记录失败:', error)
    return null
  }
}

