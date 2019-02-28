// pages/intoShop/intoShop.js
const app = getApp();
var that
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //店铺图片
    img_url: '',
    //店铺名字
    name: '',
    //店铺营业时间
    openTime: '',
    closeTime: '',
    appintmentName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.setData({
      options: options,
      activitySn: options.activitySn
    })
    if (options.activitySn) {
      that.setData({
        activitySn: options.activitySn
      })
    }
    if (options.diamondChange) {
      wx.setNavigationBarTitle({
        title: options.diamondChange
      })
      that.setData({
        diamondChange: options.diamondChange
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      appintmentName: wx.getStorageSync('USER_INFO').userName
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
  appointmentDate: function (e) {
    this.setData({
      appointmentDate: e.detail.value
    })
  },
  // 获取门店信息
  getStoreInfo: (lat, lng) => {
    var data
    if (that.data.options.h5) {
      data = {
        token: app.getUserInfo().token,
        storeId: that.data.options.storeId
      }
    } else {
      data = {
        token: app.getUserInfo().token,
        storeId: that.data.storeId_prev || '',
        activitySn: that.data.activitySn || '',
        activityGoodsTypeId: that.data.diamondChange ? "1" : "2",
        lat: lat || '',
        lng: lng || ''
      }
    }
    app.ajax({
      url: '/yxsee/activityshow',
      method: 'POST',
      data: data,
    }, (res) => {
      that.setData({
        storeInfo: res.data.data
      })
    })
  },
  commit: (event) => {
    // 保存
    if (event.detail.value.nickName) {
      if (event.detail.value.phoneNumber) {
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
        if (!myreg.test(event.detail.value.phoneNumber)) {
          wx.showToast({
            title: '请输入正确的手机号码',
            icon: 'none',
            duration: 1000
          })
          return false
        } else if (!that.data.appointmentDate) {
          wx.showToast({
            title: '请选择预约时间',
            icon: 'none',
            duration: 1000
          })
          return false
        }
        app.ajax({
          url: '/yxsee/activityappointment',
          method: 'POST',
          data: {
            token: app.getUserInfo().token,
            username: event.detail.value.nickName,
            phone: event.detail.value.phoneNumber,
            storeId: that.data.storeInfo.store.id,
            date: that.data.appointmentDate,
            interactId: that.data.options.interactId || '',
            userId: app.getUserInfo().userId,
            activitySn: that.data.activitySn || '',
            activityGoodsTypeId: that.data.options.h5?"4":that.data.diamondChange ? "1" : "2"
          }
        }, (res) => {
          if (that.data.options.app) {
            wx.showModal({
              title: '预约成功!',
              content: '预约后，您的钻石分数暂时冻结；兑换后，钻石分数继续累积!',
              icon: 'none',
              showCancel: false,
              mask: false,
              success: () => {
                if (that.data.diamondChange) {
                  wx.navigateTo({
                    url: '/pages/appointment/appointment'
                  })
                } else {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            })
          } else if (that.data.options.giftCard) {
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2]
            prevPage.setData({
              isAppointment_preve : 1,
              id_preve: res.data.data
            })
            wx.showToast({
              title: '预约成功',
              success: () => {
                setTimeout(() => {
                  wx.navigateBack({
                    delta:1
                  })
                }, 500)
              }
            })
          } else {
            wx.showToast({
              title: '预约成功',
              success: () => {
                setTimeout(() => {
                  wx.navigateTo({
                    url: '/pages/appointment/appointment'
                  })
                },500)
              }
            })
          }
        })
      } else {
        wx.showToast({
          title: '请输入手机号码',
          icon: 'none',
          duration: 1000
        })
        return false
      }
    } else {
      wx.showToast({
        title: '你的名字不能为空',
        icon: 'none',
        duration: 1000
      });
      return
    }
  }
})