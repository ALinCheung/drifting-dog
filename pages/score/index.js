var base64 = require("../images/base64");

// 用户对象
function User(id, name, score) {
  this.id = id;
  this.name = name;
  this.score = score;
}

Page({
  data: {
    time: new Date().format("yyyy-MM-dd hh:mm:ss"),
    usersCount: 4,
    users: [
      // 测试用户
      {
        id: 1,
        name: "a",
        score: 0
      },
      {
        id: 2,
        name: "b",
        score: 0
      },
      {
        id: 3,
        name: "c",
        score: 0
      },
      {
        id: 4,
        name: "d",
        score: 0
      },
    ],
    scoresHistory: []
  },
  onLoad(e) {
    // 初始化用户
    let users = this.data.users;
    let usersCount = this.data.usersCount;
    if (users.length < usersCount) {
      let size = usersCount - users.length;
      for (var i = 0; i < size; i++) {
        this.addUser()
      }
    }
    // 获取本地缓存
    this.getLocalCache()

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
  onShow() {
    this.getLocalCache()
  },
  getLocalCache() {
    // 获取本地历史缓存
    let scoreStorage = wx.getStorageSync('scoreStorage')
    if (scoreStorage == '') {
      scoreStorage = [];
    }
    this.setData({
      scoresHistory: scoreStorage
    })
  },
  // 添加用户
  addUser() {
    let users = this.data.users;
    let usersCount = this.data.usersCount;
    if (users.length == usersCount) {
      wx.showModal({
        title: '提示',
        content: '用户数不能超过' + usersCount + '个',
        success: function (res) {}
      })
    } else {
      users.push(new User())
      this.setData({
        users: users
      })
    }
  },
  // 删除用户
  removeUser() {
    let users = this.data.users;
    users.pop()
    this.setData({
      users: users
    })
  },
  // 设置用户名
  setName: function (e) {
    let index = parseInt(e.currentTarget.id.replace("name-", ""));
    let name = e.detail.value;
    let users = this.data.users;
    users[index - 1].id = index;
    users[index - 1].name = name;
    users[index - 1].score = 0;
    this.setData({
      users: users
    });
  },
  // 开始计算
  submit(e) {
    let users = this.data.users;
    let usersCount = this.data.usersCount;
    // 验证用户数量
    if (users.length > usersCount) {
      let title = '用户数不能超过' + usersCount + '个'
      wx.showModal({
        title: '提示',
        content: title,
        success: function (res) {}
      })
      return
    }
    let userNames = [];
    // 验证用户名是否为空
    let index = 0;
    for (const user of users) {
      index++;
      if (user.id === undefined ||
        user.id == null ||
        user.id == '' ||
        user.name == null ||
        user.name == '') {
        wx.showModal({
          title: '提示',
          content: '用户' + index + '名称不能为空',
          success: function (res) {}
        })
        return
      }
      userNames.push(user.name);
    }
    // 验证重复用户名
    userNames = Array.from(new Set(userNames))
    if (userNames.length != users.length) {
      wx.showModal({
        title: '提示',
        content: '不能有重复的用户名',
        success: function (res) {}
      })
      return
    }
    let scoreInfo = {
      time: new Date().format("yyyy-MM-dd hh:mm:ss"),
      users: users,
      scores: []
    }
    // 跳转至列表
    this.navigateToList(scoreInfo)
  },
  // 提交历史对局
  submitHistory(e) {
    let scoreStorage = wx.getStorageSync('scoreStorage')
    // 跳转至列表
    this.navigateToList(scoreStorage[e.currentTarget.id])
  },
  // 滑动删除记录
  slideButtonTap(e) {
    let scoreStorage = wx.getStorageSync('scoreStorage')
    scoreStorage.splice(e.currentTarget.id, 1)
    wx.setStorage({
      data: scoreStorage,
      key: 'scoreStorage',
    })
    this.setData({
      scoresHistory: scoreStorage
    })
  },
  navigateToList(scoreInfo) {
    // 跳转至列表
    wx.navigateTo({
      url: './list/index',
      success(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('scoreInfo', scoreInfo)
      }
    })
  }
});