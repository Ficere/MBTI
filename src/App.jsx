import React, { useState } from 'react'
import WelcomePage from './components/WelcomePage'
import TestPage from './components/TestPage'
import ResultPage from './components/ResultPage'
import DemoPage from './components/DemoPage'
import HistoryPage from './components/HistoryPage'
import { clearProgress } from './utils/storage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('welcome') // welcome, test, result, demo, history
  const [answers, setAnswers] = useState(null)
  const [historyRecord, setHistoryRecord] = useState(null)
  const [continueData, setContinueData] = useState(null)

  // 开始新测试
  const handleStartTest = () => {
    clearProgress() // 清除旧进度
    setAnswers(null)
    setContinueData(null)
    setCurrentPage('test')
  }

  // 继续上次测试
  const handleContinueTest = (savedAnswers, savedQuestion) => {
    setContinueData({ answers: savedAnswers, currentQuestion: savedQuestion })
    setCurrentPage('test')
  }

  // 测试完成
  const handleTestComplete = (userAnswers) => {
    setAnswers(userAnswers)
    setHistoryRecord(null)
    setCurrentPage('result')
  }

  // 返回欢迎页
  const handleBackToWelcome = () => {
    setCurrentPage('welcome')
    setAnswers(null)
    setHistoryRecord(null)
  }

  // 显示示例
  const handleShowDemo = () => {
    setCurrentPage('demo')
  }

  // 显示历史记录
  const handleShowHistory = () => {
    setCurrentPage('history')
  }

  // 查看历史记录详情
  const handleViewHistoryResult = (record) => {
    setHistoryRecord(record)
    setAnswers(record.answers)
    setCurrentPage('result')
  }

  return (
    <div className="app">
      {currentPage === 'welcome' && (
        <WelcomePage
          onStartTest={handleStartTest}
          onContinueTest={handleContinueTest}
          onShowDemo={handleShowDemo}
          onShowHistory={handleShowHistory}
        />
      )}

      {currentPage === 'test' && (
        <TestPage
          onComplete={handleTestComplete}
          onShowDemo={handleShowDemo}
          initialAnswers={continueData?.answers || []}
          initialQuestion={continueData?.currentQuestion || 0}
        />
      )}

      {currentPage === 'result' && (
        <ResultPage
          answers={answers}
          onRestart={handleBackToWelcome}
          isHistoryView={historyRecord !== null}
        />
      )}

      {currentPage === 'demo' && (
        <DemoPage onBack={handleBackToWelcome} />
      )}

      {currentPage === 'history' && (
        <HistoryPage
          onBack={handleBackToWelcome}
          onViewResult={handleViewHistoryResult}
        />
      )}
    </div>
  )
}

export default App

