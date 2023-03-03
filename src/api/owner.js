import request from '@/utils/request'

export default {
    getownerList(pageNum, pageSize, keyword) {
        return request({
            url: '/owner/list',
            method: 'get',
            params: {
                pageNum, 
                pageSize, 
                keyword
            }
        })
    },
    ownerAdd(obj) {
        return request({
            url: '/owner/add',
            method: 'post',
            data: obj
        })
    },
    ownerUpdate(obj) {
        return request({
            url: '/owner/update',
            method: 'post',
            data: obj
        })
    },
    ownerReomve(id) {
        return request({
            url: `/owner/remove/${id}`,
            method: 'post'
        })
    },
    resetPassword(id) {
        return request({
            url: `/owner/resetPassword/${id}`,
            method: 'post'
        })
    },
    assignStore(obj) {
        return request({
            url: '/owner/assign',
            method: 'post',
            data: obj
        })
    },
    getDetail(id) {
        return request({
            url: `/owner/get/${id}`,
            method: 'get'
        })
    },
    getStore(id) {
        return request({
            url: `/owner/getStore/${id}`,
            method: 'get'
        })
    }
}