// pages/foodlist/foodlist.js
const fetch = require('../../utils/fetch')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //当前加载的分类
        category:{},
        //子分类下的全部店铺
        shops:[],
        //下拉加载
        pageIndex: 0,
        pageSize: 10,
        hasMore: true,
        //初始文本框不显示内容 搜索连
        inputShowed: false,  

    },

    //加载下一页通用代码 封装
    loadMore () {
        if (this.data.hasMore) {
            //es6解构赋值 let 可变量
            let { pageIndex, pageSize } = this.data
            const params = { _page: ++pageIndex, _limit: pageSize }
            return fetch(`categories/${this.data.category.id}/shops`, params)
                .then(res => {
                    //获取总数 头字段中
                    const totalCount = parseInt(res.header['X-Total-Count'])
                    const hasMore = pageIndex * pageSize < totalCount

                    //叠加数据
                    const shops = this.data.shops.concat(res.data)
                    this.setData({ shops, pageIndex, hasMore })
                })
        }
    },
    
    // 使文本框进入可编辑状态
    showInput: function () {
        this.setData({
            inputShowed: true   //设置文本框可以输入内容
        });
    },
    // 取消搜索
    hideInput: function () {
        this.setData({
            inputShowed: false
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //加载全部目录-->选择id为1的目录继续执行
        fetch(`categories/${options.cat=1}`).then(res => {
            console.log(res.data)

            // //这里不能确定一定是在onready之后执行
            // wx.setNavigationBarTitle({
            //     //设置二级页面navigatorname
            //     title: res.data.name,
            // })
            //所以把获得数据保存到category 在onready里先判断并加载
            this.setData({category: res.data})
            //不管onReady先行还是onload先行 保证严谨性
            wx.setNavigationBarTitle({
                //设置二级页面navigatorname
                title: "美食推荐",
            })


            //加载完目录地址之后 加载具体信息shops
            //return fetch(`categories/${this.data.category.id}/shops`, {_page:1, _limit:10})
            this.loadMore()
        })
        //一个fetch return一个promise函数，promise函数后接then
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        //不管onReady先行还是onload先行 判断是否本地data中有获得到的数据
        if (this.data.category.name) {
            wx.setNavigationBarTitle({
                //设置二级页面navigatorname
                title: "美食推荐",
            })
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        //下拉刷新
        //重新加载整个页面数据
        this.setData({shops: [], pageIndex: 0, hasMore: true})
        //防止下拉刷新延迟
        this.loadMore().then(() => wx.stopPullDownRefresh())
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        //加载下一页
        //判断一下是否正在加载
        this.loadMore()

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})