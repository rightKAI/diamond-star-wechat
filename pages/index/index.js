//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
var that
Page({
  data: {
    indicatorDots: true,
    vertical: true,
    autoplay: true,
    interval: 3000,
    showLoginBtn: true,
    showShade: false, // 遮罩
    tabInfolist: [],
    flag: false,
    duration: 500,
    imagesThree: '',
    imgUrls: [],
    current: 0,
    preIndex: 1,
    swiperCurrent: 0,
    phone: '',
    vcode: '',
    verifyCodeText: '获取验证码 领取钻石',
    btnType: false, //false相当于禁用
    isGetCode: 1,
    sending: false, //是否正在发送短信
    sended: true, //是否已发送
    keyboardFlag: true,
    showBanner: false,
    diamondNum: 0
  },

  swiperchange: function (event) {
    if (event.detail.source == "touch") {
      //防止swiper控件卡死
      if (this.data.current == 0 && this.data.preIndex > 1) {//卡死时，重置current为正确索引
        this.setData({ current: this.data.preIndex })
      }
      else {//正常轮转时，记录正确页码索引
        this.setData({ preIndex: this.data.current })
      }
    }
    this.setData({
      swiperCurrent: event.detail.current
    })
  },
  onLoad: function (options) {
    that = this
    if (decodeURIComponent(options.scene) !== 'undefined' && decodeURIComponent(options.scene)) {
      // wx.showModal({
      //   title: '',
      //   content: decodeURIComponent(options.scene),
      // })
      this.setData({
        inviteId: decodeURIComponent(options.scene)
      })
    }
  },
  onShow: function () {
    app.ajax({
      url: '/mllad/list?pageCode=yx_applet_index'
    }, (rsp) => {
      var tabInfolist = rsp.data.data[1].contentList
      var imgUrls = rsp.data.data[0].contentList
      that.setData({
        imgUrls: imgUrls,
        tabInfolist: tabInfolist,
        imagesThree: rsp.data.data[2].contentList[0].imgurl,
        imagesThreeLink: rsp.data.data[2].contentList[0].link,
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.login({
      //获取code
      success: function (res) {
        that.getDiamondNum(res.code)
        that.setData({
          code: res.code
        })
      }
    })  
  },
  pageOpen: function (e) {
    if (e.currentTarget.dataset.url) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    } else {
      console.log(1)
      wx.navigateToMiniProgram({
        appId: 'wx8209322da31160bf', // 要跳转的小程序的appid
        // path: 'page/index/index', // 跳转的目标页面
        extarData: {
          open: 'auth'
        },
        success(res) {
          // 打开成功  
        }
      })
    }
  },
  changeInput: function (e) {
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
    if (!myreg.test(e.detail.value)) {
      if (!that.data.sending && e.detail.value.length === 11) {
          wx.showToast({
            title: '请输入正确的手机号码',
            icon: 'none',
            duration: 1000
          })    
        }
        that.setData({
          phone: '',
          btnType: false
        })
    } else {
        that.setData({
          phone: e.detail.value,
          btnType: true
        })
      }
  },
  changeCode: function (e) {
    if (e.detail.value.length === 4) {
      that.setData({
        vcode: e.detail.value
      })
      if (that.data.phone) {
        that.setData({
          btnType: true,
          coded: true,
          showLoginBtn: false
        })
      }
    } else {
      if (that.data.btnType && that.data.sending) {
        that.setData({
          verifyCodeText: that.data.sendingStatus,
          coded: false,
          btnType: false    
        })
      } else {
        that.setData({
          verifyCodeText: '重新发送',
          coded: false,
          btnType: false
        })
      } 
    }
  },
  /**
   * 获取用户信息
   */
  bindGetUserInfo: function (e) {
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
            title: '领取中',
          })
          app.sendRequest({
            url: '/thirdLogin/yxapplet',
            method: 'GET',
            data: params,
            success: function (res) {
              wx.setStorageSync("USER_INFO", res.data);
              that.setData({
                userInfoData: userInfo,
                isLogin: true
              })
              that.getDiamond()
              // wx.showToast({
              //   title: '登录成功',
              //   icon: 'success',
              //   duration: 500
              // })
              // setTimeout(() => {
              //   wx.navigateBack({
              //     delta: 1
              //   })
              // }, 500)
            }
          })
        } else {
          wx.showToast({ title: "登录失败", icon: "none" })
        }
      }
    });
  },
  // 发送验证码&&领取钻石
  getVerifyCode: (phone) => {
    if (that.data.sended) {
      // 发送验证码
      app.ajax({
        url: '/system/getVerifyCode',
        header: 'application/json',
        method: 'POST',
        data: {
          action: 'login',
          phone: that.data.phone
        }
      }, (res) => {
        var time = 60
        wx.showToast({
          title: '验证码发送成功',
          duration: 1000
        })
        that.setData({
          sending: true,
          sended: false,
          keyboardFlag: false
        })
        var timer = setInterval(() => {
          if (!that.data.coded) {
            that.setData({
              verifyCodeText: time + '秒后可重新发送',
              btnType: false
            })
          }
          that.setData({
            sendingStatus: time+'秒后可重新发送'
          })
          time --
          if (time <0) {
            clearInterval(timer)
            that.setData({
              sendingStatus: '重新发送',
              verifyCodeText: '重新发送',
              sended: true,
              sending: false
            })
            if (that.data.phone) {
              that.setData({
                btnType: true
              })
            }
          }
        },1000)
      })
    } else if (that.data.coded) {
      that.getDiamond()
    }
  },
  // 关闭
  close: function () {
    console.log(1)
    this.setData({
      showShade: false,
    })
  },
  // 获取随机钻石&&判断是否已领取
  getDiamondNum: (code) => {
    app.ajax({
      url: '/yxuser/getDiamondRandom',
      data: {
        code: code
      }
    }, (res) => {
      if (res.data.data.diamondNum === 0) { //已领取
        that.setData({
          showShade: false
        })
      } else {
        that.setData({
          showShade: true,
          contentId: res.data.data.contentId,
          diamondNum: res.data.data.diamondNum
        })
      }
      wx.setStorageSync('DIAMOND_NUM', res.data.data.diamondNum)
      that.setData({
        diamondNum: res.data.data.diamondNum
      })
    })
  },
  // 跳转校验
  navigateFnc: (e) => {
    if (e.currentTarget.dataset.love) {
      if (app.getUserInfo().token) {
        if (app.getUserInfo().checkLove) {
          wx.navigateTo({
            url: '/pages/myLover/love/love',
          })
        } else {
          wx.navigateTo({
            url: '/pages/myLover/myLover',
          })
        }
      } else {
        wx.showToast({
          title: '请先登录玛丽莱星球',
          icon: 'none',
          duration: 1000
        })
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/star/star'
          })
        }, 1000)
      }
    } else {
      util.navigateFnc(e.currentTarget.dataset.url)
    }
  },
  // 绑定号码&&领取钻石
  getDiamond: () => {
    wx.login({
      //获取code
      success: function (res) {
        var data 
        wx.hideLoading()
        app.ajax({
          url: '/yxuser/login', 
          method: 'POST',
          data: {
            phone: that.data.phone,
            verifyCode: that.data.vcode,
            inviteId: that.data.inviteId == undefined ? 0 : that.data.inviteId,
            contentId: that.data.contentId || 0,
            code: res.code
          }
        }, (res) => {
          wx.showToast({
            title: '领取成功!',
            duration: 1000
          })
          var userInfo = app.getUserInfo()
          userInfo.token = res.data.data.token
          wx.setStorage({
            key: "USER_INFO",
            data: userInfo,
            success: () => {
            }
          })
          wx.setStorage({
            key: "DIAMOND_NUM",
            data: 0,
            success: () => {
              that.setData({
                diamondNum: 0
              })
            }
          })
          setTimeout(() => {
            that.setData({
              showShade: false
            })
          }, 500)
        })
      }
    }) 
  },
  // 打开弹窗
  openCard: () => {
    that.setData({
      showShade: true
    })
  }
})