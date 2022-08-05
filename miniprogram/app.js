// app.js
App({
  onLaunch() {
    if (!wx.cloud) {
      console.error(" 2.2.3 或以上的基础库以使用云能力")
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    name:'',
    checkItem:null,
    checkMoney:0,
    menuname:''
  }
})
