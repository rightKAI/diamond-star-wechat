// pages/member/babyGift/babyGift.js
const app = getApp()
var that
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activitySn: '',
    description: '', //活动说明
    img_url: '', //图片地址
    title_Shop: '', //店铺地址
    openTime: '', //营业起始时间
    closeTime: '', //营业关闭时间
    appointmentCount: '', //预约人数
    username: '', //称呼
    phone: '',
    appointmentName: '',
    appointmentDate: '',
    userId: '',
    storeId: '',
    isAppintment: false, //是否预约
    checkLove: '', //是否绑定
    flag: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    this.setData({
      activitySn: options.activitySn
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      appointmentName: wx.getStorageSync('USER_INFO').userName
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    that = this
    this.setData({
      checkLove: app.getUserInfo().checkLove
    })
    var locaCache = wx.getStorageSync('locaCache')
    if (locaCache) {
      that.getStoreInfo(locaCache.lat, locaCache.lng)
    } else {
      util.getLocaltion((localtionInfo) => {
        that.getStoreInfo(localtionInfo.latitude, localtionInfo.longitude)
      }, that.getStoreInfo())
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
    wx.navigateTo({
      url: '/pages/myLover/myLover'
    });
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
    app.ajax({
      url: '/yxsee/activityshow',
      method: 'POST',
      data: {
        token: app.getUserInfo().token,
        storeId: that.data.storeId_prev || '',
        activitySn: that.data.activitySn,
        activityGoodsTypeId: 2,
        lat: lat || '',
        lng: lng || ''
      },
    }, (res) => {
      if (res.data.data.bookingStatus !== 0) {
        that.setData({
          isAppintment: true
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
        bookingStatus: res.data.data.bookingStatus,
        loveJudge: res.data.data.loveJudge
      })
    })
  }
})