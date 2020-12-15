<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" replace="false">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-button type="primary" @click="addDialogVisible = true ">添加管理员</el-button>
      <!-- 管理员列表 -->
      <template>
        <el-table :data="userListData" border stripe style="width: 100%;">
          <el-table-column fixed prop="id" label="id" width="60">
          </el-table-column>
          <el-table-column prop="account" label="账户" width="100">
          </el-table-column>
          <el-table-column prop="password" label="密码" width="100">
          </el-table-column>
          <el-table-column prop="loginTime" label="最后登录时间" width="140">
            <template slot-scope="scope">
              {{scope.row.loginTime | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="loginIp" label="登录ip" width="150">
          </el-table-column>
          <el-table-column prop="roleName" label="权限">
            <template slot-scope="scope">
             <el-tag type="success">{{ scope.row.roleName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="addTime" label="添加时间" width="140">
            <template slot-scope="scope">
              {{scope.row.addTime | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="100">
          </el-table-column>
          <el-table-column prop="unitName" label="单位名称" width="200">
          </el-table-column>
          <el-table-column prop="useFul" label="是否可用" width="100">
            <template slot-scope="scope">
              <el-tag :type="scope.row.useFul == 1 ? '' : 'danger'">{{scope.row.useFul == 1 ? '是' : '否'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template slot-scope="scope">
              <!-- 修改按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
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

      <!-- 添加管理员 -->
      <el-dialog
        title="添加管理员信息"
        :visible.sync="addDialogVisible"
        width="36%"
        @close="addDiglogClosed">
        <!-- 内容主体区 -->
       <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="150px">
          <el-form-item label="账户" prop="account">
            <el-input v-model="addForm.account"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="权限" prop="rid">
            <el-select v-model="addForm.rid" placeholder="请选择权限">
            <el-option
              v-for="item in ridArr"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="是否可用" prop="useFul">
            <el-radio-group v-model="addForm.useFul">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <!-- 底部区 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改管理员 -->
      <el-dialog
        title="修改管理员信息"
        :visible.sync="editDialogVisible"
        width="36%"
        @close="editDialogClosed">
        <!-- 内容主体区 -->
       <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="150px">
          <el-form-item label="账户" prop="account">
            <el-input v-model="editForm.account"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="editForm.password"></el-input>
          </el-form-item>
          <el-form-item label="权限" prop="rid">
            <el-select v-model="editForm.rid" placeholder="请选择权限">
            <el-option
              v-for="item in ridArr"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="是否可用" prop="useFul">
            <el-radio-group v-model="editForm.useFul">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <!-- 底部区 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return{
        // 权限菜单
        ridArr: [],
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 10,
        // 管理员列表
        userListData: [],
        total: 0,
        // 控制添加管理员的显示与隐藏
        addDialogVisible: false,
        // 添加用户的表单数据
        addForm: {
          account: '',
          password: '',
          rid: '',
          name: '',
          useFul: ''
        },
        // 添加表单验证规则对象
        addFormRules: {
          account: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '用户名的长度在3~10个字符之间', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '密码的长度在6~15个字符之间', trigger: 'blur' }
          ],
          rid: [
            { required: true, message: '请选择权限', trigger: 'change' }
          ],
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          useFul: [
            { required: true, message: '请选择是否可用', trigger: 'change' }
          ]
        },
        // 控制修改用户对话框的显示与隐藏
        editDialogVisible: false,
        // 查询到的用户信息对象
        editForm: {},
        // 修改表单的验证规则对象
        editFormRules: {
          account: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '用户名的长度在3~10个字符之间', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '密码的长度在6~15个字符之间', trigger: 'blur' }
          ],
          rid: [
            { required: true, message: '请选择权限', trigger: 'change' }
          ],
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          useFul: [
            { required: true, message: '请选择是否可用', trigger: 'change' }
          ]
        }
      }
    },
    created() {
      this.getUserList()
    },
    methods:{
      // 获取管理员信息
      async getUserList() {
        // 获取权限管理
        const { data: res } = await this.$http.get('articleAdmin/getRole')
        console.log(res)
        if(!res.success) return this.$message.error('获取权限信息失败')
        this.ridArr = res.data

        // 获取列表
        const { data: resa } = await this.$http.get(`/articleAdmin/list/${this.pagenum}/${this.pagesize}`)
        console.log(resa)
        if(!resa.success) return this.$message.error('获取管理员列表失败')
        this.total = resa.data.total
        this.userListData = resa.data.records
      },
      // 每页显示多少条
      handleSizeChange(newSize) {
        this.pagesize = newSize
        this.getUserList()
      },
      // 当前第几页
      handleCurrentChange(newPage) {
        this.pagenum = newPage
        this.getUserList()
      },
      // 监听添加用户对话框的关闭事件
      addDiglogClosed () {
        this.$refs.addFormRef.resetFields()
      },
      // 点击按钮添加新用户
      addUser () {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return
          // 可以发起添加用户的表单请求
          const { data: res } = await this.$http.post('/articleAdmin', this.addForm)

          if (!res.success) {
            this.$message.error('添加管理员失败')
          }

          this.$message.success('添加管理员成功')
          // 添加成功后隐藏添加用户对话框
          this.addDialogVisible = false
          // 然后刷新用户列表 重新获取用户列表数据
          this.getUserList()
        })
      },
      // 监听修改用户对话框的关闭事件
      editDialogClosed () {
        this.$refs.editFormRef.resetFields()
      },
      // 展示编辑用户的对话框
      async showEditDialog (id) {
        // 获取指定管理员
        const { data: res } = await this.$http.get('articleAdmin/' + id)
        if(!res.success) return this.$message.error('获取指定管理员信息失败')
        this.editForm = res.data
        this.editDialogVisible = true
      },
      // 修改用户信息并提交
      editUserInfo () {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return
          
          // 发起修改用户信息的数据请求
          const { data: res } = await this.$http.post('/articleAdmin/' + this.editForm.id, this.editForm)

          // 如果状态不等于200
          if (!res.success) {
            return this.$message.error('更新管理员信息失败')
          }

          // 提示修改成功
          this.$message.success('更新管理员信息成功')

          this.getUserList()
          this.editDialogVisible = false
        })
      },
      // 根据id删除对应的用户信息
      async removeUserById (id) {
        // 弹框询问用户是否删除数据
        const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        // 如果用户确认删除,则返回值为字符串 confirm
        // 如果用户取消删除,则返回值为字符串 cancel
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }

        const { data: res } = await this.$http.delete('/articleAdmin/' + id)

        if (!res.success) {
          return this.$message.error('删除管理员失败')
        }
        
        this.getUserList()
        this.$message.success('删除管理员成功!')
      }
    }
  }
</script>
