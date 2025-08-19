<template>
  <div class="p-6">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">控制台</h1>
      <p class="text-gray-600">DevOps平台概览</p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">项目总数</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalProjects }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <icon-folder class="text-blue-600 text-xl" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">在线主机</p>
            <p class="text-2xl font-bold text-green-600">{{ stats.onlineHosts }}</p>
            <p class="text-xs text-gray-500">总计 {{ stats.totalHosts }} 台</p>
          </div>
          <div class="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
            <icon-desktop class="text-green-600 text-xl" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">构建成功率</p>
            <p class="text-2xl font-bold text-blue-600">{{ buildSuccessRate }}%</p>
            <p class="text-xs text-gray-500">最近30天</p>
          </div>
          <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <icon-code class="text-blue-600 text-xl" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">部署成功率</p>
            <p class="text-2xl font-bold text-purple-600">{{ deploySuccessRate }}%</p>
            <p class="text-xs text-gray-500">最近30天</p>
          </div>
          <div class="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
            <icon-cloud class="text-purple-600 text-xl" />
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 最近构建 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">最近构建</h3>
            <router-link to="/builds" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
              查看全部
            </router-link>
          </div>
        </div>
        <div class="p-6">
          <div v-if="recentBuilds.length === 0" class="text-center py-8 text-gray-500">
            暂无构建记录
          </div>
          <div v-else class="space-y-4">
            <div v-for="build in recentBuilds" :key="build.id"
              class="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div class="flex items-center space-x-3">
                <div class="w-2 h-2 rounded-full" :class="getStatusColor(build.status)"></div>
                <div>
                  <p class="font-medium text-gray-900">{{ build.project_name }}</p>
                  <p class="text-sm text-gray-500">{{ formatTime(build.created_at) }}</p>
                </div>
              </div>
              <a-tag :color="getStatusTagColor(build.status)">{{ getStatusText(build.status) }}</a-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近部署 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">最近部署</h3>
            <router-link to="/deploys" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
              查看全部
            </router-link>
          </div>
        </div>
        <div class="p-6">
          <div v-if="recentDeploys.length === 0" class="text-center py-8 text-gray-500">
            暂无部署记录
          </div>
          <div v-else class="space-y-4">
            <div v-for="deploy in recentDeploys" :key="deploy.id"
              class="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div class="flex items-center space-x-3">
                <div class="w-2 h-2 rounded-full" :class="getStatusColor(deploy.status)"></div>
                <div>
                  <p class="font-medium text-gray-900">{{ deploy.project_name }}</p>
                  <p class="text-sm text-gray-500">{{ deploy.host_name }} • {{ formatTime(deploy.created_at) }}</p>
                </div>
              </div>
              <a-tag :color="getStatusTagColor(deploy.status)">{{ getStatusText(deploy.status) }}</a-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { IconFolder, IconDesktop, IconCode, IconCloud } from '@arco-design/web-vue/es/icon'
import type { DashboardStats, RecentActivity, BuildStatus, DeployStatus } from '../../types/devops'

// 响应式数据
const stats = ref<DashboardStats>({
  totalProjects: 0,
  totalHosts: 0,
  onlineHosts: 0,
  offlineHosts: 0,
  runningBuilds: 0,
  successBuilds: 0,
  failedBuilds: 0,
  runningDeploys: 0,
  successDeploys: 0,
  failedDeploys: 0,
  totalImageRepos: 0,
  totalBuildNodes: 0,
  onlineBuildNodes: 0,
  offlineBuildNodes: 0
})

const recentBuilds = ref<RecentActivity[]>([])
const recentDeploys = ref<RecentActivity[]>([])

// 计算属性
const buildSuccessRate = computed(() => {
  const total = stats.value.successBuilds + stats.value.failedBuilds
  return total > 0 ? Math.round((stats.value.successBuilds / total) * 100) : 0
})

const deploySuccessRate = computed(() => {
  const total = stats.value.successDeploys + stats.value.failedDeploys
  return total > 0 ? Math.round((stats.value.successDeploys / total) * 100) : 0
})

// 工具函数
const getStatusColor = (status: BuildStatus | DeployStatus) => {
  switch (status) {
    case 'SUCCESS': return 'bg-green-500'
    case 'FAILED': return 'bg-red-500'
    case 'RUNNING': return 'bg-blue-500'
    case 'PENDING': return 'bg-yellow-500'
    default: return 'bg-gray-500'
  }
}

const getStatusTagColor = (status: BuildStatus | DeployStatus) => {
  switch (status) {
    case 'SUCCESS': return 'green'
    case 'FAILED': return 'red'
    case 'RUNNING': return 'blue'
    case 'PENDING': return 'orange'
    default: return 'gray'
  }
}

const getStatusText = (status: BuildStatus | DeployStatus) => {
  switch (status) {
    case 'SUCCESS': return '成功'
    case 'FAILED': return '失败'
    case 'RUNNING': return '运行中'
    case 'PENDING': return '等待中'
    default: return '未知'
  }
}

const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN')
}

// 加载数据
const loadDashboardData = async () => {
  try {
    // TODO: 调用API获取统计数据
    // const response = await dashboardApi.getStats()
    // stats.value = response.data

    // 模拟数据
    stats.value = {
      totalProjects: 12,
      totalHosts: 8,
      onlineHosts: 6,
      offlineHosts: 2,
      runningBuilds: 2,
      successBuilds: 45,
      failedBuilds: 3,
      runningDeploys: 1,
      successDeploys: 38,
      failedDeploys: 2,
      totalImageRepos: 55,
      totalBuildNodes: 55,
      onlineBuildNodes: 55,
      offlineBuildNodes: 55
    }

    // 模拟最近构建数据
    recentBuilds.value = [
      { id: 1, type: 'build', project_name: 'Web前端项目', status: 'SUCCESS', created_at: new Date().toISOString() },
      { id: 2, type: 'build', project_name: 'API服务', status: 'RUNNING', created_at: new Date(Date.now() - 300000).toISOString() },
      { id: 3, type: 'build', project_name: '数据处理服务', status: 'FAILED', created_at: new Date(Date.now() - 600000).toISOString() }
    ]

    // 模拟最近部署数据
    recentDeploys.value = [
      { id: 1, type: 'deploy', project_name: 'Web前端项目', status: 'SUCCESS', created_at: new Date().toISOString(), host_name: '生产服务器1' },
      { id: 2, type: 'deploy', project_name: 'API服务', status: 'RUNNING', created_at: new Date(Date.now() - 180000).toISOString(), host_name: '生产服务器2' }
    ]
  } catch (error) {
    console.error('加载Dashboard数据失败:', error)
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>