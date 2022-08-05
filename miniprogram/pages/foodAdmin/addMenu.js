// pages/foodAdmin/foodAdmin.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    foodList:[],
    menulist:[],
    name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadItem();
  },
  loadItem(){
    var that = this
    db.collection('menu').get({
      success: function(res) {
        var foodli = []
        foodli = res.data
        foodli.forEach(function(item,index){
          item.select = "circle"
        })
        var time = setInterval(function(){
          that.setData({
            menulist: foodli
          })
          clearInterval(time)
        },100)

      }
    })
  },
  toInfo(e){
    app.globalData.menuname = e.currentTarget.dataset.name
    wx.navigateTo({
      url: 'foodAdmin'
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
    var menulist = that.data.menulist
    menulist.forEach(function(item,index){
      if(item._id == e.currentTarget.dataset.id){
        if(item.select == "success"){
          item.select = "circle"
        }else{
          item.select = "success"
        }
        
      }
    })
    that.setData({
      menulist:menulist
    })
  },
  removefood(id){
    db.collection('menu').doc(id).remove({
      success: function(res) {
        var that = this
        wx.showToast({
          title: '删除成功！',
          icon: 'success',
          duration: 1200
        })
        that.loadItem();
      }
    })
  },
  deletefood(){
    var that = this
    var menulist = that.data.menulist
    menulist.forEach(function(item,index){
        if(item.select == "success"){
          menulist.splice(index,1)
          that.removefood(item._id);
        }
    })
    that.setData({
      menulist:menulist
    })
  },
  add(){
    var that = this
    wx.showModal({
      title: '请输入菜系名称',
      editable: true,
      placeholderText:'请输入',
      success (res) {
        if (res.confirm) {
          console.log(res.content)
          that.setData({
            name: res.content
          })
          db.collection('menu').add({ // .add() 在集合上新增记录
            data: {
              name: that.data.name
            },
            success: res => {
              wx.showToast({
                title: '添加成功！',
                icon: 'success',
                duration: 1200
              })
              that.loadItem();
            }
          })
        }
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