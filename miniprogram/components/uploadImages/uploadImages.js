// component/uploadImages/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    count: { //最多选择图片的张数，默认9张
      type: Number,
      value: 9
    },
    uploadUrl: { //图片上传的服务器路径
      type: String,
      value: ''
    },
    showUrl: { //图片的拼接路径
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    detailPics: [], //上传的结果图片集合
    FileIdPath:'',
    pics: 1,
    ImgList:[],
    ImgsPath:''
  },

  ready: function() {
    this.loadImgs();
  },

  /**
   * 组件的方法列表
   */
  methods: {

    loadImgs(){
      var that = this
      var list = []
  const db = wx.cloud.database()
      db.collection("ImgBook").get({ // .get() 获取集合 / 记录数据
        success: res => {
          that.setData({
            ImgsPath:res.data[0].ImgArr
          })
          console.log(res.data[0].ImgArr.split(','))
          for(var i = 0;i<res.data[0].ImgArr.split(',').length-1;i++){
            list.push(res.data[0].ImgArr.split(',')[i])
            that.setData({
              detailPics: list
            })
          }
        },
        fail: res => {
          
        }
      })
    },

    uploadDetailImage: function(e) { //这里是选取图片的方法
      var that = this;
      var pics = [];
      var detailPics = that.data.detailPics;
      if (detailPics.length >= that.data.count) {
        wx.showToast({
          title: '最多选择' + that.data.count + '张！',
        })
        return;
      }
      wx.chooseImage({
        count: 1,
        success: function(res) {
          var imgs = res.tempFilePaths;
          console.log(res.tempFilePaths)
            pics.push(imgs[0])
          that.uploadimg({
            url: that.data.uploadUrl +(that.data.ImgsPath.split(',').length-1)+".jpg", //这里是你图片上传的接口
            path: pics, //这里是选取的图片的地址数组
          });
          that.setData({
            pics: Number(that.data.pics) + 1,
          })
        },
      })

    },
    //多张图片上传
    uploadimg: function(data) {
      wx.showLoading({
        title: '上传中...',
        mask: true,
      })
      var that = this,
        i = data.i ? data.i : 0,
        success = data.success ? data.success : 0,
        fail = data.fail ? data.fail : 0;
      wx.cloud.uploadFile({
        cloudPath: data.url,
        filePath: data.path[i],
        success: (res) => {
          that.getTempPath(res.fileID);
          wx.hideLoading();
          success++;
          var str = res.fileID ;//返回的结果，可能不同项目结果不一样
        },
        fail: (res) => {
          fail++;
          console.log('fail:' + i + "fail:" + fail);
          wx.hideLoading();
        },
        complete: () => {
          i++;
          if (i == data.path.length) { //当图片传完时，停止调用     
            console.log('执行完毕');
            console.log('成功：' + success + " 失败：" + fail);
            var myEventDetail = {
              picsList: that.data.detailPics
            } // detail对象，提供给事件监听函数
            var myEventOption = {} // 触发事件的选项
            that.triggerEvent('myevent', myEventDetail, myEventOption)//结果返回调用的页面
          }
        }
      });
    },

    previewImage: function(event){
      var that = this
      wx.previewImage({
        current: event.currentTarget.dataset.img,
        urls: that.data.detailPics
      })
      console.log(event.currentTarget.dataset.img)
    },


    getTempPath(path){
      var that = this
      wx.cloud.getTempFileURL({
        fileList: [path],
        success: res => {
          console.log("文件下载链接", res.fileList[0].tempFileURL)   
          var pic = res.fileList[0].tempFileURL;
          var detailPics = that.data.detailPics;
          const db = wx.cloud.database()
          detailPics.push(pic)
          that.setData({
            detailPics:[]
          })
          db.collection('ImgBook').doc('c462c81061a8afe8000f3fb70e397dbd').update({
            // data 传入需要局部更新的数据
            data: {
              ImgArr: that.data.ImgsPath + pic + ','
            },
            success: function(res) {
              console.log(res.data)
              that.loadImgs();
            }
          })
          
        }
      })
    }

  }
})