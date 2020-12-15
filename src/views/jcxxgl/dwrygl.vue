<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>单位人员管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>

      <!-- 添加 -->
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addFormVisible = true">添加单位人员</el-button>

      <!-- 表格 -->
      <el-table :data="listdata" stripe border>
        <el-table-column prop="preceptionname" label="单位人员姓名"></el-table-column>
        <el-table-column prop="pcardid" label="身份证号"></el-table-column>
        <el-table-column prop="ptelephone" label="电话"></el-table-column>
        <el-table-column prop="pmobile" label="手机"></el-table-column>
        <el-table-column prop="dname" label="所属部门"></el-table-column>

        <el-table-column fixed="right" label="操作" width="190">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editList(scope.row.pid)">修改</el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delList(scope.row.pid)">删除</el-button>
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
        <el-form-item label="单位人员姓名" prop="preceptionname">
          <el-input v-model="addForm.preceptionname" placeholder="请输入单位人员姓名"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="pcardid">
          <el-input v-model="addForm.pcardid" placeholder="请输入身份证号"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="ptelephone">
          <el-input type="number" v-model="addForm.ptelephone" placeholder="请输入电话号"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="pmobile">
          <el-input type="number" v-model="addForm.pmobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="所属组织机构" prop="pdid">
          <el-select v-model="addForm.pdid" placeholder="请选择所属组织机构">
            <el-option
              v-for="item in bmlistData"
              :key="item.did"
              :label="item.dname"
              :value="item.did">
            </el-option>
          </el-select>
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
        <el-form-item label="单位人员姓名" prop="preceptionname">
          <el-input v-model="editForm.preceptionname" placeholder="请输入单位人员姓名"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="pcardid">
          <el-input v-model="editForm.pcardid" placeholder="请输入身份证号"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="ptelephone">
          <el-input type="number" v-model="editForm.ptelephone" placeholder="请输入电话号"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="pmobile">
          <el-input type="number" v-model="editForm.pmobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="所属组织机构" prop="pdid">
          <el-select v-model="editForm.pdid" placeholder="请选择所属组织机构">
            <el-option
              v-for="item in bmlistData"
              :key="item.did"
              :label="item.dname"
              :value="item.did">
            </el-option>
          </el-select>
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
      bmlistData: [],
      listdata: [],
      total: 0,
      pagenum: 1,
      pagesize: 10,
      addFormVisible: false,
      addForm: {
        preceptionname: '',
        pcardid:'',
        ptelephone: '',
        pmobile: '',
        puseful: '1',
        pdid: ''
      },
      addFormRules: {
        preceptionname: [
          { required: true, message: '请输入单位人员名称', trigger: 'blur' },
        ],
        pcardid: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
        ],
        ptelephone: [
          { required: true, message: '请输入电话号', trigger: 'blur' },
        ],
        pmobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
        ],
        pdid: [
          { required: true, message: '请选择所属组织机构', trigger: 'change' },
        ]
      },
      editFormVisible: false,
      editForm: {},
      editFormRules: {
        preceptionname: [
          { required: true, message: '请输入单位人员名称', trigger: 'blur' },
        ],
        pcardid: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
        ],
        ptelephone: [
          { required: true, message: '请输入电话号', trigger: 'blur' },
        ],
        pmobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
        ],
        pdid: [
          { required: true, message: '请选择所属组织机构', trigger: 'change' },
        ]
      }
    }
  },
  created() {
    this.getBmlistData()
    this.getListData()
  },
  methods: {
    async getBmlistData() {
      const { data: res } = await this.$http.get(`/departmentInfo/list`)
      if(!res.success) return this.$message.error('获取组织机构信息失败')
      this.bmlistData = res.data
    },
    async getListData() {
      const { data: res } = await this.$http.get(`/personnelInfo/list/${this.pagenum}/${this.pagesize}/1`)
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

        const { data: res } = await this.$http.post('/personnelInfo/add/1', this.addForm)
        if(!res.success) return this.$message.error(res.errMsg)
        this.$message.success(res.errMsg)
        this.getListData()
        this.addFormVisible = false
      })
    },
    // 修改展示信息
    async editList(id) {
      const { data: res } = await this.$http.get('/personnelInfo/' + id)
      console.log(res)
      if(!res.success) return this.$message.error('获取指定信息失败')
      this.editForm = res.data
      this.editFormVisible = true
    },
    // 提交编辑
    submitEditForm() {
       this.$refs.editFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.post(`/personnelInfo/${this.editForm.pid}`, this.editForm)
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

      const { data: res } = await this.$http.delete(`/personnelInfo/` + id)
      if (!res.success) return this.$message.error(res.errMsg)
      this.getListData()
      this.$message.success(res.errMsg)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
