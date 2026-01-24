import { DIMENSIONS } from '../../constants/mbti'
import { calculatePercentage } from '../helpers'

/**
 * 初始化得分对象
 */
export function initializeScores() {
  return {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  }
}

/**
 * 计算 MBTI 得分
 * @param {Array} answers - 答案数组 [{ questionId, value, weight }]
 * @param {Array} questions - 题目数组
 * @returns {Object} 得分对象
 */
export function calculateScores(answers, questions) {
  const scores = initializeScores()

  answers.forEach(answer => {
    // 使用索引获取题目（questionId 是题目在数组中的索引）
    const question = questions[answer.questionId]
    if (!question) return

    // 获取权重，兼容旧数据（没有 weight 字段时默认为 1.0）
    const weight = answer.weight !== undefined ? answer.weight : 1.0

    // 计算得分
    // answer.value 是用户选择的维度（A或B的value）
    // weight 表示用户对该选择的确信程度：
    // - 1.0 = 完全符合A, 0.75 = 偏向A, 0.5 = 中立, 0.25 = 偏向B, 0.0 = 完全符合B
    const choiceA = question.choice_a.value
    const choiceB = question.choice_b.value

    // 无论选择的是 A 还是 B 的维度值，都统一按照 weight 来分配分数
    // weight 表示对 A 的倾向程度，(1-weight) 表示对 B 的倾向程度
    scores[choiceA] += weight
    scores[choiceB] += (1 - weight)
  })

  return scores
}

/**
 * 根据得分计算 MBTI 类型
 * @param {Object} scores - 得分对象
 * @returns {String} MBTI 类型（如 'INTJ'）
 */
export function getMBTIType(scores) {
  const type = [
    scores.E >= scores.I ? 'E' : 'I',
    scores.S >= scores.N ? 'S' : 'N',
    scores.T >= scores.F ? 'T' : 'F',
    scores.J >= scores.P ? 'J' : 'P'
  ].join('')
  
  return type
}

/**
 * 计算维度详情
 * @param {Object} scores - 得分对象
 * @param {Array} questions - 题目数组
 * @returns {Array} 维度详情数组
 */
export function calculateDimensions(scores, questions) {
  return DIMENSIONS.map(dimension => {
    const leftType = dimension.left.type
    const rightType = dimension.right.type

    // 计算该维度的题目总数（同时检查 choice_a 和 choice_b）
    const dimensionQuestions = questions.filter(q =>
      q.choice_a.value === leftType || q.choice_a.value === rightType ||
      q.choice_b.value === leftType || q.choice_b.value === rightType
    )
    const totalQuestions = dimensionQuestions.length
    
    // 获取得分
    const leftScore = scores[leftType]
    const rightScore = scores[rightType]
    const totalScore = leftScore + rightScore
    
    // 计算百分比（使用通用工具函数）
    const leftPercent = totalScore > 0 ? calculatePercentage(leftScore, totalScore) : 50
    const rightPercent = 100 - leftPercent

    // 构建包含得分的左右对象
    const leftWithScore = {
      ...dimension.left,
      score: leftScore,
      percent: leftPercent
    }

    const rightWithScore = {
      ...dimension.right,
      score: rightScore,
      percent: rightPercent
    }

    // 确定主导类型（使用包含得分的对象）
    const dominant = leftScore >= rightScore ? leftWithScore : rightWithScore

    return {
      ...dimension,
      left: leftWithScore,
      right: rightWithScore,
      dominant,
      totalQuestions
    }
  })
}

/**
 * 完整的 MBTI 计算
 * @param {Array} answers - 答案数组
 * @param {Array} questions - 题目数组
 * @returns {Object} { type, scores, dimensions }
 */
export function calculateMBTI(answers, questions) {
  const scores = calculateScores(answers, questions)
  const type = getMBTIType(scores)
  const dimensions = calculateDimensions(scores, questions)
  
  return {
    type,
    scores,
    dimensions
  }
}

/**
 * 获取单个维度的结果
 * @param {Object} dimension - 维度对象
 * @returns {Object} { leftPercent, rightPercent, dominant }
 */
export function getDimensionResult(dimension) {
  return {
    leftPercent: dimension.left.percent,
    rightPercent: dimension.right.percent,
    dominant: dimension.dominant
  }
}

