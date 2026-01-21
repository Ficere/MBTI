export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/test/test',
    'pages/result/result',
    'pages/history/history'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#6366f1',
    navigationBarTitleText: 'MBTI 性格测试',
    navigationBarTextStyle: 'white',
    backgroundColor: '#f8f9fa'
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#6366f1',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '测试',
        iconPath: 'assets/test.png',
        selectedIconPath: 'assets/test-active.png'
      },
      {
        pagePath: 'pages/history/history',
        text: '历史',
        iconPath: 'assets/history.png',
        selectedIconPath: 'assets/history-active.png'
      }
    ]
  }
})

