// pages/member/integralCenter/integralCenter.js
var that
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showExchangePage: 1,
    integralUserPut: '',
    exchangeCode: '',
    integral: 0,
    showTips: false,
    showDialog: false,
    phoneNum: '',
    isbind: true,
    flag:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
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
    that.getIntegral()
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
  showExchangePageEven () {
    let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
    if (!that.data.integralUserPut) {
      wx.showToast({
        title: '请输入要兑换的积分',
        icon: 'none'
      })
      return false
    } else if (!that.data.isbind && !myreg.test(that.data.phoneNum)) {
      wx.showToast({
        title: '请填写正确的手机号码',
        icon: 'none'
      })
      return false
    } else if (that.data.integralUserPut > that.data.integral) {
      that.setData({
        showTips: true
      })
    } else {
      app.ajax({
        url: '/yxuser/convertIntegral',
        data: {
          token: app.getUserInfo().token,
          integral: that.data.integralUserPut,
          phone: that.data.phoneNum || ''
        }
      },res1 => {
        that.setData({
          appointmentId: res1.data.data.appointmentId
        })
        that.exchangeSuccessPage(true)
      })
    }
    // that.setData({
    //   showExchangePage:3
    // })
  },
  phoneInput (e) {
    that.setData({
      phoneNum: e.detail.value
    })
  },
  // 获取输入框内容
  integralInput (e) {
    if (e.detail.value > that.data.integral) {
      that.setData({
        showTips: true
      })
    } else {
      that.setData({
        showTips: false
      })
    }
    that.setData({
      integralUserPut: e.detail.value
    })
  },
  //查看积分
  getIntegral () {
    app.ajax({
      url: '/yxuser/userIntegral',
      data: {
        token: app.getUserInfo().token
      }
    },res => {
      that.setData({
        integral: res.data.data.integral,
        temp:res.data.data.temp,
        isbind: res.data.data.find
      })
      if (res.data.data.temp) {
        that.setData({
          appointmentId: res.data.data.appointmentId,
        })
      }
    })
  },
  exchangeSuccessPage (flag) {
    app.ajax({
      url: '/yxuser/exchangeInfo',
      data: {
        token: app.getUserInfo().token,
        appointmentId: that.data.appointmentId
      }
    }, res => {
      if (flag) {
        wx.showToast({
          title: '兑换成功',
          duration: 1000,
          icon: 'success'
        })
      }
      that.setData({
        showExchangePage: 3,
        exchangeCode: res.data.data.exchange_sn
      })
      that.getIntegral()
    })
  },
  // 页面切换 
  changePage (e) {
    if(that.data.temp && that.data.showExchangePage != 3) {
      that.exchangeSuccessPage()
      that.setData({
        showExchangePage: 3
      })
    } else {
      that.setData({
        showExchangePage: e.target.dataset.change
      })
    }
  },
  // 取消兑换
  cancelExchange () {
    that.setData({
      showDialog: true
    })
  },
  _error () {
    app.ajax({
      url: '/yxuser/cancelExchange',
      data: {
        token: app.getUserInfo().token,
        appointmentId: that.data.appointmentId
      }, 
      fail: errorData => {
        console.log(errorData)
      }
    },res => {
      wx.showToast({
        title: '取消成功',
      })
      if(res.data.data) {
        that.setData({
          showExchangePage: 2,
          showDialog: false
        })
      } else {
          wx.hideLoading()
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            success: () => {
              that.setData({
                showDialog: false
              })
            }
          })
      }
      setTimeout(() => {
        that.getIntegral()
      },1000)
    })
  },
  _success () {
    that.setData({
      showDialog: false
    })
  },
  showRules () {
    that.setData({
      flag: false
    })
  },
  hide () {
    that.setData({
      flag: true
    })
  }
})