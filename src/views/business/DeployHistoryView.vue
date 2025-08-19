<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">部署历史</h1>
      <p class="text-gray-600">查看项目部署记录和日志</p>
    </div>

    <!-- 筛选器 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <a-row :gutter="16">
        <a-col :span="5">
          <a-select v-model="filters.projectId" placeholder="选择项目" allow-clear @change="loadDeploys">
            <a-option value="">全部项目</a-option>
            <a-option v-for="project in projects" :key="project.id" :value="project.id">
              {{ project.name }}
            </a-option>
          </a-select>
        </a-col>
        <a-col :span="5">
          <a-select v-model="filters.hostId" placeholder="选择主机" allow-clear @change="loadDeploys">
            <a-option value="">全部主机</a-option>
            <a-option v-for="host in hosts" :key="host.id" :value="host.id">
              {{ host.name }} ({{ host.ip }})
            </a-option>
          </a-select>
        </a-col>
        <a-col :span="5">
          <a-select v-model="filters.status" placeholder="选择状态" allow-clear @change="loadDeploys">
            <a-option value="">全部状态</a-option>
            <a-option value="PENDING">等待中</a-option>
            <a-option value="RUNNING">运行中</a-option>
            <a-option value="SUCCESS">成功</a-option>
            <a-option value="FAILED">失败</a-option>
          </a-select>
        </a-col>
        <a-col :span="5">
          <a-range-picker v-model="filters.dateRange" @change="loadDeploys" />
        </a-col>
        <a-col :span="4">
          <a-button @click="loadDeploys">
            <template #icon>
              <icon-refresh />
            </template>
            刷新
          </a-button>
        </a-col>
      </a-row>
    </div>

    <!-- 部署历史列表 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <a-table :columns="columns" :data="deploys" :loading="loading" :pagination="pagination"
        @page-change="handlePageChange" @page-size-change="handlePageSizeChange">
        <template #project="{ record }">
          <div>
            <p class="font-medium text-gray-900">{{ record.project?.name || '未知项目' }}</p>
            <p class="text-sm text-gray-500">ID: {{ record.project_id }}</p>
          </div>
        </template>

        <template #host="{ record }">
          <div>
            <p class="font-medium text-gray-900">{{ record.host?.name || '未知主机' }}</p>
            <p class="text-sm text-gray-500">{{ record.host?.ip }}:{{ record.host?.port }}</p>
          </div>
        </template>

        <template #container="{ record }">
          <div>
            <code class="text-sm bg-gray-100 px-2 py-1 rounded block mb-1">{{ record.image_tag }}</code>
            <p class="text-sm text-gray-600">{{ record.container_name }}</p>
          </div>
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
            <a-button v-if="record.status === 'SUCCESS'" type="text" size="small" @click="stopContainer(record)">
              <template #icon>
                <icon-stop />
              </template>
              停止容器
            </a-button>
            <a-button v-if="record.status === 'FAILED'" type="text" size="small" @click="redeployProject(record)">
              <template #icon>
                <icon-refresh />
              </template>
              重新部署
            </a-button>
          </a-space>
        </template>
      </a-table>
    </div>

    <!-- 日志查看弹窗 -->
    <a-modal v-model:visible="showLogModal" title="部署日志" width="80%" :footer="false">
      <div class="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
        <pre v-if="currentLog">{{ currentLog }}</pre>
        <div v-else class="text-gray-500">暂无日志信息</div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import { IconRefresh, IconStop } from '@arco-design/web-vue/es/icon'
import type { DeployHistory, Project, Host, DeployStatus } from '../../types/devops'

// 响应式数据
const loading = ref(false)
const showLogModal = ref(false)
const deploys = ref<DeployHistory[]>([])
const projects = ref<Project[]>([])
const hosts = ref<Host[]>([])
const currentLog = ref('')

const filters = reactive({
  projectId: '',
  hostId: '',
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
    width: 180
  },
  {
    title: '目标主机',
    dataIndex: 'host',
    slotName: 'host',
    width: 180
  },
  {
    title: '容器信息',
    dataIndex: 'container',
    slotName: 'container',
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
    width: 180,
    align: 'center'
  }
]

// 工具函数
const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN')
}

const getStatusColor = (status: DeployStatus) => {
  switch (status) {
    case 'SUCCESS': return 'bg-green-500'
    case 'FAILED': return 'bg-red-500'
    case 'RUNNING': return 'bg-blue-500'
    case 'PENDING': return 'bg-yellow-500'
    default: return 'bg-gray-500'
  }
}

const getStatusTagColor = (status: DeployStatus) => {
  switch (status) {
    case 'SUCCESS': return 'green'
    case 'FAILED': return 'red'
    case 'RUNNING': return 'blue'
    case 'PENDING': return 'orange'
    default: return 'gray'
  }
}

const getStatusText = (status: DeployStatus) => {
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
  loadDeploys()
}

const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.current = 1
  loadDeploys()
}

const viewLog = (deploy: DeployHistory) => {
  currentLog.value = deploy.log || '暂无日志信息'
  showLogModal.value = true
}

const stopContainer = (deploy: DeployHistory) => {
  Modal.confirm({
    title: '确认停止',
    content: `确定要停止容器 "${deploy.container_name}" 吗？`,
    onOk: async () => {
      try {
        // TODO: 调用停止容器API
        // await deployApi.stopContainer(deploy.id)
        Message.success('容器停止成功')
        loadDeploys()
      } catch (error) {
        Message.error('停止容器失败')
      }
    }
  })
}

const redeployProject = async (deploy: DeployHistory) => {
  try {
    // TODO: 调用重新部署API
    console.log('重新部署项目', deploy.project_id, deploy.host_id, deploy.image_tag);
    // await deployApi.redeploy(deploy.project_id, deploy.host_id, deploy.image_tag)
    Message.success('重新部署任务已启动')
    loadDeploys()
  } catch (error) {
    Message.error('启动重新部署失败')
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

const loadHosts = async () => {
  try {
    // TODO: 调用API获取主机列表
    // const response = await hostApi.getAll()
    // hosts.value = response.data

    // 模拟数据
    hosts.value = [
      { id: 1, host_group_id: 1, name: '生产服务器1', ip: '192.168.1.100', port: 8080, status: 'ONLINE', created_at: '', updated_at: '' },
      { id: 2, host_group_id: 1, name: '生产服务器2', ip: '192.168.1.101', port: 8080, status: 'OFFLINE', created_at: '', updated_at: '' }
    ]
  } catch (error) {
    Message.error('加载主机列表失败')
  }
}

const loadDeploys = async () => {
  try {
    loading.value = true
    // TODO: 调用API获取部署历史
    // const response = await deployApi.getList({
    //   page: pagination.current,
    //   pageSize: pagination.pageSize,
    //   ...filters
    // })
    // deploys.value = response.data.list
    // pagination.total = response.data.total

    // 模拟数据
    deploys.value = [
      {
        id: 1,
        project_id: 1,
        host_id: 1,
        image_tag: 'v1.0.0',
        container_name: 'web-frontend-prod',
        status: 'SUCCESS',
        log: '部署开始...\n拉取镜像...\n启动容器...\n部署完成',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        project: { id: 1, name: 'Web前端项目', repo_url: '', branch: '', build_cmd: '', image_name: '', created_at: '', updated_at: '' },
        host: { id: 1, host_group_id: 1, name: '生产服务器1', ip: '192.168.1.100', port: 8080, status: 'ONLINE', created_at: '', updated_at: '' }
      },
      {
        id: 2,
        project_id: 2,
        host_id: 2,
        image_tag: 'v1.0.1',
        container_name: 'api-service-prod',
        status: 'FAILED',
        log: '部署开始...\n拉取镜像...\n启动容器失败：端口被占用',
        created_at: new Date(Date.now() - 300000).toISOString(),
        updated_at: new Date(Date.now() - 180000).toISOString(),
        project: { id: 2, name: 'API服务', repo_url: '', branch: '', build_cmd: '', image_name: '', created_at: '', updated_at: '' },
        host: { id: 2, host_group_id: 1, name: '生产服务器2', ip: '192.168.1.101', port: 8080, status: 'OFFLINE', created_at: '', updated_at: '' }
      }
    ]
    pagination.total = 2
  } catch (error) {
    Message.error('加载部署历史失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProjects()
  loadHosts()
  loadDeploys()
})
</script>