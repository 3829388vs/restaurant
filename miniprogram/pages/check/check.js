// pages/check/check.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkItem:[],
    totalMoney:0,
    method:'',
    memo:'',
    phone:'',
    address:'',
    name:'',
    value: [9999, 1, 1],
    showType:false,
    types:['打包','堂食'],
    type:'堂食',
    userInfo:[],
    lastType:'',
    checkTime:false,
    showPayPwdInput: false,  //是否展示密码输入层
    pwdVal: '',  //输入的密码
    payFocus: true, //文本框焦点
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      checkItem:app.globalData.checkItem
    })
    this.setData({
      name:app.globalData.userInfo.name,
      phone:app.globalData.userInfo.phone,
      totalMoney:app.globalData.checkMoney,
      userInfo: app.globalData.userInfo
    })
  },
  inputedit (e){
    this.setData({
      memo: e.detail.value,
    }) 
  },
  editInfo(){
    wx.navigateTo({
      url: '../me/editInfo',
    })
  },
  closeType(){
    var that = this
    that.setData({
      type: that.data.lastType,
    }) 
    that.setData({
      showType:false
    })
  },
  bindChange2(e) {
    var that = this
    const val = e.detail.value
    that.setData({
      type: that.data.types[val],
    })
    console.log(that.data.type)
  },
  showType(){
    var that = this
    that.setData({
      lastType: that.data.type
    }) 
    that.setData({
      showType: !that.data.showType,
    }) 
    that.setData({
        type: '堂食',
      }) 
  },
  sure(){
    this.setData({
      showType: false,
    }) 
    // if(this.data.type == '打包'){
    //   this.setData({
    //     type: '打包',
    //     showType: false,
    //   }) 
    // }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      checkItem:app.globalData.checkItem
    })
    this.setData({
      name:app.globalData.userInfo.name,
      phone:app.globalData.userInfo.phone,
      totalMoney:app.globalData.checkMoney,
      userInfo: app.globalData.userInfo
    })
  },
  checkout(){
    var that = this
    if(that.data.userInfo.money < that.data.totalMoney){
      wx.showToast({
        title: '余额不足！',
        icon: 'error',
        duration: 1200
      })
      return
    }else{
      that.showInputLayer();
  }
  },

      /**
   * 显示支付密码输入层
   */
  showInputLayer: function(){
    this.setData({ showPayPwdInput: true, payFocus: true });
  },
  /**
   * 隐藏支付密码输入层
   */
  hidePayLayer: function(){
    var that = this
    var val = that.data.pwdVal;
    that.setData({ showPayPwdInput: false, payFocus: false, pwdVal: '' }, function(){
      if(val == '000000'){
        if(that.data.checkTime){
          return
        }
      var time = that.getNowTime()
      db.collection('order').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          username: that.data.userInfo.name,
          money:that.data.totalMoney,
          name:that.data.userName,
          phone:that.data.userInfo.phone,
          address:that.data.address,
          status:'制作中',
          time:time,
          item:that.data.checkItem,
          memo:that.data.memo,
          method:that.data.type,
        },
        success: function(res) {
          var usermoney = that.data.userInfo
          usermoney.money -= that.data.totalMoney
          that.setData({
            userInfo: usermoney,
            checkTime: true
          })
          db.collection('users').doc(that.data.userInfo._id).update({
            data: {
              money: that.data.userInfo.money
            },
            success: function(res) {
              console.log(res)
              wx.showToast({
                title: '您的订单已提交',
                icon: 'success',
                duration: 1000
              })
              var timeout = setInterval(() => {
                wx.switchTab({
                  url: '../order/order'
               })
               clearInterval(timeout);
              }, 800);
            }
            })
      }
      })
      }else{
        wx.showToast({
          title: '密码错误！',
          icon: 'error',
          duration: 1000
        })
      }

    });
  },
  /**
   * 获取焦点
   */
  getFocus: function(){
    this.setData({ payFocus: true });
  },
  /**
   * 输入密码监听
   */
  inputPwd: function(e){
    var that = this
    that.setData({ pwdVal: e.detail.value });
      if (e.detail.value.length >= 6){
        if(e.detail.value == '000000'){
          that.hidePayLayer();
        }else{
          wx.showToast({
            title: '密码错误！',
            icon: 'error',
            duration: 1000
          })
          that.setData({ 
            showPayPwdInput: false, payFocus: false, pwdVal: ''
          })
          that.setData({ 
            showPayPwdInput: true, payFocus: true, pwdVal: ''
          })
        }
        
      }
  },


  getNowTime(){
    var date = new Date()
    var date2 = date.getFullYear() + '.' + (parseInt(date.getMonth())+1) + '.' + date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var seconds = date.getSeconds()
    if(hour.toString().length<=1){
      hour = '0'+hour
    }
    if(minute.toString().length<=1){
      minute = '0'+minute
    }
    if(seconds.toString().length<=1){
      seconds = '0'+seconds
    }
    var time = hour + ':' + minute+':' + seconds
    return date2 + "  " + time;
  },
 
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})