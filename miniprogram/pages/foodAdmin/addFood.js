//index.js
const app = getApp()
const db = wx.cloud.database()

Page({

  data: {
    img:'',
    foodInfo:{},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  onShow: function(options){
    this.loadTempImg()
  },

  onLoad: function (options) { 

  },
  upload(){
    wx.navigateTo({
      url: 'res',
    })
  },
  clearAll(){
    db.collection('common').doc('807102f6623d7ef001d20f51169973d6').update({
      data: {
        tempImgs: '',
      },
    })
    this.setData({
      img:''
    })
  },

  loadTempImg(){
    db.collection("common").get({ // .get() 获取集合 / 记录数据
      success: res => {
        console.log(res.data[0].tempImgs)
        this.setData({
          img: res.data[0].tempImgs,
        })
      }, 
      fail: err => {
  
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
  selImgs(index){
    console.log(index.currentTarget.dataset.indx)
    wx.navigateTo({
      url: 'selRes?index='+index.currentTarget.dataset.indx
    })
  },
  addItem: function () {
    var that = this
    db.collection('foodInfo').add({ // .add() 在集合上新增记录
      data: {
        name: that.data.foodInfo.name,
        district: that.data.foodInfo.district,
        price: that.data.foodInfo.price,
        detail: that.data.foodInfo.detail,
        url:that.data.img,
      },
      success: res => {
        wx.showToast({
          icon: "success",
          title: '保存成功',
        })
        this.clearAll();
        setTimeout(() => {
          wx.navigateBack({
          delta: 1
        }) }, 1000)
      },
      fail: err => {
        wx.showToast({
          icon: "none",
          title: '保存失败',
        })
        console.log(err)
      }
    })
  }
})
