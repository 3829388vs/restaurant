// pages/nanbei/nanbei.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsNum:'',
    title:'',
    userInfo: {},
    selected:[],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    foodList:[],
    nodata:false,
    // slideProductList: [
    //   {
    //     id:1,
    //     name: '鸡肉炒饭',
    //     url: "/pages/index/img/favicon.png",
    //     price: "9",
    //     select: "circle",
    //     num: "1",
    //   },
    //   {
    //     id: 2,
    //     name: "鸡丁炒饭",
    //     url: "/pages/index/img/favicon.png",
    //     price: "10",
    //     select: "circle",
    //     num: "1",
    //   },
    //   {
    //     id: 3,
    //     name: "扬州炒饭",
    //     url: "/pages/index/img/favicon.png",
    //     price: "10",
    //     select: "circle",
    //     num: "1",
    //   },
    //   {
    //     id: 4,
    //     name: "牛肉炒饭",
    //     url: "/pages/index/img/favicon.png",
    //     price: "12",
    //     select: "circle",
    //     num: "1",
    //   },
    //   {
    //     id: 5,
    //     name: "三鲜炒饭",
    //     url: "/pages/index/img/favicon.png",
    //     price: "12",
    //     select: "circle",
    //     num: "1",
    //   },
 
    // ],
    allSelect: "circle",
    cartList:[],
    num: 0,
    numb:0,
    count: 0,
    lastX: 0,
    lastY: 0,
    list:[],
    showCart:false,
    text: "没有滑动",
  },

  change: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var select = e.currentTarget.dataset.select

    if (select == "circle") {
      var stype = "success"
    } else {
      var stype = "circle"
    }
    var newList = that.data.slideProductList
    newList[index].select = stype
    that.setData({
      slideProductList: newList
    })
    // that.countNum()
    that.count()
  },
  cart(){
    if(this.data.showCart){
      this.setData({
        showCart:false
      })
    }else{
      var that = this
      that.setData({
        showCart:true
      })
    }
  },
  addtion: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var newList = that.data.foodList
    var num = parseInt(newList[index].num)
    var isHave = false
    num++;
    newList[index].num = num;
    that.data.cartList.forEach(function(item,indx){
      console.log(item.name+"---"+newList[index].name)
      if(item.name == newList[index].name){
        var cart = that.data.cartList
        isHave = true
        that.setData({
          cartList:cart
        })
      }
    })
    if(!isHave){
      newList[index].select = "success";
      that.data.list.push(newList[index])
      that.setData({
        cartList: that.data.list
      })
    }

    that.setData({
      foodList: newList
    })
    that.count()
    console.log(that.data.foodList)
  },
  inputNum:function(e){
    var num = parseInt(e.detail.value);
    this.setData({
      goodsNum:num
    })
  },
  numIputBlur:function(e){
    var that = this
    var index = e.currentTarget.dataset.index
    var newList = that.data.foodList
    var num = parseInt(e.detail.value);
    var isHave = false
    if(e.detail.value == ''){
      num = 0
      isHave = true
      that.data.cartList.forEach(function(item,indx){
        if(item.num == 0){
          var cart = that.data.cartList
         cart.splice(indx,1)
          that.setData({
            cartList:cart
          })
        }
      })
    }
    newList[index].num = num;
    that.data.cartList.forEach(function(item,indx){
      if(item.name == newList[index].name){
        var cart = that.data.cartList
        isHave = true
        that.setData({
          cartList:cart
        })
      }
    })
    if(!isHave){
      that.data.list.push(newList[index])
      that.setData({
        cartList: that.data.list
      })
    }

    that.setData({
      foodList: newList
    })
    that.count()
  },
  //减法
  subtraction: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var newList = that.data.foodList
    var num = parseInt(newList[index].num)
    var isHave = true
    if(num <= 0){
      wx.showToast({
        title: '亲，该宝贝不能减少了哦~',
        icon: 'none'
      })
    }else{
    num--;
    newList[index].num = num;
    that.data.cartList.forEach(function(item,indx){
      if(item.num == 0){
        var cart = that.data.cartList
       cart.splice(indx,1)
        that.setData({
          cartList:cart
        })
      }
      if(item.name == newList[index].name){
        var cart = that.data.cartList
        that.setData({
          cartList:cart
        })
      }
    })
    that.setData({
      foodList: newList
    })
    that.count()
  }
  },
  //全选
  allSelect: function (e) {
    var that = this
    var cart = that.data.cartList
    var allSelect = e.currentTarget.dataset.select //先判断是否选中
    if(allSelect == 'circle'){
      that.setData({
        allSelect: 'success'
      })
      cart.forEach(function(item,index){
        item.select = "success"
      })
    }else{
      that.setData({
        allSelect: 'circle'
      })
      cart.forEach(function(item,index){
        item.select = "circle"
      })
    }
    that.setData({
      cartList: cart
    })
    that.count()
  },
 
  countNum: function () { //计算数量
    var that = this
    var newList = that.data.slideProductList
    var allNum = 0
    for (var i = 0; i < newList.length; i++) {
      if (newList[i].select == "success") {
        allNum += parseInt(newList[i].num)
      }
    }
    parseInt
    that.setData({
      num: allNum
    })
  },
  
  count: function () {//计算金额方法
    var that = this
    var newList = that.data.cartList
    var newCount = 0
    for (var i = 0; i < newList.length; i++) {
      if(newList[i].select == "success"){
        newCount += newList[i].price * newList[i].num
      }
    }
    that.setData({
      count: newCount
    })
  },

  selectCartItem(e){
    var that = this
    var allSelect = e.currentTarget.dataset.select //先判断是否选中
    var name = e.currentTarget.dataset.name
    var cart = that.data.cartList
    cart.forEach(function(item,index){
      if(item.name == name){
        if(item.select == "circle"){
          item.select = "success"
        }else{
          item.select = "circle"
        }
        that.setData({
          cartList: cart
        })
        that.count()
      }
    })
  },

  loadItem(){
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
  checkOut(){
    var checkItem = []
    var that = this
    var cart = that.data.cartList
    cart.forEach(function(item,index){
      if(item.select == "success"){
        checkItem.push(item)
      }
    })
    if(checkItem.length<=0){
      wx.showToast({
        title: '您还没选食品呢！',
        icon: 'none'
      })
      return
    }
    var time = setInterval(function(){
      app.globalData.checkItem = checkItem
      app.globalData.checkMoney = that.data.count
      wx.navigateTo({
        url: '../check/check',
      })
      clearInterval(time)
    },200)
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var width=wx.getSystemInfoSync().windowWidth
    var height=wx.getSystemInfoSync().windowHeight
    height=height-55-33;
    this.setData({
      height:height
    })
    this.setData({
      title:options.item
    })
    var that = this
    db.collection('foodInfo').where({
      district: options.item,
    })
    .get({
      success: function(res) {
        // res.data 是包含以上定义的两条记录的数组
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
        that.setData({
          foodList: res.data
        })
        var list = []
        list = that.data.foodList
        for(var i = 0;i<that.data.foodList.length;i++){
          list[i].num = 0
        }
        that.setData({
          foodList:list
        })
      }
    })
  },
  clearcart(){
    var that = this
    var cart = that.data.cartList
    var foods = that.data.foodList
    cart.forEach(function(item,index){
      item.num = 0
    })
    foods.forEach(function(item,index){
      item.num = 0
    })
    cart.splice(0,cart.length)
     that.setData({
       cartList:cart
     })
     that.setData({
      foodList:foods
    })
    that.setData({
      count: 0
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
