require('./libs/Mixins.js');
require('./libs/DateUtils.js');
require('./libs/WatchUtils.js');

const themeListeners = [];

App({
	globalData: {
		now: (new Date()).toLocaleString(),
		theme: 'light', // dark
	},
	themeChanged(theme) {
		this.globalData.theme = theme;
		themeListeners.forEach((listener) => {
			listener(theme);
		});
	},
	watchThemeChange(listener) {
		if (themeListeners.indexOf(listener) < 0) {
			themeListeners.push(listener);
		}
	},
	unWatchThemeChange(listener) {
		const index = themeListeners.indexOf(listener);
		if (index > -1) {
			themeListeners.splice(index, 1);
		}
	},
	onShow() {
		//新版本更新
		if(wx.canIUse( "getUpdateManager")){
			const updateManager = wx.getUpdateManager();
			updateManager.onCheckForUpdate(function (res) {
				//请求完新版本信息的回调
				if (res.hasUpdate) {
					updateManager.onUpdateReady(function() {
						wx.showModal({
							title: "新版本已发布",
							content: "自动更新问题处理, 是否重启小程序?",
							success: function(res) {
								if (res.confirm) {
									//新的版本已经下载好，调用applyUpdate 应用新版本并重启
									updateManager.applyUpdate();
								}
							}
						})
					})
					updateManager.onUpdateFailed(function() {
						// 新版本下载失败
						wx.showToast({
							title: '新版本下载失败',
						})
					})
				}
			})
		}
	}
});