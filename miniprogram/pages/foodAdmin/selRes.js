//index.js
const app = getApp()
const db = wx.cloud.database()
Page({

  onShareAppMessage() {
    return {
      title: 'picker-view',
      path: '../../page/component/pages/picker-view/picker-view',
    }
  },

  data: {
    imgs:[],
    img:'',
    index:'',
    selMusic:'',
    contant:'',
    title:'',
    userInfo:{},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    time:'',
    bgimg:'',
    animationData: {},
  },

  onLoad: function (options) { 
    this.setData({
      index: options.index
    })
    this.onloadImgs();
        wx.getSetting({
          success (res){
            if (res.authSetting['scope.userInfo']) {
              wx.authorize({
                scope: 'scope.userInfo',
                success () {
                  wx.getUserInfo()
                }
              })
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success: function(res) {
                  console.log(res.userInfo)
                }
              })
            }
          }
        })
        
        
  },
  onloadImgs(){
    var imgList = ''
  db.collection("common").get({ // .get() 获取集合 / 记录数据
    success: res => {
      imgList = res.data[0].ImgArr.substring(0,res.data[0].ImgArr.length-1)
      console.log(imgList.split(','))
      this.setData({
        imgs: imgList.split(',')
      })
    }, 
    fail: err => {

    }
  })
},

  bindGetUserInfo (e) {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        this.addItem();
      }
    })
  },
  selImg(img){
    console.log(img)
    if(this.data.index == '1'){
      this.setData({
        img: img.currentTarget.dataset.img
      })
      db.collection('common').doc('807102f6623d7ef001d20f51169973d6').update({
        data: {
          tempImgs: this.data.img,
        },
        success: function(res) {
  
        }
      })
    }
    wx.navigateBack({
      delta: 1
    })
  },
  inputedit (e){
      this.setData({
        title: e.detail.value,
      }) 
    },
  inputedit2 (e){
      this.setData({
        contant: e.detail.value,
      }) 
      console.log("---"+this.data.contant)
    },
    inputedit3 (e){
      this.setData({
        location: e.detail.value,
      }) 
    },
    inputedit4 (e){
      this.setData({
        score: e.detail.value,
      }) 
    },

    showTime(){
      this.setData({
        showTime: !this.data.showTime,
      }) 
    },
    closeTime(){
      this.setData({
        showTime: false,
      }) 
    },
    sureTime(){
      this.setData({
        time: this.data.year + '.'+this.data.month+'.'+this.data.day,
        showTime: false,
      }) 
    }

  })
