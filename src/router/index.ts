import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layout/MainLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: {
      title: '登录',
      requiresAuth: false,
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/RegisterView.vue'),
    meta: {
      title: '注册',
      requiresAuth: false,
    },
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('../views/test/test.vue'),
    meta: {
      title: '组件测试',
      requiresAuth: false,
    },
  },
  {
    path: '/',
    component: MainLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/DashboardView.vue'),
        meta: {
          title: '控制台',
          requiresAuth: false,
        },
      },
      {
        path: 'projects',
        name: 'Projects',
        component: () => import('../views/business/ProjectView.vue'),
        meta: {
          title: '项目管理',
          requiresAuth: false,
        },
      },
      {
        path: 'builds',
        name: 'Builds',
        component: () => import('../views/business/BuildHistoryView.vue'),
        meta: {
          title: '构建历史',
          requiresAuth: false,
        },
      },
      {
        path: 'deploys',
        name: 'Deploys',
        component: () => import('../views/business/DeployHistoryView.vue'),
        meta: {
          title: '部署历史',
          requiresAuth: false,
        },
      },
      // 制品管理路由组
      {
        path: 'artifacts',
        name: 'ArtifactList',
        component: () => import('../views/artifact/ArtifactListView.vue'),
        meta: {
          title: '制品列表',
          requiresAuth: false,
        },
      },
      {
        path: 'artifacts/:id',
        name: 'ArtifactDetail',
        component: () => import('../views/artifact/ArtifactDetailView.vue'),
        meta: {
          title: '制品详情',
          requiresAuth: false,
        },
      },
      {
        path: 'artifact-repos',
        name: 'ArtifactRepos',
        component: () => import('../views/artifact/ArtifactRepoView.vue'),
        meta: {
          title: '制品仓库管理',
          requiresAuth: false,
        },
      },
      {
        path: 'artifact-downloads',
        name: 'ArtifactDownloads',
        component: () => import('../views/artifact/ArtifactDownloadView.vue'),
        meta: {
          title: '制品下载记录',
          requiresAuth: false,
        },
      },
      {
        path: 'system/host-groups',
        name: 'HostGroups',
        component: () => import('../views/system/HostGroupView.vue'),
        meta: {
          title: '主机组管理',
          requiresAuth: false,
        },
      },
      {
        path: 'system/hosts',
        name: 'Hosts',
        component: () => import('../views/system/HostView.vue'),
        meta: {
          title: '主机管理',
          requiresAuth: false,
        },
      },
      {
        path: 'system/image-repos',
        name: 'ImageRepos',
        component: () => import('../views/system/ImageRepoView.vue'),
        meta: {
          title: '镜像仓库管理',
          requiresAuth: false,
        },
      },
      {
        path: 'system/build-nodes',
        name: 'BuildNodes',
        component: () => import('../views/system/BuildNodeView.vue'),
        meta: {
          title: '构建节点配置',
          requiresAuth: false,
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, _, next) => {
  const token = localStorage.getItem('token')
  const requiresAuth = to.meta.requiresAuth

  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - DevOps平台`
  }

  if (requiresAuth && !token) {
    next('/login')
  }
  else if (!requiresAuth && token && (to.path === '/login' || to.path === '/register')) {
    next('/dashboard')
  }
  else {
    next()
  }
})

export default router
