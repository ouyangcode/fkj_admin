<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>来访用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>

      <!-- 筛选网站新闻 -->
      <el-form v-model="searchForm" :inline="true" class="demo-form-inline">
        <el-form-item label="编号:">
          <el-input v-model="searchForm.uid" placeholder="请输入编号"></el-input>
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input v-model="searchForm.uvisitorname" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别:">
          <el-select v-model="searchForm.usex" placeholder="请选择性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchFormClick">查询</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="listdata" stripe border>
        <el-table-column prop="uid" label="编号" width="50"></el-table-column>
        <el-table-column prop="usheetno" label="访客单号" width="150"></el-table-column>
        <el-table-column prop="uvisitorname" label="访客姓名" width="80"></el-table-column>
        <el-table-column prop="ucredentialstype" label="证件类型" width="80"></el-table-column>
        <el-table-column prop="ucredentialsno" label="证件号码" width="180"></el-table-column>
        <el-table-column prop="usex" label="性别" width="60"></el-table-column>
        <el-table-column prop="ucredentialsaddr" label="证件地址" width="150"></el-table-column>
        <el-table-column prop="uvisitorcompany" label="访客单位" width="120"></el-table-column>
        <el-table-column prop="umobile" label="手机" width="120"></el-table-column>
        <el-table-column prop="utelephone" label="电话" width="120"></el-table-column>
        <el-table-column prop="汉" label="民族" width="60"></el-table-column>
        <el-table-column prop="ubirthday" label="出生日期" width="160">
          <template slot-scope="scope">{{scope.row.ubirthday | dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="usigndept" label="签发机构" width="180"></el-table-column>
        <el-table-column prop="usignstdate" label="生效日期" width="160">
          <template slot-scope="scope">{{scope.row.usignstdate | dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="usignenddate" label="失效日期" width="160">
          <template slot-scope="scope">{{scope.row.usignenddate | dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="ucardno" label="卡片登记号码" width="150"></el-table-column>
        <el-table-column prop="ucardsn" label="卡片系列号" width="150"></el-table-column>
        <el-table-column prop="uinouttimes" label="进出次数" width="80"></el-table-column>

        <el-table-column fixed="right" label="操作" width="240">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="goWhiteUser(scope.row)">移至白名单</el-button>
            <el-button type="danger" size="mini" @click="goBlockUser(scope.row)">移至黑名单</el-button>
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
      pagesize: 10,
      editForm: {},
      searchForm: {
        uid: '',
        usex: '',
        uvisitorname: ''
      }
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    async getListData() {
      const { data: res } = await this.$http.get(`/userInfo/list/${this.pagenum}/${this.pagesize}/0`)
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
    async searchFormClick() {
      const { data:res } = await this.$http.post(`/userInfo/list/condition/1/${this.pagesize}/1`, this.searchForm)
      if(!res.success) return this.$message.error(res.errMsg)
      if(res.data.records.length == 0) return this.$message.error('查询内容不存在')
      this.pagenum = 1
      this.$message.success(res.errMsg)
      console.log(res.data.records)
      this.listdata = res.data.records
    },
    // 移至白名单
    async goWhiteUser(row) {
      const confirmResult = await this.$confirm('是否移动到白名单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消更改')

      row.uiswhite = 1
      const { data: res } = await this.$http.post('/userInfo/' + row.uid, row)
      if(!res.success) return this.$message.error(res.errMsg)
      this.getListData()
      this.$message.success(res.errMsg)
    },
    // 移至黑名单
    async goBlockUser(row) {
      const confirmResult = await this.$confirm('是否移动到黑名单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消更改')

      row.uiswhite = 2
      const { data: res } = await this.$http.post('/userInfo/' + row.uid, row)
      if(!res.success) return this.$message.error(res.errMsg)
      this.getListData()
      this.$message.success(res.errMsg)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
