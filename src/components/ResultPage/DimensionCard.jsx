import React, { memo } from 'react'

const DimensionCard = memo(function DimensionCard({ dimension }) {
  const leftPercent = dimension.left.percent
  const rightPercent = dimension.right.percent
  const dominant = dimension.dominant
  const total = dimension.totalQuestions

  return (
    <div className="dimension-card">
      <h3 className="dimension-name">
        {dimension.name} ({dimension.pair})
      </h3>

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
})

export default DimensionCard

