//app.js
App({
  globalData: {
    url: 'https://wechat.dmallovo.com',
    userInfo: null,
    // url: 'http://19/2.168.1.235:8090'
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                console.log(this)
              }
            }
          })
        }
      }
    })
    //
  },
  /**
   * 封装登录方法
   */
  sendRequest: function (opt)  {
    var that = this 
    wx.request({
      url: that.globalData.url+opt.url,
      data: opt.data,
      success: (res) => {
        if (res.data.code == '999999') {
          if (opt.fail) {
            opt.fail(res);
          } else {
            //请求接口异常
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '网络异常，请稍后重试！'
            });
          }
          return;
        } else if (res.data.code == '000002') {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '登录已失效，请重新登录！',
            success: function (res) {
              wx.removeStorage({
                key: 'USER_INFO',
                success: function(res) {},
              })
              wx.switchTab({
                url: '/pages/star/star'
              })
            }
          });
          return;
        } else if (res.data.code != '000000') {
          if (opt.fail) {
            opt.fail(res);
          } else {
            //请求接口异常
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: res.data.msg ? res.data.msg : "请求数据发生异常."
            });
          }
          return;
        } else {
          if (opt.success) {
            wx.request({
              url: that.globalData.url + '/myFamily/checkLove',
              data: {
                token: res.data.data.token
              },
              success: (res2) => {
                res.data.data.checkLove = res2.data.data
                wx.setStorage({
                  key: "USER_INFO",
                  data: res.data.data,
                  success: () => {
                    opt.success(res.data)
                  }
                })
              }
            })
          }
        }
      },
      fail: (res) => {
        if (opt.fail) {
          opt.fail(res)
        }
      },
      complete: function (res) {
        if (opt.complete) {
          opt.complete(res);
        }
      }
    })
  },
  //获取用户信息
  getUserInfo: function (cb) {
    return wx.getStorageSync('USER_INFO')
  },
  /**
   * 封装wx.request
   */
  ajax: function (opt, callback, title) {
    var that = this
    wx.showLoading({
      title: title || '数据加载中',
      mask: true
    })
    var header = opt.header ? opt.header : { 'content-type': 'application/x-www-form-urlencoded' };
    wx.request({
      url: that.globalData.url + opt.url,
      data: opt.data,
      header: opt.header ? opt.header : header,
      method: opt.method ? opt.method : 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == '999999') {
          if (opt.fail) {
            opt.fail(res);
          } else {
            //请求接口异常
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '网络异常，请稍后重试！'
            });
          }
          return;
        } else if (res.data.code == '000002' || res.data.code == '000001') {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '登录已失效，请重新登录！',
            success: function (res) {
              wx.removeStorage({
                key: 'USER_INFO',
                success: function (res) { 
                  wx.switchTab({
                    url: '/pages/star/star?isLogin=false'
                  })
                },
              })
              
            }
          });
          return;
        } else if (res.data.code != '000000') {
          if (opt.fail) {
            opt.fail(res);
          } else {
            //请求接口异常
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: res.data.msg ? res.data.msg : "请求数据发生异常."
            });
          }
          return;
        } else {
          if (callback) {
            callback(res);
          }
        }
      },
      fail: function (res) {
        return res
      },
      complete: function (res) { },
    })
  }
})