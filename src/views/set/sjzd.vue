<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>数据字典</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="sjzdData" stripe border style="width: 100%">
         <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table :data="scope.row.sysTableList" stripe border style="width: 100%">
              <el-table-column prop="sname" label="名称"></el-table-column>
              <el-table-column prop="snote" label="描述"></el-table-column>
              <el-table-column prop="screateTime" label="创建时间">
                <template slot-scope="scope">
                  {{scope.row.screateTime | dateFormat}}
                </template>
              </el-table-column>

              <el-table-column label="操作" width="180px">
                <template slot-scope="scope">
                  <!-- 修改按钮 -->
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="editSjzdZxClick(scope.row)"></el-button>
                  <!-- 删除按钮 -->
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteSjzdZxClick(scope.row.sid)"></el-button>
                </template>
              </el-table-column>

            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="sdType" label="类型编号"></el-table-column>
        <el-table-column prop="sdName" label="类型名称"></el-table-column>
        <el-table-column prop="sdDescription" label="描述"></el-table-column>
        <!-- <el-table-column prop="sinUse" label="是否可编辑">
          <template slot-scope="scope">
              <el-tag :type="scope.row.sdCanEdit == 0 ? '' : 'danger'">{{scope.row.sdCanEdit == 0 ? '是' : '否'}}</el-tag>
            </template>
        </el-table-column> -->

        <el-table-column label="操作" width="240px">
          <template slot-scope="scope">
            <!-- 添加子项 -->
            <el-button type="warning" icon="el-icon-circle-plus-outline" size="mini" @click="addSjzdZx(scope.row.sdID)">添加子项</el-button>
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editSjzd(scope.row)">修改信息</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>

    <!-- 修改列表数据字典 -->
    <el-dialog title="修改数据字典类型" :visible.sync="editSjzdVisible" @closed="editSjzdClosed" width="36%">
      <el-form :model="editSjzdForm" ref="editSjzdRef" label-width="80px">
        <el-form-item label="名称" prop="sdName">
          <el-input v-model="editSjzdForm.sdName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="sdDescription">
          <el-input v-model="editSjzdForm.sdDescription"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editSjzdVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditSjzd">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加数据字典 -->
    <el-dialog title="添加子项数据字典" :visible.sync="addSjzdVisible" @closed="addSjzdClosed" width="36%">
      <el-form :model="addSjzdForm" ref="addSjzdRef" :rules="addSjzdRules" label-width="80px">
        <el-form-item label="名称" prop="sname">
          <el-input v-model="addSjzdForm.sname"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="snote">
          <el-input v-model="addSjzdForm.snote"></el-input>
        </el-form-item>
        <el-form-item label="排列顺序" prop="ssequence">
          <el-input type="number" v-model="addSjzdForm.ssequence"></el-input>
        </el-form-item>
        <el-form-item label="是否可用" prop="sinUse">
          <el-radio-group v-model="addSjzdForm.sinUse">
            <el-radio label="0">是</el-radio>
            <el-radio label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addSjzdVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddSjzd">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改子项数据字典 -->
    <el-dialog title="修改子项数据字典" :visible.sync="editSjzdZxVisible" @closed="editSjzdZxClosed" width="36%">
      <el-form :model="editSjzdZxForm" ref="editSjzdZxRef" label-width="80px">
        <el-form-item label="名称" prop="sname">
          <el-input v-model="editSjzdZxForm.sname"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="snote">
          <el-input v-model="editSjzdZxForm.snote"></el-input>
        </el-form-item>
        <el-form-item label="排列顺序" prop="ssequence">
          <el-input type="number" v-model="editSjzdZxForm.ssequence"></el-input>
        </el-form-item>
        <el-form-item label="是否可用" prop="sinUse">
          <el-radio-group v-model="editSjzdZxForm.sinUse">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editSjzdZxVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditSjzdZx">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sjzdData: [],
      editSjzdVisible: false,
      // 修改字典基础信息
      editSjzdForm: {},
      addSjzdVisible: false,
      // 添加子项数据字典
      addSjzdForm: {},
      // 验证数据字典
      addSjzdRules: {
        sname: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        snote: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ],
        ssequence: [
          { required: true, message: '请输入排列顺序', trigger: 'blur' }
        ],
        sinUse: [
          { required: true, message: '请选择是否可用', trigger: 'change' }
        ]
      },
      editSjzdZxVisible: false,
      // 修改子项数据字典
      editSjzdZxForm: {}
    }
  },
  created() {
    this.getZidianData()
  },
  methods: {
    async getZidianData() {
      const { data: res } = await this.$http.get('sysTableDesc/SelectAllSysTableDesc')
      console.log(res)
      if(!res.success) return this.$message.error('获取数据字典列表失败')
      this.sjzdData = res.data
    },
    // 弹出修改数据字典类型
    editSjzd(data) {
      this.editSjzdForm = data
      this.editSjzdVisible = true
    },
    // 修改数据字典类型关闭
    editSjzdClosed() {
      this.$refs.editSjzdRef.resetFields()
    },
    // 确认修改数据字典基础
    async submitEditSjzd() {
      const { data: res } = await this.$http.post('/sysTableDesc/UpdateSysTableDesc?id=' + this.editSjzdForm.sdID, this.editSjzdForm)
      if(!res.success) return this.$message.error('修改数据字典类型失败')
      this.$message.success('修改数据字典类型成功')
      this.getZidianData()
      this.editSjzdVisible = false
    },
    // 弹出添加子项字典
    addSjzdZx(sdid) {
      console.log(sdid)
      this.addSjzdForm.sdid = sdid
      this.addSjzdVisible = true
    },
    // 添加子项数据字典关闭触发
    addSjzdClosed() {
      this.$refs.addSjzdRef.resetFields()
    },
    // 确认添加数据字典
    submitAddSjzd() {
      this.$refs.addSjzdRef.validate(async valid => {
        // 如果预验证没有通过
        if (!valid) return this.$message.error('请填写必要的内容')
        const { data: res } = await this.$http.post('/sysTable/addSysTable', this.addSjzdForm)
        console.log(res)
        if(!res.success) return this.$message.error('添加子项数据字典失败')
        this.$message.success('添加子项数据字典成功')
        this.getZidianData()
        this.addSjzdVisible = false
      })
    },
    // 修改子项数据字典
    editSjzdZxClick(data) {
      console.log(data)
      this.editSjzdZxForm = data
      this.editSjzdZxVisible = true
    },
    // 修改子项数据字典对话框关闭触发
    editSjzdZxClosed() {
      this.$refs.editSjzdZxRef.resetFields()
    },
    // 确定添加子项数据字典
    async submitEditSjzdZx() {
      const { data: res } = await this.$http.post('/sysTable/updateSysTableById', this.editSjzdZxForm)
      if(!res.success) return this.$message.error('修改子项数据字典失败')
      this.$message.success('修改子项数据字典成功')
      this.getZidianData()
      this.editSjzdZxVisible = false
    },
    // 删除子项数据字典
    async deleteSjzdZxClick(sid) {
      console.log(sid)
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该子项字典信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认删除,则返回值为字符串 confirm
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.post(`/sysTable/deleteSysTableById?id=${sid}`)
      console.log(res)
      if (!res.success) return this.$message.error('删除失败')
      this.getZidianData()
      this.$message.success('删除成功!')
    }
  }
};
</script>

<style scoped lang="scss">

</style>
