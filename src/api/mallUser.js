import request from '@/utils/request'

export default {
    getUserList(pageNum, pageSize, keyword) {
        return request({
            url: '/user/list',
            method: 'get',
            params: {
                pageNum,
                pageSize,
                keyword
            }
        })
    },
    addUser(obj) {
        return request({
            url: '/user/add',
            method: 'post',
            data: obj
        })
    },
    updateUser(obj) {
        return request({
            url: '/user/update',
            method: 'post',
            data: obj
        })
    },
    getUserDetail(userId) {
        return request({
            url: `/user/get/${userId}`,
            method: 'get'
        })
    },
    removeUser(obj) {
        return request({
            url: '/user/remove',
            method: 'post',
            data: obj
        })
    }
}