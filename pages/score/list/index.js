const {
  setWatcher
} = require("../../../libs/WatchUtils");
var base64 = require("../../images/base64");

function Score(userId, userName, score, disable) {
  this.userId = userId;
  this.userName = userName;
  this.score = score;
  this.disable = disable;
}

Page({
  data: {
    time: null,
    users: [],
    score: [],
    scores: [],
    show: false,
    keyBoardHeight: 0
  },
  onLoad: function (option) {
    const page = this
    // 页面参数传递
    const eventChannel = page.getOpenerEventChannel()
    let scoreInfo;
    if (JSON.stringify(eventChannel) != "{}") {
      eventChannel.on('scoreInfo', function (data) {
        scoreInfo = data
        page.setData({
          time: scoreInfo.time,
          users: scoreInfo.users,
          scores: scoreInfo.scores
        })
      })
    }
    // 页面转发
    const options = page.options;
    if (JSON.stringify(options) != "{}" && options.data) {
      scoreInfo = JSON.parse(options.data)
      page.setData({
        time: scoreInfo.time,
        users: scoreInfo.users
      })
    }

    // 设置监听
    setWatcher(this)

    this.setData({
      icon: base64.icon20,
      slideButtons: [{
        type: 'warn',
        text: '警示',
        extClass: 'slideview-icon',
        src: '/pages/images/icon_del.svg', // icon的路径
      }]
    })
  },
  onShareAppMessage(option) {
    let scoreInfo = {
      time: this.data.time,
      users: this.data.users
    }

    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "分数计算详情", // 默认是小程序的名称(可以写slogan等)
      path: '/pages/score/list/index?data='+JSON.stringify(scoreInfo), // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: '', //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function (res) {
        console.log(res)
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {}
      },
      fail: function (res) {
        console.log(res)
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
      complete: function(res) {
        console.log(res)
        // 转发结束之后的回调（转发成不成功都会执行）
      },
    }
    // 来自页面内的按钮的转发
    if (option.from == 'button') {
      // var eData = options.target.dataset;
      // console.log(eData.name); // shareBtn
      // 此处可以修改 shareObj 中的内容
      // shareObj.path = '/pages/';
    }
    // 返回shareObj
    return shareObj;
  },
  watch: {
    'scores': function (scores) {
      let time = this.data.time
      let users = this.data.users
      // 获取本地缓存
      let scoreStorage = wx.getStorageSync('scoreStorage')
      if (scoreStorage == '') {
        scoreStorage = [];
      }
      let scoreInfo = {
        time: time,
        users: users,
        scores: scores
      }
      if (scores.length > 0) {
        let isExists = false;
        for (let i = 0; i < scoreStorage.length; i++) {
          if (scoreStorage[i].time == time) {
            scoreStorage[i] = scoreInfo
            isExists = true;
          }
        }
        if (!isExists) {
          scoreStorage.unshift(scoreInfo)
        }
      } else {
        // 清空记录
        let scoreStorageTemp = []
        for (let i = 0; i < scoreStorage.length; i++) {
          if (scoreStorage[i].time != time) {
            scoreStorageTemp.push(scoreStorage[i])
          }
        }
        scoreStorage = scoreStorageTemp
        // 创建新对局
        time = new Date().format("yyyy-MM-dd hh:mm:ss")
        for (let i = 0; i < users; i++) {
          users[i].score = 0
        }
        this.setData({
          time: time,
          users: users
        })
        // 如果缓存超过20个则删掉最后一个
        if (scoreStorage.length >= 20) {
          scoreStorage.pop();
        }
      }
      wx.setStorage({
        data: scoreStorage,
        key: 'scoreStorage',
      })
    }
  },
  slideButtonTap(e) {
    let index = e.target.id;
    let users = this.data.users;
    let scores = this.data.scores;
    // 统计总数
    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < scores[index].length; j++) {
        if (users[i].id == scores[index][j].userId) {
          users[i].score -= parseInt(scores[index][j].score);
        }
      }
    }
    scores.splice(index, 1);
    this.setData({
      users: users,
      scores: scores
    })
  },
  openAddScoreDialog() {
    let score = []
    let users = this.data.users;
    for (let i = 0; i < users.length; i++) {
      score.push(new Score(users[i].id, users[i].name, null, false))
    }
    this.setData({
      show: true,
      score: score
    })
  },
  closeAddScoreDialog: function () {
    // 收起键盘
    this.closeKeyBoard()
    this.setData({
      show: false
    });
  },
  resetScore(e) {
    let page = this
    wx.showModal({
      title: '提示',
      content: '是否确定清空全部分数',
      success: function (res) {
        if (res.confirm) {
          page.setData({
            scores: []
          })
          page.resetUsersScore()
        }
      }
    })
  },
  checkScore() {
    // 检查输入数据个数
    let score = this.data.score;
    let size = 0;
    for (let i = 0; i < score.length; i++) {
      if (score[i].score != null && score[i].score != '') {
        size++;
      }
    }
    return size == score.length - 1;
  },
  checkAddScore(e) {
    let score = this.data.score;
    // 绑定数据
    let index = parseInt(e.currentTarget.id.replace("score-add-", ""));
    let scoreValue = e.detail.value;
    score[index].score = scoreValue;
    for (let i = 0; i < score.length; i++) {
      if (this.checkScore()) {
        if (score[i].score == null || score[i].score == '') {
          score[i].disable = true;
        }
      } else {
        score[i].disable = false;
      }
    }
    this.setData({
      score: score
    })
  },
  addScore(e) {
    let users = this.data.users;
    let score = this.data.score;
    let scores = this.data.scores;
    let reg = /^[0-9]+.?[0-9]*$/;
    // 判断输入个数
    if (this.checkScore()) {
      // 添加每局信息
      let total = 0
      for (let i = 0; i < score.length; i++) {
        if (score[i].score != null && score[i].score != '') {
          // 判断数字
          if (!reg.test(score[i].score)) {
            wx.showModal({
              title: '提示',
              content: score[i].userName + '用户输入框请填写数字'
            })
            return
          }
          total += parseInt(score[i].score);
          score[i].score = -score[i].score;
        }
      }
      for (let i = 0; i < score.length; i++) {
        if (score[i].score == null || score[i].score == '') {
          score[i].score = total;
        }
      }
      scores.unshift(score)
      // 统计总数
      for (let i = 0; i < users.length; i++) {
        for (let j = 0; j < score.length; j++) {
          if (users[i].id == score[j].userId) {
            users[i].score += parseInt(score[j].score);
          }
        }
      }
      // 绑定数据
      this.setData({
        users: users,
        scores: scores
      })
      // 关闭弹窗
      this.closeAddScoreDialog()
      // 收起键盘
      this.closeKeyBoard()
    } else {
      wx.showModal({
        title: '提示',
        content: '输入框至少填写' + (score.length - 1) + '个'
      })
      return
    }
  },
  resetUsersScore() {
    let users = this.data.users;
    for (let i = 0; i < users.length; i++) {
      users[i].score = 0;
    }
    this.setData({
      users: users
    })
  },
  focusKeyBoardHeight(e) {
    let height = e.detail.height
    this.setData({
      keyBoardHeight: height
    })
  },
  closeKeyBoard(e) {
    this.setData({
      keyBoardHeight: 0
    })
  },
  checkKeyboard(e) {
    let height = e.detail.height
    if (height == 0) {
      // 收起键盘
      this.closeKeyBoard()
    }
  }
});