<template>
  <div class="container">
    <my-breadcrumb p1="分类管理" p2="分类列表"></my-breadcrumb>

    <div class="category-list-area">
      <el-card>
        <div class="search-area">
          <div class="left">
            <el-input
              placeholder="请搜索输入内容"
              v-model="keyword"
              clearable
              @clear="getCategoryList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getCategoryList"
              ></el-button>
            </el-input>
          </div>
          <div class="right">
            <el-button type="primary" @click="showAddDialog">添加</el-button>
          </div>
        </div>
        <div class="data-table">
          <el-table :data="categoryList" border stripe style="width: 100%">
            <el-table-column label="编号" type="index" width="200">
            </el-table-column>
            <el-table-column prop="categoryName" label="分类名" width="300">
            </el-table-column>
            <el-table-column prop="categoryIcon" label="分类图标" width="300">
              <template slot-scope="scope">
                <div>
                  <img
                    :src="catrgoryBaseUrl + scope.row.categoryIcon"
                    alt=""
                    style="width: 80px; height: 80px"
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="flag" label="是否为默认分类" width="300">
              <template slot-scope="scope">
                <div v-if="scope.row.flag === 0">是</div>
                <div v-if="scope.row.flag !== 0">否</div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.id)"
                ></el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeCategoryOne(scope.row.id)"
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

    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%">
      <el-form
        :model="dataFrom"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="dataFrom.categoryName"></el-input>
        </el-form-item>
        <el-form-item prop="categoryIcon">
          <el-input style="display:none" v-model="dataFrom.categoryIcon"></el-input>
          <el-upload
            ref="upload"
            action=""
            :file-list="fileList"
            :http-request="fileUpload"
            :show-file-list="false"
            :limit="1"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>

        <img
          v-if="imageUrl"
          :src="catrgoryBaseUrl + dataFrom.categoryIcon"
          alt=""
          style="width: 60px; height: 60px"
        />
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
import categoryApi from '@/api/category'
import globalConstant from '@/utils/global'
import fileUploadApi from '@/api/fileUpload'
export default {
  components: {
    MyBreadcrumb,
  },
  data() {
    return {
      keyword: '',
      pageNum: 1,
      pageSize: 10,
      categoryList: [],
      total: 0,
      catrgoryBaseUrl: globalConstant.BASE_CATEGORY_ICON_UMG_URL,
      dialogVisible: false,
      dataFrom: {},
      rules: {
        categoryName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
        categoryIcon: [
          { required: true, message: '请上传图片', trigger: 'blur' },
        ]
      },
      fileList: [],
      title: '添加',
      fileUploadUrl: globalConstant.BASE_FILE_UPLOAD_URL,
      imageUrl: '',
    }
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    getCategoryList() {
      categoryApi
        .getCategoryList(this.pageNum, this.pageSize, this.keyword)
        .then((res) => {
          this.categoryList = res.data.list
          this.total = res.data.total
        })
    },
    getCategoryDetail(id) {
      categoryApi.getCategoryDetail(id).then((res) => {
        this.dataFrom = res.data
        this.imageUrl = res.data.categoryIcon
      })
    },
    addCategory() {
      if(!this.dataFrom.categoryIcon) {
        this.$message.error('请先上传图片')
        return
      }
      categoryApi.addCategory(this.dataFrom).then((res) => {
        this.$message.success('添加成功')
        this.dialogVisible = !this.dialogVisible
        this.getCategoryList()
      })
    },
    updateCategory() {
      categoryApi.updateCategory(this.dataFrom).then((res) => {
        this.$message.success('更新成功')
        this.dialogVisible = !this.dialogVisible
        this.getCategoryList()
      })
    },
    showAddDialog() {
      this.title = '添加'
      this.dialogVisible = !this.dialogVisible
    },
    showEditDialog(id) {
      this.title = '修改'
      this.dialogVisible = !this.dialogVisible
      this.getCategoryDetail(id)
    },
    removeCategoryOne(id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        categoryApi.removeCategory(id).then((res) => {
          this.$message.success('删除成功')
          this.getCategoryList()
        })
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getCategoryList()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getCategoryList()
    },
    fileUpload(options) {
      // console.log('222')
      let file = options.file
      let formData = new FormData()
      formData.append('file', file)
      formData.append('flag', 'category')
      fileUploadApi.fileUpload(formData).then((response) => {
        let res = response.data
        if (res.code == 200) {
          this.imageUrl = res.data
          this.dataFrom.categoryIcon = this.imageUrl
          console.log(this.imageUrl)
          this.$message.success('文件上传成功')
        } else {
          this.$message.error('文件上传失败')
        }
      })
    },
    subForm() {
      if (this.dataFrom.id) {
        this.updateCategory()
      } else {
        this.addCategory()
      }
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  .category-list-area {
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