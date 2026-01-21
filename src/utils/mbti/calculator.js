import { DIMENSIONS } from '../../constants/mbti'

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
    const choiceA = question.choice_a.value
    const choiceB = question.choice_b.value
    
    if (answer.value === choiceA) {
      // 选择 A，权重越大，A 的得分越高
      scores[choiceA] += weight
      scores[choiceB] += (1 - weight)
    } else {
      // 选择 B，权重越大，B 的得分越高
      scores[choiceB] += weight
      scores[choiceA] += (1 - weight)
    }
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
    
    // 计算百分比
    const leftPercent = totalScore > 0 ? Math.round((leftScore / totalScore) * 100) : 50
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

