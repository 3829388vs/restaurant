// pages/me/editInfo.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    console.log(app.globalData.userInfo)
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

  },

  edit: function(){
    var that = this
    console.log(that.data.userInfo)
    db.collection('users').doc(that.data.userInfo._id).update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        name: that.data.userInfo.name,
        phone: that.data.userInfo.phone
      },
      success: function(res) {
        wx.showToast({
          title: '修改成功！',
          icon: 'success',
          duration: 1200
        })
      var back = setInterval(function(){
          wx.navigateBack({
            delta: 1
          })
          clearInterval(back)
        }, 1200)


        console.log(res.data)
      }
    })
  },
  changeName (e){
    this.data.userInfo.name = e.detail.value;
  },
  changePhone (e){
    this.data.userInfo.phone = e.detail.value;
  },
  back (){
    wx.navigateBack({
      delta: 1,
    })
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