// pages/foodAdmin/foodAdmin.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    foodList:[],
    name:'',
    isNotData:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadItem()
  },
  loadItem(){
    var that = this
    if(app.globalData.menuname){
      console.log(app.globalData.menuname)
      db.collection('foodInfo').where({
        district: app.globalData.menuname
      })
      .get({
        success: function(res) {
          var foodli = []
          foodli = res.data
          foodli.forEach(function(item,index){
            item.select = "circle"
          })
          var time = setInterval(function(){
            that.setData({
              foodList: foodli
            })
            app.globalData.menuname = ""
            clearInterval(time)
          },100)
        }
      })
    }else{
    db.collection('foodInfo').get({
      success: function(res) {
        var foodli = []
        foodli = res.data
        foodli.forEach(function(item,index){
          item.select = "circle"
        })
        var time = setInterval(function(){
          that.setData({
            foodList: foodli
          })
          clearInterval(time)
        },100)

      }
    })
  }
  },
  toInfo(e){
    wx.navigateTo({
      url: 'foodInfo?id='+e.currentTarget.dataset.id,
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
    this.loadItem();
  },
  handleSlideDelete(e){
    var that = this
    var foodlist = that.data.foodList
    foodlist.forEach(function(item,index){
      if(item._id == e.currentTarget.dataset.id){
        if(item.select == "success"){
          item.select = "circle"
        }else{
          item.select = "success"
        }
        
      }
    })
    that.setData({
      foodList:foodlist
    })
  },
  removefood(id){
    var that = this
    db.collection('foodInfo').doc(id).remove({
      success: function(res) {
        wx.showToast({
          title: '删除成功！',
          icon: 'success',
          duration: 1200
        })
        that.loadItem()
      }
    })
  },
  deletefood(){
    var that = this
    var foodlist = that.data.foodList
    foodlist.forEach(function(item,index){
        if(item.select == "success"){
          foodlist.splice(index,1)
          that.removefood(item._id);
        }
    })
    that.setData({
      foodList:foodlist
    })
  },
  add(){
    wx.navigateTo({
      url: 'addFood',
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