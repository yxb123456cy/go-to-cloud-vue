<template>
  <div class="p-6">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">制品下载记录</h1>
      <p class="text-gray-600">查看制品下载和拉取历史</p>
    </div>

    <!-- 筛选器 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <a-row :gutter="16">
        <a-col :span="5">
          <a-select v-model="filters.artifactId" placeholder="选择制品" allow-clear @change="loadDownloads">
            <a-option value="">全部制品</a-option>
            <a-option v-for="artifact in artifacts" :key="artifact.id" :value="artifact.id">
              {{ artifact.name }}:{{ artifact.version }}
            </a-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-select v-model="filters.action" placeholder="操作类型" allow-clear @change="loadDownloads">
            <a-option value="">全部操作</a-option>
            <a-option value="PULL">拉取</a-option>
            <a-option value="DOWNLOAD">下载</a-option>
          </a-select>
        </a-col>
        <a-col :span="5">
          <a-select v-model="filters.hostId" placeholder="选择主机" allow-clear @change="loadDownloads">
            <a-option value="">全部主机</a-option>
            <a-option v-for="host in hosts" :key="host.id" :value="host.id">
              {{ host.name }} ({{ host.ip }})
            </a-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <a-range-picker v-model="filters.dateRange" @change="loadDownloads" />
        </a-col>
        <a-col :span="4">
          <a-button @click="loadDownloads">
            <template #icon>
              <icon-refresh />
            </template>
            刷新
          </a-button>
        </a-col>
      </a-row>
    </div>

    <!-- 下载记录列表 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <a-table :columns="columns" :data="downloads" :loading="loading" :pagination="pagination"
        @page-change="handlePageChange" @page-size-change="handlePageSizeChange">
        <template #artifact="{ record }">
          <div>
            <p class="font-medium text-gray-900">{{ record.artifact?.name }}</p>
            <p class="text-sm text-gray-500">{{ record.artifact?.version }}</p>
          </div>
        </template>

        <template #action="{ record }">
          <a-tag :color="record.action === 'PULL' ? 'blue' : 'green'">
            {{ record.action === 'PULL' ? '拉取' : '下载' }}
          </a-tag>
        </template>

        <template #user="{ record }">
          <span class="text-sm text-gray-600">{{ record.user?.username || '系统操作' }}</span>
        </template>

        <template #host="{ record }">
          <div v-if="record.host">
            <p class="text-sm text-gray-900">{{ record.host.name }}</p>
            <p class="text-xs text-gray-500">{{ record.host.ip }}</p>
          </div>
          <span v-else class="text-sm text-gray-500">-</span>
        </template>

        <template #created_at="{ record }">
          {{ formatTime(record.created_at) }}
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconRefresh } from '@arco-design/web-vue/es/icon'
import type { ArtifactDownload, Artifact } from '../../types/artifact'
import type { Host } from '../../types/devops'


// 响应式数据
const loading = ref(false)
const downloads = ref<ArtifactDownload[]>([])
const artifacts = ref<Artifact[]>([])
const hosts = ref<Host[]>([])

const filters = reactive({
  artifactId: '',
  action: '',
  hostId: '',
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
    title: '制品信息',
    dataIndex: 'artifact',
    slotName: 'artifact',
    width: 200
  },
  {
    title: '操作类型',
    dataIndex: 'action',
    slotName: 'action',
    width: 100
  },
  {
    title: '操作用户',
    dataIndex: 'user',
    slotName: 'user',
    width: 120
  },
  {
    title: '目标主机',
    dataIndex: 'host',
    slotName: 'host',
    width: 150
  },
  {
    title: '操作时间',
    dataIndex: 'created_at',
    slotName: 'created_at',
    width: 180
  }
]

// 工具函数
const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN')
}

// 事件处理
const handlePageChange = (page: number) => {
  pagination.current = page
  loadDownloads()
}

const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.current = 1
  loadDownloads()
}

// 加载数据
const loadArtifacts = async () => {
  try {
    // TODO: 调用API获取制品列表
    // const response = await artifactApi.getAll()
    // artifacts.value = response.data

    // 模拟数据
    artifacts.value = [
      {
        id: 1,
        project_id: 1,
        repo_id: 1,
        name: 'web-frontend',
        version: 'v1.0.0',
        type_id: 1,
        path: 'myorg/web-frontend:v1.0.0',
        created_at: ''
      }
    ]
  } catch (error) {
    Message.error('加载制品列表失败')
  }
}

const loadHosts = async () => {
  try {
    // TODO: 调用API获取主机列表
    // const response = await hostApi.getAll()
    // hosts.value = response.data

    // 模拟数据
    hosts.value = [
      { id: 1, host_group_id: 1, name: '生产服务器1', ip: '192.168.1.100', port: 8080, status: 'ONLINE', created_at: '', updated_at: '' }
    ]
  } catch (error) {
    Message.error('加载主机列表失败')
  }
}

const loadDownloads = async () => {
  try {
    loading.value = true
    // TODO: 调用API获取下载记录
    // const response = await artifactDownloadApi.getList({
    //   page: pagination.current,
    //   pageSize: pagination.pageSize,
    //   ...filters
    // })
    // downloads.value = response.data.list
    // pagination.total = response.data.total

    // 模拟数据
    downloads.value = [
      {
        id: 1,
        artifact_id: 1,
        user_id: 1,
        host_id: 1,
        action: 'PULL',
        created_at: new Date().toISOString(),
        artifact: { id: 1, project_id: 1, repo_id: 1, name: 'web-frontend', version: 'v1.0.0', type_id: 1, path: '', created_at: '' },
        user: { id: "1", username: 'admin', email: '', avatar: '', createdAt: '' },
        host: { id: 1, host_group_id: 1, name: '生产服务器1', ip: '192.168.1.100', port: 8080, status: 'ONLINE', created_at: '', updated_at: '' }
      }
    ]
    pagination.total = 1
  } catch (error) {
    Message.error('加载下载记录失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadArtifacts()
  loadHosts()
  loadDownloads()
})
</script>