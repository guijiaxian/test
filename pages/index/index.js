//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    p:'',
    array: [
      {
         icon: 'https://open.closerhearts.cn/server_v4/web/live/demopic/1.png',
         caption: '单人识别',
         flag: '0'
      },
      {
         icon: 'https://open.closerhearts.cn/server_v4/web/live/demopic/2.png',
         caption: '年龄、性别识别',
         flag: '1'
      },
      {
         icon: 'https://open.closerhearts.cn/server_v4/web/live/demopic/3.png',
         caption: '表情识别',
         flag: '2'
      },
      {
         icon: 'https://open.closerhearts.cn/server_v4/web/live/demopic/4.png',
         caption: '图片上色',
         flag: '3'
      },
      {
         icon: 'https://open.closerhearts.cn/server_v4/web/live/demopic/5.png',
         caption: '圈脸',
         flag: '4'
      },
      {
         icon: 'https://open.closerhearts.cn/server_v4/web/live/demopic/6.png',
         caption: '脸眼鼻描点',
         flag: '5'
      }
    ]
  },
  //事件处理函数
  bindViewTap: function(event) {

    wx.reLaunch({
      url: '../details/details'
      //url: '../account/account'
      //url: '../getmoney/getmoney'
    })

  //  console.log('code:'+app.globalData.code)
    console.log(event.target.dataset)
  /*  wx.navigateTo({
      url: '../stage/stage?flag='+event.currentTarget.dataset.hi
    })*/
    
  //  console.log(p);
    var p = event.target.dataset.name
    var orderID = event.target.dataset.order
    var openid = app.globalData.openid;
    wx.request({
      url: 'https://open.lingxiai.net/order/content/paymodule/WxpayAPI_php_v3/api/jsapi.php?guid=1234&orderID=' + orderID + '&body=1&price=' + p + '&notifyUrl=https%3A%2F%2Fopen.lingxiai.net%2Forder%2Fcontent%2Fpaymodule%2FWxpayAPI_php_v3%2Fapi%2Fnotify.php&openid=' + openid,//后台统一下单接口
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
          },
          'fail': function (res) {
            console.log('fail');
          },
          'complete': function (res) {
            console.log('complete');
          },
          fail: function (res) {
            console.log(res)
          }
        });
      }
    });   
  },
  onLoad: function (res) {
    console.log('onLoad')

    var that = this
    var queryArr = res.id

/*    wx.request({
      url: 'https://open.lingxiai.net/lxCandy/core/payfee.php',//后台统一下单接口
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        fee: 666
      },
      //method: 'POST',
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
          },
          'fail': function (res) {
            console.log('fail');
          },
          'complete': function (res) {
            console.log('complete');
          }
        });
      },
      fail: function (res) {
        console.log(res.data)
      }
    });*/


    
    this.setData({
      //id: queryArr
      id: app.globalData.group,
      p:res.p,
      orderid:res.id
    })
    /*
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })*/
  },
})
