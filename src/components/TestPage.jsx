import React, { useState, useEffect } from 'react'
import questions from '../data/questions.json'
import { saveProgress } from '../utils/storage'
import './TestPage.css'

function TestPage({ onComplete, onShowDemo, initialAnswers = [], initialQuestion = 0 }) {
  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion)
  const [answers, setAnswers] = useState(initialAnswers)

  // 获取当前题目
  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswer = (choice) => {
    const newAnswers = [...answers, choice]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      const nextQuestion = currentQuestion + 1
      setCurrentQuestion(nextQuestion)
      // 保存进度
      saveProgress(newAnswers, nextQuestion)
    } else {
      onComplete(newAnswers)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      const prevQuestion = currentQuestion - 1
      const newAnswers = answers.slice(0, -1)
      setCurrentQuestion(prevQuestion)
      setAnswers(newAnswers)
      // 保存进度
      saveProgress(newAnswers, prevQuestion)
    }
  }

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key.toLowerCase()

      // A 或 1 选择选项 A
      if (key === 'a' || key === '1') {
        event.preventDefault()
        handleAnswer(question.choice_a.value)
      }
      // B 或 2 选择选项 B
      else if (key === 'b' || key === '2') {
        event.preventDefault()
        handleAnswer(question.choice_b.value)
      }
      // 左箭头返回上一题
      else if (key === 'arrowleft') {
        event.preventDefault()
        handlePrevious()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [currentQuestion, answers, question])

  return (
    <div className="test-page">
      <div className="test-container">
        <div className="header">
          <h1>MBTI 性格测试</h1>
          <p className="subtitle">探索你的性格类型</p>
          {currentQuestion === 0 && (
            <button className="demo-button" onClick={onShowDemo}>
              👁️ 查看示例结果
            </button>
          )}
          <div className="progress-info">
            <span>问题 {currentQuestion + 1} / {questions.length}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="question-card">
          <h2 className="question-text">{question.question}</h2>
          
          <div className="choices">
            <button
              className="choice-button choice-a"
              onClick={() => handleAnswer(question.choice_a.value)}
            >
              <span className="choice-label">A</span>
              <span className="choice-text">{question.choice_a.text}</span>
              <span className="choice-hint">按 A 或 1</span>
            </button>

            <button
              className="choice-button choice-b"
              onClick={() => handleAnswer(question.choice_b.value)}
            >
              <span className="choice-label">B</span>
              <span className="choice-text">{question.choice_b.text}</span>
              <span className="choice-hint">按 B 或 2</span>
            </button>
          </div>

          {currentQuestion > 0 && (
            <button className="previous-button" onClick={handlePrevious}>
              ← 上一题
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TestPage

