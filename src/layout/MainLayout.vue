<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import {
  IconApps,
  IconCloud,
  IconCode,
  IconDashboard,
  IconDesktop,
  IconDown,
  IconExport,
  IconFolder,
  IconNotification,
  IconSettings,
  IconStorage,
  IconUser,
} from '@arco-design/web-vue/es/icon'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../store/modules/auth'

const currentRoute = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const userStore = authStore // 使用auth store中的用户信息

// 侧边栏折叠状态
const collapsed = ref(false)

// 菜单选中状态
const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>([])

// 更新路由映射
const routeMap: Record<string, string> = {
  'dashboard': '/dashboard',
  'projects': '/projects',
  'builds': '/builds',
  'deploys': '/deploys',
  'artifacts': '/artifacts',
  'artifact-repos': '/artifact-repos',
  'artifact-downloads': '/artifact-downloads',
  'host-groups': '/system/host-groups',
  'hosts': '/system/hosts',
  'image-repos': '/system/image-repos',
  'build-nodes': '/system/build-nodes',
}

// 更新面包屑和菜单状态逻辑
function updateMenuState() {
  const path = currentRoute.path

  if (path === '/dashboard') {
    selectedKeys.value = ['dashboard']
    openKeys.value = []
  }
  else if (path === '/projects') {
    selectedKeys.value = ['projects']
    openKeys.value = ['business']
  }
  else if (path === '/builds') {
    selectedKeys.value = ['builds']
    openKeys.value = ['business']
  }
  else if (path === '/deploys') {
    selectedKeys.value = ['deploys']
    openKeys.value = ['business']
  }
  else if (path === '/artifacts' || path.startsWith('/artifacts/')) {
    selectedKeys.value = ['artifacts']
    openKeys.value = ['artifacts']
  }
  else if (path === '/artifact-repos') {
    selectedKeys.value = ['artifact-repos']
    openKeys.value = ['artifacts']
  }
  else if (path === '/artifact-downloads') {
    selectedKeys.value = ['artifact-downloads']
    openKeys.value = ['artifacts']
  }
  else if (path === '/system/host-groups') {
    selectedKeys.value = ['host-groups']
    openKeys.value = ['system']
  }
  else if (path === '/system/hosts') {
    selectedKeys.value = ['hosts']
    openKeys.value = ['system']
  }
  else if (path === '/system/image-repos') {
    selectedKeys.value = ['image-repos']
    openKeys.value = ['system']
  }
  else if (path === '/system/build-nodes') {
    selectedKeys.value = ['build-nodes']
    openKeys.value = ['system']
  }
}

// 更新面包屑逻辑
const breadcrumbRoutes = computed(() => {
  const routes = []

  routes.push({
    path: '/dashboard',
    breadcrumbName: '首页',
  })

  if (currentRoute.path === '/dashboard') {
    routes[0].breadcrumbName = '控制台'
  }
  else if (currentRoute.path === '/projects') {
    routes.push({ path: '/projects', breadcrumbName: '项目管理' })
  }
  else if (currentRoute.path === '/builds') {
    routes.push({ path: '/builds', breadcrumbName: '构建历史' })
  }
  else if (currentRoute.path === '/deploys') {
    routes.push({ path: '/deploys', breadcrumbName: '部署历史' })
  }
  else if (currentRoute.path === '/system/host-groups') {
    routes.push(
      { path: '/system', breadcrumbName: '系统管理' },
      { path: '/system/host-groups', breadcrumbName: '主机组管理' },
    )
  }
  else if (currentRoute.path === '/system/hosts') {
    routes.push(
      { path: '/system', breadcrumbName: '系统管理' },
      { path: '/system/hosts', breadcrumbName: '主机管理' },
    )
  }
  else if (currentRoute.path === '/system/image-repos') {
    routes.push(
      { path: '/system', breadcrumbName: '系统管理' },
      { path: '/system/image-repos', breadcrumbName: '镜像仓库管理' },
    )
  }
  else if (currentRoute.path === '/system/build-nodes') {
    routes.push(
      { path: '/system', breadcrumbName: '系统管理' },
      { path: '/system/build-nodes', breadcrumbName: '构建节点配置' },
    )
  }

  return routes
})

// 监听路由变化
watch(
  () => currentRoute.path,
  () => {
    updateMenuState()
  },
  { immediate: true },
)

// 菜单点击处理
function handleMenuClick(key: string) {
  const path = routeMap[key]
  if (path && path !== currentRoute.path) {
    router.push(path)
  }
}

// 退出登录
function handleLogout() {
  authStore.logout()
  Message.success('已退出登录')
  router.push('/login')
}
</script>

<template>
  <a-layout class="min-h-screen">
    <!-- 侧边栏 -->
    <a-layout-sider
      v-model:collapsed="collapsed" :width="240" :collapsed-width="64" collapsible
      class="bg-white border-r border-gray-200 shadow-sm"
      :style="{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100 }"
    >
      <!-- Logo区域 -->
      <div class="h-16 flex items-center justify-center border-b border-gray-200">
        <div v-if="!collapsed" class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <IconCloud class="text-white text-lg" />
          </div>
          <span class="text-lg font-bold text-gray-900">DevOps平台</span>
        </div>
        <div v-else class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <IconCloud class="text-white text-lg" />
        </div>
      </div>

      <!-- 菜单 -->
      <a-menu
        v-model:selected-keys="selectedKeys" v-model:open-keys="openKeys" mode="inline"
        :style="{ border: 'none', background: 'transparent' }" @menu-item-click="handleMenuClick"
      >
        <a-menu-item key="dashboard">
          <template #icon>
            <IconDashboard class="text-lg" />
          </template>
          控制台
        </a-menu-item>

        <a-sub-menu key="business">
          <template #icon>
            <IconApps class="text-lg" />
          </template>
          <template #title>
            业务管理
          </template>
          <a-menu-item key="projects">
            <template #icon>
              <IconFolder class="text-base" />
            </template>
            项目管理
          </a-menu-item>
          <a-menu-item key="builds">
            <template #icon>
              <IconCode class="text-base" />
            </template>
            构建历史
          </a-menu-item>
          <a-menu-item key="deploys">
            <template #icon>
              <IconCloud class="text-base" />
            </template>
            部署历史
          </a-menu-item>
        </a-sub-menu>
        <!-- 在菜单部分添加制品管理菜单组 -->
        <a-sub-menu key="artifacts">
          <template #icon>
            <icon-archive class="text-lg" />
          </template>
          <template #title>
            制品管理
          </template>
          <a-menu-item key="artifacts">
            <template #icon>
              <icon-package class="text-base" />
            </template>
            制品列表
          </a-menu-item>
          <a-menu-item key="artifact-repos">
            <template #icon>
              <IconStorage class="text-base" />
            </template>
            制品仓库管理
          </a-menu-item>
          <a-menu-item key="artifact-downloads">
            <template #icon>
              <icon-download class="text-base" />
            </template>
            制品下载记录
          </a-menu-item>
        </a-sub-menu>

        <!-- 在菜单部分添加新的菜单项 -->
        <a-sub-menu key="system">
          <template #icon>
            <IconSettings class="text-lg" />
          </template>
          <template #title>
            系统管理
          </template>
          <a-menu-item key="host-groups">
            <template #icon>
              <IconStorage class="text-base" />
            </template>
            主机组管理
          </a-menu-item>
          <a-menu-item key="hosts">
            <template #icon>
              <IconDesktop class="text-base" />
            </template>
            主机管理
          </a-menu-item>
          <a-menu-item key="image-repos">
            <template #icon>
              <icon-archive class="text-base" />
            </template>
            镜像仓库管理
          </a-menu-item>
          <a-menu-item key="build-nodes">
            <template #icon>
              <icon-computer class="text-base" />
            </template>
            构建节点配置
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <!-- 主内容区域 -->
    <a-layout :style="{ marginLeft: collapsed ? '64px' : '240px' }">
      <!-- 顶部Header -->
      <a-layout-header
        class="bg-white border-b border-gray-200 shadow-sm px-6 h-16 flex items-center justify-between"
        :style="{ position: 'fixed', top: 0, right: 0, left: collapsed ? '64px' : '240px', zIndex: 99 }"
      >
        <!-- 面包屑导航 -->
        <div class="flex items-center space-x-4">
          <a-breadcrumb :routes="breadcrumbRoutes" class="text-sm">
            <template #itemRender="{ route, routes }">
              <span v-if="routes.indexOf(route) === routes.length - 1" class="text-gray-900 font-medium">
                {{ route.breadcrumbName }}
              </span>
              <router-link v-else :to="route.path || '/'" class="text-gray-600 hover:text-blue-600">
                {{ route.breadcrumbName }}
              </router-link>
            </template>
          </a-breadcrumb>
        </div>

        <!-- 右侧操作区 -->
        <div class="flex items-center space-x-4">
          <!-- 通知 -->
          <a-badge :count="3" :offset="[2, -2]">
            <a-button type="text" shape="circle" class="text-gray-600 hover:text-blue-600">
              <template #icon>
                <IconNotification class="text-lg" />
              </template>
            </a-button>
          </a-badge>

          <!-- 用户菜单 -->
          <a-dropdown>
            <div class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg">
              <a-avatar :size="32" class="bg-blue-600">
                <IconUser class="text-white" />
              </a-avatar>
              <div class="text-sm">
                <div class="font-medium text-gray-900">
                  {{ userStore.user?.username || 'Admin' }}
                </div>
                <div class="text-gray-500">
                  管理员
                </div>
              </div>
              <IconDown class="text-gray-400" />
            </div>
            <template #content>
              <a-doption>
                <template #icon>
                  <IconUser />
                </template>
                个人信息
              </a-doption>
              <a-doption>
                <template #icon>
                  <IconSettings />
                </template>
                系统设置
              </a-doption>
              <a-doption>
                <template #icon>
                  <IconSettings />
                </template>
                切换组织
              </a-doption>
              <a-doption @click="handleLogout">
                <template #icon>
                  <IconExport />
                </template>
                退出登录
              </a-doption>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <!-- 内容区域 -->
      <a-layout-content class="mt-16">
        <router-view />
      </a-layout-content>

      <!-- 底部Footer -->
      <a-layout-footer class="bg-white border-t border-gray-200 text-center py-4 text-gray-600 text-sm">
        <div class="max-w-6xl mx-auto">
          <p>© 2024 DevOps平台. 基于 Vue 3 + ArcoDesign + UnoCSS 构建</p>
          <p class="mt-1">
            轻量级持续集成与部署解决方案
          </p>
        </div>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<style scoped>
/* 自定义菜单样式 */
:deep(.arco-menu-item) {
  margin: 4px 8px;
  border-radius: 6px;
  height: 40px;
  line-height: 40px;
}

:deep(.arco-menu-item:hover) {
  background-color: #f7f8fa;
}

:deep(.arco-menu-item-selected) {
  background-color: #e8f4ff !important;
  color: #1890ff !important;
}

:deep(.arco-menu-sub-menu-title) {
  margin: 4px 8px;
  border-radius: 6px;
  height: 40px;
  line-height: 40px;
}

:deep(.arco-menu-sub-menu-title:hover) {
  background-color: #f7f8fa;
}

/* 面包屑样式 */
:deep(.arco-breadcrumb-item-link) {
  color: #6b7280;
  text-decoration: none;
}

:deep(.arco-breadcrumb-item-link:hover) {
  color: #2563eb;
}
</style>
