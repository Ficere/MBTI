// 测试辅助函数和模拟数据

// 模拟题目数据（每个维度各1题，共4题）
export const mockQuestions = [
  { question: 'E/I 测试', choice_a: { value: 'E', text: 'A' }, choice_b: { value: 'I', text: 'B' } },
  { question: 'S/N 测试', choice_a: { value: 'S', text: 'A' }, choice_b: { value: 'N', text: 'B' } },
  { question: 'T/F 测试', choice_a: { value: 'T', text: 'A' }, choice_b: { value: 'F', text: 'B' } },
  { question: 'J/P 测试', choice_a: { value: 'J', text: 'A' }, choice_b: { value: 'P', text: 'B' } }
]

// 每个维度3题的扩展题目（用于混合选择测试）
export const extendedQuestions = [
  // E/I 维度 (3题)
  { question: 'E/I-1', choice_a: { value: 'E', text: 'A' }, choice_b: { value: 'I', text: 'B' } },
  { question: 'E/I-2', choice_a: { value: 'E', text: 'A' }, choice_b: { value: 'I', text: 'B' } },
  { question: 'E/I-3', choice_a: { value: 'E', text: 'A' }, choice_b: { value: 'I', text: 'B' } },
  // S/N 维度 (3题)
  { question: 'S/N-1', choice_a: { value: 'S', text: 'A' }, choice_b: { value: 'N', text: 'B' } },
  { question: 'S/N-2', choice_a: { value: 'S', text: 'A' }, choice_b: { value: 'N', text: 'B' } },
  { question: 'S/N-3', choice_a: { value: 'S', text: 'A' }, choice_b: { value: 'N', text: 'B' } },
  // T/F 维度 (3题)
  { question: 'T/F-1', choice_a: { value: 'T', text: 'A' }, choice_b: { value: 'F', text: 'B' } },
  { question: 'T/F-2', choice_a: { value: 'T', text: 'A' }, choice_b: { value: 'F', text: 'B' } },
  { question: 'T/F-3', choice_a: { value: 'T', text: 'A' }, choice_b: { value: 'F', text: 'B' } },
  // J/P 维度 (3题)
  { question: 'J/P-1', choice_a: { value: 'J', text: 'A' }, choice_b: { value: 'P', text: 'B' } },
  { question: 'J/P-2', choice_a: { value: 'J', text: 'A' }, choice_b: { value: 'P', text: 'B' } },
  { question: 'J/P-3', choice_a: { value: 'J', text: 'A' }, choice_b: { value: 'P', text: 'B' } }
]

// 生成答案的辅助函数
export function createAnswer(questionId, weight) {
  return { questionId, value: 'unused', weight }
}

// 快速生成特定类型的答案集
export function createTypedAnswers(typeString) {
  // typeString 如 'INTJ'，返回对应的答案数组
  const typeMap = {
    'E': 1.0, 'I': 0.0,
    'S': 1.0, 'N': 0.0,
    'T': 1.0, 'F': 0.0,
    'J': 1.0, 'P': 0.0
  }
  
  return [
    createAnswer(0, typeMap[typeString[0]]),  // E/I
    createAnswer(1, typeMap[typeString[1]]),  // S/N
    createAnswer(2, typeMap[typeString[2]]),  // T/F
    createAnswer(3, typeMap[typeString[3]])   // J/P
  ]
}

