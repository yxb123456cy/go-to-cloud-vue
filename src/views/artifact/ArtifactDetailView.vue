<template>
  <div class="p-6">
    <!-- 返回按钮 -->
    <div class="mb-6">
      <a-button @click="goBack" class="mb-4">
        <template #icon>
          <icon-arrow-left />
        </template>
        返回列表
      </a-button>
    </div>

    <!-- 制品基本信息 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div class="flex items-start justify-between mb-6">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center">
            <icon-archive class="text-blue-600 text-2xl" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ artifact?.name }}</h1>
            <p class="text-gray-600">{{ artifact?.path }}</p>
          </div>
        </div>
        <a-space>
          <a-button type="primary" @click="downloadArtifact" :loading="downloading">
            <template #icon>
              <icon-download />
            </template>
            下载制品
          </a-button>
          <a-button @click="viewDownloadHistory">
            <template #icon>
              <icon-history />
            </template>
            下载记录
          </a-button>
        </a-space>
      </div>

      <a-row :gutter="24">
        <a-col :span="8">
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <p class="text-2xl font-bold text-blue-600 mb-1">{{ artifact?.version }}</p>
            <p class="text-sm text-gray-600">当前版本</p>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <p class="text-2xl font-bold text-green-600 mb-1">{{ formatSize(artifactDetail?.size) }}</p>
            <p class="text-sm text-gray-600">制品大小</p>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <p class="text-2xl font-bold text-purple-600 mb-1">{{ artifactDetail?.download_count || 0 }}</p>
            <p class="text-sm text-gray-600">下载次数</p>
          </div>
        </a-col>
      </a-row>
    </div>

    <a-row :gutter="24">
      <!-- 左侧信息 -->
      <a-col :span="16">
        <!-- 基本信息 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">基本信息</h3>
          <a-descriptions :column="2" bordered>
            <a-descriptions-item label="制品名称">{{ artifact?.name }}</a-descriptions-item>
            <a-descriptions-item label="版本号">{{ artifact?.version }}</a-descriptions-item>
            <a-descriptions-item label="制品类型">
              <a-tag :color="getTypeColor(artifact?.artifact_type?.name)">
                {{ artifact?.artifact_type?.name }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="所属项目">{{ artifact?.project?.name }}</a-descriptions-item>
            <a-descriptions-item label="仓库地址">{{ artifact?.artifact_repo?.name }}</a-descriptions-item>
            <a-descriptions-item label="创建时间">{{ formatTime(artifact?.created_at) }}</a-descriptions-item>
            <a-descriptions-item label="制品路径" :span="2">{{ artifact?.path }}</a-descriptions-item>
            <a-descriptions-item label="摘要值" :span="2">
              <code class="text-xs bg-gray-100 px-2 py-1 rounded">{{ artifactDetail?.digest || 'N/A' }}</code>
            </a-descriptions-item>
          </a-descriptions>
        </div>

        <!-- 版本历史 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">版本历史</h3>
          <a-table :columns="versionColumns" :data="versions" :pagination="false" size="small">
            <template #version="{ record }">
              <div class="flex items-center space-x-2">
                <a-tag :color="record.is_latest ? 'green' : 'blue'">{{ record.version }}</a-tag>
                <a-tag v-if="record.is_latest" color="green" size="small">最新</a-tag>
              </div>
            </template>
            <template #size="{ record }">
              {{ formatSize(record.size) }}
            </template>
            <template #created_at="{ record }">
              {{ formatTime(record.created_at) }}
            </template>
          </a-table>
        </div>

        <!-- 元数据信息 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6" v-if="artifactDetail?.metadata">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">元数据信息</h3>
          <pre class="bg-gray-50 p-4 rounded-lg text-sm overflow-auto">{{ JSON.stringify(artifactDetail.metadata, null, 2) }}</pre>
        </div>
      </a-col>

      <!-- 右侧信息 -->
      <a-col :span="8">
        <!-- 标签 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">标签</h3>
          <div class="space-y-2">
            <a-tag v-for="tag in artifactDetail?.tags" :key="tag" color="blue">{{ tag }}</a-tag>
            <p v-if="!artifactDetail?.tags?.length" class="text-gray-500 text-sm">暂无标签</p>
          </div>
        </div>

        <!-- 使用统计 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">使用统计</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">今日下载</span>
              <span class="font-medium">{{ usage?.daily_downloads || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">本周下载</span>
              <span class="font-medium">{{ usage?.weekly_downloads || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">本月下载</span>
              <span class="font-medium">{{ usage?.monthly_downloads || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">总下载量</span>
              <span class="font-medium">{{ usage?.total_downloads || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">独立用户</span>
              <span class="font-medium">{{ usage?.unique_users || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- 安全扫描 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">安全扫描</h3>
          <div class="space-y-3">
            <div v-for="scan in scanResults" :key="scan.id" class="p-3 border rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium">{{ getScanTypeName(scan.scan_type) }}</span>
                <a-tag :color="getScanStatusColor(scan.status)">{{ getScanStatusText(scan.status) }}</a-tag>
              </div>
              <div v-if="scan.result" class="text-sm text-gray-600">
                <span class="text-red-600">高危: {{ scan.result.high_issues }}</span> |
                <span class="text-orange-600">中危: {{ scan.result.medium_issues }}</span> |
                <span class="text-yellow-600">低危: {{ scan.result.low_issues }}</span>
              </div>
            </div>
            <p v-if="!scanResults.length" class="text-gray-500 text-sm">暂无扫描结果</p>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import {
  IconArrowLeft,
  IconArchive,
  IconDownload,
  IconHistory
} from '@arco-design/web-vue/es/icon'
import type {
  Artifact,
  ArtifactDetail,
  ArtifactVersion,
  ArtifactUsage,
  ArtifactScanResult
} from '../../types/artifact'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(false)
const downloading = ref(false)
const artifact = ref<Artifact | null>(null)
const artifactDetail = ref<ArtifactDetail | null>(null)
const versions = ref<ArtifactVersion[]>([])
const usage = ref<ArtifactUsage | null>(null)
const scanResults = ref<ArtifactScanResult[]>([])

// 版本历史表格列
const versionColumns = [
  {
    title: '版本',
    dataIndex: 'version',
    slotName: 'version',
    width: 120
  },
  {
    title: '大小',
    dataIndex: 'size',
    slotName: 'size',
    width: 100
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    slotName: 'created_at'
  }
]

// 工具函数
const formatTime = (time?: string) => {
  return time ? new Date(time).toLocaleString('zh-CN') : 'N/A'
}

const formatSize = (bytes?: number) => {
  if (!bytes) return 'N/A'
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

const getTypeColor = (typeName?: string) => {
  const colorMap: Record<string, string> = {
    'DOCKER': 'blue',
    'NPM': 'green',
    'JAR': 'orange',
    'MAVEN': 'red',
    'PYPI': 'yellow'
  }
  return colorMap[typeName || ''] || 'gray'
}

const getScanTypeName = (type: string) => {
  const typeMap: Record<string, string> = {
    'vulnerability': '漏洞扫描',
    'license': '许可证扫描',
    'quality': '质量扫描'
  }
  return typeMap[type] || type
}

const getScanStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    'pending': 'gray',
    'scanning': 'blue',
    'completed': 'green',
    'failed': 'red'
  }
  return colorMap[status] || 'gray'
}

const getScanStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    'pending': '等待中',
    'scanning': '扫描中',
    'completed': '已完成',
    'failed': '失败'
  }
  return textMap[status] || status
}

// 事件处理
const goBack = () => {
  router.go(-1)
}

const downloadArtifact = async () => {
  try {
    downloading.value = true
    // TODO: 调用下载API
    // await artifactApi.download(artifact.value!.id)
    Message.success('下载开始')
  } catch (error) {
    Message.error('下载失败')
  } finally {
    downloading.value = false
  }
}

const viewDownloadHistory = () => {
  router.push(`/artifacts/${route.params.id}/downloads`)
}

// 加载数据
const loadArtifactDetail = async () => {
  try {
    loading.value = true
    const artifactId = route.params.id as string
    console.log('artifactId', artifactId);
    // TODO: 调用API获取制品详情
    // const response = await artifactApi.getDetail(artifactId)
    // artifact.value = response.data.artifact
    // artifactDetail.value = response.data.detail
    // versions.value = response.data.versions
    // usage.value = response.data.usage
    // scanResults.value = response.data.scanResults
    
    // 模拟数据
    artifact.value = {
      id: 1,
      project_id: 1,
      repo_id: 1,
      name: 'web-frontend',
      version: 'v1.0.0',
      type_id: 1,
      path: 'myorg/web-frontend:v1.0.0',
      created_at: new Date().toISOString(),
      project: { id: 1, name: 'Web前端项目', repo_url: '', branch: '', build_cmd: '', image_name: '', created_at: '', updated_at: '' },
      artifact_repo: { id: 1, name: 'Docker Hub', type_id: 1, url: 'docker.io', created_at: '', updated_at: '' },
      artifact_type: { id: 1, name: 'DOCKER', description: 'Docker镜像', created_at: '' }
    }
    
    artifactDetail.value = {
      ...artifact.value,
      size: 1024 * 1024 * 150, // 150MB
      digest: 'sha256:abc123def456...',
      tags: ['latest', 'stable', 'v1.0.0'],
      download_count: 1250,
      last_download_at: new Date().toISOString(),
      metadata: {
        architecture: 'amd64',
        os: 'linux',
        created: new Date().toISOString(),
        author: 'DevOps Team'
      }
    }
    
    versions.value = [
      { id: 1, artifact_id: 1, version: 'v1.0.0', size: 1024 * 1024 * 150, created_at: new Date().toISOString(), is_latest: true },
      { id: 2, artifact_id: 1, version: 'v0.9.0', size: 1024 * 1024 * 145, created_at: new Date(Date.now() - 86400000).toISOString(), is_latest: false }
    ]
    
    usage.value = {
      artifact_id: 1,
      daily_downloads: 25,
      weekly_downloads: 180,
      monthly_downloads: 750,
      total_downloads: 1250,
      unique_users: 85,
      last_used_at: new Date().toISOString()
    }
    
    scanResults.value = [
      {
        id: 1,
        artifact_id: 1,
        scan_type: 'vulnerability',
        status: 'completed',
        result: { high_issues: 0, medium_issues: 2, low_issues: 5 },
        scanned_at: new Date().toISOString()
      }
    ]
  } catch (error) {
    Message.error('加载制品详情失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadArtifactDetail()
})
</script>