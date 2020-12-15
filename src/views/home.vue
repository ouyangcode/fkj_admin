<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <span>访客机后台管理系统</span>
      </div>
      欢迎您管理员: {{username}}
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '220px '">

        <!-- 实现折叠展开 -->
        <div class="toggle_button" @click="toggleCollapse">丨丨丨</div>

        <!-- 侧边栏菜单区 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#406eff" unique-opened :collapse="isCollapse"
          router :default-active="currentMenu" :collapse-transition="false">

          <el-menu-item index="/welcome">
            <i class="iconfont icon-xiazai44"></i>
            <span slot="title">首页</span>
          </el-menu-item>

          <el-submenu :index="item.abbr + ''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.name}}</span>
            </template>

            <el-menu-item :index="'/' + subItem.abbr" v-for="subItem in item.ziCaiDanList" :key="subItem.id" >
              <i :class="iconsObj[subItem.id]"></i>
              <span>{{subItem.name}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 放一个路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      isCollapse: false,
      username: '',
      currentMenu:'/welcome',
      menulist: [],
      iconsObj: {
        '0': 'iconfont icon-jichuxinxi',
        '1': 'iconfont icon-unit',
        '2': 'iconfont icon-unit',
        '3': 'iconfont icon-jigoutuanti',
        '4': 'iconfont icon-huaban',
        '5': 'iconfont icon-user-approval',
        '6': 'iconfont icon-Management',
        '7': 'iconfont icon-shoufahuorenxinxiguanli',
        '8': 'iconfont icon-ziyuan1',
        '9': 'iconfont icon-ziyuan',
        '10': 'iconfont icon-jiqiren___',
        '11': 'iconfont icon-guanli2',
        '12': 'iconfont icon-auth',
        '13': 'iconfont icon-yonghuguanli',
        '14': 'iconfont icon-jinricaigou',
        '15': 'iconfont icon-lishijilu',
        '16': 'iconfont icon-xitongcanshushezhi',
        '17': 'iconfont icon-erweima',
        '18': 'iconfont icon-fuwuqi',
        '19': 'iconfont icon-weixingongzhonghaoguanli',
        '20': 'iconfont icon-xitongguanli',
        '21': 'iconfont icon-guanliyuan',
        '22': 'iconfont icon-jiaosequanxianguanli',
        '23': 'iconfont icon-xitongrizhi',
        '24': 'iconfont icon-zidianguanli',
        '25': 'iconfont icon-unit',
      }
    }
  },
  created() {
    this.username = window.sessionStorage.getItem('name')
    this.getMenuList()
    this.getUrl()
  },
  methods: {
    logout () {
      sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList(){
      // 获取权限id
      const rid = window.sessionStorage.getItem('rid')
      // 获取左侧菜单
      const { data: res } = await this.$http.get(`/articleAdmin/Rid?Rid=${rid}`)
      console.log(res)
      if(!res.success) return this.$message.error(res.errMsg)
      this.menulist = res.data
    },
    getUrl(){
      let self = this
      let currentUrl = window.location.href
      self.currentMenu = currentUrl.split('#')[1]
    },
    // 点击按钮切换菜单折叠展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="scss" scope>
.home_container{
  height: 100%;
}
.el-header{
  height: 86px !important;
  background-color: #373D41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div{
    display: flex;
    align-items: center;
    img{
      height: 44px;
      background-color: #fff;
      border-radius: 50%;
      border: 4px solid #4291c5;
    }
    span{
      margin-left: 15px;
    }
  }
}
.el-aside{
  background-color: #333744;
  .el-menu{
    border-right: none;
  }
}
.el-main{
  background-color: #eaedf1;
}
.toggle_button{
  background-color: #4a5064;
  color: #fff;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
}
.iconfont{
  padding-right: 10px;
}
</style>
