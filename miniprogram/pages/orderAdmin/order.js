// pages/foodAdmin/foodAdmin.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    foodList:[],
    orderlist:[],
    name:'',
    nodata:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadItem()
  },
  loadItem(){
    var that = this
    var orderlist = []
    db.collection('order').where({
      status: "制作中",
    })
   .get({
      success: function(res) {
        if(res.data.length==0){
          that.setData({
            nodata:true
          })
        }
        orderlist = res.data
        orderlist.forEach(function(ite,index){
          var titl = ""
          ite.select = "circle"
          ite.item.forEach(function(itm,indx){
            if(indx >= ite.item.length - 1){
              titl += itm.name
            }else{
              titl += itm.name + " + "
            }
          })
          ite.title = titl
        })
        var time = setInterval(function(){
          that.setData({
            orderlist: orderlist
          })
          clearInterval(time)
        },100)
      }
    })
  },
  toInfo(e){
    wx.navigateTo({
      url: '../order/orderInfo?id='+e.currentTarget.dataset.id,
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
    this.loadItem()
  },
  handleSlideDelete(e){
    var that = this
    var list = that.data.orderlist
    list.forEach(function(item,index){
      if(item._id == e.currentTarget.dataset.id){
        if(item.select == "success"){
          item.select = "circle"
        }else{
          item.select = "success"
        }
        
      }
    })
    that.setData({
      orderlist:list
    })
  },
  cancel(){
    var that = this
    var orderlist = that.data.orderlist
    var nowMoney = 0
    var ordermoney = 0
    var id = ''
    orderlist.forEach(function(item,index){
        if(item.select == "success"){
          ordermoney = item.money
          wx.cloud.callFunction({
            // 需调用的云函数名
            name: 'cancelOrder',
            // 传给云函数的参数
            data: {
              _id: item._id,
            },
            // 成功回调
            complete: console.log
          })
          db.collection('users').where({
            _openid: item._openid,
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
              wx.showToast({
                title: '取消成功！',
                icon: 'success',
                duration: 1200
              })
              that.loadItem();
            }
         })
          // db.collection('users').doc(id).update({
          //   data: {
          //     money: nowMoney+ordermoney,
          //   },
          //   success: function(res) {
          //     console.log(res.data)
          //   }
          // })

        }
    })
    that.setData({
      orderlist:orderlist
    })
  },
  comple(){
    var that = this
    var orderlist = that.data.orderlist
    orderlist.forEach(function(item,index){
        if(item.select == "success"){
          item.status = "已完成"
          wx.cloud.callFunction({
            // 需调用的云函数名
            name: 'editStatus',
            // 传给云函数的参数
            data: {
              _id: item._id,
            },
            // 成功回调
            complete: console.log
          })
              wx.showToast({
                title: '完成订单成功！',
                icon: 'success',
                duration: 1200
              })
              that.loadItem();
          // db.collection('order').doc(item._id).update({
          //   data: {
          //     status: '已完成',
          //   },
          //   success: function(res) {
          //     wx.showToast({
          //       title: '完成订单成功！',
          //       icon: 'success',
          //       duration: 1200
          //     })
          //     that.setData({
          //       orderlist:orderlist
          //     })
          //   }
          // })
      }
    })
    that.setData({
      orderlist:orderlist
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