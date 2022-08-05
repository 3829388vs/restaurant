// pages/seach/Imgs.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countPic:999,//上传图片最大数量
    showImgUrl: "", //路径拼接，一般上传返回的都是文件名，
    uploadImgUrl:'Resource/res'//图片的上传的路径
  },
        //监听组件事件，返回的结果
        myEventListener:function(e){
          console.log("上传的图片结果集合")
          console.log(e.detail.picsList)
         },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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