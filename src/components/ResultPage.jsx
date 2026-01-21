import React, { useMemo, useRef, useState, useEffect } from 'react'
import html2canvas from 'html2canvas'
import QRCode from 'qrcode'
import questions from '../data/questions.json'
import { saveTestResult } from '../utils/storage'
import { calculateMBTI, getDimensionResult } from '../utils/mbti'
import { getTypeDescription } from '../constants/mbti'
import './ResultPage.css'

function ResultPage({ answers, onRestart, isHistoryView = false }) {
  const resultRef = useRef(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [activeTab, setActiveTab] = useState('strengths') // 当前激活的标签页

  // 生成二维码（用于下载图片）
  useEffect(() => {
    const generateQrCode = async () => {
      try {
        const url = window.location.origin + window.location.pathname
        const qrDataUrl = await QRCode.toDataURL(url, {
          width: 200,
          margin: 1,
          color: {
            dark: '#1f2937',
            light: '#ffffff'
          }
        })
        setQrCodeUrl(qrDataUrl)
      } catch (error) {
        console.error('生成二维码失败:', error)
      }
    }
    generateQrCode()
  }, [])

  const result = useMemo(() => {
    // 使用新的计算逻辑
    const { type, scores, dimensions } = calculateMBTI(answers, questions)

    // 保存测试结果到历史（仅在非历史查看模式下）
    if (!isHistoryView) {
      saveTestResult(type, answers, scores)
    }

    // 获取类型描述
    const typeDescription = getTypeDescription(type)

    return {
      dimensions,
      mbtiType: type,
      scores,
      typeDescription
    }
  }, [answers, isHistoryView])

  // 下载结果图片（包含二维码）
  const handleDownloadImage = async () => {
    if (!resultRef.current || isDownloading || !qrCodeUrl) return

    setIsDownloading(true)
    try {
      // 先截取结果区域
      const resultCanvas = await html2canvas(resultRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      })

      // 创建新的 canvas，包含结果和二维码
      const finalCanvas = document.createElement('canvas')
      const ctx = finalCanvas.getContext('2d')

      const qrSize = 200
      const padding = 40
      const qrPadding = 20

      finalCanvas.width = resultCanvas.width
      finalCanvas.height = resultCanvas.height + qrSize + padding * 2

      // 填充白色背景
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height)

      // 绘制结果图片
      ctx.drawImage(resultCanvas, 0, 0)

      // 绘制分隔线
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(padding, resultCanvas.height + padding / 2)
      ctx.lineTo(finalCanvas.width - padding, resultCanvas.height + padding / 2)
      ctx.stroke()

      // 绘制二维码
      const qrImage = new Image()
      qrImage.src = qrCodeUrl
      await new Promise((resolve) => {
        qrImage.onload = resolve
      })

      const qrX = (finalCanvas.width - qrSize) / 2
      const qrY = resultCanvas.height + padding

      // 绘制二维码背景
      ctx.fillStyle = '#f9fafb'
      ctx.fillRect(qrX - qrPadding, qrY - qrPadding, qrSize + qrPadding * 2, qrSize + qrPadding * 2)

      // 绘制二维码
      ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize)

      // 绘制提示文字
      ctx.fillStyle = '#6b7280'
      ctx.font = '16px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('扫码进入 MBTI 性格测试', finalCanvas.width / 2, qrY + qrSize + qrPadding + 20)

      // 下载图片
      const link = document.createElement('a')
      link.download = `MBTI测试结果-${result.mbtiType}-${new Date().getTime()}.png`
      link.href = finalCanvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('下载图片失败:', error)
      alert('下载失败，请重试')
    } finally {
      setIsDownloading(false)
    }
  }

  // 标签页配置
  const tabs = [
    { id: 'strengths', label: '💪 优势', icon: '✓' },
    { id: 'weaknesses', label: '⚡ 劣势', icon: '⚠️' },
    { id: 'workStyle', label: '💼 工作风格', icon: '💼' },
    { id: 'idealEnvironment', label: '🏡 理想环境', icon: '🌟' },
    { id: 'relationshipTips', label: '❤️ 关系建议', icon: '💡' },
    { id: 'growthSuggestions', label: '🌱 成长建议', icon: '🎯' },
    { id: 'misconceptions', label: '🔍 误解与真相', icon: '❌' },
    { id: 'compatibilityTips', label: '🤝 兼容性', icon: '🔗' }
  ]

  // 渲染标签页内容
  const renderTabContent = () => {
    const typeDesc = result.typeDescription

    switch (activeTab) {
      case 'strengths':
        return (
          <div className="tab-content-list">
            {typeDesc.strengths.map((item, index) => (
              <div key={index} className="content-item">
                <span className="item-icon">✓</span>
                <span className="item-text">{item}</span>
              </div>
            ))}
          </div>
        )

      case 'weaknesses':
        return (
          <div className="tab-content-list">
            {typeDesc.weaknesses.map((item, index) => (
              <div key={index} className="content-item">
                <span className="item-icon">⚠️</span>
                <span className="item-text">{item}</span>
              </div>
            ))}
          </div>
        )

      case 'workStyle':
        return (
          <div className="tab-content-list">
            {typeDesc.workStyle.map((item, index) => (
              <div key={index} className="content-item">
                <span className="item-icon">💼</span>
                <span className="item-text">{item}</span>
              </div>
            ))}
          </div>
        )

      case 'idealEnvironment':
        return (
          <div className="tab-content-list">
            {typeDesc.idealEnvironment.map((item, index) => (
              <div key={index} className="content-item">
                <span className="item-icon">🌟</span>
                <span className="item-text">{item}</span>
              </div>
            ))}
          </div>
        )

      case 'relationshipTips':
        return (
          <div className="tab-content-list">
            {typeDesc.relationshipTips.map((item, index) => (
              <div key={index} className="content-item">
                <span className="item-icon">💡</span>
                <span className="item-text">{item}</span>
              </div>
            ))}
          </div>
        )

      case 'growthSuggestions':
        return (
          <div className="tab-content-list">
            {typeDesc.growthSuggestions.map((item, index) => (
              <div key={index} className="content-item">
                <span className="item-icon">🎯</span>
                <span className="item-text">{item}</span>
              </div>
            ))}
          </div>
        )

      case 'misconceptions':
        return (
          <div className="tab-content-list">
            <div className="misconception-section">
              <h4 className="subsection-title">❌ 常见误解</h4>
              {typeDesc.misconceptions.map((item, index) => (
                <div key={index} className="content-item misconception">
                  <span className="item-icon">❌</span>
                  <span className="item-text">{item}</span>
                </div>
              ))}
            </div>
            <div className="truth-section">
              <h4 className="subsection-title">✅ 真相</h4>
              {typeDesc.truths.map((item, index) => (
                <div key={index} className="content-item truth">
                  <span className="item-icon">✅</span>
                  <span className="item-text">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )

      case 'compatibilityTips':
        return (
          <div className="tab-content-list">
            {typeDesc.compatibilityTips.map((item, index) => (
              <div key={index} className="content-item">
                <span className="item-icon">🔗</span>
                <span className="item-text">{item}</span>
              </div>
            ))}
          </div>
        )

      default:
        return null
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
            <span className="type-tagline">{result.typeDescription.tagline}</span>
          </div>
        </div>

        <div className="dimensions">
          {result.dimensions.map((dimension, index) => {
            // 使用新的维度数据结构（已包含 percent 信息）
            const leftPercent = dimension.left.percent
            const rightPercent = dimension.right.percent
            const dominant = dimension.dominant
            const total = dimension.totalQuestions

            return (
              <div key={index} className="dimension-card">
                <h3 className="dimension-name">{dimension.name} ({dimension.pair})</h3>

                <div className="dimension-scores">
                  <div className="score-item">
                    <span className="score-type">{dimension.left.type}</span>
                    <span className="score-value">{dimension.left.score.toFixed(1)} 分</span>
                    <span className="score-percent">{leftPercent}%</span>
                  </div>
                  <div className="score-item">
                    <span className="score-type">{dimension.right.type}</span>
                    <span className="score-value">{dimension.right.score.toFixed(1)} 分</span>
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
                    共 {total} 题，倾向 {dominant.type} ({dominant.score.toFixed(1)} 分)
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* 类型概览卡片 */}
        <div className="type-overview-card">
          <div className="overview-section">
            <div className="overview-icon">📌</div>
            <h3 className="overview-title">核心特质</h3>
            <div className="traits-container">
              {result.typeDescription.traits.map((trait, index) => (
                <span key={index} className="trait-tag">{trait}</span>
              ))}
            </div>
          </div>

          <div className="overview-section">
            <div className="overview-icon">💡</div>
            <h3 className="overview-title">核心动机</h3>
            <p className="overview-text">{result.typeDescription.motivation}</p>
          </div>

          <div className="overview-section">
            <div className="overview-icon">⚠️</div>
            <h3 className="overview-title">核心恐惧</h3>
            <p className="overview-text">{result.typeDescription.fears}</p>
          </div>
        </div>

        {/* 详细分析标签页 */}
        <div className="type-detail-tabs">
          <div className="tab-buttons">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="tab-content">
            {renderTabContent()}
          </div>
        </div>

        <div className="actions">
          <button className="restart-button" onClick={onRestart}>
            {isHistoryView ? '返回' : '重新测试'}
          </button>

          <button
            className="download-button"
            onClick={handleDownloadImage}
            disabled={isDownloading || !qrCodeUrl}
          >
            {isDownloading ? '生成中...' : '📥 下载结果图片'}
          </button>

          <button className="copy-button" onClick={handleCopyText}>
            📋 复制结果文本
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResultPage

