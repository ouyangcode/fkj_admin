<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>访客信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>历史访客记录</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>

      <!-- 表格 -->
      <el-table :data="listdata" stripe border>
        <el-table-column prop="vsheetno" label="访客单号" width="150"></el-table-column>
        <el-table-column prop="vvisitornum" label="来访人数" width="80"></el-table-column>
        <el-table-column prop="vstdate" label="来访日期" width="160">
          <template slot-scope="scope">{{scope.row.vstdate | dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="vstposition" label="来访门岗" width="100"></el-table-column>
        <el-table-column prop="venddate" label="预计离开时间" width="160">
          <template slot-scope="scope" v-if="scope.row.vplanendtime!=null">{{scope.row.vplanendtime | dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="vendtime" label="实际离开时间" width="160">
          <template slot-scope="scope" v-if="scope.row.vendtime!=null">{{scope.row.vendtime | dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="vendposition" label="离开门岗" width="100"></el-table-column>
        <el-table-column prop="vvisitreason" label="事由" width="160"></el-table-column>
        <el-table-column prop="vremark" label="备注" width="160"></el-table-column>
        <el-table-column prop="vcarzone" label="车辆/省" width="80"></el-table-column>
        <el-table-column prop="vcarno" label="车辆车牌" width="100"></el-table-column>
        <el-table-column prop="vcartype" label="车辆车型" width="100"></el-table-column>
        <el-table-column prop="vendoperid" label="进入操作员" width="100"></el-table-column>
        <el-table-column prop="vvisitorcompany" label="离开操作员" width="100"></el-table-column>
        <el-table-column prop="vvisitortype" label="访客单位" width="120"></el-table-column>
        <el-table-column prop="uname" label="访问姓名" width="80"></el-table-column>
        <el-table-column prop="pname" label="被访问姓名" width="100"></el-table-column>

        <el-table-column fixed="right" prop="vvisitorstatus" label="来访状态" width="160">
          <template slot-scope="scope">
            <el-tag :type="scope.row.vvisitorstatus == 0 ? 'success' : 'danger'">{{scope.row.vvisitorstatus == 0 ? '已来访登记' : '已离开登记'}}</el-tag>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      listdata: [],
      total: 0,
      pagenum: 1,
      pagesize: 10
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    async getListData() {
      const { data: res } = await this.$http.get(`/visitInfo/list/${this.pagenum}/${this.pagesize}/0`)
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
