<template>
  <div class="login_container">
    <div class="login_box">
      <h1 class="login_js">访客机后台管理系统</h1>
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
           <!-- prefix-icon="iconfont icon-yonghuming" -->
          <el-input v-model="loginForm.username" placeholder="请输入登录名"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入密码" @keydown.enter.native="doLogin" type="password"></el-input>
          <!-- @keydown.enter.native="doLogin"当按下enter键的时候也会执行doLogin方法-->
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="doLogin">登录</el-button>
          <el-button type="info" @click="resectLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 定义用户名密码
      loginForm: {
        username: '',
        password: ''
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮,重置登录表单
    resectLoginForm () {
      // 重置表单$refs对象
      this.$refs.loginFormRef.resetFields()
    },
    doLogin () {
      // 可以直接把this.user对象传给后端进行校验用户名和密码
      // alert(JSON.stringify(this.loginForm))
      this.$refs.loginFormRef.validate(async valid => {
       if (!valid) return
        const { data: res } = await this.$http.get(`/articleAdmin/login?username=${this.loginForm.username}&password=${this.loginForm.password}`)
        console.log(res)
        if(!res.success) return this.$message.error(res.errMsg)
        this.$message.success('登录成功!')
        window.sessionStorage.setItem('rid', res.data.rid)
        window.sessionStorage.setItem('name', res.data.name)
        this.$router.push('./home')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.aefe{
  color: $color;
}
.login_container {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(~@/assets/images/login_bg.jpg) no-repeat;
  background-size: 100% 100%;
}

.login_js{
  position: absolute;
  width: 100%;
  left: 0;
  top: -60%;
  color: #fff;
  text-align: center;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 10px;
  position: absolute;
  left: 30%;
  top: 60%;
  transform: translate(-50%, -50%);
  box-shadow:1px 1px 10px 0px #bde1ff;
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns{
  display: flex;
  justify-content: flex-end;
}
</style>
