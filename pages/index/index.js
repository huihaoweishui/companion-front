//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        motto: 'Welcome',
        userInfo: {},
        partner: {
            nickName: null,
            avatarUrl: null
        },
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    //邀请
    onShareAppMessage: function (res) {
        return {
            title: '邀请你成为我的另一半！',
            path: '/pages/invite/invite?openId=' + wx.getStorageSync("openId"),
            imageUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1573545736&di=eefd49e6534ae1d6c8659858da444efb&imgtype=jpg&er=1&src=http%3A%2F%2Fpic39.nipic.com%2F20140327%2F9534185_182037594149_2.jpg'//自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4。
        }
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function () {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },
    onShow() {
        try {
            const updateManager = wx.getUpdateManager();
            updateManager.onCheckForUpdate(function (res) {
                if (res.hasUpdate) {
                    updateManager.onUpdateReady(function () {
                        wx.showModal({
                            title: '更新提示',
                            content: '新版本已经准备好，重启应用？',
                            showCancel: false,
                            success: function (res) {
                                if (res.confirm) {
                                    updateManager.applyUpdate();
                                }
                            },
                        });
                    });
                }
            });
        } catch (error) {
            console.log(error);
        }
        this.getPartner()
    },
    getUserInfo: function (e) {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    invitePartner() {

    },
    getPartner() {
        app.$http({
            url: '/companion/partner',
            method: "post",
            data: {
                openId: wx.getStorageSync("openId")
            }
        }).then(res => {
            if (res.data) {
                const loveDay = res.data.loveDay;
                const startDate = new Date(loveDay);
                const endDate = new Date();
                const diff = endDate.getTime() - startDate.getTime();//时间差的毫秒数
                //计算出相差天数
                const num = Math.ceil(diff / (24 * 3600 * 1000));
                this.setData({
                    ['partner.nickName']: res.data.nickName,
                    ['partner.avatarUrl']: res.data.avatarUrl,
                    motto: '这是你和' + res.data.gender + '在一起的第' + num + '天'
                })
            }
        })
    }
})
