import React, { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { getDimensionResult } from '../../utils/mbti'

function ActionButtons({ result, onRestart, isHistoryView }) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')

  // 生成二维码
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

  // 文字换行辅助函数
  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split('')
    let line = ''
    let currentY = y

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i]
      const metrics = ctx.measureText(testLine)

      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, x, currentY)
        line = words[i]
        currentY += lineHeight
      } else {
        line = testLine
      }
    }
    ctx.fillText(line, x, currentY)
  }

  // 下载结果图片
  const handleDownloadImage = async () => {
    if (isDownloading || !qrCodeUrl) return

    setIsDownloading(true)
    try {
      // 创建 3:4 比例的 canvas (1080x1440)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      canvas.width = 1080
      canvas.height = 1440

      // 填充渐变背景
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#6366f1')
      gradient.addColorStop(1, '#8b5cf6')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 绘制白色内容区域
      const contentPadding = 60
      const contentY = 80
      const contentHeight = canvas.height - contentY - 80

      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'
      ctx.shadowBlur = 30
      ctx.shadowOffsetY = 10
      ctx.fillRect(contentPadding, contentY, canvas.width - contentPadding * 2, contentHeight)
      ctx.shadowColor = 'transparent'

      // 绘制 MBTI 类型
      ctx.fillStyle = '#1f2937'
      ctx.font = 'bold 80px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(result.mbtiType, canvas.width / 2, contentY + 140)

      // 绘制类型名称
      ctx.fillStyle = '#6366f1'
      ctx.font = '36px sans-serif'
      ctx.fillText(result.typeDescription.name, canvas.width / 2, contentY + 200)

      // 绘制 tagline
      ctx.fillStyle = '#6b7280'
      ctx.font = 'italic 24px sans-serif'
      const taglineY = contentY + 250
      wrapText(ctx, result.typeDescription.tagline, canvas.width / 2, taglineY, canvas.width - contentPadding * 4, 32)

      // 绘制维度信息
      let dimensionY = contentY + 340
      const dimensionSpacing = 120

      result.dimensions.forEach((dim, index) => {
        const y = dimensionY + index * dimensionSpacing

        // 维度名称
        ctx.fillStyle = '#374151'
        ctx.font = 'bold 28px sans-serif'
        ctx.textAlign = 'left'
        ctx.fillText(dim.name, contentPadding + 80, y)

        // 主导类型
        ctx.fillStyle = '#6366f1'
        ctx.font = 'bold 32px sans-serif'
        ctx.textAlign = 'right'
        ctx.fillText(`${dim.dominant.type} - ${dim.dominant.name}`, canvas.width - contentPadding - 80, y)

        // 百分比
        ctx.fillStyle = '#9ca3af'
        ctx.font = '24px sans-serif'
        ctx.fillText(`${dim.dominant.percent}%`, canvas.width - contentPadding - 80, y + 35)
      })

      // 绘制二维码
      const qrImage = new Image()
      qrImage.src = qrCodeUrl
      await new Promise((resolve) => {
        qrImage.onload = resolve
      })

      const qrSize = 180
      const qrX = (canvas.width - qrSize) / 2
      const qrY = canvas.height - 280

      ctx.fillStyle = '#f9fafb'
      ctx.fillRect(qrX - 15, qrY - 15, qrSize + 30, qrSize + 30)
      ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize)

      // 绘制提示文字
      ctx.fillStyle = '#6b7280'
      ctx.font = '22px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('扫码进入 MBTI 性格测试', canvas.width / 2, qrY + qrSize + 50)

      // 下载图片
      const link = document.createElement('a')
      link.download = `MBTI测试结果-${result.mbtiType}-${new Date().getTime()}.png`
      link.href = canvas.toDataURL('image/png', 0.95)
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
  )
}

export default ActionButtons

