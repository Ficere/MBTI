// MBTI 类型详情 Tab 配置
export const TYPE_DETAIL_TABS = [
  { id: 'strengths', label: '💪 优势', icon: '✓', dataKey: 'strengths' },
  { id: 'weaknesses', label: '⚡ 劣势', icon: '⚠️', dataKey: 'weaknesses' },
  { id: 'workStyle', label: '💼 工作风格', icon: '💼', dataKey: 'workStyle' },
  { id: 'idealEnvironment', label: '🏡 理想环境', icon: '🌟', dataKey: 'idealEnvironment' },
  { id: 'relationshipTips', label: '❤️ 关系建议', icon: '💡', dataKey: 'relationshipTips' },
  { id: 'growthSuggestions', label: '🌱 成长建议', icon: '🎯', dataKey: 'growthSuggestions' },
  { id: 'misconceptions', label: '🔍 误解与真相', icon: '❌', dataKey: 'misconceptions', special: true },
  { id: 'compatibilityTips', label: '🤝 兼容性', icon: '🔗', dataKey: 'compatibilityTips' }
]

// 默认激活的 Tab
export const DEFAULT_TAB = 'strengths'
