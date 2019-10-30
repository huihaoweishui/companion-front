//record.js
// const util = require('../../utils/util.js')
const app = getApp();
/*const citys = {
    '浙江': ['杭州', '宁波', '温州', '嘉兴', '湖州'],
    '福建': ['福州', '厦门', '莆田', '三明', '泉州']
};*/
Page({
    data: {
        show: false,
        record: {
            amount: null,
            remark: null,
            typeId: null,
            typeName: null
        },
        columnData: {},
        originalData: [],
        columns: [
            /*{
                values: Object.keys(citys),
                className: 'column1'
            },
            {
                values: citys['浙江'],
                className: 'column2',
                defaultIndex: 2
            }*/
        ]
    },
    onLoad: function () {
        app.$http({
            url: '/finance/type2',
            method: "post",
            data: {}
        }).then(res => {
            const data = res.data;
            //将数组转换成固定格式 参考顶部的columns数据结构
            let columnData = {}
            data.forEach(record => {
                const list = record.list;
                let childs = [];
                list.forEach(child => {
                    childs.push(child.name)
                })
                columnData[record.name] = childs;
            })
            this.setData({
                columnData: columnData,
                originalData: data,
                columns: [
                    {
                        values: Object.keys(columnData)
                    },
                    {
                        values: columnData[data[0].name]
                    }
                ]
            })
        })
    },
    addRecord() {
        console.log(this.data.record)
        app.$http({
            url: '/finance/add',
            method: "post",
            data: {
                amount: this.data.record.amount,
                openId: wx.getStorageSync("openId"),
                typeId: this.data.record.typeId,
                remark: this.data.record.remark
            }
        }).then(res => {
            if (res.status === 0) {
                wx.navigateBack({
                    delta: 1
                })
            }

        })
    },
    changeAmount(value) {
        this.setData({
            ['record.amount']: value.detail
        })
    },
    changeRemark(value) {
        this.setData({
            ['record.remark']: value.detail
        })
    },
    //收支类型弹出层关闭事件
    onClose() {
        this.setData({
            show: false
        })
    },
    //收支类型弹出层打开
    chooseType() {
        this.setData({
            show: true
        })
    },
    //收支类型选择
    onConfirm(event) {
        const {value, index} = event.detail;
        let typeId = 'record.typeId'
        let typeName = 'record.typeName'
        this.setData({
            [typeId]: this.data.originalData[index[0]].list[index[1]].id,
            [typeName]: this.data.originalData[index[0]].name.concat("-" + this.data.originalData[index[0]].list[index[1]].name),
            show: false
        })
    },
    onCancel() {
        this.setData({
            show: false
        })
    },
    onChange(event) {
        const {picker, value, index} = event.detail;
        picker.setColumnValues(1, this.data.columnData[value[0]]);
    }
})
