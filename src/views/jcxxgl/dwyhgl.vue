<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>单位用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>

      <!-- 表格 -->
      <el-table :data="listdata" stripe border>
        <el-table-column prop="preceptionname" label="单位人员姓名"></el-table-column>
        <el-table-column prop="pcardid" label="身份证号"></el-table-column>
        <el-table-column prop="ptelephone" label="电话"></el-table-column>
        <el-table-column prop="pmobile" label="手机"></el-table-column>
        <el-table-column prop="dname" label="所属部门"></el-table-column>

        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="danger" icon="el-icon-circle-close" size="mini" @click="editList(scope.row.pid)">未审核</el-button>
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

    <el-dialog
      title="审核人员"
      :visible.sync="dialogVisible"
      width="26%"
      center>
      <span>是否审核通过?</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="dialogVisible = false">取消审核</el-button>
        <el-button type="danger" @click="delUser">删除用户</el-button>
        <el-button type="primary" @click="successUser">审核通过</el-button>
      </span>
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
      dialogVisible: false,
      editForm: {}
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    async getListData() {
      const { data: res } = await this.$http.get(`/personnelInfo/list/${this.pagenum}/${this.pagesize}/0`)
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
    // 点击未审核
    async editList(id) {
      const { data: res } = await this.$http.get('/personnelInfo/' + id)
      console.log(res)
      if(!res.success) return this.$message.error('获取指定信息失败')
      this.editForm = res.data
      this.dialogVisible = true
    },
    // 审核通过
    async successUser() {
      this.editForm.puseful = 1
      const { data: res } = await this.$http.post(`/personnelInfo/` + this.editForm.pid, this.editForm)
      if (!res.success) return this.$message.error(res.errMsg)
      this.getListData()
      this.dialogVisible = false
      this.$message.success(res.errMsg)
    },
    async delUser() {
      const { data: res } = await this.$http.delete(`/personnelInfo/` + this.editForm.pid)
      if (!res.success) return this.$message.error(res.errMsg)
      this.getListData()
      this.dialogVisible = false
      this.$message.success('删除成功')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
