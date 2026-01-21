import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { loadProgress, getTestHistory } from '../../utils/storage'
import './index.scss'

export default class Index extends Component {
  state = {
    hasProgress: false,
    hasHistory: false,
    progressCount: 0,
    historyCount: 0
  }

  componentDidShow() {
    this.checkStatus()
  }

  checkStatus = () => {
    const progress = loadProgress()
    const history = getTestHistory()
    
    this.setState({
      hasProgress: !!progress,
      hasHistory: history.length > 0,
      progressCount: progress ? progress.answers.length : 0,
      historyCount: history.length
    })
  }

  handleStartTest = () => {
    Taro.navigateTo({
      url: '/pages/test/test'
    })
  }

  handleContinueTest = () => {
    Taro.navigateTo({
      url: '/pages/test/test?continue=true'
    })
  }

  handleShowHistory = () => {
    Taro.switchTab({
      url: '/pages/history/history'
    })
  }

  render() {
    const { hasProgress, hasHistory, progressCount, historyCount } = this.state

    return (
      <View className='index-page'>
        <View className='header'>
          <Text className='title'>MBTI 性格测试</Text>
          <Text className='subtitle'>探索你的性格类型</Text>
        </View>

        <View className='content'>
          <View className='intro'>
            <Text className='intro-title'>什么是 MBTI？</Text>
            <Text className='intro-text'>
              MBTI 是一种性格分类工具，通过四个维度将人们分为 16 种性格类型。
            </Text>
          </View>

          <View className='dimensions'>
            <View className='dimension-item'>
              <Text className='dimension-label'>E/I</Text>
              <Text className='dimension-name'>外向 / 内向</Text>
            </View>
            <View className='dimension-item'>
              <Text className='dimension-label'>S/N</Text>
              <Text className='dimension-name'>实感 / 直觉</Text>
            </View>
            <View className='dimension-item'>
              <Text className='dimension-label'>T/F</Text>
              <Text className='dimension-name'>思考 / 情感</Text>
            </View>
            <View className='dimension-item'>
              <Text className='dimension-label'>J/P</Text>
              <Text className='dimension-name'>判断 / 感知</Text>
            </View>
          </View>

          <View className='info'>
            <View className='info-item'>
              <Text className='info-icon'>📝</Text>
              <Text className='info-text'>共 93 道题目</Text>
            </View>
            <View className='info-item'>
              <Text className='info-icon'>⏱️</Text>
              <Text className='info-text'>预计 10-15 分钟</Text>
            </View>
            <View className='info-item'>
              <Text className='info-icon'>💡</Text>
              <Text className='info-text'>凭直觉选择，不要过度思考</Text>
            </View>
          </View>

          <View className='actions'>
            {hasProgress && (
              <Button className='continue-btn' onClick={this.handleContinueTest}>
                继续上次测试 ({progressCount} 题)
              </Button>
            )}
            
            <Button className='start-btn' onClick={this.handleStartTest}>
              {hasProgress ? '重新开始测试' : '开始测试'}
            </Button>

            {hasHistory && (
              <Button className='history-btn' onClick={this.handleShowHistory}>
                查看历史记录 ({historyCount})
              </Button>
            )}
          </View>
        </View>

        <View className='footer'>
          <Text className='footer-text'>本测试结果仅供参考，不作为专业心理评估依据</Text>
        </View>
      </View>
    )
  }
}

