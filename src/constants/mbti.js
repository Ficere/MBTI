// MBTI 维度定义
export const DIMENSIONS = [
  {
    name: '能量来源',
    pair: 'E/I',
    left: { type: 'E', name: '外向', description: '从外部世界获得能量' },
    right: { type: 'I', name: '内向', description: '从内心世界获得能量' }
  },
  {
    name: '认知方式',
    pair: 'S/N',
    left: { type: 'S', name: '实感', description: '关注具体事实和细节' },
    right: { type: 'N', name: '直觉', description: '关注整体和可能性' }
  },
  {
    name: '决策方式',
    pair: 'T/F',
    left: { type: 'T', name: '思考', description: '基于逻辑和客观分析' },
    right: { type: 'F', name: '情感', description: '基于价值观和人际和谐' }
  },
  {
    name: '生活方式',
    pair: 'J/P',
    left: { type: 'J', name: '判断', description: '喜欢计划和组织' },
    right: { type: 'P', name: '感知', description: '喜欢灵活和自发' }
  }
]

// MBTI 类型描述
export const TYPE_DESCRIPTIONS = {
  INTJ: {
    name: '建筑师',
    description: '富有想象力和战略性的思想家，一切皆在计划之中。',
    traits: ['独立', '理性', '战略性', '创新']
  },
  INTP: {
    name: '逻辑学家',
    description: '具有创造力的发明家，对知识有着止不住的渴望。',
    traits: ['分析', '好奇', '客观', '理论']
  },
  ENTJ: {
    name: '指挥官',
    description: '大胆、富有想象力且意志强大的领导者，总能找到或创造解决方法。',
    traits: ['领导力', '果断', '高效', '战略']
  },
  ENTP: {
    name: '辩论家',
    description: '聪明好奇的思想家，无法抗拒智力上的挑战。',
    traits: ['创新', '机智', '好辩', '适应']
  },
  INFJ: {
    name: '提倡者',
    description: '安静而神秘，同时鼓舞人心且不知疲倦的理想主义者。',
    traits: ['理想', '洞察', '坚定', '有原则']
  },
  INFP: {
    name: '调停者',
    description: '诗意、善良的利他主义者，总是热情地为正义事业提供帮助。',
    traits: ['理想', '忠诚', '好奇', '灵活']
  },
  ENFJ: {
    name: '主人公',
    description: '富有魅力且鼓舞人心的领导者，有能力让听众着迷。',
    traits: ['魅力', '利他', '领导', '可靠']
  },
  ENFP: {
    name: '竞选者',
    description: '热情、有创造力且社交能力强的自由精神，总能找到理由微笑。',
    traits: ['热情', '创造', '社交', '独立']
  },
  ISTJ: {
    name: '物流师',
    description: '实际且注重事实的个人，可靠性不容怀疑。',
    traits: ['可靠', '实际', '负责', '有序']
  },
  ISFJ: {
    name: '守卫者',
    description: '非常专注且温暖的守护者，时刻准备保护爱的人。',
    traits: ['支持', '可靠', '耐心', '忠诚']
  },
  ESTJ: {
    name: '总经理',
    description: '出色的管理者，在管理事务或人员方面无与伦比。',
    traits: ['组织', '务实', '传统', '诚实']
  },
  ESFJ: {
    name: '执政官',
    description: '极有同情心、受欢迎且乐于助人的人，总是热心地为他人提供帮助。',
    traits: ['关怀', '社交', '忠诚', '有序']
  },
  ISTP: {
    name: '鉴赏家',
    description: '大胆且实际的实验家，擅长使用各种工具。',
    traits: ['实际', '灵活', '好奇', '自发']
  },
  ISFP: {
    name: '探险家',
    description: '灵活且有魅力的艺术家，时刻准备探索和体验新事物。',
    traits: ['艺术', '敏感', '灵活', '好奇']
  },
  ESTP: {
    name: '企业家',
    description: '聪明、精力充沛且善于感知的人，真心享受生活在边缘的感觉。',
    traits: ['精力', '感知', '直接', '社交']
  },
  ESFP: {
    name: '表演者',
    description: '自发、精力充沛且热情的表演者——生活在他们周围永远不会无聊。',
    traits: ['热情', '友好', '自发', '享受']
  }
}

// 获取维度信息
export function getDimensionByPair(pair) {
  return DIMENSIONS.find(d => d.pair === pair)
}

// 获取类型描述
export function getTypeDescription(type) {
  return TYPE_DESCRIPTIONS[type] || {
    name: '未知类型',
    description: '暂无描述',
    traits: []
  }
}

