import React, { useMemo, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { saveTestResult } from '../utils/storage'
import './ResultPage.css'

function ResultPage({ answers, onRestart, isHistoryView = false }) {
  const resultRef = useRef(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const result = useMemo(() => {
    const scores = {
      E: 0, I: 0,
      S: 0, N: 0,
      T: 0, F: 0,
      J: 0, P: 0
    }

    answers.forEach(answer => {
      scores[answer]++
    })

    const dimensions = [
      {
        name: '能量来源',
        pair: 'E/I',
        left: { type: 'E', name: '外向 (Extraversion)', score: scores.E },
        right: { type: 'I', name: '内向 (Introversion)', score: scores.I }
      },
      {
        name: '认知方式',
        pair: 'S/N',
        left: { type: 'S', name: '实感 (Sensing)', score: scores.S },
        right: { type: 'N', name: '直觉 (Intuition)', score: scores.N }
      },
      {
        name: '判断方式',
        pair: 'T/F',
        left: { type: 'T', name: '思考 (Thinking)', score: scores.T },
        right: { type: 'F', name: '情感 (Feeling)', score: scores.F }
      },
      {
        name: '生活方式',
        pair: 'J/P',
        left: { type: 'J', name: '判断 (Judging)', score: scores.J },
        right: { type: 'P', name: '感知 (Perceiving)', score: scores.P }
      }
    ]

    const mbtiType = dimensions.map(dim => {
      const total = dim.left.score + dim.right.score
      return dim.left.score >= dim.right.score ? dim.left.type : dim.right.type
    }).join('')

    // 保存测试结果到历史（仅在非历史查看模式下）
    if (!isHistoryView) {
      saveTestResult(mbtiType, answers, scores)
    }

    return { dimensions, mbtiType, scores }
  }, [answers, isHistoryView])

  const getDimensionResult = (dimension) => {
    const total = dimension.left.score + dimension.right.score
    const leftPercent = total > 0 ? (dimension.left.score / total * 100).toFixed(1) : 50
    const rightPercent = total > 0 ? (dimension.right.score / total * 100).toFixed(1) : 50
    const dominant = dimension.left.score >= dimension.right.score ? dimension.left : dimension.right

    return { leftPercent, rightPercent, dominant, total }
  }

  // 下载结果图片
  const handleDownloadImage = async () => {
    if (!resultRef.current || isDownloading) return

    setIsDownloading(true)
    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      })

      const link = document.createElement('a')
      link.download = `MBTI测试结果-${result.mbtiType}-${new Date().getTime()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('下载图片失败:', error)
      alert('下载失败，请重试')
    } finally {
      setIsDownloading(false)
    }
  }

  // 复制结果文本
  const handleCopyText = () => {
    const text = `
我的 MBTI 性格测试结果

性格类型: ${result.mbtiType}

四个维度详情:
${result.dimensions.map(dim => {
  const { leftPercent, rightPercent, dominant } = getDimensionResult(dim)
  return `${dim.name} (${dim.pair}): ${dominant.type} - ${dominant.name} (${dominant.score}题, ${leftPercent > rightPercent ? leftPercent : rightPercent}%)`
}).join('\n')}

测试时间: ${new Date().toLocaleString('zh-CN')}
    `.trim()

    navigator.clipboard.writeText(text).then(() => {
      alert('结果已复制到剪贴板！')
    }).catch(() => {
      alert('复制失败，请手动复制')
    })
  }

  return (
    <div className="result-page">
      <div className="result-container" ref={resultRef}>
        <div className="result-header">
          <h1>测试结果</h1>
          <div className="mbti-type">
            <span className="type-label">{isHistoryView ? '性格类型' : '你的性格类型是'}</span>
            <span className="type-value">{result.mbtiType}</span>
          </div>
        </div>

        <div className="dimensions">
          {result.dimensions.map((dimension, index) => {
            const { leftPercent, rightPercent, dominant, total } = getDimensionResult(dimension)
            
            return (
              <div key={index} className="dimension-card">
                <h3 className="dimension-name">{dimension.name} ({dimension.pair})</h3>
                
                <div className="dimension-scores">
                  <div className="score-item">
                    <span className="score-type">{dimension.left.type}</span>
                    <span className="score-value">{dimension.left.score} 题</span>
                    <span className="score-percent">{leftPercent}%</span>
                  </div>
                  <div className="score-item">
                    <span className="score-type">{dimension.right.type}</span>
                    <span className="score-value">{dimension.right.score} 题</span>
                    <span className="score-percent">{rightPercent}%</span>
                  </div>
                </div>

                <div className="dimension-bar">
                  <div 
                    className="bar-left" 
                    style={{ width: `${leftPercent}%` }}
                  >
                    {leftPercent > 15 && <span>{leftPercent}%</span>}
                  </div>
                  <div 
                    className="bar-right" 
                    style={{ width: `${rightPercent}%` }}
                  >
                    {rightPercent > 15 && <span>{rightPercent}%</span>}
                  </div>
                </div>

                <div className="dimension-result">
                  <strong>{dominant.name}</strong>
                  <span className="result-detail">
                    共 {total} 题，倾向 {dominant.type} ({dominant.score} 题)
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="actions">
          <button className="restart-button" onClick={onRestart}>
            {isHistoryView ? '返回' : '重新测试'}
          </button>

          {!isHistoryView && (
            <>
              <button
                className="download-button"
                onClick={handleDownloadImage}
                disabled={isDownloading}
              >
                {isDownloading ? '生成中...' : '📥 下载结果图片'}
              </button>

              <button className="copy-button" onClick={handleCopyText}>
                📋 复制结果文本
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResultPage

