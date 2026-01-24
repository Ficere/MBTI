import React, { memo } from 'react'

const TypeOverview = memo(function TypeOverview({ typeDescription }) {
  return (
    <div className="type-overview-card">
      <div className="overview-section">
        <div className="overview-icon">📌</div>
        <h3 className="overview-title">核心特质</h3>
        <div className="traits-container">
          {typeDescription.traits.map((trait, index) => (
            <span key={index} className="result-trait-tag">{trait}</span>
          ))}
        </div>
      </div>

      <div className="overview-section">
        <div className="overview-icon">💡</div>
        <h3 className="overview-title">核心动机</h3>
        <p className="overview-text">{typeDescription.motivation}</p>
      </div>

      <div className="overview-section">
        <div className="overview-icon">⚠️</div>
        <h3 className="overview-title">核心恐惧</h3>
        <p className="overview-text">{typeDescription.fears}</p>
      </div>
    </div>
  )
})

export default TypeOverview

