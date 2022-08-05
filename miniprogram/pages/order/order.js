// pages/order/order.js
const app = getApp()
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
    slideProductList: [],
    count: 0,
    nodata:false,
    userInfo:[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
      var that = this
      var orderList = []
      //搜索数据库是否相同用户，如无则注册
      db.collection('order').where({
        username: that.data.userInfo.name,
      })
      .get({
        success: function(res) {
          console.log(res.data)
          if(res.data.length==0){
            that.setData({
              nodata:true
            })
          }
          orderList = res.data
          orderList.forEach(function(ite,index){
            var titl = ""
            ite.item.forEach(function(itm,indx){
              if(indx >= ite.item.length - 1){
                titl += itm.name
              }else{
                titl += itm.name + " + "
              }
            })
            ite.title = titl
          })
          that.setData({
            slideProductList:orderList
          })
        }
      })
    },
    toInfo(e){
      wx.navigateTo({
        url: 'orderInfo?id='+e.currentTarget.dataset.indx,
      })
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
        userInfo: app.globalData.userInfo
      })
      var that = this
      var orderList = []
      //搜索数据库是否相同用户，如无则注册
      db.collection('order').where({
        username: that.data.userInfo.name,
      })
      .get({
        success: function(res) {
          console.log(res.data)
          if(res.data.length==0){
            that.setData({
              nodata:true
            })
          }else{
            that.setData({
              nodata:false
            })
          }
          orderList = res.data
          orderList.forEach(function(ite,index){
            var titl = ""
            ite.item.forEach(function(itm,indx){
              if(indx >= ite.item.length - 1){
                titl += itm.name
              }else{
                titl += itm.name + " + "
              }
            })
            ite.title = titl
          })
          that.setData({
            slideProductList:orderList
          })
        }
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