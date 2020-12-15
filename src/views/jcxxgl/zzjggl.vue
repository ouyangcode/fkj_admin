<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>组织机构管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>

      <!-- 添加 -->
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addFormVisible = true">添加部门信息</el-button>

      <!-- 表格 -->
      <el-table :data="listdata" stripe border>
        <el-table-column prop="did" label="编号"></el-table-column>
        <el-table-column prop="dname" label="部门名称"></el-table-column>
        <el-table-column prop="cname" label="单位名称"></el-table-column>
        <el-table-column prop="duserId" label="负责人"></el-table-column>
        <el-table-column prop="daddress" label="地址"></el-table-column>
        <el-table-column prop="dtel" label="联系电话"></el-table-column>

        <el-table-column fixed="right" label="操作" width="190">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editList(scope.row.did)">修改</el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delList(scope.row.did)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>

    <!-- 添加弹出框 -->
    <el-dialog title="添加部门信息" :visible.sync="addFormVisible" @closed="addFormClosed" width="36%">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="90px">
        <el-form-item label="部门名称" prop="dname">
          <el-input v-model="addForm.dname" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="duserId">
          <el-input v-model="addForm.duserId" placeholder="请输入负责人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="dtel">
          <el-input type="number" v-model="addForm.dtel" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="daddress">
          <el-input v-model="addForm.daddress" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="unit.cname" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog title="修改部门信息" :visible.sync="editFormVisible" width="36%">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="90px">
        <el-form-item label="部门名称" prop="dname">
          <el-input v-model="editForm.dname" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="duserId">
          <el-input v-model="editForm.duserId" placeholder="请输入负责人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="dtel">
          <el-input type="number" v-model="editForm.dtel" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="daddress">
          <el-input v-model="editForm.daddress" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="unit.cname" disabled></el-input>
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
      // 单位信息
      unit: {},
      listdata: [],
      total: 0,
      pagenum: 1,
      pagesize: 10,
      addFormVisible: false,
      addForm: {
        dname: '',
        duserId: '',
        dtel: '',
        daddress: '',
        dcid: ''
      },
      addFormRules: {
        dname: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
        ],
        duserId: [
          { required: true, message: '请输入负责人', trigger: 'blur' },
        ],
        dtel: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
        ],
        daddress: [
          { required: true, message: '请输入地址', trigger: 'blur' },
        ]
      },
      editFormVisible: false,
      editForm: {},
      editFormRules: {
        dname: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
        ],
        duserId: [
          { required: true, message: '请输入负责人', trigger: 'blur' },
        ],
        dtel: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
        ],
        daddress: [
          { required: true, message: '请输入地址', trigger: 'blur' },
        ]
      }
    }
  },
  created() {
    this.getUnit()
    this.getListData()
  },
  methods: {
    async getUnit() {
      const { data: unitRes } = await this.$http.get(`/companyInfo/list/1/1`)
      if(!unitRes.success) return this.$message.error('获取单位信息失败')
      this.unit = unitRes.data.records[0]
    },
    async getListData() {
      const { data: res } = await this.$http.get(`/departmentInfo/list`)
      this.listdata = res.data
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

        this.addForm.dcid = this.unit.cid
        const { data: res } = await this.$http.post('/departmentInfo', this.addForm)
        if(!res.success) return this.$message.error(res.errMsg)
        this.$message.success(res.errMsg)
        this.getListData()
        this.addFormVisible = false
      })
    },
    // 修改展示信息
    async editList(id) {
      const { data: res } = await this.$http.get('/departmentInfo/' + id)
      if(!res.success) return this.$message.error('获取指定信息失败')
      this.editForm = res.data
      this.editFormVisible = true
    },
    // 提交编辑
    submitEditForm() {
       this.$refs.editFormRef.validate(async valid => {
        if (!valid) return

        this.editForm.dcid = this.unit.cid
        const { data: res } = await this.$http.post(`/departmentInfo/${this.editForm.did}`, this.editForm)
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

      const { data: res } = await this.$http.delete(`/departmentInfo/` + id)
      if (!res.success) return this.$message.error(res.errMsg)
      this.getListData()
      this.$message.success(res.errMsg)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
