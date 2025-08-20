<script setup lang="ts">
import type { Artifact, ArtifactRepo, ArtifactType } from '../../types/artifact'
import type { Project } from '../../types/devops'
import { Message, Modal } from '@arco-design/web-vue'
import { IconDelete, IconDownload, IconEye, IconRefresh } from '@arco-design/web-vue/es/icon'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const artifacts = ref<Artifact[]>([])
const projects = ref<Project[]>([])
const artifactTypes = ref<ArtifactType[]>([])
const artifactRepos = ref<ArtifactRepo[]>([])
const downloadingArtifacts = ref<number[]>([])

const filters = reactive({
  projectId: '',
  typeId: '',
  repoId: '',
  keyword: '',
})

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: true,
})

// 表格列配置
const columns = [
  {
    title: '制品信息',
    dataIndex: 'name',
    slotName: 'name',
    width: 250,
  },
  {
    title: '版本',
    dataIndex: 'version',
    slotName: 'version',
    width: 120,
  },
  {
    title: '类型',
    dataIndex: 'type',
    slotName: 'type',
    width: 100,
  },
  {
    title: '所属项目',
    dataIndex: 'project',
    slotName: 'project',
    width: 150,
  },
  {
    title: '仓库',
    dataIndex: 'repo',
    slotName: 'repo',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    slotName: 'created_at',
    width: 180,
  },
  {
    title: '操作',
    slotName: 'actions',
    width: 180,
    align: 'center',
  },
]

// 工具函数
function formatTime(time: string) {
  return new Date(time).toLocaleString('zh-CN')
}

function getTypeColor(typeName?: string) {
  const colorMap: Record<string, string> = {
    DOCKER: 'blue',
    NPM: 'green',
    JAR: 'orange',
    MAVEN: 'red',
    PYPI: 'yellow',
  }
  return colorMap[typeName || ''] || 'gray'
}

// 事件处理
function handlePageChange(page: number) {
  pagination.current = page
  loadArtifacts()
}

function handlePageSizeChange(pageSize: number) {
  pagination.pageSize = pageSize
  pagination.current = 1
  loadArtifacts()
}

function viewArtifactDetail(artifact: Artifact) {
  router.push(`/artifacts/${artifact.id}`)
}

async function downloadArtifact(artifact: Artifact) {
  try {
    downloadingArtifacts.value.push(artifact.id)
    // TODO: 调用下载API
    // await artifactApi.download(artifact.id)
    Message.success(`制品 ${artifact.name} 下载开始`)
  }
  catch (error) {
    console.error(error)
    Message.error('下载失败')
  }
  finally {
    downloadingArtifacts.value = downloadingArtifacts.value.filter(id => id !== artifact.id)
  }
}

function deleteArtifact(artifact: Artifact) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除制品 "${artifact.name}:${artifact.version}" 吗？此操作不可恢复。`,
    onOk: async () => {
      try {
        // TODO: 调用删除API
        // await artifactApi.delete(artifact.id)
        Message.success('删除成功')
        loadArtifacts()
      }
      catch (error) {
        console.error(error)
        Message.error('删除失败')
      }
    },
  })
}

function refreshArtifacts() {
  loadArtifacts()
}

// 加载数据
async function loadProjects() {
  try {
    // TODO: 调用API获取项目列表
    // const response = await projectApi.getAll()
    // projects.value = response.data

    // 模拟数据
    projects.value = [
      { id: 1, name: 'Web前端项目', repo_url: '', branch: '', build_cmd: '', image_name: '', created_at: '', updated_at: '' },
      { id: 2, name: 'API服务', repo_url: '', branch: '', build_cmd: '', image_name: '', created_at: '', updated_at: '' },
    ]
  }
  catch (error) {
    console.error(error)
    Message.error('加载项目列表失败')
  }
}

async function loadArtifactTypes() {
  try {
    // TODO: 调用API获取制品类型列表
    // const response = await artifactTypeApi.getAll()
    // artifactTypes.value = response.data

    // 模拟数据
    artifactTypes.value = [
      { id: 1, name: 'DOCKER', description: 'Docker镜像', created_at: '' },
      { id: 2, name: 'NPM', description: 'NPM包', created_at: '' },
      { id: 3, name: 'JAR', description: 'Java JAR包', created_at: '' },
    ]
  }
  catch (error) {
    console.error(error)
    Message.error('加载制品类型失败')
  }
}

async function loadArtifactRepos() {
  try {
    // TODO: 调用API获取制品仓库列表
    // const response = await artifactRepoApi.getAll()
    // artifactRepos.value = response.data

    // 模拟数据
    artifactRepos.value = [
      { id: 1, name: 'Docker Hub', type_id: 1, url: 'docker.io', created_at: '', updated_at: '' },
      { id: 2, name: 'NPM Registry', type_id: 2, url: 'registry.npmjs.org', created_at: '', updated_at: '' },
    ]
  }
  catch (error) {
    console.error(error)
    Message.error('加载制品仓库失败')
  }
}

async function loadArtifacts() {
  try {
    loading.value = true
    // TODO: 调用API获取制品列表
    // const response = await artifactApi.getList({
    //   page: pagination.current,
    //   pageSize: pagination.pageSize,
    //   ...filters
    // })
    // artifacts.value = response.data.list
    // pagination.total = response.data.total

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
        created_at: new Date().toISOString(),
        project: { id: 1, name: 'Web前端项目', repo_url: '', branch: '', build_cmd: '', image_name: '', created_at: '', updated_at: '' },
        artifact_repo: { id: 1, name: 'Docker Hub', type_id: 1, url: 'docker.io', created_at: '', updated_at: '' },
        artifact_type: { id: 1, name: 'DOCKER', description: 'Docker镜像', created_at: '' },
      },
      {
        id: 2,
        project_id: 2,
        repo_id: 2,
        name: '@myorg/api-utils',
        version: '2.1.0',
        type_id: 2,
        path: '@myorg/api-utils',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        project: { id: 2, name: 'API服务', repo_url: '', branch: '', build_cmd: '', image_name: '', created_at: '', updated_at: '' },
        artifact_repo: { id: 2, name: 'NPM Registry', type_id: 2, url: 'registry.npmjs.org', created_at: '', updated_at: '' },
        artifact_type: { id: 2, name: 'NPM', description: 'NPM包', created_at: '' },
      },
    ]
    pagination.total = 2
  }
  catch (error) {
    console.error(error)
    Message.error('加载制品列表失败')
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProjects()
  loadArtifactTypes()
  loadArtifactRepos()
  loadArtifacts()
})
</script>

<template>
  <div class="p-6">
    <!-- 页面标题和操作 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          制品列表
        </h1>
        <p class="text-gray-600">
          查看和管理所有制品
        </p>
      </div>
      <a-space>
        <a-button @click="refreshArtifacts">
          <template #icon>
            <IconRefresh />
          </template>
          刷新
        </a-button>
      </a-space>
    </div>

    <!-- 筛选器 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <a-row :gutter="16">
        <a-col :span="5">
          <a-select v-model="filters.projectId" placeholder="选择项目" allow-clear @change="loadArtifacts">
            <a-option value="">
              全部项目
            </a-option>
            <a-option v-for="project in projects" :key="project.id" :value="project.id">
              {{ project.name }}
            </a-option>
          </a-select>
        </a-col>
        <a-col :span="5">
          <a-select v-model="filters.typeId" placeholder="选择类型" allow-clear @change="loadArtifacts">
            <a-option value="">
              全部类型
            </a-option>
            <a-option v-for="type in artifactTypes" :key="type.id" :value="type.id">
              {{ type.name }}
            </a-option>
          </a-select>
        </a-col>
        <a-col :span="5">
          <a-select v-model="filters.repoId" placeholder="选择仓库" allow-clear @change="loadArtifacts">
            <a-option value="">
              全部仓库
            </a-option>
            <a-option v-for="repo in artifactRepos" :key="repo.id" :value="repo.id">
              {{ repo.name }}
            </a-option>
          </a-select>
        </a-col>
        <a-col :span="9">
          <a-input-search v-model="filters.keyword" placeholder="搜索制品名称或版本" @search="loadArtifacts" />
        </a-col>
      </a-row>
    </div>

    <!-- 制品列表 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <a-table
        :columns="columns"
        :data="artifacts"
        :loading="loading"
        :pagination="pagination"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template #name="{ record }">
          <div>
            <p class="font-medium text-gray-900">
              {{ record.name }}
            </p>
            <p class="text-sm text-gray-500">
              {{ record.path }}
            </p>
          </div>
        </template>

        <template #version="{ record }">
          <a-tag color="blue">
            {{ record.version }}
          </a-tag>
        </template>

        <template #type="{ record }">
          <a-tag :color="getTypeColor(record.artifact_type?.name)">
            {{ record.artifact_type?.name || '未知' }}
          </a-tag>
        </template>

        <template #project="{ record }">
          <span class="text-sm text-gray-600">{{ record.project?.name || '未知项目' }}</span>
        </template>

        <template #repo="{ record }">
          <span class="text-sm text-gray-600">{{ record.artifact_repo?.name || '未知仓库' }}</span>
        </template>

        <template #created_at="{ record }">
          {{ formatTime(record.created_at) }}
        </template>

        <template #actions="{ record }">
          <a-space>
            <a-button type="text" size="small" @click="viewArtifactDetail(record)">
              <template #icon>
                <IconEye />
              </template>
              详情
            </a-button>
            <a-button type="text" size="small" :loading="downloadingArtifacts.includes(record.id)" @click="downloadArtifact(record)">
              <template #icon>
                <IconDownload />
              </template>
              下载
            </a-button>
            <a-button type="text" size="small" status="danger" @click="deleteArtifact(record)">
              <template #icon>
                <IconDelete />
              </template>
              删除
            </a-button>
          </a-space>
        </template>
      </a-table>
    </div>
  </div>
</template>
