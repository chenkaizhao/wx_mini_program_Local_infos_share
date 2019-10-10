//将公用路径导出封装
module.exports = (url, data) => {
    return new Promise((resolve, reject) => {
        wx.request({
            //es6模板字符串  `.....${url}`
            url: `https://locally.uieee.com/${url}`,
            data: data,
            success: resolve,
            fail: reject
        })
    })
}