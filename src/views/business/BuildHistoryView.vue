<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">构建历史</h1>
      <p class="text-gray-600">查看项目构建记录和日志</p>
    </div>

    <!-- 筛选器 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-select v-model="filters.projectId" placeholder="选择项目" allow-clear @change="loadBuilds">
            <a-option value="">全部项目</a-option>
            <a-option v-for="project in projects" :key="project.id" :value="project.id">
              {{ project.name }}
            </a-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <a-select v-model="filters.status" placeholder="选择状态" allow-clear @change="loadBuilds">
            <a-option value="">全部状态</a-option>
            <a-option value="PENDING">等待中</a-option>
            <a-option value="RUNNING">运行中</a-option>
            <a-option value="SUCCESS">成功</a-option>
            <a-option value="FAILED">失败</a-option>
          </a-select>
        </a-col>
        <a-col :span="8">
          <a-range-picker v-model="filters.dateRange" @change="loadBuilds" />
        </a-col>
        <a-col :span="4">
          <a-button @click="loadBuilds">
            <template #icon>
              <icon-refresh />
            </template>
            刷新
          </a-button>
        </a-col>
      </a-row>
    </div>

    <!-- 构建历史列表 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <a-table :columns="columns" :data="builds" :loading="loading" :pagination="pagination"
        @page-change="handlePageChange" @page-size-change="handlePageSizeChange">
        <template #project="{ record }">
          <div>
            <p class="font-medium text-gray-900">{{ record.project?.name || '未知项目' }}</p>
            <p class="text-sm text-gray-500">ID: {{ record.project_id }}</p>
          </div>
        </template>

        <template #image_tag="{ record }">
          <code class="text-sm bg-gray-100 px-2 py-1 rounded">{{ record.image_tag }}</code>
        </template>

        <template #status="{ record }">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 rounded-full" :class="getStatusColor(record.status)"></div>
            <a-tag :color="getStatusTagColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </div>
        </template>

        <template #duration="{ record }">
          {{ calculateDuration(record.created_at, record.updated_at) }}
        </template>

        <template #created_at="{ record }">
          {{ formatTime(record.created_at) }}
        </template>

        <template #actions="{ record }">
          <a-space>
            <a-button type="text" size="small" @click="viewLog(record)">
              <template #icon>
                <icon-file-text />
              </template>
              查看日志
            </a-button>
            <a-button v-if="record.status === 'FAILED'" type="text" size="small" @click="rebuildProject(record)">
              <template #icon>
                <icon-refresh />
              </template>
              重新构建
            </a-button>
          </a-space>
        </template>
      </a-table>
    </div>

    <!-- 日志查看弹窗 -->
    <a-modal v-model:visible="showLogModal" title="构建日志" width="80%" :footer="false">
      <div class="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
        <pre v-if="currentLog">{{ currentLog }}</pre>
        <div v-else class="text-gray-500">暂无日志信息</div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { IconRefresh } from '@arco-design/web-vue/es/icon'
import type { BuildHistory, Project, BuildStatus } from '../../types/devops'

const route = useRoute()

// 响应式数据
const loading = ref(false)
const showLogModal = ref(false)
const builds = ref<BuildHistory[]>([])
const projects = ref<Project[]>([])
const currentLog = ref('')

const filters = reactive({
  projectId: route.query.projectId as string || '',
  status: '',
  dateRange: []
})

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: true
})

// 表格列配置
const columns = [
  {
    title: '项目',
    dataIndex: 'project',
    slotName: 'project',
    width: 200
  },
  {
    title: '镜像标签',
    dataIndex: 'image_tag',
    slotName: 'image_tag',
    width: 200
  },
  {
    title: '状态',
    dataIndex: 'status',
    slotName: 'status',
    width: 120
  },
  {
    title: '耗时',
    dataIndex: 'duration',
    slotName: 'duration',
    width: 100
  },
  {
    title: '开始时间',
    dataIndex: 'created_at',
    slotName: 'created_at',
    width: 180
  },
  {
    title: '操作',
    slotName: 'actions',
    width: 150,
    align: 'center'
  }
]

// 工具函数
const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN')
}

const getStatusColor = (status: BuildStatus) => {
  switch (status) {
    case 'SUCCESS': return 'bg-green-500'
    case 'FAILED': return 'bg-red-500'
    case 'RUNNING': return 'bg-blue-500'
    case 'PENDING': return 'bg-yellow-500'
    default: return 'bg-gray-500'
  }
}

const getStatusTagColor = (status: BuildStatus) => {
  switch (status) {
    case 'SUCCESS': return 'green'
    case 'FAILED': return 'red'
    case 'RUNNING': return 'blue'
    case 'PENDING': return 'orange'
    default: return 'gray'
  }
}

const getStatusText = (status: BuildStatus) => {
  switch (status) {
    case 'SUCCESS': return '成功'
    case 'FAILED': return '失败'
    case 'RUNNING': return '运行中'
    case 'PENDING': return '等待中'
    default: return '未知'
  }
}

const calculateDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()
  const duration = Math.floor((end - start) / 1000)

  if (duration < 60) {
    return `${duration}秒`
  } else if (duration < 3600) {
    return `${Math.floor(duration / 60)}分${duration % 60}秒`
  } else {
    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor((duration % 3600) / 60)
    return `${hours}时${minutes}分`
  }
}

// 事件处理
const handlePageChange = (page: number) => {
  pagination.current = page
  loadBuilds()
}

const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.current = 1
  loadBuilds()
}

const viewLog = (build: BuildHistory) => {
  currentLog.value = build.log || '暂无日志信息'
  showLogModal.value = true
}

const rebuildProject = async (build: BuildHistory) => {
  try {
    // TODO: 调用重新构建API
    // await projectApi.build(build.project_id)
    console.log('重新构建项目', build.project_id);
    Message.success('重新构建任务已启动')
    loadBuilds()
  } catch (error) {
    Message.error('启动重新构建失败')
  }
}

// 加载数据
const loadProjects = async () => {
  try {
    // TODO: 调用API获取项目列表
    // const response = await projectApi.getAll()
    // projects.value = response.data

    // 模拟数据
    projects.value = [
      { id: 1, name: 'Web前端项目', repo_url: '', branch: '', build_cmd: '', image_name: '', created_at: '', updated_at: '' },
      { id: 2, name: 'API服务', repo_url: '', branch: '', build_cmd: '', image_name: '', created_at: '', updated_at: '' }
    ]
  } catch (error) {
    Message.error('加载项目列表失败')
  }
}

const loadBuilds = async () => {
  try {
    loading.value = true
    // TODO: 调用API获取构建历史
    // const response = await buildApi.getList({
    //   page: pagination.current,
    //   pageSize: pagination.pageSize,
    //   ...filters
    // })
    // builds.value = response.data.list
    // pagination.total = response.data.total

    // 模拟数据
    builds.value = [
      {
        id: 1,
        project_id: 1,
        image_tag: 'v1.0.0',
        status: 'SUCCESS',
        log: '构建开始...\n下载依赖...\n编译代码...\n构建完成',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        project: { id: 1, name: 'Web前端项目', repo_url: '', branch: '', build_cmd: '', image_name: '', created_at: '', updated_at: '' }
      },
      {
        id: 2,
        project_id: 2,
        image_tag: 'v1.0.1',
        status: 'FAILED',
        log: '构建开始...\n下载依赖...\n编译失败：语法错误',
        created_at: new Date(Date.now() - 300000).toISOString(),
        updated_at: new Date(Date.now() - 180000).toISOString(),
        project: { id: 2, name: 'API服务', repo_url: '', branch: '', build_cmd: '', image_name: '', created_at: '', updated_at: '' }
      }
    ]
    pagination.total = 2
  } catch (error) {
    Message.error('加载构建历史失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProjects()
  loadBuilds()
})
</script>