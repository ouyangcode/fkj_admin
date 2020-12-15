<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" replace="false">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 权限列表 -->
    <el-card class="box-card">
      <el-button type="primary" @click="showaddRightDialog()">添加权限</el-button>

      <!-- 表格 -->
      <template>
        <el-table :data="rolelist" border stripe style="width: 100%;">
          <!-- 数据 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="name" label="权限名称">
          </el-table-column>
          <el-table-column prop="describe" label="权限描述">
          </el-table-column>
          <el-table-column prop="addTime" label="添加时间">
            <template slot-scope="scope">
              {{scope.row.addTime | dateFormat}}
            </template>
          </el-table-column>
        
          <el-table-column label="操作" width="140">
            <template slot-scope="scope">
              <!-- 修改按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showSetRightDialog(scope.row.id)"></el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>

      <!-- 添加权限 -->
      <el-dialog
        title="添加权限"
        :visible.sync="addRightDialogVisible"
        width="30%"
        @close="addRightDialogClosed">
        <el-form :model="addform" :rules="addFormRules"  ref="addFormRef" label-width="80px">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="addform.name"></el-input>
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="addform.describe"></el-input>
          </el-form-item>
          <el-form-item label="分配权限">
             <!-- 树形控件 -->
            <el-tree
              :data="rolesList"
              show-checkbox
              node-key="id"
              ref="addtree"
              highlight-current
              :props="treeProps">
            </el-tree>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRights">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改权限 -->
      <el-dialog
        title="修改权限信息"
        :visible.sync="setRightDialogVisible"
        width="36%"
        @close="setRightDialogClosed">
        <el-form :model="editform" label-width="80px">
          <el-form-item label="权限名称">
            <el-input v-model="editform.name"></el-input>
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="editform.describe"></el-input>
          </el-form-item>
          <el-form-item label="分配权限">
            <!-- 树形控件 -->
            <el-tree
              :data="rolesList"
              show-checkbox
              default-expand-all
              node-key="id"
              :default-checked-keys="defKeys"
              ref="settree"
              highlight-current
              :props="treeProps">
            </el-tree>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  inject:['reload'],
  data() {
    return {
      // 权限表格列表
      rolelist: [],
      total: 0,
      pagenum: 1,
      pagesize: 10,
      // 权限树形列表
      rolesList: [],
      // 添加权限
      addRightDialogVisible: false,
      // 添加表单验证规则对象
      addFormRules: {
        name: [
          { required: true, message: '请输入权限名称', trigger: 'blur' }
        ]
      },
      addform: {
        name: '',
        describe: '',
        caiDanIds: []
      },
      // 控制修改权限对话框的显示与隐藏
      setRightDialogVisible: false,
      editform: {
        name: '',
        describe: '',
        caiDanIds: []
      },
      // 树形控件的属性绑定对象
      treeProps: {
        children: 'ziCaiDanList',
        label: 'name'
      },
      // 默认选中的节点ID值数值
      defKeys: [],
      rid: ''
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取权限列表
    async getRoleList() {
      // 获取权限菜单
      const { data: resa } = await this.$http.get('/articleServermenu/GetAllServerMenu')
      if(!resa.success) return this.$message.error('请求角色权限失败')
      this.rolesList = resa.data
      
      // 获取权限列表
      const { data: res } = await this.$http.get(`articleRole/list/${this.pagenum}/${this.pagesize}`)
      console.log(res)
      if(!res.success) return this.$message.error('获取权限列表失败')
      this.total = res.data.total
      this.rolelist = res.data.records
    },
    // 当前第几页
    handleCurrentChange(pagenum) {
      this.pagenum = pagenum
      this.getRoleList()
    },
    // 每页显示多少条
    handleSizeChange(pagesize) {
      this.pagesize = pagesize
      this.getRoleList()
    },
    // 展示添加权限
    showaddRightDialog() {
      this.addRightDialogVisible = true
    },
    // 确认添加权限
    addRights () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return

        const keys = [
          ...this.$refs.addtree.getCheckedKeys(),
          ...this.$refs.addtree.getHalfCheckedKeys()
        ]
        console.log(keys)
        this.addform.caiDanIds = keys
        if(this.addform.caiDanIds.length == 0) return this.$message.error('请最少选择一个权限')
        console.log(this.addform)

        const { data: res } = await this.$http.post('/articleRole/addRole', this.addform)
        if(!res.success) return this.$message.error('添加角色权限失败')
        this.$message.success('添加角色权限成功')
        this.getRoleList()
        this.addRightDialogVisible = false
      })
    },
    // 添加权限对话框关闭
    addRightDialogClosed() {
      this.addform.name = ''
      this.addform.describe = ''
      this.addform.caiDanIds = []
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed () {
      this.reload();
    },
    // 展示修改权限
    async showSetRightDialog(rid) {
      console.log(this.defKeys)
      console.log(rid)
      const { data: res } = await this.$http.get(`/articleRole/selectRoleById?rid=${rid}`)
      if(!res.success) return this.$message.error(res.msg)
      this.editform = res.data

      const arr = []
      const arrname = []
      res.data.serverMenuVOS.forEach(function (c) {
        // return arr.push(c.id);
        c.ziCaiDanList.forEach (item => {
          arr.push(item.id);
          arrname.push(item.name);
        })
      })
      console.log(arr)
      console.log(arrname)

      this.defKeys = arr
      this.rid = rid
      this.setRightDialogVisible = true
    },
    // 确认修改权限
    async setRights() {
      const keys = [
        ...this.$refs.settree.getCheckedKeys(),
        ...this.$refs.settree.getHalfCheckedKeys()
      ]
      this.editform.caiDanIds = keys
      if(this.editform.caiDanIds.length == 0) return this.$message.error('请最少选择一个权限')

      const { data: res } = await this.$http.post(`/articleRole/updateRoleById?rid=${this.rid}`, this.editform)
      if(!res.success) return this.$message.error('修改权限信息失败')
      this.getRoleList()
      this.$message.success('修改权限信息成功')
      this.setRightDialogVisible = false
    },
    // 删除权限
    async removeUserById(rid) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该权限并附带管理员信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认删除,则返回值为字符串 confirm
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete(`/articleRole/deleteRoleById?rid=${rid}`)
      console.log(res)
      if (!res.success) return this.$message.error(res.errMsg)
      this.$message.success('删除权限信息成功!')
      // 刷新权限列表
      this.getRoleList()
    }
  }
};
</script>

<style scoped lang="scss">
.el-tag{
  margin: 7px;
}

.bdtop{
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>
