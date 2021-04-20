Page({
  mixins: [require('../../mixin/themeChanged')],
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  login() {
    wx.login({
      success (res) {
        if (res.code) {
          //发起网络请求
          // wx.request({
          //   url: 'https://api.weixin.qq.com/sns/jscode2session?appid='+appId+'&secret='+secret+'&js_code=JSCODE&grant_type=authorization_code',
          //   data: {
          //     code: res.code
          //   }
          // })
          console.log('登录成功！', res)
        } else {
          console.log('登录失败！', res.errMsg)
        }
      }
    })
  }
});