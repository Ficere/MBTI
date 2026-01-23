import React, { useState } from 'react'

const TABS = [
  { id: 'strengths', label: '💪 优势', icon: '✓' },
  { id: 'weaknesses', label: '⚡ 劣势', icon: '⚠️' },
  { id: 'workStyle', label: '💼 工作风格', icon: '💼' },
  { id: 'idealEnvironment', label: '🏡 理想环境', icon: '🌟' },
  { id: 'relationshipTips', label: '❤️ 关系建议', icon: '💡' },
  { id: 'growthSuggestions', label: '🌱 成长建议', icon: '🎯' },
  { id: 'misconceptions', label: '🔍 误解与真相', icon: '❌' },
  { id: 'compatibilityTips', label: '🤝 兼容性', icon: '🔗' }
]

function TypeDetailTabs({ typeDescription }) {
  const [activeTab, setActiveTab] = useState('strengths')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'strengths':
        return (
          <div className="tab-content-list">
            {typeDescription.strengths.map((item, index) => (
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
            {typeDescription.weaknesses.map((item, index) => (
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
            {typeDescription.workStyle.map((item, index) => (
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
            {typeDescription.idealEnvironment.map((item, index) => (
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
            {typeDescription.relationshipTips.map((item, index) => (
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
            {typeDescription.growthSuggestions.map((item, index) => (
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
              {typeDescription.misconceptions.map((item, index) => (
                <div key={index} className="content-item misconception">
                  <span className="item-icon">❌</span>
                  <span className="item-text">{item}</span>
                </div>
              ))}
            </div>
            <div className="truth-section">
              <h4 className="subsection-title">✅ 真相</h4>
              {typeDescription.truths.map((item, index) => (
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
            {typeDescription.compatibilityTips.map((item, index) => (
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

  return (
    <div className="type-detail-tabs">
      <div className="tab-buttons">
        {TABS.map(tab => (
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
  )
}

export default TypeDetailTabs

