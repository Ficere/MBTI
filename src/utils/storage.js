import { generateId, formatDateTime, isExpired } from './helpers'

// localStorage 键名
const PROGRESS_KEY = 'mbti_progress'
const HISTORY_KEY = 'mbti_history'

// ========== 进度管理 ==========

// 保存答题进度
export const saveProgress = (answers, currentQuestion) => {
  try {
    const progress = {
      answers,
      currentQuestion,
      timestamp: Date.now()
    }
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
    return true
  } catch (error) {
    console.error('保存进度失败:', error)
    return false
  }
}

// 加载答题进度
export const loadProgress = () => {
  try {
    const data = localStorage.getItem(PROGRESS_KEY)
    if (!data) return null
    
    const progress = JSON.parse(data)
    // 检查进度是否过期（超过7天）
    if (isExpired(progress.timestamp, 7)) {
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
    localStorage.removeItem(PROGRESS_KEY)
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
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
    
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
    const data = localStorage.getItem(HISTORY_KEY)
    if (!data) return []
    return JSON.parse(data)
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
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('删除历史记录失败:', error)
    return false
  }
}

// 清空所有历史记录
export const clearAllHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY)
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

