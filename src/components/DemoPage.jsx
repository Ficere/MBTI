import React from 'react'
import ResultPage from './ResultPage'
import './DemoPage.css'

// 虚拟人物：李明，28岁，软件工程师
function DemoPage({ onBack }) {
  // 随机生成一个合理的MBTI测试答案
  // 这个虚拟人物是一个INTJ类型的人
  const generateDemoAnswers = () => {
    const answers = []
    
    // E/I 维度：倾向内向 (I占65%)
    const eiQuestions = 23 // 假设E/I相关题目约23题
    const iCount = Math.floor(eiQuestions * 0.65)
    const eCount = eiQuestions - iCount
    for (let i = 0; i < iCount; i++) answers.push('I')
    for (let i = 0; i < eCount; i++) answers.push('E')
    
    // S/N 维度：倾向直觉 (N占70%)
    const snQuestions = 24
    const nCount = Math.floor(snQuestions * 0.70)
    const sCount = snQuestions - nCount
    for (let i = 0; i < nCount; i++) answers.push('N')
    for (let i = 0; i < sCount; i++) answers.push('S')
    
    // T/F 维度：倾向思考 (T占75%)
    const tfQuestions = 23
    const tCount = Math.floor(tfQuestions * 0.75)
    const fCount = tfQuestions - tCount
    for (let i = 0; i < tCount; i++) answers.push('T')
    for (let i = 0; i < fCount; i++) answers.push('F')
    
    // J/P 维度：倾向判断 (J占60%)
    const jpQuestions = 23
    const jCount = Math.floor(jpQuestions * 0.60)
    const pCount = jpQuestions - jCount
    for (let i = 0; i < jCount; i++) answers.push('J')
    for (let i = 0; i < pCount; i++) answers.push('P')
    
    // 打乱数组，使其看起来更真实
    return answers.sort(() => Math.random() - 0.5)
  }

  const demoAnswers = generateDemoAnswers()

  return (
    <div className="demo-page">
      <div className="demo-header">
        <button className="back-button" onClick={onBack}>
          ← 返回测试
        </button>
        <div className="demo-info">
          <h2>示例结果展示</h2>
          <div className="virtual-person">
            <div className="person-avatar">👨‍💻</div>
            <div className="person-details">
              <h3>李明</h3>
              <p>28岁 · 软件工程师</p>
              <p className="person-desc">
                喜欢独立思考，对新技术充满好奇，做事有条理，善于分析问题
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <ResultPage 
        answers={demoAnswers} 
        onRestart={onBack}
      />
    </div>
  )
}

export default DemoPage

