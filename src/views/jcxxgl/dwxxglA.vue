<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>单位信息管理场景2</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>

      <!-- 添加 -->
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addFormVisible = true">添加单位信息</el-button>

      <!-- 表格 -->
      <el-table :data="listdata" stripe border>
        <el-table-column prop="cid" label="编号"></el-table-column>
        <el-table-column prop="cname" label="单位名称"></el-table-column>
        <el-table-column prop="cnameJ" label="简介"></el-table-column>
        <el-table-column prop="cnote" label="备注"></el-table-column>

        <el-table-column fixed="right" label="操作" width="190">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editList(scope.row.cid)">修改</el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delList(scope.row.cid)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2, 4, 8, 10]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加弹出框 -->
    <el-dialog title="添加单位人员信息" :visible.sync="addFormVisible" @closed="addFormClosed" width="36%">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="120px">
        <el-form-item label="单位名称" prop="cname">
          <el-input v-model="addForm.cname" placeholder="请输入单位名称"></el-input>
        </el-form-item>
        <el-form-item label="单位简称" prop="cnameJ">
          <el-input v-model="addForm.cnameJ" placeholder="请输入单位简称"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="cnote">
          <el-input type="textarea" v-model="addForm.cnote"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog title="编辑单位人员信息" :visible.sync="editFormVisible" width="36%">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="120px">
        <el-form-item label="单位名称" prop="cname">
          <el-input v-model="editForm.cname" placeholder="请输入单位名称"></el-input>
        </el-form-item>
        <el-form-item label="单位简称" prop="cnameJ">
          <el-input v-model="editForm.cnameJ" placeholder="请输入单位简称"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="cnote">
           <el-input type="textarea" v-model="editForm.cnote"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listdata: [],
      total: 0,
      pagenum: 1,
      pagesize: 10,
      addFormVisible: false,
      addForm: {
        cname: '',
        cnameJ:'',
        cnote: ''
      },
      addFormRules: {
        cname: [  
          { required: true, message: '请输入单位名称', trigger: 'blur' }
        ],
      },
      editFormVisible: false,
      editForm: {},
      editFormRules: {
        cname: [
          { required: true, message: '请输入单位名称', trigger: 'blur' }
        ],
      }
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    async getListData() {
      const { data: res } = await this.$http.get(`/companyInfo/list/${this.pagenum}/${this.pagesize}`)
      this.total = res.data.total
      this.listdata = res.data.records
      console.log(res)
    },
    // 显示第几页
    handleCurrentChange (val) {
      this.pagenum = val
      this.getListData()
    },
    // 每页显示的条数
    handleSizeChange (val) {
      this.pagesize = val
      this.getListData()
    },
    // 添加对话框关闭
    addFormClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 提交添加
    submitAddForm() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.post('/companyInfo', this.addForm)
        if(!res.success) return this.$message.error(res.errMsg)
        this.$message.success(res.errMsg)
        this.getListData()
        this.addFormVisible = false
      })
    },
    // 修改展示信息
    async editList(id) {
      const { data: res } = await this.$http.get('/companyInfo/' + id)
      console.log(res)
      if(!res.success) return this.$message.error('获取指定信息失败')
      this.editForm = res.data
      this.editFormVisible = true
    },
    // 提交编辑
    submitEditForm() {
       this.$refs.editFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.post(`/companyInfo/${this.editForm.cid}`, this.editForm)
        if(!res.success) return this.$message.error(res.errMsg)
        this.$message.success(res.errMsg)
        this.getListData()
        this.editFormVisible = false
      })
    },
    // 删除
    async delList(id) {
      const confirmResult = await this.$confirm('是否删除所选中的内容?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')

      const { data: res } = await this.$http.delete(`/companyInfo/` + id)
      if (!res.success) return this.$message.error(res.errMsg)
      this.getListData()
      this.$message.success(res.errMsg)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
