// pages/address/addAddress/add.js
var app = getApp()
var that 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    addressDetail: '',
    phoneNumber: '',
    region: ['省份', '城市', '地区'],
    token: app.getUserInfo().token,
    isChoose: false
  },
  // 保存
  searchBox: (event) => {
    if (event.detail.value.userName) {
      if (event.detail.value.phoneNumber) {
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
        if (!myreg.test(event.detail.value.phoneNumber)) {
          wx.showToast({
            title: '请输入正确的手机号码',
            icon: 'none',
            duration: 1000
          })
          return false
        } else if (!that.data.dateFlag) {
          wx.showToast({
            title: '请选择地址',
            icon: 'none',
            duration: 1000
          })
          return false
        } else if (!event.detail.value.address_detail) {
          wx.showToast({
            title: '请输入详细地址',
            icon: 'none',
            duration: 1000
          })
          return false
        }
        var url
        var data = {
          token: app.getUserInfo().token,
          userName: event.detail.value.userName,
          phone: event.detail.value.phoneNumber,
          province: that.data.region[0],
          city: that.data.region[1],
          area: that.data.region[2],
          address: event.detail.value.address_detail,
          isDefault: "0"
        }
        if (that.data.isAdd) {
          url = '/YXaddress/update'
          data.id = that.data.isAdd
        } else {
          url = '/YXaddress/add'
        }
        app.ajax({
          url: url,
          data: data,
          method: 'POST'
        }, (res) => {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: that.data.isAdd ? '修改地址成功' : '添加地址成功',
            success: () => {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              },1000)
            }
          })
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
        title: '收货人不能为空',
        icon: 'none',
        duration: 1000
      });
      return 
    }
  },
  // 数据清除
  clearContent: (event) => {
    var cs = event.currentTarget.dataset.bind
    if (cs == 1) {
      that.setData({
        userName: ''
      })
    } else {
      that.setData({
        phoneNumber: ''
      })
    }
  },
  // 选择日期校验
  bindRegionChange (date) {
    for (let index in date.detail.value) {
        let region = that.data.region
        region[index] = date.detail.value[index]
        that.setData({
          region
        })
      }
    that.setData({
      dateFlag: true
    })
  },
  // 获取省市区列表
  // getListProvince (promise) {
  //   app.ajax({
  //     url: '/common/listProvince',
  //     method: 'POST'
  //   }, (res) => {
  //     let addressArray = that.data.addressArray
  //     addressArray.push(res.data.data)
  //     that.setData({
  //       addressArray: addressArray
  //     })
  //     that.getListCity(promise)
  //   })
  // },
  // getListCity(promise) {
  //   app.ajax({
  //     url: '/common/listCity',
  //     method: 'POST'
  //   }, (res) => {
  //     let addressArray = that.data.addressArray
  //     addressArray.push(res.data.data)
  //     that.setData({
  //       addressArray: addressArray
  //     })
  //     that.getListArea(promise)
  //   })
  // },
  // getListArea(promise) {
  //   app.ajax({
  //     url: '/common/listArea',
  //     method: 'POST'
  //   }, (res) => {
  //     let addressArray = that.data.addressArray
  //     addressArray.push(res.data.data)
  //     that.setData({
  //       addressArray: addressArray
  //     })
  //     promise()
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    if (options.addressInfo) {
      that.setData({
        isAdd: options.addressInfo
      })
    }
    if (options.addressInfo) {
      wx.setNavigationBarTitle({
        title: '编辑地址'
      })
      app.ajax({
        url: '/YXaddress/get',
        data: {
          token: app.getUserInfo().token,
          id: options.addressInfo
        },
        method: 'get'
      }, (res) => {
        let customItem = []
        customItem.push(res.data.data.provinceName)
        customItem.push(res.data.data.cityName)
        customItem.push(res.data.data.areaName)
        that.setData({
          userName: res.data.data.userName,
          phoneNumber: res.data.data.phone,
          addressDetail: res.data.data.address,
          region: customItem,
          dateFlag: true
        })
        console.log(that.data.customItem)
      })
    } else {
      wx.setNavigationBarTitle({
        title: '新增地址'
      })
    }
    // that.getListProvince(() => {
    //   console.log(that.data.addressArray)
    // })
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