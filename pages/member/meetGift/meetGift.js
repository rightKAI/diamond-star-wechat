// pages/member/babyGift/babyGift.js
const app = getApp()
var that
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkLove: '',
    activitySn: '',
    description: '', //活动说明
    img_url: '', //图片地址
    title_Shop: '', //店铺地址
    openTime: '', //营业起始时间
    closeTime: '', //营业关闭时间
    appointmentCount: '', //预约人数
    username: '', //称呼
    phone: '',
    appointmentDate: '',
    userId: '',
    storeId: '',
    btngrey: false,
    loveJudge: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      activitySn: options.activitySn
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    that = this
    
    var locaCache = wx.getStorageSync('locaCache')
    if (locaCache) {
      that.getStoreInfo(locaCache.lat, locaCache.lng)
    } else {
      util.getLocaltion((localtionInfo) => {
        that.getStoreInfo(localtionInfo.latitude, localtionInfo.longitude)
      }, that.getStoreInfo())
    }
    this.setData({
      checkLove: app.getUserInfo().checkLove
    })
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

  },

  username: function (e) {
    this.setData({
      username: e.detail.value
    })
  },

  phone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  appointmentDate: function (e) {
    this.setData({
      appointmentDate: e.detail.value
    })
  },
  takePart: function () {
    if (!that.data.btngrey) {
      if (!that.data.checkLove) {
        wx.navigateTo({
          url: '/pages/myLover/myLover?page=true'
        })
      } else {
        app.ajax({
          url: '/myFamily/getMeetGift',
          method: 'POST',
          data: {
            token: app.getUserInfo().token
          }
        }, (res) => {
          wx.showToast({
            title: '领取情侣礼成功',
          })
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/intoShop/intoShop?activitySn=' + that.data.activitySn
            })
          }, 500)
        })
      }
    }
  },
  appintmentList: function () {
    wx.navigateTo({
      url: '/pages/appointment/appointment'
    });
  },
  // 发送
  send: function (e) {
    var nickName = that.data.username
    var phone = that.data.phone
    var appointmentDate = that.data.appointmentDate
    if (nickName) {
      if (phone) {
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
        if (!myreg.test(phone)) {
          wx.showToast({
            title: '请输入正确的手机号码',
            icon: 'none',
            duration: 1000,
          })
          return false
        } else if (!that.data.appointmentDate) {
          wx.showToast({
            title: '请选择预约日期',
            icon: 'none',
            duration: 1000,
          })
          return false
        }
        app.ajax({
          url: '/yxsee/activityappointment',
          method: 'POST',
          data: {
            token: app.getUserInfo().token,
            username: that.data.username,
            phone: that.data.phone,
            storeId: that.data.storeId,
            date: that.data.appointmentDate,
            userId: that.data.userId,
            activitySn: that.data.activitySn,
            activityGoodsTypeId: 2
          }
        }, (res) => {
          wx.showToast({
            title: '预约成功',
            icon: 'none',
            duration: 1500,
            mask: false,
          });
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/appointment/appointment'
            });
          }, 1000);
        })
      } else {
        wx.showToast({
          title: '请输入手机号',
          icon: 'none',
          duration: 1500,
          mask: false,
        })
      }
    } else {
      wx.showToast({
        title: '昵称不能为空',
        icon: 'none',
        duration: 1000,
        mask: false,
      })
      return
    }
  },
  // 获取门店信息
  getStoreInfo: (lat, lng) => {
    console.log(111)
    app.ajax({
      url: '/yxsee/activityshow',
      method: 'POST',
      data: {
        token: app.getUserInfo().token,
        activitySn: that.data.activitySn,
        activityGoodsTypeId: 2,
        lat: lat || '',
        lng: lng || ''
      },
    }, (res) => {
      if ((res.data.data.loveJudge == 3) || (res.data.data.loveJudge == 5) || (res.data.data.loveJudge == 1) && app.getUserInfo().checkLove) {
        that.setData({
          btngrey: true
        })
      }
      that.setData({
        img_url: res.data.data.store.imgUrl,
        title_Shop: res.data.data.store.name,
        openTime: res.data.data.store.openTime,
        closeTime: res.data.data.store.closeTime,
        appointmentCount: res.data.data.appointmentCount,
        description: res.data.data.wx_describe,
        userId: res.data.data.user.userId, //用户ID
        storeId: res.data.data.store.id, //店铺id
        loveJudge: res.data.data.loveJudge
      })
    })
  },
  // 领取单身礼品
  getOneGift: function () {
    wx.showModal({
      title: '温馨提示',
      content: '你好~见面礼仅限领取一次,要不要升级礼物？',
      cancelText: '继续领取',
      confirmText: '绑定情侣',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/myLover/myLover?page=true'
          })
        } else if (res.cancel) {
          app.ajax({
            url: '/myFamily/getMeetGift',
            method: 'POST',
            data: {
              token: app.getUserInfo().token
            }
          }, (res) => {
            wx.showToast({
              title: '领取单身礼成功',
            })
            setTimeout(() => {
              wx.navigateTo({
                url: '/pages/intoShop/intoShop?activitySn=' + that.data.activitySn
              })
            }, 500)
          })
        }
      }
    })
    
  }
})