import React from 'react'

function TypeHeader({ mbtiType, tagline, isHistoryView }) {
  return (
    <div className="result-header">
      <h1>测试结果</h1>
      <div className="mbti-type">
        <span className="type-label">
          {isHistoryView ? '性格类型' : '你的性格类型是'}
        </span>
        <span className="type-value">{mbtiType}</span>
        <span className="result-type-tagline">{tagline}</span>
      </div>
    </div>
  )
}

export default TypeHeader

