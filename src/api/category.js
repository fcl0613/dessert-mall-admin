import api from '@/utils/request'

export default {
    getCategoryList(pageNum, pageSize, keyword) {
        return api({
            url: '/category/list',
            method: 'get',
            params: {
                pageNum,
                pageSize,
                keyword
            }
        })
    },
    addCategory(obj) {
        return api({
            url: '/category/add',
            method: 'post',
            data: obj
        })
    },
    updateCategory(obj) {
        return api({
            url: '/category/update',
            method: 'post',
            data: obj
        })
    },
    removeCategory(id) {
        return api({
            url: `/category/remove/${id}`,
            method: 'post'
        })
    },
    getCategoryDetail(id) {
        return api({
            url: `/category/get/${id}`,
            method: 'get'
        })
    }
}