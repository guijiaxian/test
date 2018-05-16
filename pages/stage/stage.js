//stage.js
//获取应用实例
var imageUtil = require('../../utils/util.js');  
var app = getApp()
Page({
  data: {
    result:"",
    btn:"立即体验",
    width:"20",
    height:"20",
    flag:-1,
    adImage:"https://open.closerhearts.cn/server_v4/web/live/demopic/daad.png",
    array: ["单人识别","年龄、性别识别","表情识别","图片上色","圈脸","脸眼鼻描点"
    ]
  },
  //事件处理函数
  bindViewTap: function() {
    var that = this;
    wx.chooseImage({
      success: function(res) {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'https://open.closerhearts.cn/server_v4/user_v2/rd_upload.php',
          filePath: tempFilePaths[0],
          name: 'userfile',
          formData:{
            'user': 'test'
          },
          success: function(res){
            //console.log(res.data);
            var obj = JSON.parse(res.data);
            var status = obj.status;
            var id = obj.id;
            var url = "https://open.closerhearts.cn/server_v4/content/image/"+id+".jpg";
            wx.showToast({
            title: '识别中',
            icon: 'loading',
            duration: 100000000
          })
          var request = 'https://open.closerhearts.cn/server_v4/web/live/rd_upload.php?mediaID=&url='+url+"&type="+that.data.flag;
          console.log(request);
            wx.request({
              url: request,
              data: {
                x: '' ,
                y: ''
              },
              header: {
                  'content-type': 'application/json'
              },
              success: function(res) {
                console.log(res.data)
                var json = res.data;
                var age = json.age;
                var emotion = json.emotion;
                var gender = json.gender;
                var type = json.type;
                var succ = json.succ;
                var url = json.newurl;
                var width = json.width;
                var height = json.height;
                if(succ == 0) {
                  wx.showToast({
                  title: '识别失败',
                  icon: 'failed',
                  duration: 2000
                  })
                  return;
                }
                var r = "";
                if(age!="") {
                  r = age+"        "+gender;
                }
                else if(emotion!="") {
                  r = emotion;
                }
                that.setData({
                  width:width,
                  height:height,
                  adImage:url,
                  btn:"再次体验",
                  result:r
                })
                
              },
              fail: function(res){
                console.log(res);
                wx.showToast({
                  title: '识别失败',
                  icon: 'failed',
                  duration: 2000
                  })
                //var data = res.data;
                //console.log(res);
              },
              complete: function(res){
                setTimeout(function(){
                  wx.hideToast()
                },2000)
              }
            })
          },
          fail: function(res){
            console.log(res);
            wx.showToast({
              title: '上传失败',
              icon: 'failed',
              duration: 2000
              })
            //var data = res.data;
            //console.log(res);
          }
        })
      }
    })
  },
  onLoad: function (options) {
    console.log('onLoad')
    var that = this
    this.data.flag = options.flag;
    wx.setNavigationBarTitle({
      title: that.data.array[options.flag],
      success: function(res) {
        // success
      }
    })
  },
  imageLoad: function (e) {  
    var imageSize = imageUtil.imageUtil(e)  
    this.setData({  
      imagewidth: imageSize.imageWidth,  
      imageheight: imageSize.imageHeight  
    })  
  }  
})
