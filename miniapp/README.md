# MBTI 小程序快速开发指南

## 📱 项目概述

这是 MBTI 性格测试的微信小程序版本，使用 Taro 框架开发，可以编译为微信小程序、H5 等多端应用。

## 🚀 快速开始

### 1. 安装依赖

```bash
cd miniapp
npm install
```

### 2. 开发模式

```bash
# 微信小程序
npm run dev:weapp

# H5 网页版
npm run dev:h5
```

### 3. 生产构建

```bash
# 微信小程序
npm run build:weapp

# H5 网页版
npm run build:h5
```

### 4. 使用微信开发者工具

1. 下载并安装[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 打开工具，选择"导入项目"
3. 项目目录选择：`miniapp/dist`
4. AppID：使用测试号或你的小程序 AppID

## 📂 项目结构

```
miniapp/
├── src/
│   ├── pages/              # 页面
│   │   ├── index/          # 首页（欢迎页）✅ 已完成
│   │   ├── test/           # 测试页 ⏳ 待开发
│   │   ├── result/         # 结果页 ⏳ 待开发
│   │   └── history/        # 历史记录页 ⏳ 待开发
│   ├── utils/              # 工具函数
│   │   └── storage.js      # 数据存储 ✅ 已完成
│   ├── data/               # 数据文件
│   │   └── questions.json  # 题目数据 ✅ 已完成
│   ├── app.jsx             # 入口文件
│   ├── app.scss            # 全局样式
│   └── app.config.js       # 应用配置
├── config/                 # 构建配置
├── project.config.json     # 微信小程序配置
└── package.json
```

## 🔧 待开发页面

### 1. 测试页面 (pages/test)

**功能需求：**
- 显示当前题目和进度
- 提供 A/B 两个选项按钮
- 支持上一题/下一题导航
- 自动保存答题进度
- 完成后跳转到结果页

**参考代码：** 查看 `../../src/components/TestPage.jsx`

**关键修改：**
- 移除键盘事件监听（小程序不支持）
- 使用 `Taro.navigateTo` 跳转页面
- 使用 `Taro.showToast` 显示提示

### 2. 结果页面 (pages/result)

**功能需求：**
- 显示 MBTI 类型
- 显示四个维度的详细得分
- 提供分享功能
- 提供重新测试按钮

**参考代码：** 查看 `../../src/components/ResultPage.jsx`

**关键修改：**
- 移除 html2canvas（使用小程序截图 API）
- 移除二维码功能
- 添加小程序分享：`useShareAppMessage`

### 3. 历史记录页面 (pages/history)

**功能需求：**
- 显示所有测试记录列表
- 点击查看详细结果
- 支持删除单条记录
- 支持清空所有记录

**参考代码：** 查看 `../../src/components/HistoryPage.jsx`

**关键修改：**
- 使用 `Taro.navigateTo` 跳转到结果页
- 使用 `Taro.showModal` 确认删除操作

## 📝 开发注意事项

### 1. API 差异

| Web API | Taro API |
|---------|----------|
| `localStorage.setItem` | `Taro.setStorageSync` |
| `localStorage.getItem` | `Taro.getStorageSync` |
| `localStorage.removeItem` | `Taro.removeStorageSync` |
| `window.location.href` | `Taro.getCurrentPages()` |
| `alert()` | `Taro.showToast()` |
| `confirm()` | `Taro.showModal()` |

### 2. 样式单位

Taro 会自动将 `px` 转换为 `rpx`（小程序响应式单位）。
- 设计稿宽度：750px
- 1px = 2rpx（在 750px 设计稿下）

### 3. 组件导入

```javascript
// Web
import { useState } from 'react'

// Taro
import { useState } from 'react'
import { View, Text, Button } from '@tarojs/components'
```

### 4. 页面配置

每个页面需要 `.config.js` 文件：

```javascript
export default definePageConfig({
  navigationBarTitleText: '页面标题'
})
```

## 🎯 小程序特有功能

### 1. 分享功能

在结果页面添加：

```javascript
import { useShareAppMessage } from '@tarojs/taro'

// 在组件中
useShareAppMessage(() => {
  return {
    title: `我的MBTI类型是 ${mbtiType}`,
    path: '/pages/index/index',
    imageUrl: '分享图片URL'
  }
})
```

### 2. 页面生命周期

```javascript
componentDidShow() {
  // 页面显示时触发
}

componentDidHide() {
  // 页面隐藏时触发
}
```

## 🚀 部署流程

### 1. 构建生产版本

```bash
npm run build:weapp
```

### 2. 上传代码

1. 在微信开发者工具中打开 `dist` 目录
2. 点击右上角"上传"按钮
3. 填写版本号和项目备注
4. 上传成功

### 3. 提交审核

1. 登录[微信公众平台](https://mp.weixin.qq.com/)
2. 进入"版本管理"
3. 选择刚上传的版本，点击"提交审核"
4. 填写审核信息：
   - 功能介绍：MBTI 性格测试工具
   - 测试账号：无需登录
   - 隐私政策：不收集用户信息

### 4. 发布上线

- 审核通过后（通常 1-7 天）
- 点击"发布"按钮
- 用户即可在微信中搜索并使用

## 📋 下一步工作

1. **完成剩余页面开发**
   - [ ] pages/test/test.jsx
   - [ ] pages/result/result.jsx
   - [ ] pages/history/history.jsx

2. **测试功能**
   - [ ] 答题流程
   - [ ] 结果计算
   - [ ] 数据持久化
   - [ ] 分享功能

3. **准备素材**
   - [ ] 小程序图标 (120x120)
   - [ ] 分享图片 (500x400)
   - [ ] 功能截图（至少 3 张）

4. **填写小程序信息**
   - [ ] 在 `project.config.json` 中填入你的 AppID
   - [ ] 在微信公众平台配置小程序信息

## 🔗 相关链接

- [Taro 官方文档](https://taro-docs.jd.com/)
- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [微信公众平台](https://mp.weixin.qq.com/)

