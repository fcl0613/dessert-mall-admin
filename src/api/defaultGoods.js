import request from '@/utils/request'

export default {
    getGoodsList(pageNum, pageSize, keyword) {
        return request({
            url: '/goods/default/list',
            method: 'get',
            params: {
                pageNum,
                pageSize,
                keyword
            }
        })
    },
    addGoods(obj) {
        return request({
            url: '/goods/default/add',
            method: 'post',
            data: obj
        })
    },
    updateGoods(obj) {
        return request({
            url: '/goods/default/update',
            method: 'post',
            data: obj
        })
    },
    removeGoods(id) {
        return request({
            url: `/goods/default/remove/${id}`,
            method: 'post'
        })
    },
    getGoodsDetail(id) {
        return request({
            url: `/goods/default/get/${id}`,
            method: 'get'
        })
    },
    changeStatus(obj) {
        return request({
            url: '/goods/default/changeStatus',
            method: 'post',
            data: obj
        })
    }
}