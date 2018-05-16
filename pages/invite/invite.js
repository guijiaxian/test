
var app = getApp()

Page({

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  data: {
    pageheight: 100,
    friend: null
  },

  onPageHeight: function (h) {
    var that = this
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


})