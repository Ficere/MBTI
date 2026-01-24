import React, { useReducer, useCallback } from 'react'
import WelcomePage from './components/WelcomePage'
import TestPage from './components/TestPage'
import ResultPage from './components/ResultPage'
import DemoPage from './components/DemoPage'
import HistoryPage from './components/HistoryPage'
import TypeBrowserPage from './components/TypeBrowserPage'
import { clearProgress } from './utils/storage'
import questions93 from './data/questions.json'
import questions28 from './data/questions_28.json'
import './App.css'

// 测试模式配置
const TEST_MODES = {
  full: { questions: questions93, name: '完整版', count: 93 },
  quick: { questions: questions28, name: '快速版', count: 28 }
}

// Action Types
const ACTIONS = {
  START_TEST: 'START_TEST',
  CONTINUE_TEST: 'CONTINUE_TEST',
  COMPLETE_TEST: 'COMPLETE_TEST',
  EXIT_TEST: 'EXIT_TEST',
  VIEW_HISTORY_RESULT: 'VIEW_HISTORY_RESULT',
  NAVIGATE: 'NAVIGATE',
  BACK_TO_WELCOME: 'BACK_TO_WELCOME'
}

// 初始状态
const initialState = {
  currentPage: 'welcome',
  answers: null,
  historyRecord: null,
  continueData: null,
  testMode: 'full'
}

// Reducer 函数
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.START_TEST:
      return {
        ...state,
        currentPage: 'test',
        answers: null,
        continueData: null,
        testMode: action.payload.mode || 'full'
      }
    
    case ACTIONS.CONTINUE_TEST:
      return {
        ...state,
        currentPage: 'test',
        continueData: {
          answers: action.payload.answers,
          currentQuestion: action.payload.currentQuestion
        }
      }
    
    case ACTIONS.COMPLETE_TEST:
      return {
        ...state,
        currentPage: 'result',
        answers: action.payload.answers,
        historyRecord: null
      }
    
    case ACTIONS.EXIT_TEST:
      return {
        ...state,
        currentPage: 'welcome',
        continueData: null
      }
    
    case ACTIONS.VIEW_HISTORY_RESULT:
      return {
        ...state,
        currentPage: 'result',
        historyRecord: action.payload.record,
        answers: action.payload.record.answers
      }
    
    case ACTIONS.NAVIGATE:
      return {
        ...state,
        currentPage: action.payload.page
      }
    
    case ACTIONS.BACK_TO_WELCOME:
      return {
        ...state,
        currentPage: 'welcome',
        answers: null,
        historyRecord: null
      }
    
    default:
      return state
  }
}

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const { currentPage, answers, historyRecord, continueData, testMode } = state

  // 开始新测试（支持选择模式）
  const handleStartTest = useCallback((mode = 'full') => {
    clearProgress()
    dispatch({ type: ACTIONS.START_TEST, payload: { mode } })
  }, [])

  // 继续上次测试
  const handleContinueTest = useCallback((savedAnswers, savedQuestion) => {
    dispatch({
      type: ACTIONS.CONTINUE_TEST,
      payload: { answers: savedAnswers, currentQuestion: savedQuestion }
    })
  }, [])

  // 测试完成
  const handleTestComplete = useCallback((userAnswers) => {
    dispatch({ type: ACTIONS.COMPLETE_TEST, payload: { answers: userAnswers } })
  }, [])

  // 返回欢迎页
  const handleBackToWelcome = useCallback(() => {
    dispatch({ type: ACTIONS.BACK_TO_WELCOME })
  }, [])

  // 退出测试
  const handleExitTest = useCallback(() => {
    clearProgress()
    dispatch({ type: ACTIONS.EXIT_TEST })
  }, [])

  // 显示示例
  const handleShowDemo = useCallback(() => {
    dispatch({ type: ACTIONS.NAVIGATE, payload: { page: 'demo' } })
  }, [])

  // 显示历史记录
  const handleShowHistory = useCallback(() => {
    dispatch({ type: ACTIONS.NAVIGATE, payload: { page: 'history' } })
  }, [])

  // 显示类型浏览器
  const handleShowTypeBrowser = useCallback(() => {
    dispatch({ type: ACTIONS.NAVIGATE, payload: { page: 'typeBrowser' } })
  }, [])

  // 查看历史记录详情
  const handleViewHistoryResult = useCallback((record) => {
    dispatch({ type: ACTIONS.VIEW_HISTORY_RESULT, payload: { record } })
  }, [])

  return (
    <div className="app">
      {currentPage === 'welcome' && (
        <WelcomePage
          onStartTest={handleStartTest}
          onContinueTest={handleContinueTest}
          onShowDemo={handleShowDemo}
          onShowHistory={handleShowHistory}
          onShowTypeBrowser={handleShowTypeBrowser}
        />
      )}

      {currentPage === 'test' && (
        <TestPage
          onComplete={handleTestComplete}
          onExit={handleExitTest}
          initialAnswers={continueData?.answers || []}
          initialQuestion={continueData?.currentQuestion || 0}
          questions={TEST_MODES[testMode].questions}
          modeName={TEST_MODES[testMode].name}
        />
      )}

      {currentPage === 'result' && (
        <ResultPage
          answers={answers}
          onRestart={handleBackToWelcome}
          isHistoryView={historyRecord !== null}
          questions={TEST_MODES[testMode].questions}
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

      {currentPage === 'typeBrowser' && (
        <TypeBrowserPage onBack={handleBackToWelcome} />
      )}
    </div>
  )
}

export default App
