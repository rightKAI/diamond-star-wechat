// pages/star/star.js
var app = getApp()
var that
Page({
  /**
   * 页面的初始数据
   */
  data: {
    memberInfo: {},
    animation: '',
    showAddNum:'',
    token: app.getUserInfo().token,
    checkLove: '',
    isAdd: false,
    userInfoData: {},
    isLogin: true,
    noError: true,
    tabList: [
      {
        imgUrl: 'https://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/yx_applet/images/icon_wdxq_05.png',
        navigatorUrl: '/pages/giftCard/giftCard',
        title: '礼券'
      },
      {
        imgUrl: 'https://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/yx_applet/images/icon_wdxq_04.png',
        navigatorUrl: '/pages/appointment/appointment',
        title: '预约'
      },
      {
        imgUrl: 'https://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/yx_applet/images/icon_wdxq_03.png',
        navigatorUrl: '/pages/invite/invite',
        title: '邀请'
      },
      {
        imgUrl: 'https://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/yx_applet/images/icon_wdxq_02.png',
        title: '订单'
      }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.isLogin) {
      this.setData({
        isLogin: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.getUserInfo()) {
      this.setData({
        checkLove: app.getUserInfo().checkLove
      })
    }
    this.animation  = wx.createAnimation({
      // 动画持续时间，单位ms，默认值 400
      duration: 400,
      /**
       * http://cubic-bezier.com/#0,0,.58,1  
       *  linear  动画一直较为均匀
       *  ease    从匀速到加速在到匀速
       *  ease-in 缓慢到匀速
       *  ease-in-out 从缓慢到匀速再到缓慢
       * 
       *  http://www.tuicool.com/articles/neqMVr
       *  step-start 动画一开始就跳到 100% 直到动画持续时间结束 一闪而过
       *  step-end   保持 0% 的样式直到动画持续时间结束        一闪而过
       */
      timingFunction: 'linear',
      // 延迟多长时间开始
      /**
       * 以什么为基点做动画  效果自己演示
       * left,center right是水平方向取值，对应的百分值为left=0%;center=50%;right=100%
       * top center bottom是垂直方向的取值，其中top=0%;center=50%;bottom=100%
       */
      transformOrigin: 'left top 0',
      success: function (res) {
      }
    })
    that = this
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          if (app.getUserInfo().token) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            that.getUserInfo()
            that.setData({
              isLogin: true
            })
          } else {
            wx.showLoading({
              title: '加载中',
            })
            wx.getUserInfo({
              success: function (res) {
                that.loginFnc(res.userInfo)
              }
            })
          }
        } else {
          that.setData({
            isLogin: false
          })
        }
      }
    })
  },
  /**
   * 获取用户信息
   */
  getUserInfo () {
    app.ajax({
      url: '/yxuser/getUserInfomation',
      data: {
        token: app.getUserInfo().token
      }
    }, (rsp) => {
      if (rsp.data.data.checkSignIn) {
        this.setData({
          isAdd: true
        })
      }
      var tabList = this.data.tabList
      tabList[0].tipNum = rsp.data.data.couponsNum
      tabList[1].tipNum = rsp.data.data.appointmentNum
      this.setData({
        memberInfo: rsp.data.data,
        tabList
      })
    })
  },
  /**
   * 签到
   */
  addOne () {
    if (!this.data.isAdd) {
      app.ajax({
        url: '/signIn/signIn',
        method: 'get',
        data: {
          token: app.getUserInfo().token,
          activitySn: '10002',
          keyName: 'sign_integral'
        }
      },() => {
        this.setData({
          isAdd: true,
          showAddNum: true
        })
        this.animation.translateY(-50).opacity(0).step()
        this.setData({
          //输出动画
          animation: this.animation.export(),
        })
        setTimeout(() => {
          showAddNum: false
        }, 500)
        wx.showToast({
          title: '签到成功',
          icon: 'success',
          duration: 500
        })
      })
    }
  },
  /**
   * 获取用户信息
   */
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    var that = this
    if (e.detail.userInfo) {
      that.loginFnc(e.detail.userInfo)
    } else {
      //用户按了拒绝按钮
    }
  },
  /**
   * 登录
   */
  loginFnc: (userInfo) => {
    //登陆获取code
    wx.login({
      success: function (loginResp) {
        if (loginResp.code) {
          //用户按了允许授权按钮
          //封装登陆需要的参数
          var params = {};
          // if (wx.getStorageSync('INVITE_ID')) {
          //   params.inviteId = wx.getStorageSync('INVITE_ID')
          // } else {
            params.inviteId = 0
          // }
          params.code = loginResp.code;
          params.nickName = userInfo.nickName;
          params.sex = userInfo.gender;
          params.avatarUrl = userInfo.avatarUrl;
          //调用登陆接口
          wx.showLoading({
            title: '登陆中',
          })
          app.sendRequest({
            url: '/thirdLogin/yxapplet',
            method: 'GET',
            data: params,
            success: function (res) {
              wx.hideLoading()
              wx.setStorageSync("USER_INFO", res.data);
              that.getUserInfo()
              that.setData({
                userInfoData: userInfo,
                isLogin: true
              })
              wx.showToast({
                title: '登录成功',
                icon: 'success',
                duration: 500
              })
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 500)
            }
          })
        } else {
          wx.showToast({ title: "登录失败", icon: "none" })
        }
      }
    });
  },
  /**
   * 跳转校验
   */
  navigateFnc: (e) => {
    if (that.data.isLogin) {
      if (e.currentTarget.dataset.love) {
        app.ajax({
          url: '/myFamily/checkLove',
          data: {
            token: app.getUserInfo().token
          }
        }, (res2) => {
          var userInfo = app.getUserInfo()
          userInfo.checkLove = res2.data.data
          wx.setStorageSync("USER_INFO", userInfo)
          if (res2.data.data) {
            wx.navigateTo({
              url: '/pages/myLover/love/love',
            })
          } else {
            wx.navigateTo({
              url: '/pages/myLover/myLover',
            })
          }
        })
      } else if (e.currentTarget.dataset.key === "address") {
        if (!that.data.memberInfo.checkAddress) {
          wx.navigateTo({
            url: '/pages/address/addAddress/add'
          })
        } else {
          wx.navigateTo({
            url: '/pages/address/address'
          })
        }
      } else {
        if (e.currentTarget.dataset.url) {
          wx.navigateTo({
            url: e.currentTarget.dataset.url
          })
        } else {
          wx.showToast({
            title: '功能正在开发中,敬请期待~',
            icon: 'none'
          })
        }
      }
    }else {
      wx.showToast({
        title: '请先登录玛丽莱星球',
        icon: 'none',
        duration: 1000
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})