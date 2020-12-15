import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 路由重定向到登录
  { path: '/', redirect: '/login' },

  // 登录页面
  { path: '/login', component: () => import('@/views/login.vue') },
  { path: '/home',
    component: () => import('@/views/home.vue'),
    redirect: '/welcome',
    children: [
      // ------首页-----------
      { path: '/welcome', component: () => import('@/views/welcome.vue') },

      // -----基础信息管理--------
      // 组织机构管理
      { path: '/zzjggl', component: () => import('@/views/jcxxgl/zzjggl.vue') },
      // 单位人员管理
      { path: '/dwrygl', component: () => import('@/views/jcxxgl/dwrygl.vue') },
      // 单位审核管理
      { path: '/dwyhgl', component: () => import('@/views/jcxxgl/dwyhgl.vue') },

      // -----用户管理--------
      // 访客信息管理
      { path: '/lfyhgl', component: () => import('@/views/yhgl/lfyhgl.vue') },
      // 黑名单管理
      { path: '/hmdgl', component: () => import('@/views/yhgl/hmdgl.vue') },
      // 白名单管理
      { path: '/bmdgl', component: () => import('@/views/yhgl/bmdgl.vue') },
      
      // -----访客机管理--------
      // 访客机管理
      { path: '/fkjgl', component: () => import('@/views/fkjgl/fkjgl.vue') },
      // 访客机认证管理
      { path: '/fkjrzgl', component: () => import('@/views/fkjgl/fkjrzgl.vue') },

      // -----访客信息管理--------
      // 今日访客管理
      { path: '/jrfkgl', component: () => import('@/views/fkxxgl/jrfkgl.vue') },
      // 历史访客记录
      { path: '/lsfkgl', component: () => import('@/views/fkxxgl/lsfkjl.vue') },

      // -----参数设置--------
      // 二维码规则设置
      { path: '/ewmgzsz', component: () => import('@/views/cssz/ewmgzsz.vue') },
      // 服务器参数设置
      { path: '/fwqcssz', component: () => import('@/views/cssz/fuqcssz.vue') },
      // 公众号参数设置
      { path: '/gzhcssz', component: () => import('@/views/cssz/gzhcssz.vue') },

      // -----系统设置--------
      // 单位信息管理场景1
      { path: '/dwxxgl', component: () => import('@/views/jcxxgl/dwxxgl.vue') },
      // 管理员管理
      { path: '/glygl', component: () => import('@/views/set/glygl.vue') },
      // 角色权限管理
      { path: '/jsqxgl', component: () => import('@/views/set/jsqxgl.vue') },
      // 系统日志
      { path: '/xtrzgl', component: () => import('@/views/set/xtrzgl.vue') },
      // 数据字典
      { path: '/sjzd', component: () => import('@/views/set/sjzd.vue') },
      // 单位列表管理
      { path: '/dwlbgl', component: () => import('@/views/jcxxgl/dwxxglA.vue') },
    ]
  }
]

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取登录信息
  const userStr = window.sessionStorage.getItem('rid')
  // 如果不存在跳转到登录,如果存在直接放行
  if (!userStr) return next('/login')
  next()
})

export default router
