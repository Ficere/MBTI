import React, { useState } from 'react'
import { getTestHistory, deleteTestHistory, clearAllHistory } from '../utils/storage'
import './HistoryPage.css'

function HistoryPage({ onBack, onViewResult }) {
  const [history, setHistory] = useState(getTestHistory())
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = (id, event) => {
    event.stopPropagation()
    if (window.confirm('确定要删除这条记录吗？')) {
      deleteTestHistory(id)
      setHistory(getTestHistory())
    }
  }

  const handleClearAll = () => {
    setShowConfirm(true)
  }

  const confirmClearAll = () => {
    clearAllHistory()
    setHistory([])
    setShowConfirm(false)
  }

  const getDimensionPercent = (scores, left, right) => {
    const total = scores[left] + scores[right]
    if (total === 0) return 50
    return ((scores[left] / total) * 100).toFixed(1)
  }

  return (
    <div className="history-page">
      <div className="history-container">
        <div className="history-header">
          <button className="back-button" onClick={onBack}>
            ← 返回
          </button>
          <h1>测试历史记录</h1>
          {history.length > 0 && (
            <button className="clear-all-button" onClick={handleClearAll}>
              清空所有记录
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h2>暂无测试记录</h2>
            <p>完成测试后，结果会自动保存在这里</p>
            <button className="start-test-button" onClick={onBack}>
              开始测试
            </button>
          </div>
        ) : (
          <div className="history-list">
            {history.map((record) => (
              <div
                key={record.id}
                className="history-item"
                onClick={() => onViewResult(record)}
              >
                <div className="history-item-header">
                  <div className="history-date">{record.date}</div>
                  <button
                    className="delete-button"
                    onClick={(e) => handleDelete(record.id, e)}
                    title="删除"
                  >
                    🗑️
                  </button>
                </div>

                <div className="history-mbti-type">
                  <span className="type-label">性格类型</span>
                  <span className="type-value">{record.mbtiType}</span>
                </div>

                <div className="history-dimensions">
                  <div className="mini-dimension">
                    <span className="mini-label">E/I</span>
                    <div className="mini-bar">
                      <div
                        className="mini-bar-fill"
                        style={{ width: `${getDimensionPercent(record.scores, 'E', 'I')}%` }}
                      ></div>
                    </div>
                    <span className="mini-percent">
                      {getDimensionPercent(record.scores, 'E', 'I')}%
                    </span>
                  </div>

                  <div className="mini-dimension">
                    <span className="mini-label">S/N</span>
                    <div className="mini-bar">
                      <div
                        className="mini-bar-fill"
                        style={{ width: `${getDimensionPercent(record.scores, 'S', 'N')}%` }}
                      ></div>
                    </div>
                    <span className="mini-percent">
                      {getDimensionPercent(record.scores, 'S', 'N')}%
                    </span>
                  </div>

                  <div className="mini-dimension">
                    <span className="mini-label">T/F</span>
                    <div className="mini-bar">
                      <div
                        className="mini-bar-fill"
                        style={{ width: `${getDimensionPercent(record.scores, 'T', 'F')}%` }}
                      ></div>
                    </div>
                    <span className="mini-percent">
                      {getDimensionPercent(record.scores, 'T', 'F')}%
                    </span>
                  </div>

                  <div className="mini-dimension">
                    <span className="mini-label">J/P</span>
                    <div className="mini-bar">
                      <div
                        className="mini-bar-fill"
                        style={{ width: `${getDimensionPercent(record.scores, 'J', 'P')}%` }}
                      ></div>
                    </div>
                    <span className="mini-percent">
                      {getDimensionPercent(record.scores, 'J', 'P')}%
                    </span>
                  </div>
                </div>

                <div className="view-detail-hint">点击查看详细结果 →</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="confirm-modal" onClick={() => setShowConfirm(false)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>确认清空</h3>
            <p>确定要清空所有历史记录吗？此操作不可恢复。</p>
            <div className="confirm-buttons">
              <button className="cancel-button" onClick={() => setShowConfirm(false)}>
                取消
              </button>
              <button className="confirm-button" onClick={confirmClearAll}>
                确定清空
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HistoryPage

