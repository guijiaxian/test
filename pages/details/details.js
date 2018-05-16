//const detailsUrl = require('../../config').detailsUrl
//const share = require('../../config').share
const productpage = require('../../config').productpage

const pay_success = require('../../config').pay_success
const pay_failed = require('../../config').pay_failed
const pay = require('../../config').pay
const paycallback = require('../../config').notifyUrl

var app = getApp()

Page({

  data: {
    groupID:"",
    inviteval:0,
    totalval:0,
    nickname: "",
    notingroup : true,
    pageheight:100,
    friend:null,
    parentid: "",
    codeurl:"https://open.lingxiai.net/lxCandy/images/1.jpg",
    path: "",
  },

  onPageHeight: function(h) {
    var that = this;
    var height = 1100
    if (app.globalData.isgroupmember == "1") {
      height = 900
    }
    //height = 660
    height += h;

    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        console.log('height=' + res.windowHeight);
        console.log('width=' + res.windowWidth);
        if (height < res.windowHeight)
          height = res.windowHeight;
        that.setData({
          pageheight: height
        })
      }
    })

    this.setData({
      pageheight: height
    })
  },

  onLogin: function () {
    var that = this;
    app.login(this.data.parentid, function (msg) {
      if (msg == "3") {
        //出错
        wx.showToast({
          title: "出错，请重新进入"
        })
      }
      else {
        console.log('code:' + app.globalData.code)
        var userid = app.globalData.userid
        var parentid = that.data.parentid
        console.log('获取：' + userid + ' ' + parentid)
        /*var u = share + '?userid='+ userid + '&parentid=' + parentid + '&type=2';
        wx.request({
          url: u,
          success: function(res){
            console.log(res);
          }
        })
        if (app.globalData.isgroupmember == "1") {
          that.setData({
            notingroup: false
          })
        }
        else {
          that.setData({
            notingroup: true
          })
        }*/
        that.setData({
          //nickname: app.globalData.nickname,
          groupID: app.globalData.groupIdentifier
        })
      }
    })
  },

  onLoad: function (res) {
    var that = this
    var types = res.type
    var price = res.p 
    var orderID = res.orderid
    var openid = app.globalData.openid
    var successurl = pay_success
    var failedurl = pay_failed
    var product = res.product
    var subid = res.subID
    var siteid =res.siteID
    var parentid = res.id
    var amount = res.amount

    console.log('types:' + types)
    console.log('p:' + price + " orderid:" + orderID + " amount:" + amount)
    console.log('parentid:' + parentid)

    if (types != 'pay') {
      if (!parentid) {
        parentid = "";
      }
      else {
        that.data.parentid = parentid;
      }
    }
    /*that.setData({
      notingroup: false
    })*/
    

    //this.onPageHeight(0);
    //this.onRequestUserInfo()
    wx.showShareMenu({
      withShareTicket: true
    })
    if(types == 'pay'){
      
      var payurl = pay + '?guid=' + app.globalData.openid + '&orderID=' + orderID + '&body=' + encodeURI(product) + '&price=' + price * 100 + '&notifyUrl=' + paycallback + '&openid=' + openid + '&subid=' + subid + '&siteid=' + siteid + '&appidentifier=' + app.globalData.appidentifier + '&scene=' + app.globalData.scene;//后台统一下单接口
      console.log('p:' + price+' orderid:'+orderID)
      console.log('payurl:' + payurl)
      wx.request({
        url: payurl,
        success: function (res) {
          console.log(res.data);
          console.log('调起支付');
          wx.requestPayment({
            'timeStamp': res.data.timeStamp,
            'nonceStr': res.data.nonceStr,
            'package': res.data.package,
            'signType': 'MD5',
            'paySign': res.data.paySign,
            'success': function (res) {
              console.log('success');
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 3000
              });
              console.log(successurl + '?product=' + encodeURI(product) + '&price=' + price + '&orderid=' + orderID)
              app.globalData.productpage = successurl + '?product=' + encodeURI(product) + '&price=' + price + '&orderid=' + orderID + '&amount=' + amount + '&subid=' +subid
              that.setData({
                path: app.globalData.productpage
              })
            },
            'fail': function (res) {
              console.log('fail');
            },
            'complete': function (res) {
              console.log('complete');
            },
            fail: function (res) {
              console.log(res)
              var url = failedurl + '?product=' + encodeURI(product) + '&price=' + price + '&orderid=' + orderID + '&openid=' + openid + '&subid=' + subid + '&siteid=' + siteid + '&amount=' + amount
              console.log('repay:'+url)
              app.globalData.productpage = url
              that.setData({
                path: app.globalData.productpage
              })
            }
          });
        }
      });   
    }
    else {
      app.globalData.productpage = productpage + "&appidentifier=" + app.globalData.appidentifier + '&scene=' + app.globalData.scene;
      this.setData({
        path: app.globalData.productpage
      })
    }
    if (app.globalData.groupIdentifier != "") {
      app.onTraceShareMsg(app.globalData.groupIdentifier, function (groupID) {
        //无论群信息是否获取都登录
        if (groupID != "")
          app.globalData.groupIdentifier = groupID;
        that.onLogin();
      })
    }
    else {
      this.onLogin();
    }
  },

  onShow: function() {
    //var that = this
    
    
  },

  onShareAppMessage: function (data) {
    var userid = app.globalData.userid
    var that = this;
    var msg = "立即下单吧！";//app.globalData.nickname + "给你发糖果啦";
    return {
      title: msg,
      imageUrl: '/images/shareGroup.png',
      path: '/pages/details/details?id=' + userid,
      success(res) {
        var group = res.shareTickets[0]
        app.onTraceShareMsg(group, function (groupID){
          if (groupID != "")
            app.onShareToGroup(groupID)
        });
        /*wx.setStorage({
          key: "123key",
          //data: "haha"
          data: group
        })*/
        /*wx.request({
          url: 'https://open.lingxiai.net/lxCandy/share.php?userid=' + userid + '&type=1',
          success: function (res) {
            console.log(res);
          }
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
      url: detailsUrl,
      data: {
        userid: app.globalData.userid,
        sessionid: app.globalData.sessionid,
      },
      success: function (res) {
        var obj = res.data;
        var status = obj.status;
        if (status == "200") {
          var totalval = obj.totalval
          var inviteval = obj.inviteval
          var friend = obj.friend
          var h = friend.length * 100
          //self.onPageHeight(h);
          self.setData({
            totalval: totalval,
            inviteval: inviteval,
            friend: friend,
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

  onListAccount: function () {
    wx.navigateTo({
      url: '../account/account'
    })
  },

  onGetMoney: function () {
    wx.navigateTo({
      url: '../getmoney/getmoney'
    })
  },

  onShare: function () {
    wx.navigateTo({
      url: '../invite/invite'
    })
  },

  onSaveCode: function () {
    var that=this;
    wx.downloadFile({
      url: that.data.codeurl,
      success: function (res) {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function (data) {
              wx.showModal({
                title: '提示',
                content: '二维码已经保存到系统相册，请扫码入群',
                confirmText:'关闭',
                showCancel:false
              })
            },
            fail: function (res) {
              if(err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                wx.openSetting({
                  success(settingdata) {
                    if(!settingdata.authSetting['scope.writePhotosAlbum']) {
                      wx.showToast({
                        title: "没有权限！"
                      })
                    }
                  }
                });
              }
            }
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: "下载失败！"
        })
      }
    })
  }

})
