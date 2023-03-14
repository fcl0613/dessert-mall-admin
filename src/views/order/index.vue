<template>
  <div class="container">
    <div class="header">
      <div class="title-area">
        <div class="title">搜索条件</div>
        <div class="btn-group">
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" @click="getOrderList">搜索</el-button>
        </div>
      </div>
      <div class="search-area">
        <el-form ref="searchFormRef" :model="searchForm" label-width="80px">
          <el-form-item label="订单编号">
            <el-input
              placeholder="订单编号"
              v-model.number="searchForm.orderId"
            ></el-input>
          </el-form-item>
          <el-form-item label="提交时间">
            <el-date-picker
              v-model="searchForm.time"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker
          ></el-form-item>
          <el-form-item label="订单状态">
            <el-select v-model="searchForm.orderStatus" placeholder="请选择">
              <el-option
                v-for="item in orderStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="店铺">
            <el-select
              v-model="searchForm.storeId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in storeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="data-area">
      <el-card>
        <el-table :data="orderList" border style="width: 100%">
          <el-table-column prop="id" label="订单编号" width="180">
          </el-table-column>
          <el-table-column prop="createTime" label="提交时间" width="180">
          </el-table-column>
          <el-table-column prop="username" label="用户账号"> </el-table-column>
          <el-table-column prop="totalPrice" label="订单金额">
          </el-table-column>
          <el-table-column prop="orderStatus" label="订单状态">
          </el-table-column>
          <el-table-column prop="storeName" label="所属店铺"> </el-table-column>
          <el-table-column label="操作">
              <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="toDeatilPage(scope.row.id)" >查看订单</el-button>
              </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <div class="page-area">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="searchForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import storeApi from '@/api/store'
import orderApi from '@/api/order'
export default {
  data() {
    return {
      searchForm: {
        pageNum: 1,
        pageSize: 10,
      },
      orderStatusOptions: [
        {
          value: 0,
          label: '等待中',
        },
        {
          value: 1,
          label: '已完成',
        },
      ],
      storeOptions: [],
      orderList: [],
      total: 0
    }
  },
  created() {
      this.getOrderList()
  },
  methods: {
    remoteMethod(query) {
      if ('' !== query) {
        this.loading = true
        storeApi.searchAll(query).then((res) => {
          let storeList = res.data
          let op = []
          storeList.forEach((element) => {
            let obj = { value: element.id, label: element.storeName }
            op.push(obj)
          })
          this.storeOptions = op
          this.loading = false
        })
      }
    },
    handleSizeChange(val) {
        this.searchForm.pageSize = val
        this.getOrderList()
    },
    handleCurrentChange(val) {
        this.searchForm.pageNum = val
        this.getOrderList()
    },
    getOrderList() {
        orderApi.getOrderList(this.searchForm).then((res) => {
            this.total = res.data.total
            this.orderList = res.data.list
        })
    },
    toDeatilPage(id) {
        this.$router.push({
          path: '/orderDetail',
          query: {
            orderId: id
          }
        })
    },
    reset() {
        this.searchForm = {
        pageNum: 1,
        pageSize: 10,
      }
      this.getOrderList()
    }
  },
}
</script>

<style lang="less" scoped>
.container {
  padding: 20px 30px;
  .header {
    width: 100%;
    border: 1px solid rgb(199, 199, 199);
    background-color: #ffffff;
    .title-area {
      margin: 6px 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      .title {
          margin-left: 10px;
      }
      .btn-group {
          margin-right: 10px;
      }
    }
    .search-area {
      margin-top: 10px;
      .el-form {
        width: 100%;
        display: flex;
      }
    }
  }
  .data-area {
      margin-top: 10px;
      margin-bottom: 10px;
  }
  .page-area {
    float: right;
  }
}
</style>