// const appBase = require()
import appBase from '../config/baseUrl.js'
// 错误提示语
import errorMsg from '../config/errorMsg.js'

let resetStatus = true

/**
 * method {String} 请求方法 get post 等 默认POST
 * url {String} 请求的路径
 * data {Object} 请求的参数
 * showLoading {Boolean} 是否需要 looding 提示，默认提示
 * showTitle {String} looding 提示文字  默认 加载中
 * showToast {Boolean} 是否需要 除了登录以外的 错误提示，默认提示
 */
export const http = ({
                         method = 'POST',
                         url = '',
                         data = {},
                         showLoading = true,
                         navLoading = true,
                         showTitle = '加载中',
                         contentType = '',
                         showToast = true,
                     }) => {
    // 把方法名称转换成大写，因为wx.request 只认识大写
    method = method.toUpperCase()
    // 删除data中的key属性(当其对应的value为空时)
    let obj = {}
    Object.keys(data).forEach(key => {
        if (data[key]) {
            obj[key] = data[key]
        }
    })
    data = obj;
    // 小程序顶部显示Loading
    if (navLoading) {
        wx.showNavigationBarLoading();
    }
    if (showLoading) {
        wx.showLoading({
            title: showTitle + '...',
            mask: true
        })
    }

    if (url.indexOf('http://') === -1 || url.indexOf('https://') === -1) {
        url = `${appBase.baseUrl}${url}`
    }
    if (contentType === '') {
        if (method === 'POST') {
            contentType = 'application/x-www-form-urlencoded'
        } else {
            contentType = 'application/json'
        }
    }
    return new Promise((resolve, reject) => {
        wx.request({
            url: url,
            data: data,
            header: {
                Authorization: wx.getStorageSync('token') || '',
                'content-type': contentType
            },
            method,
            dataType: 'json',
            responseType: 'text',
            success: function (res) {
                if (navLoading) {
                    wx.hideNavigationBarLoading();
                }
                if (showLoading) {
                    wx.hideLoading()
                }
                let data = res.data
                if (data.status === 9 || data.status === 10 || data.status === 16) {
                    if (resetStatus) {
                        resetStatus = false
                        wx.showModal({
                            title: '提示',
                            content: errorMsg[data.status],
                            showCancel: false,
                            success(res) {
                                if (res.confirm) {
                                    resetStatus = true
                                    wx.navigateTo({
                                        url: '/pages/common/login/login?back=back',
                                    })
                                } else if (res.cancel) {
                                    console.log('用户点击取消')
                                }
                            }
                        })
                    }

                    reject(data)
                    return false
                }
                if (data.status === 44) {
                    resolve(data)
                    return false
                }
                if (data.status !== 0 && showToast) {
                    wx.showToast({
                        title: data.data || data.msg || errorMsg[data.status],
                        icon: 'none'
                    })
                }
                resolve(data)
            },
            fail: function (res) {
                if (navLoading) {
                    wx.hideNavigationBarLoading();
                }
                if (showLoading) {
                    wx.hideLoading()
                }
                reject(data)
                return false
            },
            complete: function (res) {
            },
        })
    })
}
