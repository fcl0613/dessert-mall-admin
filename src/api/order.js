import request from '@/utils/request'

export default {
    getOrderList(obj) {
        return request({
            url: '/order/list',
            method: 'post',
            data: obj
        })
    },
    getOrderDetail(id) {
        return request({
            url: `/order/detail/${id}`,
            method: 'get'
        })
    }
}