function User(id, name, score) {
  this.id = id;
  this.name = name;
  this.score = score;
}

Page({
  data: {
    usersCount: 4,
    users: [
      {
        id: "1",
        name: "张文霖",
        score: 0
      },
      {
        id: "2",
        name: "黄梓扬",
        score: 0
      },
      {
        id: "3",
        name: "苏毅铭",
        score: 0
      },
      {
        id: "4",
        name: "钟国标",
        score: 0
      }
    ]
  },
  onLoad(e) {
    // 初始化用户
    let users = this.data.users;
    let usersCount = this.data.usersCount;
    if (users.length < usersCount) {
      for(var i=0;i<(usersCount - users.length);i++) {
        this.addUser()
      }
    }
  },
  addUser() {
    let users = this.data.users;
    users.push(new User())
    this.setData({
      users: users
    })
  },
  removeUser() {
    let users = this.data.users;
    users.pop()
    this.setData({
      users: users
    })
  },
  setName: function (e) {
    let index = parseInt(e.currentTarget.id.replace("name-", ""));
    let name = e.detail.value;
    let users = this.data.users;
    users[index-1].id = index;
    users[index-1].name = name;
    this.setData({
      users: users
    });
  },
  submit(e) {
    let users = this.data.users;
    let usersCount = this.data.usersCount;
    if (users.length > usersCount) {
      let title = '用户数不能超过' + usersCount + '个'
      wx.showModal({
        title: '提示',
        content: title,
        success: function (res) {}
      })
      return
    }
    for(const user of users) {
      if (user.id === undefined) {
        wx.showModal({
          title: '提示',
          content: '输入框不能为空',
          success: function (res) {}
        })
        return
      }
    }
    wx.navigateTo({
      url: './list/index',
      success(res){
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('scoreUserList', users)
      }
    })
  }
});