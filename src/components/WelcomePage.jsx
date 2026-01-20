import React from 'react'
import { loadProgress, getTestHistory } from '../utils/storage'
import './WelcomePage.css'

function WelcomePage({ onStartTest, onContinueTest, onShowDemo, onShowHistory }) {
  const progress = loadProgress()
  const history = getTestHistory()
  const hasProgress = progress && progress.answers.length > 0
  const hasHistory = history.length > 0

  const handleContinue = () => {
    if (hasProgress) {
      onContinueTest(progress.answers, progress.currentQuestion)
    }
  }

  return (
    <div className="welcome-page">
      <div className="welcome-container">
        <div className="welcome-header">
          <h1 className="welcome-title">MBTI 性格测试</h1>
          <p className="welcome-subtitle">探索你的性格类型，了解真实的自己</p>
        </div>

        <div className="welcome-content">
          <div className="intro-section">
            <h2>什么是 MBTI？</h2>
            <p>
              MBTI（Myers-Briggs Type Indicator）是一种性格分类工具，
              通过四个维度将人的性格分为 16 种类型。
            </p>
          </div>

          <div className="dimensions-section">
            <h3>四个维度</h3>
            <div className="dimensions-grid">
              <div className="dimension-item">
                <span className="dimension-label">E/I</span>
                <span className="dimension-name">外向 / 内向</span>
                <span className="dimension-desc">能量来源</span>
              </div>
              <div className="dimension-item">
                <span className="dimension-label">S/N</span>
                <span className="dimension-name">实感 / 直觉</span>
                <span className="dimension-desc">认知方式</span>
              </div>
              <div className="dimension-item">
                <span className="dimension-label">T/F</span>
                <span className="dimension-name">思考 / 情感</span>
                <span className="dimension-desc">判断方式</span>
              </div>
              <div className="dimension-item">
                <span className="dimension-label">J/P</span>
                <span className="dimension-name">判断 / 感知</span>
                <span className="dimension-desc">生活方式</span>
              </div>
            </div>
          </div>

          <div className="test-info">
            <div className="info-item">
              <span className="info-icon">📝</span>
              <span className="info-text">共 93 道题目</span>
            </div>
            <div className="info-item">
              <span className="info-icon">⏱️</span>
              <span className="info-text">预计 10-15 分钟</span>
            </div>
            <div className="info-item">
              <span className="info-icon">💡</span>
              <span className="info-text">凭直觉选择，不要过度思考</span>
            </div>
            <div className="info-item">
              <span className="info-icon">⌨️</span>
              <span className="info-text">支持键盘快捷键 A/B 或 1/2</span>
            </div>
          </div>

          <div className="action-buttons">
            {hasProgress && (
              <button className="continue-button" onClick={handleContinue}>
                <span className="button-icon">▶️</span>
                继续上次测试
                <span className="button-hint">
                  (已完成 {progress.answers.length} 题)
                </span>
              </button>
            )}
            
            <button className="start-button" onClick={onStartTest}>
              <span className="button-icon">🚀</span>
              {hasProgress ? '重新开始测试' : '开始测试'}
            </button>

            <div className="secondary-buttons">
              <button className="demo-button" onClick={onShowDemo}>
                <span className="button-icon">👁️</span>
                查看示例结果
              </button>
              
              {hasHistory && (
                <button className="history-button" onClick={onShowHistory}>
                  <span className="button-icon">📊</span>
                  查看历史记录
                  <span className="button-badge">{history.length}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="welcome-footer">
          <p>本测试结果仅供参考，不作为专业心理评估依据</p>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage

