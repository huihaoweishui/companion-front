const app = getApp();
import {formatTimeStampToYmd} from "../../utils/util";

Page({
    data: {
        type: null,
        typeId: null,
        partnerOpenIds: null,
        pageNum: 1,
        pageSize: 10,
        year: null,
        month: null,
        totalOut: 0,
        totalIn: 0,
        show: false,
        active: 0,
        inTypes: [{
            id: 0,
            name: "全部",
            typeId: 1
        }],
        outTypes: [{
            id: 0,
            name: "全部",
            typeId: 2
        }],
        records: [],
        currentDate: new Date().getTime(),
        // minDate: new Date().getTime()
        show2: false,
        scrollHeight: null
    },
    onLoad: function () {

    },
    onShow: function () {
        //1、获取收入和支出类型
        let currentDate = new Date();
        //注意 下面语句是异步的，在把records清空后 和getRecords之间先后顺序是不确定的，很有可能是get后再清空records显示无数据,可以加回调函数
        this.setData({
            year: currentDate.getFullYear(),
            month: currentDate.getMonth() + 1,
            records: []
        }, function () {
            //3、分页获取收支记录
            this.getRecords();
        })
        this.getTypes();
        //2、获取当前月的总支出和总收入
        this.getMonthInAndOut();
        //3、分页获取收支记录
        // this.getRecords();
        //
        this.computeScrollViewHeight()
    },
    //滚动到底部触发
    bindscrolltolower() {
        this.setData({
            pageNum: this.data.pageNum + 1
        })
        this.getRecords();
    },
    getMonthInAndOut() {
        app.$http({
            url: '/finance/monthInOutTotal',
            method: "post",
            data: {
                openId: wx.getStorageSync("openId"),
                yearAndMonth: this.data.year + "-" + this.data.month,
                partnerOpenIds: this.data.partnerOpenIds
            }
        }).then(res => {
            const data = res.data;
            if (data) {
                this.setData({
                    totalIn: data.split(",")[0],
                    totalOut: data.split(",")[1]
                })
            }
        })
    },
    getRecords: function () {
        app.$http({
            url: '/finance/monthInOut',
            method: "post",
            data: {
                openId: wx.getStorageSync("openId"),
                yearAndMonth: this.data.year + "-" + this.data.month,
                pageNum: this.data.pageNum,
                pageSize: this.data.pageSize,
                type: this.data.type,
                typeId: this.data.typeId,
                partnerOpenIds: this.data.partnerOpenIds
            }
        }).then(res => {
            const data = res.data;
            this.setData({
                records: this.data.records.concat(data.list)
            })
            //下面的代码是防止一开始获取的数据内容的高度小于scroll-view的height（进而无法触发滚动事件，进而无法操作获取下一页的数据）；只是粗略计算，还没想到更好的方式;注意pageSize不能太小，比如1和2就不行！
            /*if (this.data.records.length <= this.data.pageSize) {
                this.setData({
                    pageNum: this.data.pageNum + 1
                })
                this.getRecords();
            }*/
        })
    },
    getTypes: function () {
        app.$http({
            url: '/finance/type',
            method: "post"
        }).then(res => {
            const data = res.data || [];
            let inTypes2 = this.data.inTypes;
            let outTypes2 = this.data.outTypes;
            data.forEach((value, index) => {
                if (value.typeId === 1) {
                    inTypes2.push(value);
                } else if (value.typeId === 2) {
                    outTypes2.push(value);
                }
                ;
            })
            this.setData({
                inTypes: inTypes2,
                outTypes: outTypes2
            })

        })
    },
    //交易类型弹出层打开
    showTypes: function () {
        this.setData({
            show: true
        })
    },
    //交易类型弹出层关闭
    onClose: function () {
        this.setData({
            show: false
        })
    },
    //交易类型tab切换
    onChange: function () {
        // console.log(456)
    },

    //日期选择弹出层打开
    showDate: function () {
        this.setData({
            show2: true
        })
    },
    //日期选择弹出层关闭事件
    onClose2: function () {
        this.setData({
            show2: false
        })
    },
    onClose3: function () {
        this.setData({
            show3: false
        })
    },
    //点击收入类型的某一项触发
    inSelect: function (e) {
        // console.log(e)
        const index = e.target.dataset.id
        // console.log(this.data.inTypes[index])
        this.setData({
            type: this.data.inTypes[index].typeId,
            typeId: this.data.inTypes[index].id,
            show: false,
            records: [],
            pageNum: 1
        }, function () {
            //3、分页获取收支记录
            this.getRecords();
        })
        // this.getRecords()
    },
    //点击支出类型的某一项触发
    outSelect: function (e) {
        // console.log(e)
        const index = e.target.dataset.id
        this.setData({
            type: this.data.outTypes[index].typeId,
            typeId: this.data.outTypes[index].id,
            show: false,
            records: [],
            pageNum: 1
        }, function () {
            //3、分页获取收支记录
            this.getRecords();
        })
        // this.getRecords()
    },
    //计算 scroll-view 的高度
    computeScrollViewHeight() {
        let query = wx.createSelectorQuery().in(this)
        query.select('.containerChildClass1').boundingClientRect();
        query.select('.containerChildClass2').boundingClientRect();
        // 执行上面所指定的请求，结果会按照顺序存放于一个数组中，在callback的第一个参数中返回
        query.exec((res) => {
            // 分别取出navbar和header的高度
            let navbarHeight = res[0].height;
            let headerHeight = res[1].height;

            // 然后就是做个减法
            let scrollViewHeight = wx.getSystemInfoSync().windowHeight - navbarHeight - headerHeight;
            // 算出来之后存到data对象里面
            this.setData({
                scrollHeight: scrollViewHeight
            });
        });
    },
    //选择日期确定事件
    onInput: function (event) {
        let yearAndMonth = formatTimeStampToYmd(event.detail, 'Y-M');
        this.setData({
            currentDate: event.detail,
            show2: false,
            year: yearAndMonth.split("-")[0],
            month: yearAndMonth.split("-")[1],
            records: [],
            pageNum: 1
        }, function () {
            //3、分页获取收支记录
            this.getRecords();
        });
        // this.getRecords()
        this.getMonthInAndOut()
    },
    cancelDate: function () {
        this.setData({
            show2: false
        })
    }
})
