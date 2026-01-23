import React, { useState, useEffect } from 'react'
import questions from '../data/questions.json'
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

function ResultPage({ answers, onRestart, isHistoryView = false }) {
  const [result, setResult] = useState(null)

  // 计算测试结果并异步加载类型描述
  useEffect(() => {
    async function loadResult() {
      const { type, scores, dimensions } = calculateMBTI(answers, questions)

      // 保存测试结果到历史（仅在非历史查看模式下）
      if (!isHistoryView) {
        saveTestResult(type, answers, scores)
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
  }, [answers, isHistoryView])

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

