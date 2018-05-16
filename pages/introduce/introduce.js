const registerUrl = require('../../config').registerUrl
var app = getApp()

Page({
  data: {
    pageheight: "1300",
    parentid : "",
    logo1width:0,
    logo1height:0,
    logo2width: 0,
    logo2height: 0,
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  onLogin: function() {
    app.login(this.data.parentid, function (msg) {
      /*if (msg == "1") {
        //首页
      }
      else */if (msg == "2" || msg == "1") {
        //已经注册过进入详情页
        wx.reLaunch({
          url: '../details/details'
          //url: '../account/account'
          //url: '../getmoney/getmoney'
        })
      }
      else if (msg == "3") {
        //出错
        wx.showToast({
          title: "出错，请重新进入"
        })
      }
    })
  },

  onShow: function () {
    var that = this
    if (app.globalData.groupIdentifier != "") {
      app.onTraceShareMsg(app.globalData.groupIdentifier, function (groupID) {
        //无论群信息是否获取都登录
        if (groupID!="")
          app.globalData.groupIdentifier = groupID;
        that.onLogin();
      })
    }
    else {
      this.onLogin();
    }
  },

  onLoad: function (res) {
    wx.hideShareMenu()
    var that = this
    console.log('code:' + app.globalData.code)
    var parentid = res.id
    if (!parentid) {
      parentid = "";
    }
    else {
      that.data.parentid = parentid;
    }
    /*
    wx.getSystemInfo({
      success: function (res) {
        var screenWidth = res.windowWidth - 20
        var w1 = 684
        var h1 = 296
        var rh = screenWidth * h1 / w1

        var w2 = 1026
        var h2 = 444
        var rh2 = screenWidth * h2 / w2

        that.setData({
          logo1width: screenWidth,
          logo1height: rh,
          logo2width: screenWidth,
          logo2height: rh2

        })
      }
    })
    */
  },



  onRegister: function (iv, encryptedData) {
    var that = this
    app.login(that.data.parentid, function (msg) {
      if (msg == "3") {
        //出错
        wx.showToast({
          title: "出错，请重试"
        })
      }
      else {
        //拉取用户信息
        wx.getUserInfo({
          withCredentials: false,
          success: function (res) {
            console.log('log:'+res)
            app.globalData.userInfo = res.userInfo
            //注册
            that.onSubmit(that.data.parentid, iv, encryptedData);
          },
          fail: function (res) {
            //用户拒绝授权
            wx.showModal({
              title: '提示消息',
              content: '领糖果之前需要您的授权，现在授权吗？',
              success: function (res) {
                if (res.confirm) {
                  wx.openSetting({
                    success: function (data) {
                      if (data) {
                        if (data.authSetting["scope.userInfo"] == true) {
                          console.info("开启");
                          that.onRegister(iv, encryptedData);
                        }
                        else {
                          console.info("关闭");
                          wx.showToast({
                            title: "您没有授权，无法领取糖果!"
                          })
                        }
                      }
                    },
                    fail: function () {
                      console.info("设置失败返回数据");
                    }
                  });
                }
                else if (res.cancel) {
                  
                }
              }
            })
          }
        })
      }
    });
  },

  onSubmit: function (parentid, iv, encryptedData) {
    wx.showLoading({
      title: '正在注册',
      mask: true,
    }),
    wx.request({
      url: registerUrl,
      dataType: 'txt',
      data: {
        userid: app.globalData.userid,
        sessionid: app.globalData.sessionid,
        nickname: app.globalData.userInfo.nickName,
        avatar: app.globalData.userInfo.avatarUrl,
        gender: app.globalData.userInfo.gender,
        city: app.globalData.userInfo.city,
        language: app.globalData.userInfo.language,
        province: app.globalData.userInfo.province,
        country: app.globalData.userInfo.country,
        parentid: parentid,
        groupIdentifier: app.globalData.groupIdentifier,
        iv: iv, 
        encryptedData: encryptedData
      },
      success: function (res) {
        wx.hideLoading();
        //var obj = res.data;
        var obj = JSON.parse(res.data.trim());
        var status = obj.status;
        if (status == "200") {
          var ismember = obj.ismember
          var isgroupmember = obj.isgroupmember
          app.globalData.ismember = ismember
          app.globalData.isgroupmember = isgroupmember
          app.globalData.nickname = app.globalData.userInfo.nickName
          wx.reLaunch({
            url: '../details/details'
          })
        }
        else if(status == "404") {
          wx.showToast({
            title: "联系人不存在"
          })
        }
        else  {
          wx.showToast({
            title: "注册失败，请重试！"
          })
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: "注册失败，请重试！"
        })
      },
      complete: function (res) {
        
      }
    })
  },

  onRegister2: function () {
    this.onRegister("", "");
  },

  getPhoneNumber: function (e) {
    if (e.detail.errMsg == "getPhoneNumber:fail user deny") {
      wx.showModal({
        title: '提示',
        content: '您拒绝了领糖果哦~',
        confirmText: '关闭',
        showCancel: false
      })
    }
    else {
      this.onRegister(e.detail.iv, e.detail.encryptedData);
    }
  } 
})