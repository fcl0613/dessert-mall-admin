<template>
  <div class="container">
    <el-container class="main">
      <el-header>
        <div class="header">
          <div class="logo">
            <h1 style="cursor: pointer;" @click="toDashboardPage">ALMALL</h1>
          </div>
          <div class="right">
            <el-dropdown>
              <span class="el-dropdown-link">
                <img :src="base_url + avatar" alt="" />
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="toDashboardPage">首页</el-dropdown-item>
                <!-- <el-dropdown-item>个人信息</el-dropdown-item> -->
                <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#409eff"
            unique-opened
            router
            :default-active="activeMenuItem"
          >
            <el-submenu
              v-for="item in menuList"
              :key="item.id"
              :index="item.id"
            >
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.menuName }}</span>
              </template>
              <el-menu-item
                v-for="child in item.children"
                :key="child.id"
                :index="child.path"
                @click="saveActiveMenu(child.path)"
              >
                <i :class="child.icon"></i>
                <span slot="title">{{ child.menuName }}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main class="main-area">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import globalContant from '@/utils/global'
import {removeToken} from '@/utils/token'
export default {
  data() {
    return {
      base_url: globalContant.BASE_IMG_URL,
      avatar: 'salt_fish.gif',
      activeMenuItem: '',
      menuList: [
        {
          id: '1',
          menuName: '用户管理',
          icon: 'el-icon-user-solid',
          children: [
            {
              id: '1-1',
              menuName: '用户列表',
              icon: 'el-icon-user',
              path: '/userList',
            },
          ],
        },
        {
          id: '2',
          menuName: '门店管理',
          icon: 'el-icon-s-shop',
          children: [
            {
              id: '2-1',
              menuName: '门店列表',
              icon: 'el-icon-house',
              path: '/storeList'
            }
          ]
        },
        {
          id: '3',
          menuName: '店家管理',
          icon: 'el-icon-user-solid',
          children: [
            {
              id: '3-1',
              menuName: '店家列表',
              icon: 'el-icon-user',
              path: '/ownerList'
            }
          ]
        },
        {
          id: '4',
          menuName: '分类管理',
          icon: 'el-icon-s-finance',
          children: [
            {
              id: '4-1',
              menuName: '分类列表',
              icon: 'el-icon-s-grid',
              path: '/categoryList'
            }
          ]
        },
        {
          id: '5',
          menuName: '商品管理',
          icon: 'el-icon-s-shop',
          children: [
            {
              id: '5-1',
              menuName: '默认商品',
              icon: 'el-icon-sell',
              path: '/goodsDefaultList'
            }
          ]
        },
        {
          id: '6',
          menuName: '订单管理',
          icon: 'el-icon-tickets',
          children: [
            {
              id: '6-1',
              menuName: '订单列表',
              icon: 'el-icon-document',
              path: '/orderList'
            }
          ]
        }
      ],
    }
  },
  methods: {
    saveActiveMenu(path) {
      console.log(path)
      this.activeMenuItem = path
    },
    toDashboardPage() {
      this.$router.push('/dashbord')
    },
    logout() {
      console.log('sssss')
      removeToken()
      this.$router.push('/login')
    }
  },
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  .main {
    height: 100%;
    .el-header {
      background-color: rgb(30, 32, 34);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 30px;
      height: 100%;
      .right {
        .el-dropdown-link {
          cursor: pointer;
          color: #fff;
        }
        img {
          width: 50px;
          height: 40px;
          border-radius: 25px;
        }
      }
      .logo {
        h1 {
          color: #fff;
        }
      }
    }
  }
}
.el-aside {
  background-color: #545c64;
  .el-menu {
    border-right: none;
  }
}

.main-area {
  height: 100%;
  background-color: rgb(233, 233, 233);
}
</style>