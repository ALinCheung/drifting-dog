// pages/scan-code/scan-code.js
Page({
  data: {
    scanCodeInfo: null
  },
  onLoad(option) {
    const page = this
    const eventChannel = page.getOpenerEventChannel()
    eventChannel.on('scanCodeInfo', function (data) {
      page.setData({
        scanCodeInfo: data
      })
    })
  }
})