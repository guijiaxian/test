const accountUrl = require('../../config').accountUrl
var app = getApp()

Page({

  data: {
    pageheight: 100,
    friend: null
  },
  
  onPageHeight: function (h) {
    var that = this
    h+=350;
    wx.getSystemInfo({
      success: function (res) {
        var height = h
        if (height < res.windowHeight) {
          height = res.windowHeight
        }
        that.setData({
          pageheight: height
        })
        
      }
    })
  },

  onLoad: function () {
    this.onPageHeight(0)
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  onShow: function () {
    this.onRequestUserInfo()
  },

  onShareAppMessage: function (data) {
    var userid = app.globalData.userid
    var msg = "注册即得！上百种糖果免费送，快快邀请好友吧";//app.globalData.nickname + "给你发糖果啦";
    return {
      title: msg,
      imageUrl: '/images/shareGroup.png',
      path: '/pages/introduce/introduce?id=' + userid,
      success(res) {
        var group = res.shareTickets[0]
        app.onTraceShareMsg(group, function (groupID) {
          if (groupID != "")
            app.onShareToGroup(groupID)
        });
        /*wx.setStorage({
          key: "123key",
          //data: "haha"
          data: group
        })*/

      }
    }
  },

  onPullDownRefresh: function () {
    this.onRequestUserInfo()
  },

  onRequestUserInfo: function () {
    var self = this;
    wx.request({
      url: accountUrl,
      data: {
        userid: app.globalData.userid,
        sessionid: app.globalData.sessionid,
      },
      success: function (res) {
        var obj = res.data;
        var status = obj.status;
        if (status == "200") {
          var friend = obj.friend
          var totalval = obj.totalval
          var h = friend.length * 100
          self.onPageHeight(h);
          self.setData({
            friend: friend,
            totalval: totalval,
          })
        }
        else if (status == "404") {
          wx.showToast({
            title: "联系人不存在"
          })
        }
        else {
          wx.showToast({
            title: "出问题啦，再试一次！"
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: "出问题啦，再试一次！"
        })
      },
      complete: function (res) {
        wx.stopPullDownRefresh()
      }
    })

  },

  onGetMoney: function () {
    wx.navigateTo({
      url: '../getmoney/getmoney'
    })
  },

})