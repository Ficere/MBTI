import React, { useState, useEffect } from 'react'
import questions from '../data/questions.json'
import { saveProgress } from '../utils/storage'
import { ANSWER_OPTIONS } from '../constants/options'
import './TestPage.css'

function TestPage({ onComplete, onExit, initialAnswers = [], initialQuestion = 0 }) {
  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion)
  const [answers, setAnswers] = useState(initialAnswers)
  const [selectedOption, setSelectedOption] = useState(null) // 当前选中的选项
  const [showExitConfirm, setShowExitConfirm] = useState(false) // 退出确认对话框

  // 获取当前题目
  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  // 重置选项（切换题目时）
  useEffect(() => {
    setSelectedOption(null)
  }, [currentQuestion])

  const handleAnswer = (optionId) => {
    const option = ANSWER_OPTIONS.find(opt => opt.id === optionId)
    if (!option) return

    // 确定选择的是 A 还是 B
    let choiceValue
    if (optionId === 'strongly_a' || optionId === 'somewhat_a') {
      choiceValue = question.choice_a.value
    } else if (optionId === 'strongly_b' || optionId === 'somewhat_b') {
      choiceValue = question.choice_b.value
    } else {
      // 中立：随机选择 A 或 B（但权重为 0.5）
      choiceValue = Math.random() < 0.5 ? question.choice_a.value : question.choice_b.value
    }

    const newAnswer = {
      questionId: currentQuestion,  // 使用题目索引作为 ID
      value: choiceValue,
      weight: option.weight
    }

    const newAnswers = [...answers, newAnswer]
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

      // 1-5 数字键选择选项
      if (key >= '1' && key <= '5') {
        event.preventDefault()
        const optionIndex = parseInt(key) - 1
        const option = ANSWER_OPTIONS[optionIndex]
        if (option) {
          handleAnswer(option.id)
        }
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

  // 处理退出测试
  const handleExitClick = () => {
    if (answers.length > 0) {
      // 如果已经有答题进度，显示确认对话框
      setShowExitConfirm(true)
    } else {
      // 如果还没开始答题，直接退出
      onExit && onExit()
    }
  }

  // 确认退出
  const handleConfirmExit = () => {
    setShowExitConfirm(false)
    onExit && onExit()
  }

  // 取消退出
  const handleCancelExit = () => {
    setShowExitConfirm(false)
  }

  return (
    <div className="test-page">
      <div className="test-container">
        <div className="header">
          <div className="header-top">
            <h1>MBTI 性格测试</h1>
            <button className="exit-button" onClick={handleExitClick} title="退出测试">
              ✕
            </button>
          </div>
          <p className="subtitle">探索你的性格类型</p>
          <div className="progress-info">
            <span>问题 {currentQuestion + 1} / {questions.length}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="question-card">
          <h2 className="question-text">{question.question}</h2>

          {/* 展示两个选项 */}
          <div className="choices-display">
            <div className="choice-option choice-option-a">
              <div className="choice-label">选项 A</div>
              <div className="choice-text">{question.choice_a.text}</div>
            </div>

            <div className="vs-divider">VS</div>

            <div className="choice-option choice-option-b">
              <div className="choice-label">选项 B</div>
              <div className="choice-text">{question.choice_b.text}</div>
            </div>
          </div>

          {/* 5 选项按钮 */}
          <div className="answer-section">
            <p className="answer-prompt">你的倾向程度：</p>
            <div className="answer-options">
              {ANSWER_OPTIONS.map((option, index) => (
                <button
                  key={option.id}
                  className={`answer-button ${selectedOption === option.id ? 'selected' : ''}`}
                  onClick={() => handleAnswer(option.id)}
                  style={{ '--option-color': option.color }}
                >
                  <span className="option-emoji">{option.emoji}</span>
                  <span className="option-label">{option.shortLabel}</span>
                  <span className="option-hint">按 {index + 1}</span>
                </button>
              ))}
            </div>
          </div>

          {currentQuestion > 0 && (
            <button className="previous-button" onClick={handlePrevious}>
              ← 上一题
            </button>
          )}
        </div>
      </div>

      {/* 退出确认对话框 */}
      {showExitConfirm && (
        <div className="exit-confirm-overlay" onClick={handleCancelExit}>
          <div className="exit-confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>确认退出测试？</h3>
            <p>当前进度已完成 {answers.length} 题，退出后进度将被清除。</p>
            <div className="exit-confirm-actions">
              <button className="cancel-exit-button" onClick={handleCancelExit}>
                取消
              </button>
              <button className="confirm-exit-button" onClick={handleConfirmExit}>
                确认退出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TestPage

