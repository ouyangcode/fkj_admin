<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>单位信息管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="90px" style="width:500px;">
        <el-form-item label="单位全称" prop="cname">
          <el-input v-model="editForm.cname" placeholder="请输入单位全称"></el-input>
        </el-form-item>
        <el-form-item label="单位简称" prop="cnameJ">
          <el-input v-model="editForm.cnameJ" placeholder="请输入单位简称"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="cnote">
          <el-input type="textarea" :rows="2" placeholder="请输入备注信息" v-model="editForm.cnote"></el-input>
        </el-form-item>
      </el-form>

      <el-button type="primary" @click="submitEditForm">确 定</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listdata: {},
      editForm: {},
      editFormRules: {
        cname: [
          { required: true, message: '请输入单位全称', trigger: 'blur' },
        ],
        cnameJ: [
          { required: true, message: '请输入单位简称', trigger: 'blur' },
        ]
      }
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    async getListData() {
      const { data: res } = await this.$http.get(`/companyInfo/list/1/1`)
      if(!res.success) return this.$message.error('获取单位信息失败')
      this.editForm = res.data.records[0]
    },
    // 提交编辑
    submitEditForm() {
       this.$refs.editFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.post(`/companyInfo/${this.editForm.cid}`, this.editForm)
        if(!res.success) return this.$message.error('修改失败')
        this.$message.success('修改成功')
        this.getListData()
        this.editFormVisible = false
      })
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
