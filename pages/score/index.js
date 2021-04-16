function User(id, name, score) {
  this.id = id;
  this.name = name;
  this.score = score;
}

Page({
  data: {
    usersCount: 4,
    users: []
  },
  onLoad(e) {
    // 初始化用户
    let users = this.data.users;
    let usersCount = this.data.usersCount;
    if (users.length < usersCount) {
      let size = usersCount - users.length;
      for(var i=0;i<size;i++) {
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
    users[index-1].score = 0;
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
      if (user.id === undefined 
        || user.id == null 
        || user.id == ''
        || user.name == null 
        || user.name == '') {
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