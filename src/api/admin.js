import request from '@/utils/request'

export default {
    login(username, password) {
        return request({
            url: '/admin/login',
            method: 'post',
            params: {
                username,
                password
            }
        })
    }
}