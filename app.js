//app.js
const loginUrl = require('./config').loginUrl
const extendSessionUrl = require('./config').extendSessionUrl
const fetchGroupInfo = require('./config').fetchGroupInfo
const shareGroup = require('./config').shareGroup
const appidentifier = require('./config').appidentifier

App({

  onShow: function (ops) {
    this.globalData.scene = ops.scene;
    if (ops.scene == 1044) {
      this.globalData.groupIdentifier = ops.shareTicket;
      /*wx.showToast({
        title: this.globalData.groupIdentifier
      })*/
    }
  },

  onLaunch: function (ops) {
   
  },

  globalData: {
    appidentifier: appidentifier,
    scene : 0,
    userid: null,
    lastuserid: null,  //邀请人的id
    mobile: null,
    sessionid : null,
    userInfo : null,
    groupIdentifier : "",  //入口群id
    ismember:0,         //是否注册
    nickname:"",        
    isgroupmember:0,     //是否已经入群
    code:'',
    openid:'',
    productpage:'',
  },

  login: function (parentid, callback) {
    var self = this
    if (self.globalData.userid) {
      if (self.globalData.ismember == 1)
        typeof callback == "function" && callback("2")
      else 
        typeof callback == "function" && callback("1")
    }
    else {
      wx.login({
        success: function (data) {
          console.log('code:'+data.code)
          self.globalData.code = data.code
          wx.request({
            url: loginUrl,
            headers: {
              'Content-Type': 'application/json'
            },
            data: {
              code: data.code,
              parentid: parentid,
              groupIdentifier: self.globalData.groupIdentifier,
              appidentifier: self.globalData.appidentifier,
              scene: self.globalData.scene
            },
            success: function (res) {
              console.log('拉取openid成功', res)
              var obj = res.data;
              var status = obj.status;
              if (status == 200) {
                var userid = obj.userid;
                var sessionid = obj.sessionid
                var ismember = obj.ismember
                var nickname = obj.nickname
                var isgroupmember = obj.isgroupmember
                self.globalData.userid = userid
                self.globalData.sessionid = sessionid
                self.globalData.ismember = ismember
                self.globalData.nickname = nickname
                self.globalData.isgroupmember = isgroupmember
                self.globalData.openid = obj.openid
                //判断应该跳转到哪个界面
                if (ismember==1)
                  typeof callback == "function" && callback("2")
                else
                  typeof callback == "function" && callback("1")
              }
              else {
                console.log('更新用户信息失败')
                typeof callback == "function" && callback("3")
              }
            },
            fail: function (err) {
              console.log('拉取用户openid失败，将无法正常使用开放接口等服务', err)
              typeof callback == "function" && callback("3")
            }
          })
        },
        fail: function (err) {
          console.log('wx.login接口调用失败，将无法正常使用开放接口等服务', err)
          typeof callback == "function" && callback("3")
        }
      })
    }
  },

  /*
  getUserInfo: function (parentid, callback) {
    var self = this
    //if (self.globalData.userInfo) {
    //  typeof callback == "function" && callback(null)
    //} else {
      wx.login({
        success: function (data) {
          wx.request({
            url: openIdUrl,
            data: {
              code: data.code,
              parentid : parentid
            },
            success: function (res) {
              console.log('拉取openid成功', res)
              var obj = res.data;
              var status = obj.status;
              if (status == 200) {
                var userid = obj.userid;
                var sessionid = obj.sessionid
                self.globalData.userid = userid
                self.sessionid.userid = sessionid
                //拉取用户详细信息
                wx.getUserInfo({
                  withCredentials: false,
                  success: function (res) {
                    self.globalData.userInfo = res.userInfo
                    typeof callback == "function" && callback(null)
                  },
                  fail: function (res) {
                    //用户拒绝授权
                    wx.showModal({
                      title: '提示标题',
                      content: '提示内容',
                      success: function(res) {
                        if (res.confirm) {
                          console.log('用户点击确定')
                        } 
                        else if (res.cancel) {
                          wx.openSetting({
                            success: function(data) {
                              if (data) {
                                if (data.authSetting["scope.userInfo"] == true) {
                                }
                              }                             
                            },
                            fail: function() {
                              console.info("设置失败返回数据");
                            }
                          });
                        }
                      }
                    })
                  }
                })
              }
              else {
                console.log('服务器登录失败')
              }
            },
            fail: function (res) {
              console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
              
            }
          })
        },
        fail: function (err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
         
        }
      })
    }
  //}
  */

  onExtendSession: function (callback) {
    var that = this;
    wx.login({
      success: function (data) {
        wx.request({
          url: extendSessionUrl,
          data: {
            code: data.code,
            appidentifier: that.globalData.appidentifier
          },
          success: function (res) {
            var obj = res.data;
            var status = obj.status;
            if (status == 200) {
              var sessionid = obj.sessionid
              that.globalData.sessionid = sessionid
              callback(200);
            }
            else {

            }
          },
          fail: function (err) {
          }
        })
      },
      fail: function (err) {
      }
    })
  },

  onTraceShareMsg: function (groupCode, callback = null) {
    var that = this;
    if (this.globalData.sessionid == null) {
      that.onExtendSession(function (ret) {
        if (ret == 200) {
          that.onFetchGroupInfo(groupCode, callback)
        }
      })
    }
    else {
      wx.checkSession({
        success: function () {
          that.onFetchGroupInfo(groupCode, callback)
        },
        fail: function () {
          //登录态过期
          that.onExtendSession(function(ret) {
            if (ret == 200) {
              that.onFetchGroupInfo(groupCode, callback)
            }
          })
        }
      })
    }
  },

  onFetchGroupInfo: function (groupCode, callback) {
    var that = this
    wx.getShareInfo({
      shareTicket: groupCode,
      complete(res) {
        console.log(res)
        wx.request({
          url: fetchGroupInfo,
          data: {
            sessionid: that.globalData.sessionid,
            iv: res.iv,
            encryptedData: res.encryptedData,
            appidentifier: that.globalData.appidentifier
          },
          dataType: 'txt',
          success: function (res) {
            var obj = JSON.parse(res.data.trim());
            var status = obj.status;
            if (status == 200) {
              var openGId = obj.openGId
              if (callback)
                callback(openGId)
            }
            else {
              if (callback)
                callback("")
            }
          },
          fail: function (err) {
          }
        })
      },
      fail: function (err) {
      }
    })
  },
 
  onShareToGroup: function(groupID) {
    console.log(groupID)
    var that = this
    wx.request({
      url: shareGroup,
      data: {
        sessionid: that.globalData.sessionid,
        groupIdentifier: groupID,
        userid: that.globalData.userid,
        appidentifier: that.globalData.appidentifier,
        scene: that.globalData.scene
      },
      success: function (res) {
        console.log(res.data)
      },
      fail: function (err) {
      }
    })
  }
 
})

