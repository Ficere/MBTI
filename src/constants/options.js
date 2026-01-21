// 答题选项配置
export const ANSWER_OPTIONS = [
  {
    id: 'strongly_a',
    label: '完全符合',
    shortLabel: '完全A',
    weight: 1.0,
    emoji: '😄',
    color: '#6366f1',
    description: '非常符合选项A的描述'
  },
  {
    id: 'somewhat_a',
    label: '比较符合',
    shortLabel: '偏向A',
    weight: 0.75,
    emoji: '🙂',
    color: '#8b5cf6',
    description: '比较符合选项A的描述'
  },
  {
    id: 'neutral',
    label: '中立',
    shortLabel: '中立',
    weight: 0.5,
    emoji: '😐',
    color: '#6b7280',
    description: '两个选项都有一定符合'
  },
  {
    id: 'somewhat_b',
    label: '比较符合',
    shortLabel: '偏向B',
    weight: 0.25,
    emoji: '🙁',
    color: '#ec4899',
    description: '比较符合选项B的描述'
  },
  {
    id: 'strongly_b',
    label: '完全符合',
    shortLabel: '完全B',
    weight: 0.0,
    emoji: '😞',
    color: '#f97316',
    description: '非常符合选项B的描述'
  }
]

// 获取选项权重（用于计算）
export function getOptionWeight(optionId) {
  const option = ANSWER_OPTIONS.find(opt => opt.id === optionId)
  return option ? option.weight : 0.5
}

// 获取选项标签
export function getOptionLabel(optionId, useShort = false) {
  const option = ANSWER_OPTIONS.find(opt => opt.id === optionId)
  if (!option) return ''
  return useShort ? option.shortLabel : option.label
}

