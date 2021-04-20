const app = getApp();

Page({
  mixins: [require('../../mixin/themeChanged')],
  data: {
    time: app.globalData.now,
    appList: [{
      name: "分数计算",
      url: "../score/index",
      icon: "../images/icon_nav_layout.png"
    }]
  }
});