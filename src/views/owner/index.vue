<template>
  <div class="container">
    <my-breadcrumb p1="店家管理" p2="店家列表"></my-breadcrumb>
    <div class="user-list-area">
      <el-card>
        <div class="search-area">
          <div class="left">
            <el-input
              placeholder="请搜索输入内容"
              v-model="keyword"
              clearable
              @clear="getOwnerList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getOwnerList"
              ></el-button>
            </el-input>
          </div>
          <div class="right">
            <el-button type="primary" @click="showAddDialog">添加</el-button>
          </div>
        </div>
        <div class="data-table">
          <el-table :data="ownerList" border stripe style="width: 100%">
            <el-table-column label="编号" type="index" width="180">
            </el-table-column>
            <el-table-column prop="username" label="用户名" width="180">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="150">
            </el-table-column>
            <el-table-column prop="phone" label="电话" width="150">
            </el-table-column>
            <el-table-column prop="idCard" label="身份证号码" width="200">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180">
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.id)"
                ></el-button>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="分配商店"
                  placement="top-start"
                >
                  <el-button
                    type="warning"
                    icon="el-icon-s-promotion"
                    @click="showAssignDialog(scope.row.id)"
                  ></el-button>
                </el-tooltip>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeOwner(scope.row.id)"
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
      </el-card>
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      @closed="reset"
    >
      <el-form
        :model="ownerDTO"
        :rules="rules"
        ref="formRef"
        label-width="100px"
      >
        <el-form-item label="店家名称" prop="username">
          <el-input
            v-model="ownerDTO.username"
            :disabled="ownerDTO.id ? true : false"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="ownerDTO.phone"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ownerDTO.name"></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="idCard">
          <el-input v-model="ownerDTO.idCard"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subForm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="分配店铺" :visible.sync="assignDialogVisible" width="30%" @close="handleAssignDialog">
      请选择店铺：
      <el-select
        v-model="currentStoreId"
        filterable
        remote
        reserve-keyword
        placeholder="请输入关键词"
        :remote-method="remoteMethod"
        :loading="loading"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <span slot="footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignStore">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MyBreadcrumb from '@/components/MyBreadcrumb'
import ownerApi from '@/api/owner'
import storeApi from '@/api/store'
export default {
  components: {
    MyBreadcrumb,
  },
  data() {
    const checkPhone = (rule, value, cb) => {
      const phoneReg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
      if (phoneReg.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确的手机号'))
    }
    const checkIdCard = (rule, value, cb) => {
      const idCardReg = /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/
      if (idCardReg.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确的身份证号'))
    }
    return {
      pageNum: 1,
      pageSize: 10,
      keyword: '',
      ownerList: [],
      total: 0,
      dialogTitle: '添加',
      dialogVisible: false,
      ownerDTO: {},
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        idCard: [
          { required: true, message: '请输入身份证', trigger: 'blur' },
          { validator: checkIdCard, trigger: 'blur' },
        ]
      },
      assignDialogVisible: false,
      currentStoreId: null,
      currentOwnerId: null,
      options: [],
      loading: false,
    }
  },
  created() {
    this.getOwnerList()
  },
  methods: {
    getOwnerList() {
      ownerApi
        .getownerList(this.pageNum, this.pageSize, this.keyword)
        .then((res) => {
          this.ownerList = res.data.list
          this.total = res.data.total
        })
    },
    ownerAdd() {
      ownerApi.ownerAdd(this.ownerDTO).then((res) => {
        this.$message.success('添加成功')
      })
    },
    ownerUpdate() {
      ownerApi.ownerUpdate(this.ownerDTO).then((res) => {
        this.$message.success('修改成功')
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getOwnerList()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getOwnerList()
    },
    subForm() {
      if (this.ownerDTO.id) {
        this.ownerAdd()
      } else {
        this.ownerUpdate()
      }
    },
    reset() {
      this.ownerDTO = {}
    },
    showAddDialog() {
      ;(this.dialogTitle = '添加'), (this.dialogVisible = !this.dialogVisible)
    },
    showEditDialog(id) {
      ownerApi.getDetail(id).then((res) => {
        this.ownerDTO = res.data
        ;(this.dialogTitle = '修改'), (this.dialogVisible = !this.dialogVisible)
      })
    },
    removeOwner(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        ownerApi.ownerReomve(id)
      })
    },
    assignStore() {
      let obj = { ownerId: this.currentOwnerId, storeId: this.currentStoreId }
      ownerApi.assignStore(obj).then((res) => {
        this.$message.success('分配成功')
        this.assignDialogVisible = !this.assignDialogVisible
      })
    },
    showAssignDialog(id) {
      ownerApi.getStore(id).then((res) => {
        if (res.data) {
          this.currentStoreId = res.data.id
          this.options = [{ value: res.data.id, label: res.data.storeName }]
        }
      })
      this.currentOwnerId = id
      this.assignDialogVisible = !this.assignDialogVisible
    },
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
          this.options = op
          this.loading = false
        })
      }
    },
    handleAssignDialog() {
        this.options = []
        this.currentStoreId = null
    }
  },
}
</script>

<style lang="less" scoped>
.container {
  .user-list-area {
    .search-area {
      display: flex;
      justify-content: space-between;
    }
    .data-table {
      margin-top: 20px;
    }
    .page-area {
      margin-top: 20px;
      margin-bottom: 10px;
      float: right;
    }
  }
}
</style>