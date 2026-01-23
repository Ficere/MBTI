import React, { useState, useEffect } from 'react'
import { getAllTypeDescriptions } from '../constants/mbti'
import './TypeBrowserPage.css'

function TypeBrowserPage({ onBack }) {
  const [selectedType, setSelectedType] = useState(null)
  const [activeTab, setActiveTab] = useState('strengths')
  const [typeDescriptions, setTypeDescriptions] = useState(null)

  // 异步加载所有类型描述
  useEffect(() => {
    async function loadTypes() {
      const descriptions = await getAllTypeDescriptions()
      setTypeDescriptions(descriptions)
    }
    loadTypes()
  }, [])

  // 所有 MBTI 类型（按 4x4 网格排列）
  const allTypes = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
  ]

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
    if (!selectedType || !typeDescriptions) return null
    const typeDesc = typeDescriptions[selectedType]

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
          <div className="tab-content-comparison">
            <div className="comparison-column misconception-column">
              <h4>❌ 常见误解</h4>
              {typeDesc.misconceptions.map((item, index) => (
                <div key={index} className="comparison-item misconception-item">
                  {item}
                </div>
              ))}
            </div>
            <div className="comparison-column truth-column">
              <h4>✓ 真实情况</h4>
              {typeDesc.truths.map((item, index) => (
                <div key={index} className="comparison-item truth-item">
                  {item}
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

  // 加载中状态
  if (!typeDescriptions) {
    return (
      <div className="type-browser-page">
        <div className="type-browser-container">
          <div className="browser-header">
            <button className="back-button" onClick={onBack}>
              ← 返回
            </button>
            <h1>MBTI 类型浏览</h1>
            <div className="header-spacer"></div>
          </div>
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>正在加载类型信息...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="type-browser-page">
      <div className="type-browser-container">
        <div className="browser-header">
          <button className="back-button" onClick={onBack}>
            ← 返回
          </button>
          <h1>MBTI 类型浏览</h1>
          <div className="header-spacer"></div>
        </div>

        {!selectedType ? (
          // 类型网格视图
          <div className="type-grid">
            {allTypes.map(type => {
              const typeDesc = typeDescriptions[type]
              return (
                <div
                  key={type}
                  className="type-card"
                  onClick={() => {
                    setSelectedType(type)
                    setActiveTab('strengths')
                  }}
                >
                  <div className="type-card-header">
                    <h2 className="type-code">{type}</h2>
                    <p className="type-name">{typeDesc.name}</p>
                  </div>
                  <p className="type-tagline">{typeDesc.tagline}</p>
                  <div className="type-traits">
                    {typeDesc.traits.slice(0, 3).map((trait, index) => (
                      <span key={index} className="trait-tag">{trait}</span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          // 类型详情视图
          <div className="type-detail-view">
            <button className="close-detail-button" onClick={() => setSelectedType(null)}>
              ← 返回列表
            </button>

            <div className="type-detail-header">
              <h2 className="detail-type-code">{selectedType}</h2>
              <p className="detail-type-name">{typeDescriptions[selectedType].name}</p>
              <p className="detail-type-tagline">{typeDescriptions[selectedType].tagline}</p>

              <div className="detail-type-traits">
                {typeDescriptions[selectedType].traits.map((trait, index) => (
                  <span key={index} className="detail-trait-tag">{trait}</span>
                ))}
              </div>

              <div className="type-overview-section">
                <div className="overview-item">
                  <h4>💡 核心动机</h4>
                  <p>{typeDescriptions[selectedType].motivation}</p>
                </div>
                <div className="overview-item">
                  <h4>😰 核心恐惧</h4>
                  <p>{typeDescriptions[selectedType].fears}</p>
                </div>
              </div>
            </div>

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
          </div>
        )}
      </div>
    </div>
  )
}

export default TypeBrowserPage

