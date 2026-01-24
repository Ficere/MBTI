import React, { useState, useEffect, useRef } from 'react'
import defaultQuestions from '../data/questions.json'
import { saveTestResult } from '../utils/storage'
import { calculateMBTI } from '../utils/mbti'
import { getTypeDescription } from '../constants/mbti'
import TypeHeader from './ResultPage/TypeHeader'
import DimensionCard from './ResultPage/DimensionCard'
import TypeOverview from './ResultPage/TypeOverview'
import TypeDetailTabs from './ResultPage/TypeDetailTabs'
import ActionButtons from './ResultPage/ActionButtons'
import './ResultPage/index.css'
import './ResultPage/TypeHeader.css'
import './ResultPage/DimensionCards.css'
import './ResultPage/TypeOverview.css'
import './ResultPage/TypeDetailTabs.css'
import './ResultPage/Actions.css'

function ResultPage({ answers, onRestart, isHistoryView = false, questions = defaultQuestions }) {
  const [result, setResult] = useState(null)
  // 使用 answers 的引用作为标识，避免重复保存
  const savedAnswersRef = useRef(null)

  // 计算测试结果并异步加载类型描述
  useEffect(() => {
    async function loadResult() {
      const { type, scores, dimensions } = calculateMBTI(answers, questions)

      // 保存测试结果到历史（仅在非历史查看模式下，且该 answers 未保存过）
      if (!isHistoryView && savedAnswersRef.current !== answers) {
        saveTestResult(type, answers, scores)
        savedAnswersRef.current = answers
      }

      // 异步获取类型描述
      const typeDescription = await getTypeDescription(type)

      setResult({
        dimensions,
        mbtiType: type,
        scores,
        typeDescription
      })
    }

    loadResult()
  }, [answers, isHistoryView, questions])

  // 加载中状态
  if (!result) {
    return (
      <div className="result-page">
        <div className="result-container">
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>正在加载结果...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="result-page">
      <div className="result-container">
        <TypeHeader
          mbtiType={result.mbtiType}
          tagline={result.typeDescription.tagline}
          isHistoryView={isHistoryView}
        />

        <div className="dimensions">
          {result.dimensions.map((dimension, index) => (
            <DimensionCard key={index} dimension={dimension} />
          ))}
        </div>

        <TypeOverview typeDescription={result.typeDescription} />

        <TypeDetailTabs typeDescription={result.typeDescription} />

        <ActionButtons
          result={result}
          onRestart={onRestart}
          isHistoryView={isHistoryView}
        />
      </div>
    </div>
  )
}

export default ResultPage

