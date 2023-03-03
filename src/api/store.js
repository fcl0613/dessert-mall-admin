import request from '@/utils/request'

export default {
    getStoreList(pageNum, pageSize, keyword) {
        return request({
            url: '/store/list',
            method: 'get',
            params: {
                pageNum,
                pageSize,
                keyword
            }
        })
    },
    addStore(obj) {
        return request({
            url: '/store/add',
            method: 'post',
            data: obj
        })
    },
    updateStore(obj) {
        return request({
            url: '/store/update',
            method: 'post',
            data: obj
        })
    },
    removeStore(obj) {
        return request({
            url: '/store/remove',
            method: 'post',
            data: obj
        })
    },
    getStoreDetail(id) {
        return request({
            url: `/store/get/${id}`,
            method: 'get'
        })
    },
    changeStatus(obj) {
        return request({
            url: '/store/changeStatus',
            method: 'post',
            data: obj
        })
    },
    searchAll(keyword) {
        return request({
            url: '/store/searchAll',
            method: 'get',
            params: {
                keyword
            }
        })
    }
}