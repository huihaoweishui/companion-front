// 时间格式化  return '2018-09-09 10:10:10'
/**
 * date {Date}
 */
export const formatTime = (date, needIndex = false) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    if (needIndex) {
        return {
            time: [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':'),
            timeIndex: [0, Number(month - 1), Number(day - 1), Number(hour - 1), Number(minute), Number(second)],
        }
    } else {
        return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    }
}
//  小于 10 补 0
export const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}
/**
 * 时间戳转换为指定日期格式
 * @type {function(*=, *): *}
 */
export const formatTimeStampToYmd = ((number, format) => {
    let time = new Date(number)
    let newArr = []
    let formatArr = ['Y', 'M', 'D', 'h', 'm', 's']
    newArr.push(time.getFullYear())
    newArr.push(formatNumber(time.getMonth() + 1))
    newArr.push(formatNumber(time.getDate()))

    newArr.push(formatNumber(time.getHours()))
    newArr.push(formatNumber(time.getMinutes()))
    newArr.push(formatNumber(time.getSeconds()))

    for (let i in newArr) {
        format = format.replace(formatArr[i], newArr[i])
    }
    return format;
})


// 验证手机号码是否正确并且得出是哪一家运行商
/**
 * mobileNo {String,Number} 手机号码
 */
export const regNumber = (mobileNo) => {
    //移动：134(0 - 8) 、135、136、137、138、139、147、150、151、152、157、158、159、178、182、183、184、187、188、198
    //联通：130、131、132、145、155、156、175、176、185、186、166
    //电信：133、153、173、177、180、181、189、199
    var move = /^((134)|(135)|(136)|(137)|(138)|(139)|(147)|(150)|(151)|(152)|(157)|(158)|(159)|(178)|(182)|(183)|(184)|(187)|(188)|(198))\d{8}$/g;
    var link = /^((130)|(131)|(132)|(155)|(156)|(145)|(185)|(186)|(176)|(175)|(170)|(171)|(166))\d{8}$/g;
    var telecom = /^((133)|(153)|(173)|(177)|(180)|(181)|(189)|(199))\d{8}$/g;
    if (move.test(mobileNo)) {
        return true; // 移动
    } else if (link.test(mobileNo)) {
        return true; // 联通
    } else if (telecom.test(mobileNo)) {
        return true; // 电信
    } else {
        return false;
    }
}
//  简单的防抖，具体请看 lodash.debounce
export const debounce = (fn, delay = 300) => {
    let timer = null;

    return function () {
        let args = arguments;
        let context = this;

        if (timer) {
            clearTimeout(timer);

            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        } else {
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        }
    }
}
export const throttle = (func, delay = 300) => {
    var prev = Date.now();
    return function () {
        var context = this;
        var args = arguments;
        var now = Date.now();
        if (now - prev >= delay) {
            func.apply(context, args);
            prev = Date.now();
        }
    }
}

/**
 * 去除Emoji
 */
export const removeEmoji = (data) => {
    return data.replace(/([^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n])|(\s)/g, '')
}

/**
 * 获取用户当前的授权状态, 打开设置界面
 * scopeName 例如scope.userInfo scope.userLocation
 * cb 已授权
 * fc 已拒绝授权fail 回调
 */
export const getUserAuthorize = (scopeName, fc, cb) => {
    // 获取用户当前的授权状态
    wx.getSetting({
        success: res => {
            if (!res.authSetting[scopeName]) {
                // 提前发起授权请求
                wx.authorize({
                    scope: scopeName,
                    success: () => {
                        typeof cb === 'function' && cb();
                    },
                    fail: () => {
                        typeof fc === 'function' && fc();
                    }
                })
            } else {
                typeof cb === 'function' && cb();
            }
        },
        fail: res => {
            console.log(res)
        }
    })
}

/**
 * 逗号拼接 id
 *
 */
export const getIdStitching = (arr) => {
    let str = '';
    for (let i in arr) {
        str += arr[i] + ','
    }
    if (str.length > 0) {
        str = str.substr(0, str.length - 1);
    }
    return str
}
