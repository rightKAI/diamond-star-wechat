// pages/invite/invite.js
const util = require('../../utils/util.js')
var app = getApp()
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviteList: [],
    userInfo: {},
    showInviteCard: false,
    isfreeze: false,
    canvasShow:true,
    isSave: false,
    imageWidth: wx.getSystemInfoSync().windowWidth,
    imageHeight: wx.getSystemInfoSync().windowHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this)
    this.getChangeList()
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
    that = this
    that.getIntergral()
    that.getInviteCode()
    that.getIntergral()
    that.setData({
      userInfo: app.getUserInfo()
    })
    that.getInviteList()
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log("来自页面内转发按钮");
    }
    else {
      console.log("来自右上角转发菜单")
    }
    return {
      title: `hi，您的好友${app.getUserInfo().userName}送您5分钻石，点击领取。`,
      path: `/pages/index/index?scene=${app.getUserInfo().userId}`,
      imageUrl: 'http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/starDiamond/invite.jpg'
    }
  },
  /**
   * 获取邀请列表
   */
  getInviteList: () => {
    app.ajax({
      url: '/yxinvite/getInviteList',
      data: {
        token: app.getUserInfo().token,
        pageNo: 1,
        pageSize: 3
      }
    }, (res) => {
      that.setData({
        inviteList: res.data.data
      })
    })
  },
  /**
   * 绘制分享图片
   */
  drawInviteImage: () => {
    // 创建画布
    const ctx = wx.createCanvasContext('inviteCode')
    // 绘制背景图
    var avatarurl_width = (that.data.imageWidth/750)  * 156  //绘制的头像宽度
    var avatarurl_heigth = (that.data.imageWidth / 750) * 156   //绘制的头像高度
    var avatarurl_x = (that.data.imageWidth / 750) * 254//绘制的头像在画布上的位置
    var avatarurl_y = (that.data.imageWidth / 750) * 37  //绘制的头像在画布上的位置
    wx.downloadFile({
      url: 'https://m.dmallovo.com/diamondStar/img_sy_01.png',
      success: (res) => {
        ctx.drawImage(res.tempFilePath, 0, 0, (that.data.imageWidth / 750) * 664, (that.data.imageWidth / 750) * 910)
        ctx.beginPath()
        // ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, 43, 0, 3 * Math.PI)
        // ctx.setFillStyle('rgba(246,248,254,.2)')
        // ctx.fill()
        ctx.save()
        ctx.beginPath()
        ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, (that.data.imageWidth / 750) * 145 / 2, 0, Math.PI * 2, false)
        ctx.fill()
        ctx.clip()
        wx.downloadFile({
          url: that.data.userInfo.iconUrl,
          success: (res1) => {
            let str = that.data.userInfo.userName + '送你五分钻石'
            ctx.drawImage(res1.tempFilePath, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth)
            ctx.restore()
            ctx.setFontSize((that.data.imageWidth / 750) * 36)
            ctx.setFillStyle('#000')
            console.log(that.data.imageWidth / 2)
            ctx.fillText(str, ((that.data.imageWidth / 750) * 664) / 2 - (ctx.measureText(str).width / 2), (that.data.imageWidth / 750) * 350)
            ctx.setFontSize((that.data.imageWidth / 750) * 26)
            let str2 = '扫码领取钻石'
            ctx.fillText(str2, ((that.data.imageWidth / 750) * 664) / 2 - (ctx.measureText(str2).width / 2), (that.data.imageWidth / 750) * 820)
            wx.downloadFile({
              url: that.data.inviteCode,
              success: (res2) => {
                ctx.drawImage(res2.tempFilePath, (that.data.imageWidth / 750) * 215, (that.data.imageWidth / 750) * 515, (that.data.imageWidth / 750) * 240, (that.data.imageWidth / 750) * 240)
                ctx.draw()
                wx.hideLoading()
                that.setData({
                  showInviteCard: true,
                  isShow1: true,
                })
                setTimeout(() => {
                  that.saveImage()
                },500)
              }
            })
          }
        })
      },
      fail: (res) => {
        console.log(res)
        console.log('失败')
      }
    })
  },
  /**
   * 获取邀请二维码
   */
  getInviteCode: () => {
    app.ajax({
      url: '/yxinvite/makeInviteQRCode',
      data: {
        token: app.getUserInfo().token,
        url: 'pages/index/index',
      }
    }, (res) => {
      that.setData({
        inviteCode: res.data.data.qrCode
      })
    })
  },
  /**
   * 保存图片 && 生成图片
   */
  saveImage: (event) => {
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 366,
      height: 502,
      destWidth: 366,
      destHeight: 502,
      canvasId: 'inviteCode',
      success: function (res) {
        console.log('生成图片成功')
        if (!that.data.preurl) {
          that.setData({
            preurl: res.tempFilePath
          })
        }
      },
      fail: (res) => {
        console.log(res)
      }
    })
    if (event) {
      if (wx.getStorageSync('writePhotosAlbum')) {
        that.getWxImg()
      } else {
        that.getWxImg()
      }
    }
  },
  /**
   * 微信授权
   */
  getWxImg: () => {
    wx.getSetting({
      success(res) {
        console.log(res.authSetting['scope.writePhotosAlbum'])
        if (res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.setStorageSync('writePhotosAlbum', true)
              // 用户已经同意小程序相册功能，后续调用 wx.saveImageToPhotosAlbum 接口不会弹窗询问
              that.startSaveImage()
            },
            fail() {
              console.log('fail')
              wx.setStorageSync('writePhotosAlbum', false)
            }
          })
        } else {
          that.startSaveImage()
        }
      }
    })
  },
  /**
   * 保存功能
   */
  startSaveImage: function () {
    if (!that.data.isSave) {
      wx.saveImageToPhotosAlbum({
        filePath: that.data.preurl,
        success(res) {
          wx.showToast({
            title: '图片保存成功~',
            icon: 'success',
            duration: 1000
          })
          that.setData({
            isSave: true
          })
        }
      })
    } else {
      wx.showToast({
        title: '您已经保存过啦,快前往我的相册分享给好友吧~',
        icon: 'none',
        duration: 1000
      })
    }
  },
  /**
   * 跳转
   */
  toList: () => {
    wx.navigateTo({
      url: '/pages/invite/inviteList/inviteList'
    })
  },
  /**
   * 兑换专区
   */
  getChangeList: () => {
    app.ajax({
      url: '/mllad/list?pageCode=yx_applet_rights'
    }, (rsp) => {
      that.setData({
        diamondChange: rsp.data.data[1].contentList
      })
    })
  },
  // 获取积分信息
  getIntergral: () => {
    if (app.getUserInfo().token) {
      app.ajax({
        url: '/yxuser/getUserIntegral',
        data: {
          token: app.getUserInfo().token
        }
      }, (rsp) => {
        console.log(rsp)
        that.setData({
          memberInfo: rsp.data.data
        })
      })
    }
  },
  // 跳转校验
  navigateFnc: (e) => {
    var token = app.getUserInfo().token
    if (e.currentTarget.dataset.key === 'change' && token) {
      if (that.data.memberInfo.diamond < 0) {
        wx.showModal({
          title: '温馨提示',
          content: '哎呀，你口袋里没有钻石，先去邀请好友赚钻石吧!',
          showCancel: false
        })
        util.navigateFnc(e.currentTarget.dataset.url)
      } else if (that.data.memberInfo.diamondStatus) {
        wx.showModal({
          title: '温馨提示',
          content: '您已经预约过钻石兑换啦，期待您到店~',
          showCancel: false
        })
      } else {
        util.navigateFnc(e.currentTarget.dataset.url)
      }
    } else {
      util.navigateFnc(e.currentTarget.dataset.url)
    }
  },
  /**
   * 展示邀请图片
   */
  inviteShow: () => {
    wx.showLoading({
      title: '图片加载中',
    })
    if (!that.data.isShow1) {
      that.drawInviteImage()
    } else {
      wx.hideLoading()
      that.setData({
        showInviteCard: true
      })
    }
  },
  closeCard: () => {
    that.setData({
      showInviteCard: false,
      canvasShow: false
    })
  },
  // 获取积分信息
  getIntergral: () => {
    if (app.getUserInfo().token) {
      app.ajax({
        url: '/yxuser/getUserIntegral',
        data: {
          token: app.getUserInfo().token
        }
      }, (rsp) => {
        that.setData({
          memberInfo: rsp.data.data
        })
      })
    }
  }
})