// pages/foodAdmin/foodInfo.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    foodInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    var that = this
    db.collection('foodInfo').where({
      _id: options.id
    })
    .get({
      success: function(res) {
        console.log(res.data)
        that.setData({
          foodInfo:res.data[0]
        })
      }
    })
  },
  save(){
    var that = this
    db.collection('foodInfo').doc(that.data.foodInfo._id).update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        name: that.data.foodInfo.name,
        district: that.data.foodInfo.district,
        price: that.data.foodInfo.price,
        detail: that.data.foodInfo.detail,
      },
      success: function(res) {
        wx.showToast({
          title: '保存成功！',
          icon: 'success',
          duration: 1200
        })
      }
    })
  },
  changeName (e){
    this.data.foodInfo.name = e.detail.value;
  },
  changeDistrict (e){
    this.data.foodInfo.district = e.detail.value;
  },
  changePrice (e){
    this.data.foodInfo.price = e.detail.value;
  },
  changeDetail (e){
    this.data.foodInfo.detail = e.detail.value;
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