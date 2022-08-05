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
    orderInfo:{},
    method:'',
    memo:'',
    phone:'',
    address:'',
    name:'',
    orderTime:'',
    status:'',
    isUser:false,
    value: [9999, 1, 1],
    showType:false,
    types:['堂食','打包'],
    type:'',
    userInfo:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadstatus(options)
  },
  loadstatus(options){
    var that = this
    console.log(options)
    db.collection('order').where({
      _id: options.id,
    })
    .get({
      success: function(res) {
        console.log(res)
        that.setData({
          orderInfo:res.data[0]
        })
        that.setData({
          address:res.data[0].address,
          name:res.data[0].username,
          type:res.data[0].method,
          orderTime:res.data[0].time,
          phone:res.data[0].phone,
          totalMoney:res.data[0].money,
          memo:res.data[0].memo,
          checkItem:res.data[0].item,
          status:res.data[0].status,
        })
        if(app.globalData.name != 'admin'){
          if(that.data.status == "制作中"){
            that.setData({
              isUser:true
            })
          }
        }
      }
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
    this.setData({
      showType:false
    })
  },
  bindChange2(e) {
    const val = e.detail.value
    this.setData({
      type: this.data.types[val],
    })
  },
  showType(){
    this.setData({
      showType: !this.data.showType,
    }) 
  },
  sure(){
    this.setData({
      type: this.data.type,
      showType: false,
    }) 
    if(!this.data.type){
      this.setData({
        type: '打包',
        showType: false,
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

  },
  cancelOrder(){
    var that = this
    console.log(that.data.orderTime.substring(that.data.orderTime.length-8,that.data.orderTime.length-6))
    wx.showModal({
      title: '提示',
      content: '确定取消订单吗？（两分钟后将无法取消）',
      success (res) {
        if (res.confirm) {
    var min = parseInt(that.data.orderTime.substring(that.data.orderTime.length-5,that.data.orderTime.length-3)) //获取订单时间的分钟数
    var h = parseInt(that.data.orderTime.substring(that.data.orderTime.length-8,that.data.orderTime.length-6)) //获取订单时间的小时数
    var date = new Date()
    var hour = date.getHours()
    var minute = date.getMinutes()
    console.log(hour+"---"+minute)
    if(h<parseInt(hour)){
      wx.showToast({
        title: '订单已超2分钟',
        icon: 'error',
        duration: 1200
      })
      return
    }else{
      if(h == parseInt(hour) && min+2 <parseInt(minute)){
        wx.showToast({
          title: '订单已超2分钟',
          icon: 'error',
          duration: 1200
        })
        return
      }else{
        that.cancel()
        wx.showToast({
          title: '取消成功！',
          icon: 'success',
          duration: 1200
        })
      } 
    }
  } else if (res.cancel) {
  }
}
})
  },
  cancel(){
    console.log("----"+this.data.orderInfo._id)
    var that = this
    var nowMoney = 0
    var ordermoney = 0
    var id = ''
          ordermoney = that.data.totalMoney
          wx.cloud.callFunction({
            // 需调用的云函数名
            name: 'cancelOrder',
            // 传给云函数的参数
            data: {
              _id: that.data.orderInfo._id,
            },
            // 成功回调
            complete: console.log
          })
          db.collection('users').where({
            _openid: app.globalData.userInfo._openid,
          })
         .get({
            success: function(res) {
              nowMoney = res.data[0].money
              id = res.data[0]._id
              wx.cloud.callFunction({
                // 需调用的云函数名
                name: 'returnMoney',
                // 传给云函数的参数
                data: {
                  _id: id,
                  money:parseInt(nowMoney) + parseInt(ordermoney)
                },
                // 成功回调
                complete: console.log
              })
              wx.navigateBack({
                delta: 1,
              })
            }
         })
  },
  checkout(){
    var that = this
    db.collection('order').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        username: that.data.userInfo.name,
        money:that.data.totalMoney,
        name:that.data.userName,
        phone:that.data.userInfo.phone,
        address:that.data.address,
        status:'制作中',
        item:that.data.checkItem,
        memo:that.data.memo,
        method:that.data.type,
      },
      success: function(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
        wx.showToast({
          title: '您的订单已提交',
          icon: 'success',
          duration: 1200
        })
        var timeout = setInterval(() => {
          wx.switchTab({
            url: '../order/order'
         })
         clearInterval(timeout);
        }, 1200);

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