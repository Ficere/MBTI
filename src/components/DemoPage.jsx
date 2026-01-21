import React from 'react'
import ResultPage from './ResultPage'
import questions from '../data/questions.json'
import './DemoPage.css'

// 虚拟人物：李明，28岁，软件工程师
function DemoPage({ onBack }) {
  // 随机生成一个合理的MBTI测试答案（新格式）
  // 这个虚拟人物是一个INTJ类型的人
  const generateDemoAnswers = () => {
    const answers = []

    // 为每个题目生成答案
    questions.forEach((question, index) => {
      const choiceA = question.choice_a.value
      const choiceB = question.choice_b.value

      // 根据题目类型设置倾向
      let selectedValue, weight

      if (choiceA === 'I' || choiceB === 'I') {
        // E/I 维度：倾向内向 (I占65%)
        if (choiceA === 'I') {
          selectedValue = Math.random() < 0.65 ? 'I' : 'E'
          weight = selectedValue === 'I' ? (Math.random() < 0.7 ? 1.0 : 0.75) : (Math.random() < 0.5 ? 0.25 : 0.0)
        } else {
          selectedValue = Math.random() < 0.65 ? 'I' : 'E'
          weight = selectedValue === 'E' ? (Math.random() < 0.7 ? 0.0 : 0.25) : (Math.random() < 0.5 ? 0.75 : 1.0)
        }
      } else if (choiceA === 'N' || choiceB === 'N') {
        // S/N 维度：倾向直觉 (N占70%)
        if (choiceA === 'N') {
          selectedValue = Math.random() < 0.70 ? 'N' : 'S'
          weight = selectedValue === 'N' ? (Math.random() < 0.8 ? 1.0 : 0.75) : (Math.random() < 0.5 ? 0.25 : 0.0)
        } else {
          selectedValue = Math.random() < 0.70 ? 'N' : 'S'
          weight = selectedValue === 'S' ? (Math.random() < 0.8 ? 0.0 : 0.25) : (Math.random() < 0.5 ? 0.75 : 1.0)
        }
      } else if (choiceA === 'T' || choiceB === 'T') {
        // T/F 维度：倾向思考 (T占75%)
        if (choiceA === 'T') {
          selectedValue = Math.random() < 0.75 ? 'T' : 'F'
          weight = selectedValue === 'T' ? (Math.random() < 0.8 ? 1.0 : 0.75) : (Math.random() < 0.5 ? 0.25 : 0.0)
        } else {
          selectedValue = Math.random() < 0.75 ? 'T' : 'F'
          weight = selectedValue === 'F' ? (Math.random() < 0.8 ? 0.0 : 0.25) : (Math.random() < 0.5 ? 0.75 : 1.0)
        }
      } else {
        // J/P 维度：倾向判断 (J占60%)
        if (choiceA === 'J') {
          selectedValue = Math.random() < 0.60 ? 'J' : 'P'
          weight = selectedValue === 'J' ? (Math.random() < 0.6 ? 1.0 : 0.75) : (Math.random() < 0.5 ? 0.25 : 0.0)
        } else {
          selectedValue = Math.random() < 0.60 ? 'J' : 'P'
          weight = selectedValue === 'P' ? (Math.random() < 0.6 ? 0.0 : 0.25) : (Math.random() < 0.5 ? 0.75 : 1.0)
        }
      }

      answers.push({
        questionId: question.id,
        value: selectedValue,
        weight: weight
      })
    })

    return answers
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

