// 统一导出 MBTI 相关功能
export {
  initializeScores,
  calculateScores,
  getMBTIType,
  calculateDimensions,
  calculateMBTI,
  getDimensionResult
} from './calculator'

export {
  DIMENSIONS,
  TYPE_DESCRIPTIONS,
  getTypeDescription
} from '../../constants/mbti'

// 获取维度信息
export function getDimensionByPair(pair) {
  const { DIMENSIONS } = require('../../constants/mbti')
  return DIMENSIONS.find(d => d.pair === pair)
}

