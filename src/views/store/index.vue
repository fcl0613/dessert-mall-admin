<template>
  <div class="container">
    <my-breadcrumb p1="门店管理" p2="门店列表"></my-breadcrumb>
    <div class="header">
      <div class="left">
        <div class="input-area">
          <el-input placeholder="请输入门店名字" v-model="keyword"></el-input>
        </div>
        <div class="operation-area">
          <el-button type="primary" @click="getStoreList">搜索</el-button>
          <el-button type="primary" @click="resetOperation">重置</el-button>
        </div>
      </div>
      <div class="right">
        <el-button type="primary" @click="showAddDialog">添加</el-button>
      </div>
    </div>
    <div class="data-table">
      <el-table :data="storeList" border style="width: 100%">
        <el-table-column prop="storeName" label="门店名字" width="180">
        </el-table-column>
        <el-table-column prop="storeAddress" label="门店地址" width="300">
        </el-table-column>
        <el-table-column prop="openingTime" label="营业时间" width="180">
        </el-table-column>
        <el-table-column prop="longitude" label="经度" width="150">
        </el-table-column>
        <el-table-column prop="latitude" label="纬度" width="150">
        </el-table-column>
        <el-table-column label="营业状态" width="150">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="0"
              :inactive-value="1"
              @change="changeStoreStatus(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="电话"
          width="180"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="removeStoreOne(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-area">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      @close="resetForm"
    >
      <el-form
        :model="storeObj"
        :rules="rules"
        ref="formRef"
        label-width="100px"
      >
        <el-form-item label="门店名称" prop="storeName">
          <el-input v-model="storeObj.storeName"></el-input>
        </el-form-item>
        <el-form-item label="门店地址" prop="storeAddress">
          <el-input v-model="storeObj.storeAddress"></el-input>
        </el-form-item>
        <el-form-item label="营业时间" prop="openingTime">
          <!-- <el-input v-model="storeObj.openingTime"></el-input> -->
          <el-select v-model="storeObj.openingTime" placeholder="请选择">
            <el-option
              v-for="(item, index) in openingTime"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="storeObj.longitude"></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="storeObj.latitude"></el-input>
        </el-form-item>
        <el-form-item label="门店电话" prop="phone">
          <el-input v-model="storeObj.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MyBreadcrumb from '@/components/MyBreadcrumb'
import storeApi from '@/api/store'
export default {
  components: {
    MyBreadcrumb,
  },
  data() {
    const checkLongitude = (rule, value, cb) => {
      const phoneReg =
        /^(((\d|[1-9]\d|1[1-7]\d|0)\.\d{0,6})|(\d|[1-9]\d|1[1-7]\d|0{1,3})|180\.0{0,6}|180)$/
      if (phoneReg.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确的经度'))
    }
    const checkLatitude = (rule, value, cb) => {
      const phoneReg = /^([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/
      if (phoneReg.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确的纬度'))
    }
    return {
      pageNum: 1,
      pageSize: 10,
      keyword: '',
      storeList: [],
      total: 0,
      storeObj: {},
      dialogTitle: '添加',
      dialogVisible: false,
      rules: {
        storeName: [
          { required: true, message: '请输入门店名称', trigger: 'blur' },
        ],
        storeAddress: [
          { required: true, message: '请输入门店地址', trigger: 'blur' },
        ],
        openingTime: [
          { required: true, message: '请输入营业时间', trigger: 'blur' },
        ],
        longitude: [
          { required: true, message: '请输入经度', trigger: 'blur' },
          { validator: checkLongitude, trigger: 'blur' },
        ],
        latitude: [
          { required: true, message: '请输入经度', trigger: 'blur' },
          { validator: checkLatitude, trigger: 'blur' },
        ],
        phone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
      },
      openingTime: [
        '08:00-22:00',
        '08:30-22:30',
        '09:00-23:00',
        '09:30-23:30',
        '10:00-00:00',
      ],
    }
  },
  created() {
    this.getStoreList()
  },
  methods: {
    getStoreList() {
      storeApi
        .getStoreList(this.pageNum, this.pageSize, this.keyword)
        .then((res) => {
          this.storeList = res.data.list
          this.total = res.data.total
        })
    },
    addStore() {
      storeApi.addStore(this.storeObj).then((res) => {
        this.$message.success('添加成功')
        this.dialogVisible = !this.dialogVisible
        this.getStoreList()
      })
    },
    updateStore() {
      storeApi.updateStore(this.storeObj).then((res) => {
        this.$message.success('修改成功')
        this.dialogVisible = !this.dialogVisible
        this.getStoreList()
      })
    },
    removeStore(obj) {
      storeApi.removeStore(obj).then((res) => {
        this.$message.success('删除成功')
        this.getStoreList()
      })
    },
    getStoreDetail(id) {
      storeApi.getStoreDetail(id).then((res) => {
        this.storeObj = res.data
      })
    },
    changeStoreStatus(store) {
      console.log(store)
      let obj = new Object()
      obj.id = store.id
      obj.status = store.status
      storeApi.changeStatus(obj).then((res) => {
        this.$message.success('修改成功')
      })
    },
    showEditDialog(store) {
      this.dialogTitle = '修改'
      this.getStoreDetail(store.id)
      this.dialogVisible = !this.dialogVisible
    },
    removeStoreOne(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let list = [id]
        let obj = new Object()
        obj.list = list
        this.removeStore(obj)
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getStoreList()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getStoreList()
    },
    resetOperation() {
      this.pageNum = 1
      this.pageSize = 10
      this.keyword = ''
      this.getStoreList()
    },
    showAddDialog() {
      this.dialogTitle = '添加'
      this.dialogVisible = !this.dialogVisible
    },
    resetForm() {
      console.log('重置表单')
      this.$refs.formRef.resetFields()
      this.storeObj = {}
    },
    subForm() {
      if (this.storeObj.id) {
        this.updateStore()
      } else {
        this.addStore()
      }
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .left {
      display: flex;
      justify-content: space-between;
      .input-area {
        margin-right: 10px;
      }
    }
  }
  .data-table {
    margin-bottom: 20px;
  }
  .page-area {
    float: right;
  }
}
</style>