// index.js
// 获取应用实例
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    userName:'',
    adminName:'',
    adminPass:'',
    isAdmin:false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad(options) {
    console.log("--"+options.id)
    if(options.id == 'admin'){
      this.setData({
        isAdmin:true
      })
    }
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  adminuser (e){
    this.data.adminName = e.detail.value;
  },
  adminpass (e){
    this.data.adminPass = e.detail.value;
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        wx.showLoading({
          title: '加载中',
        })
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        var username = res.userInfo.nickName
        var that = this
        console.log(username)
        //搜索数据库是否相同用户，如无则注册
        db.collection('users').where({
          username: username,
        })
        .get({
          success: function(res) {
            console.log(res.data)
            if(res.data.length == 0){
              wx.hideLoading()
              wx.showModal({
                title: '您是新用户，请输入您的姓名',
                editable: true,
                placeholderText:'请输入姓名',
                success (res) {
                  if (res.confirm) {
                    console.log(res.content)
                    if(res.content.length>10||res.content.length<2){
                      wx.showToast({
                        title: '输入正确的姓名',
                        icon: 'error',
                        duration: 2000
                      })
                    }else{
                      that.setData({
                        userName: res.content
                      })
                      that.addUser(username);
                    }
                  } else if (res.cancel) {
                    console.log(res)
                  }
                }
              })
            }else{
              console.log(res.data[0])
              that.setData({
                userInfo: res.data[0]
              })
              app.globalData.userInfo = that.data.userInfo;
              console.log(that.data.userInfo)
              wx.hideLoading()
              wx.switchTab({
                url: '../list/list'
             })
            }
          }
        })
      }
    })
  },
  Login(){
    db.collection('admin').where({
      username: this.data.adminName,
      password: this.data.adminPass
    })
    .get({
      success: function(res) {
        // res.data 是包含以上定义的两条记录的数组
        console.log(res.data)
        if(res.data.length == 0){
          wx.showToast({
            title: '账号或密码错误！',
            icon: 'error',
            duration: 1200
          })
        }else{
          wx.reLaunch({
            url: '../list/list?id=admin'
         })
        }
      }
    })
  },

  addUser(user_name) {
    var that = this;
    that.setData({
      userInfo:{
        username: user_name,
        money:0,
        name:that.data.userName,
        phone:'',
      }
    })
    app.globalData.userInfo = that.data.userInfo;
    db.collection('users').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        username: user_name,
        money:0,
        name:that.data.userName,
        phone:'',
      },
      success: function(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
        app.globalData.name = that.data.userName
        wx.hideLoading()
            wx.switchTab({
               url: '../list/list'
            })
      }
    })
  },

  
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  golist: function () {
    var that = this;
    app.globalData.name = '';
    that.getUserProfile();
   
    

    // wx.switchTab({
    //   url: '../list/list'
    // })
  },

})
