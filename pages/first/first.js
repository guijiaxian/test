var app = getApp()
Page({
  data: {
    shareData: {
      title: '分享',
      desc: '哈哈',
      path: '/page/index/index'
    }
  },
  onShareAppMessage: function (data) {
    var id = "1234";
    /*this.setData({
      shareData:title = "11"
    })*/
    //return this.data.shareData
    return {
      title: '分享',
      desc: '哈哈',
      path: '/pages/index/index?id='+id,
      success(res) {
        /*wx.showToast({
          title: res.shareTicket[0]
        })*/
        var group = res.shareTickets[0]

        wx.getShareInfo({
          shareTicket: group,
          complete(res) {
            console.log(res)
          }
        })

        wx.setStorage({
          key: "123key",
          //data: "haha"
          data: group
        })

      }
    }
  },

  onShow: function () {
    var that = this
    wx.getStorage({
      key: '123key',
      success: function (res) {
        that.setData({
          group: res.data
        })
        wx.showToast({
          title: res.data
        })
      }
    })
  },

  onTap: function () {
    var that = this

    this.setData({
      group: "111"
    })

    wx.getStorage({
      key: '123key',
      success: function (res) {
        that.setData({
          group: res.data
        })
        wx.showToast({
          title: res.data
        })
      }
    })
  },

  onLoad: function () {
    console.log('onLoad')

    wx.showShareMenu({
      withShareTicket: true
    })
/*
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (msg, userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })*/
  },
})