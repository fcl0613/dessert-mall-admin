import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/views/login'
import home from '@/views/home'
import { getToken } from '@/utils/token'
import dashbord from '@/views/dashboard'
import user from '@/views/user'
import store from '@/views/store'
import owner from '@/views/owner'
import category from '@/views/category'
import goodsDefault from '@/views/goods/goodsDefault'
import order from '@/views/order'
import orderDetail from '@/views/order/detail'


Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/home',
      component: home,
      redirect: '/dashbord',
      children: [
        {
          path: '/dashbord',
          component: dashbord
        },
        {
          path: '/userList',
          component: user
        },
        {
          path: '/storeList',
          component: store
        },
        {
          path: '/ownerList',
          component: owner
        },
        {
          path: '/categoryList',
          component: category
        },
        {
          path: '/goodsDefaultList',
          component: goodsDefault
        },
        {
          path: '/orderList',
          component: order
        },
        {
          path: '/orderDetail',
          component: orderDetail
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = getToken
  if (!token) {
    return next('/login')
  }
  next()
})

export default router