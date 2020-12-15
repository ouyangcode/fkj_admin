<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>访客机管理</el-breadcrumb-item>
      <el-breadcrumb-item>访客机管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>

      <!-- 表格 -->
      <el-table :data="listdata" stripe border>
        <el-table-column prop="cequipmentNum" label="设备编号" width="100"></el-table-column>
        <el-table-column prop="cip" label="设备IP" width="120"></el-table-column>
        <el-table-column prop="cinsertTime" label="设备添加日期" width="160">
          <template slot-scope="scope">{{scope.row.cinsertTime | dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="caddTime" label="最后在线时间" width="160">
          <template slot-scope="scope">{{scope.row.caddTime | dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="crecoverTime" label="恢复时间" width="160">
          <template slot-scope="scope">{{scope.row.crecoverTime | dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="cquestionContent" label="设备报修问题描述"></el-table-column>
        <el-table-column prop="cdescription" label="设备描述" width="180"></el-table-column>
        <el-table-column prop="dname" label="所属组织机构" width="120"></el-table-column>
        <el-table-column  fixed="right" prop="cstate" label="设备运行状态" width="120">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.cstate == 0">在线</el-tag>
            <el-tag type="danger" v-else>离线</el-tag>
          </template>
        </el-table-column>

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

    <!-- 修改对话框 -->
    <el-dialog title="编辑访客机信息" :visible.sync="editFormVisible" width="36%">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="150px" size="small">
        <el-form-item label="设备编号" prop="cequipmentNum">
          <el-input v-model="editForm.cequipmentNum" placeholder="请输入设备编号"></el-input>
        </el-form-item>
        <el-form-item label="设备IP" prop="cip">
          <el-input v-model="editForm.cip" placeholder="请输入设备IP"></el-input>
        </el-form-item>
        <el-form-item label="设备添加日期" prop="cinsertTime">
          <el-date-picker
            v-model="editForm.cinsertTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择设备添加日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="最后在线时间" prop="caddTime">
          <el-date-picker
            v-model="editForm.caddTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择最后在线时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="恢复时间" prop="crecoverTime">
          <el-date-picker
            v-model="editForm.crecoverTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择恢复时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="设备报修问题描述" prop="cquestionContent">
          <el-input v-model="editForm.cquestionContent" placeholder="请输入设备报修问题描述"></el-input>
        </el-form-item>
        <el-form-item label="设备描述" prop="cdescription">
          <el-input v-model="editForm.cdescription" placeholder="请输入设备描述"></el-input>
        </el-form-item>
        <el-form-item label="所属组织机构" prop="cuid">
          <el-select v-model="editForm.cuid" placeholder="请选择所属组织机构">
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
      editFormVisible: false,
      editForm: {},
      editFormRules: {
        csid: [
          { required: true, message: '请输入设备型号', trigger: 'blur' },
        ],
        cequipmentNum: [
          { required: true, message: '请输入设备编号', trigger: 'blur' },
        ],
        cip: [
          { required: true, message: '请输入设备IP', trigger: 'blur' },
        ],
        cinsertTime: [
          { required: true, message: '请输入设备添加日期', trigger: 'blur' },
        ],
        caddTime: [
          { required: true, message: '请选择最后在线时间', trigger: 'change' },
        ],
        crecoverTime: [
          { required: true, message: '请选择恢复时间', trigger: 'change' },
        ],
        clicenseCode: [
          { required: true, message: '请输入授权码', trigger: 'blur' },
        ],
        cquestionContent: [
          { required: true, message: '请输入设备报修问题描述', trigger: 'blur' },
        ],
        cdescription: [
          { required: true, message: '请输入设备描述', trigger: 'blur' },
        ],
        cuid: [
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
      const { data: res } = await this.$http.get(`/collectionInfo/list/${this.pagenum}/${this.pagesize}/1`)
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
    // 修改展示信息
    async editList(id) {
      const { data: res } = await this.$http.get('/collectionInfo/' + id)
      console.log(res)
      if(!res.success) return this.$message.error('获取指定信息失败')
      this.editForm = res.data
      this.editFormVisible = true
    },
    // 提交编辑
    submitEditForm() {
       this.$refs.editFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.post(`/collectionInfo/${this.editForm.cid}`, this.editForm)
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

      const { data: res } = await this.$http.delete(`/collectionInfo/` + id)
      if (!res.success) return this.$message.error(res.errMsg)
      this.getListData()
      this.$message.success(res.errMsg)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
