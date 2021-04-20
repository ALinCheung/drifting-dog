const app = getApp();

Page({
  mixins: [require('../../mixin/themeChanged')],
  data: {
    time: app.globalData.now,
    appList: [{
      name: "分数计算",
      url: "../score/index",
      icon: "../images/icon_nav_layout.png",
    },
    {
      name: "扫一扫",
      url: "../scan-code/scan-code",
      icon: "../images/icon_nav_layout.png",
      event(url) {
        wx.scanCode({
          success (res) {
            if (res.result) {
              let scanCodeResult = res;
              wx.navigateTo({
                url: url,
                success(res){
                  res.eventChannel.emit('scanCodeInfo', scanCodeResult)
                }
              })
            }
          }
        })
      }
    }]
  },
  tap(e) {
    let index =  parseInt(e.currentTarget.id.replace("app-",""))
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