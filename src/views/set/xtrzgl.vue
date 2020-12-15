<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item>系统日志管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="logData" border stripe>
        <el-table-column prop="auser" label="用户名"></el-table-column>
        <el-table-column prop="lip" label="ip地址"></el-table-column>
        <el-table-column prop="laddtime" label="日志时间"></el-table-column>
        <el-table-column prop="lmemo" label="操作说明"></el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2, 4, 6, 10]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logData: [],
      total: 0,
      pagenum: 1,
      pagesize: 10
    }
  },
  created() {
    this.getLogList()
  },
  methods: {
    async getLogList() {
      const { data: res } = await this.$http.get(`/articleAdminlog/selectAllLog?page=${this.pagenum}&size=${this.pagesize}`)
      if(!res.success) return this.$message.error('获取日志列表失败')
      this.total = res.data.length
      this.logData = res.data
    },
    handleSizeChange(pagesize) {
      this.pagesize = pagesize
      this.getLogList()
    },
    handleCurrentChange(pagenum) {
      this.pagenum = pagenum
      this.getLogList()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
