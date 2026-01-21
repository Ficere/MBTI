import { describe, it, expect } from 'vitest'
import { calculateScores, getMBTIType, calculateMBTI } from './calculator'
import { mockQuestions, createAnswer } from './test-helpers'

describe('calculateScores', () => {
  it('全部选择"完全符合A"应该给A维度满分', () => {
    const answers = [
      createAnswer(0, 1.0), // E/I: 完全符合A -> E得1分
      createAnswer(1, 1.0), // S/N: 完全符合A -> S得1分
      createAnswer(2, 1.0), // T/F: 完全符合A -> T得1分
      createAnswer(3, 1.0)  // J/P: 完全符合A -> J得1分
    ]
    const scores = calculateScores(answers, mockQuestions)
    
    expect(scores.E).toBe(1.0)
    expect(scores.I).toBe(0.0)
    expect(scores.S).toBe(1.0)
    expect(scores.N).toBe(0.0)
    expect(scores.T).toBe(1.0)
    expect(scores.F).toBe(0.0)
    expect(scores.J).toBe(1.0)
    expect(scores.P).toBe(0.0)
  })

  it('全部选择"完全符合B"应该给B维度满分', () => {
    const answers = [
      createAnswer(0, 0.0), // E/I: 完全符合B -> I得1分
      createAnswer(1, 0.0), // S/N: 完全符合B -> N得1分
      createAnswer(2, 0.0), // T/F: 完全符合B -> F得1分
      createAnswer(3, 0.0)  // J/P: 完全符合B -> P得1分
    ]
    const scores = calculateScores(answers, mockQuestions)
    
    expect(scores.E).toBe(0.0)
    expect(scores.I).toBe(1.0)
    expect(scores.S).toBe(0.0)
    expect(scores.N).toBe(1.0)
    expect(scores.T).toBe(0.0)
    expect(scores.F).toBe(1.0)
    expect(scores.J).toBe(0.0)
    expect(scores.P).toBe(1.0)
  })

  it('选择"偏向A"应该给A维度0.75分，B维度0.25分', () => {
    const answers = [createAnswer(0, 0.75)]
    const scores = calculateScores(answers, mockQuestions)
    
    expect(scores.E).toBe(0.75)
    expect(scores.I).toBe(0.25)
  })

  it('选择"偏向B"应该给A维度0.25分，B维度0.75分', () => {
    const answers = [createAnswer(0, 0.25)]
    const scores = calculateScores(answers, mockQuestions)
    
    expect(scores.E).toBe(0.25)
    expect(scores.I).toBe(0.75)
  })

  it('选择"中立"应该给双方各0.5分', () => {
    const answers = [createAnswer(0, 0.5)]
    const scores = calculateScores(answers, mockQuestions)
    
    expect(scores.E).toBe(0.5)
    expect(scores.I).toBe(0.5)
  })
})

describe('getMBTIType', () => {
  it('ESTJ 类型判定', () => {
    const scores = { E: 1, I: 0, S: 1, N: 0, T: 1, F: 0, J: 1, P: 0 }
    expect(getMBTIType(scores)).toBe('ESTJ')
  })

  it('INFP 类型判定', () => {
    const scores = { E: 0, I: 1, S: 0, N: 1, T: 0, F: 1, J: 0, P: 1 }
    expect(getMBTIType(scores)).toBe('INFP')
  })

  it('INTJ 类型判定', () => {
    const scores = { E: 0.2, I: 0.8, S: 0.3, N: 0.7, T: 0.9, F: 0.1, J: 0.6, P: 0.4 }
    expect(getMBTIType(scores)).toBe('INTJ')
  })

  it('ENFP 类型判定', () => {
    const scores = { E: 0.7, I: 0.3, S: 0.2, N: 0.8, T: 0.4, F: 0.6, J: 0.3, P: 0.7 }
    expect(getMBTIType(scores)).toBe('ENFP')
  })

  it('分数相等时应该选择左侧类型', () => {
    const scores = { E: 0.5, I: 0.5, S: 0.5, N: 0.5, T: 0.5, F: 0.5, J: 0.5, P: 0.5 }
    expect(getMBTIType(scores)).toBe('ESTJ')
  })
})

describe('calculateMBTI - 典型人格类型测试', () => {
  // 测试16种类型中的4种典型类型
  const testCases = [
    { type: 'INTJ', weights: [0.0, 0.0, 1.0, 1.0] }, // I, N, T, J
    { type: 'ENFP', weights: [1.0, 0.0, 0.0, 0.0] }, // E, N, F, P
    { type: 'ISTJ', weights: [0.0, 1.0, 1.0, 1.0] }, // I, S, T, J
    { type: 'ESFP', weights: [1.0, 1.0, 0.0, 0.0] }  // E, S, F, P
  ]

  testCases.forEach(({ type, weights }) => {
    it(`典型 ${type}`, () => {
      const answers = weights.map((w, i) => createAnswer(i, w))
      const result = calculateMBTI(answers, mockQuestions)
      expect(result.type).toBe(type)
    })
  })
})

describe('calculateMBTI - 混合选择场景', () => {
  const { extendedQuestions } = require('./test-helpers')

  it('偏向 I 的混合选择应得 I 类型', () => {
    // E/I: 2个偏向I，1个偏向E -> I胜; S/N,T/F,J/P 全选对应类型
    const weights = [0.25, 0.0, 0.75, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]
    const answers = weights.map((w, i) => createAnswer(i, w))
    const result = calculateMBTI(answers, extendedQuestions)
    expect(result.type).toBe('INTJ')
    expect(result.scores.I).toBeGreaterThan(result.scores.E)
  })

  it('全部中立选择应得 ESTJ（默认左侧类型）', () => {
    const answers = Array(12).fill(0).map((_, i) => createAnswer(i, 0.5))
    const result = calculateMBTI(answers, extendedQuestions)
    expect(result.type).toBe('ESTJ')
    expect(result.scores.E).toBe(result.scores.I)
  })

  it('轻微偏向应正确累加', () => {
    // E/I: 0.4 (略偏I), S/N: 0.0 (N), T/F: 1.0 (T), J/P: 0.0 (P)
    const weights = [0.4, 0.4, 0.4, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0]
    const answers = weights.map((w, i) => createAnswer(i, w))
    const result = calculateMBTI(answers, extendedQuestions)
    expect(result.type).toBe('INTP')
    expect(result.scores.E).toBeCloseTo(1.2)
    expect(result.scores.I).toBeCloseTo(1.8)
  })
})

describe('calculateDimensions - 维度详情', () => {
  it('应该正确计算百分比', () => {
    const answers = [
      createAnswer(0, 0.75),  // E=0.75, I=0.25
      createAnswer(1, 0.0),   // S=0, N=1
      createAnswer(2, 1.0),   // T=1, F=0
      createAnswer(3, 0.5)    // J=0.5, P=0.5
    ]
    const result = calculateMBTI(answers, mockQuestions)

    // E/I: E=0.75, I=0.25, 总分=1, E占75%
    expect(result.dimensions[0].left.percent).toBe(75)
    expect(result.dimensions[0].right.percent).toBe(25)

    // S/N: S=0, N=1, N占100%
    expect(result.dimensions[1].left.percent).toBe(0)
    expect(result.dimensions[1].right.percent).toBe(100)

    // T/F: T=1, F=0, T占100%
    expect(result.dimensions[2].left.percent).toBe(100)
    expect(result.dimensions[2].right.percent).toBe(0)

    // J/P: 50-50
    expect(result.dimensions[3].left.percent).toBe(50)
    expect(result.dimensions[3].right.percent).toBe(50)
  })

  it('应该正确识别主导类型', () => {
    const answers = [
      createAnswer(0, 0.0),  // I 主导
      createAnswer(1, 0.0),  // N 主导
      createAnswer(2, 0.0),  // F 主导
      createAnswer(3, 0.0)   // P 主导
    ]
    const result = calculateMBTI(answers, mockQuestions)

    expect(result.dimensions[0].dominant.type).toBe('I')
    expect(result.dimensions[1].dominant.type).toBe('N')
    expect(result.dimensions[2].dominant.type).toBe('F')
    expect(result.dimensions[3].dominant.type).toBe('P')
  })
})

