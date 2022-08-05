// pages/me.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{
      username:'',
      name:''
    },
    isAdmin:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.name == 'admin'){
      this.setData({
        isAdmin: true,
      })
    }else{
      console.log(app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
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
    this.getUserInfo()
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
  getUserInfo:function(){
    var that = this
    db.collection('users').where({
      username: that.data.userInfo.username,
    })
    .get({
      success: function(res) {
        // res.data 是包含以上定义的两条记录的数组
        console.log(res.data)
        that.setData({
          userInfo: res.data[0]
        })
        app.globalData.userInfo = res.data[0]
      }
    })
  },

  getNowMoney:function() {
    var that = this
    db.collection('users').where({
      _id: that.data.userInfo._id,
    })
    .get({
      success: function(res) {
        // res.data 是包含以上定义的两条记录的数组
        console.log(res.data)
        that.setData({
          userInfo: res.data[0]
        })
        app.globalData.userInfo = res.data[0]
      }
    })
  },
  editNotice(){
    var that = this
    wx.showModal({
      title: '请输入公告内容',
      editable: true,
      placeholderText:'请输入内容',
      success (res) {
        if (res.confirm) {
          console.log(res.content)
          db.collection('common').doc('807102f6623d7ef001d20f51169973d6').update({
            // data 传入需要局部更新的数据
            data: {
              // 表示将 done 字段置为 true
              notice: res.content
            },
            success: function(res) {
              wx.showToast({
                title: '修改成功！',
                icon: 'success',
                duration: 1200
              })     
            }
          })
        }
      }
    })
  },

  editInfo:function(){
    wx.navigateTo({
      url: 'editInfo'
    })
  },
  charge:function(){
    var that = this
    wx.showModal({
      title: '账户充值',
      editable: true,
      placeholderText:'请输入金额',
      confirmText:'充值',
      success (res) {
        if (res.confirm) {
          var cont = parseInt(res.content) 
          if(isNaN(cont)|| cont == '' || cont<0 || cont>100000){
            wx.showToast({
              title: '输入正确的金额！',
              icon: 'error',
              duration: 1000
            })
          }else{
            if(cont>100){
              wx.showToast({
                title: '请小于100！',
                icon: 'error',
                duration: 1000
              })
              return
            }
            var nowMoney = parseInt(cont + parseInt(that.data.userInfo.money))
            db.collection('users').doc(that.data.userInfo._id).update({
              data: {
                money: nowMoney,
              },
              success: function(res) {
                wx.showToast({
                  title: '充值成功！',
                  icon: 'success',
                  duration: 1200
                })     
                that.getNowMoney();
                console.log(res.data)
              }
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  exit:function(){
    wx.reLaunch({
      url: '../index/index'
   })
  },
  adminLogin:function(){
    wx.showModal({
      title: '提示',
      content: '确定要登录管理员账户吗？',
      success (res) {
        if (res.confirm) {
          app.globalData.userInfo = null
          app.globalData.name = ''
          wx.navigateTo({
            url: '../index/index?id=admin'
          })
        } else if (res.cancel) {
          
        }
      }
    })
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