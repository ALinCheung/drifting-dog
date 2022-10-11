const app = getApp();

Page({
  mixins: [require('../../mixin/themeChanged')],
  data: {
    time: new Date().format("yyyy-MM-dd hh:mm:ss"),
    appList: [
      {
        name: "扫一扫",
        url: "../scan-code/scan-code",
        icon: "../images/icon_nav_layout.png",
        event(url) {
          wx.scanCode({
            success(res) {
              if (res.result) {
                let scanCodeResult = res;
                wx.navigateTo({
                  url: url,
                  success(res) {
                    res.eventChannel.emit('scanCodeInfo', scanCodeResult)
                  }
                })
              }
            },
            fail(res) {
              console.log('扫码失败', res)
              // wx.showToast({
              //   title: '扫码失败',
              //   icon: 'error',
              //   duration: 2000
              // })
            }
          })
        }
      },
      {
        name: "分数计算",
        url: "../score/index",
        icon: "../images/icon_nav_layout.png",
      },
      {
        name: "地图",
        url: "../map/map",
        icon: "../images/icon_nav_layout.png",
      },
    ]
  },
  onLoad: function (options) {
    let o = this;
    setInterval(() => {
      o.setData({
        time: new Date().format("yyyy-MM-dd hh:mm:ss")
      })
    }, 1000)
  },
  tap(e) {
    let index = parseInt(e.currentTarget.id.replace("app-", ""))
    let appList = this.data.appList
    // 判断应用是否有触发事件
    if (appList[index].event != undefined) {
      appList[index].event(appList[index].url);
    } else {
      // 跳转页面
      wx.navigateTo({
        url: appList[index].url,
      })
    }
  }
});