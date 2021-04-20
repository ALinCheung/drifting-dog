var base64 = require("../../images/base64");

function Score(userId, userName, score, disable) {
  this.userId = userId;
  this.userName = userName;
  this.score = score;
  this.disable = disable;
}

Page({
  data: {
    users: [],
    score: [],
    scores: [],
    show: false,
    keyBoardHeight: 0
  },
  onLoad: function (option) {
    const page = this
    const eventChannel = page.getOpenerEventChannel()
    eventChannel.on('scoreUserList', function (data) {
      page.setData({
        users: data
      })
    })

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
    if (this.checkScore()) {
      for (let i = 0; i < score.length; i++) {
        if (score[i].score == null || score[i].score == '') {
          score[i].disable = true;
        }
      }
      this.setData({
        score: score
      })
    }
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