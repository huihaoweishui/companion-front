//record.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        hasPartner: false,
        motto: 'Welcome',
        partner: {
            nickName: null,
            avatarUrl: null
        },
        userInfo: null,
        openId: null
    },
    onLoad: function (ops) {
        this.setData({
            openId: ops.openId
        })
        this.getPartner()
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
                this.setData({
                    hasPartner: true,
                    ['partner.nickName']: res.data.nickName,
                    ['partner.avatarUrl']: res.data.avatarUrl,
                    motto: '这是你和' + res.data.gender + '在一起的第' +  res.data.togetherDay  + '天'
                })
            }
        })
    },
    backHome() {

    },
    //确定授权回掉函数
    bindGetUserInfo(e) {
        const user = e.detail.userInfo
        user['openId'] = wx.getStorageSync("openId")
        //授權時更新用戶信息
        app.updateUserInfo(user).then((res) => {
            console.log(res)
        })
        //绑定当前openId和邀请人的openId为伴侣
        app.$http({
            url: '/companion/bind',
            method: "post",
            data: {
                openId: this.data.openId,
                companionOpenId: wx.getStorageSync("openId")
            }
        }).then(res => {
            console.log(res)
            if (res.status === 0) {
                console.log(312)
                wx.reLaunch({
                    url: '/pages/index/index'
                })
            }
        })
    }
})
