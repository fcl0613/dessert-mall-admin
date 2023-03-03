<template>
  <div class="container">
    <my-breadcrumb p1="用户管理" p2="用户列表"></my-breadcrumb>
    <div class="user-list-area">
      <el-card>
        <div class="search-area">
          <div class="left">
            <el-input
              placeholder="请搜索输入内容"
              v-model="keyword"
              clearable
              @clear="getUserList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUserList"
              ></el-button>
            </el-input>
          </div>
          <div class="right">
            <el-button type="primary" @click="showAddDialog">添加</el-button>
          </div>
        </div>
        <div class="data-table">
          <el-table :data="userlist" border stripe style="width: 100%">
            <el-table-column label="编号" type="index" width="200">
            </el-table-column>
            <el-table-column prop="username" label="用户名" width="300">
            </el-table-column>
            <el-table-column prop="phone" label="电话" width="300">
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              width="300"
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
                  @click="removeUserOne(scope.row.id)"
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
      @close="resetUserDTO"
    >
      <el-form
        :model="userDTO"
        :rules="rules"
        ref="userDTORef"
        label-width="100px"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input
            v-model="userDTO.username"
            :disabled="userDTO.id ? true : false"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="userDTO.phone"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userDTO.name"></el-input>
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
import mallUserApi from '@/api/mallUser'
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

    return {
      pageNum: 1,
      pageSize: 10,
      keyword: '',
      userlist: [],
      total: 0,
      userDTO: {},
      removeUserIdList: [],
      dialogVisible: false,
      dialogTitle: '添加',
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' },
        ],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      mallUserApi
        .getUserList(this.pageNum, this.pageSize, this.keyword)
        .then((res) => {
          this.userlist = res.data.list
          this.total = res.data.total
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.pageNum = val
    },
    addUser() {
      mallUserApi.addUser(this.userDTO).then((res) => {
        this.$message.success(res.message)
        this.dialogVisible = !this.dialogVisible
        this.getUserList()
      })
    },
    updateUser() {
      mallUserApi.updateUser(this.userDTO).then((res) => {
        this.$message.success(res.message)
        this.dialogVisible = !this.dialogVisible
        this.getUserList()
      })
    },
    getUserDetail(id) {
      mallUserApi.getUserDetail(id).then((res) => {
        this.userDTO = res.data
      })
    },
    removeUser() {
      let obj = new Object()
      obj.list = this.removeUserIdList
      mallUserApi.removeUser(obj).then((res) => {
        this.$message.success(res.message)
        this.removeUserIdList = []
        this.getUserList()
      })
    },
    showAddDialog() {
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '添加'
    },
    resetUserDTO() {
      this.$refs.userDTORef.resetFields()
      this.userDTO = {}
    },
    subForm() {
      this.$refs.userDTORef.validate((valid) => {
        if (!valid) return
        if (this.userDTO.id) {
          // 对象中存在id走用户更新逻辑
          this.updateUser()
        } else {
          // 走用户添加逻辑
          this.addUser()
        }
      })
    },
    showEditDialog(obj) {
      // console.log(obj)
      this.getUserDetail(obj.id)
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '修改'
    },
    removeUserOne(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.removeUserIdList = [id]
        this.removeUser()
      })
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