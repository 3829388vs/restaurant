// pages/list/list.js
const app = getApp()
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
      imgUrls: [
        {
          link: '../nanbei/nanbei?item=南北特色',
          url: 'https://636c-cloud1-2g62kh6y05adcf2a-1309263676.tcb.qcloud.la/huadanf.jpeg?sign=a478b9c472acaaad8824e34d65a4ac72&t=1646391280'
        }, {
          link: '../nanbei/nanbei?item=扒饭套餐',
          url: 'https://636c-cloud1-2g62kh6y05adcf2a-1309263676.tcb.qcloud.la/jipafan.jpeg?sign=61593aa11aa0d2bf941177b9c2c40b35&t=1646391467'
        }, {
          link: '../nanbei/nanbei?item=烧腊套餐',
          url: 'https://636c-cloud1-2g62kh6y05adcf2a-1309263676.tcb.qcloud.la/luyafan.jpeg?sign=c610b924527ec1d2fe6f0155def5b66d&t=1646391484'
        }
      ],
      indicatorDots: true,  //小点
      autoplay: true,  //是否自动轮播
      interval: 3000,  //间隔时间
      duration: 3000,  //滑动时间
      text:'美味鸡扒饭',
      left:100,
      name:'',
      notice:'',
      isAdmin:false,
      menuList:[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var that = this
      db.collection('common').where({
        _id: "807102f6623d7ef001d20f51169973d6"
      })
      .get({
        success: function(res) {
          console.log(res.data[0].notice)
          that.setData({
            notice: res.data[0].notice
          })
          that.noticeAnimation()
        }
      })
      if(options.id == 'admin'){
        this.setData({
          isAdmin: true
        })
        app.globalData.name = 'admin'
      }else{
        var name = app.globalData.userInfo.name
        this.setData({
          name: name
        })
      }
      var that = this
      db.collection('menu').get({
        success: function(res) {
          that.setData({
            menuList: res.data
          })
        }
      })
    },
    caiping(){
      wx.navigateTo({
        url: '../foodAdmin/foodAdmin',
      })
    },
    caixi(){
      wx.navigateTo({
        url: '../foodAdmin/addMenu',
      })
    },
    noticeAnimation(){
      var that = this
      var left = 700
      var time = setInterval(() => {
        if(left<-900){
          left = 700
        }else{
        left -= 2
        that.setData({
          left: left
        })
      }
      }, 20);
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
      var name = app.globalData.userInfo.name
      this.setData({
        name: name
      })
      var that = this
      db.collection('common').where({
        _id: "807102f6623d7ef001d20f51169973d6"
      })
      .get({
        success: function(res) {
          console.log(res.data[0].notice)
          that.setData({
            notice: res.data[0].notice
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

    },

    changeIndex: function(index){
      if(index.detail.current == 0){
        this.setData({
          text:'美味滑蛋饭'
        })
      }
      if(index.detail.current == 1){
        this.setData({
          text:'香煎鸡扒饭'
        })
      }
      if(index.detail.current == 2){
        this.setData({
          text:'烧鸭饭'
        })
      }
    },

    gonanbei: function (item) {
      console.log(item)
        wx.navigateTo({
          url: '../nanbei/nanbei?item='+item.currentTarget.dataset.itm
        })
    },

    dingdan:function(){
      wx.navigateTo({
        url: '../orderAdmin/order'
      })
    },
    wancheng:function(){
      wx.navigateTo({
        url: '../orderAdmin/compleorder'
      })
      
    }

    
})