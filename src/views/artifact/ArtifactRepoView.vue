<script setup lang="ts">
import type { ArtifactRepo, ArtifactRepoForm, ArtifactType } from '../../types/artifact'
import { Message, Modal } from '@arco-design/web-vue'
import { IconDelete, IconEdit, IconInfoCircle, IconPlus, IconRefresh, IconWifi } from '@arco-design/web-vue/es/icon'
import { onMounted, reactive, ref } from 'vue'

// 响应式数据
const loading = ref(false)
const showCreateModal = ref(false)
const editingArtifactRepo = ref<ArtifactRepo | null>(null)
const artifactRepos = ref<ArtifactRepo[]>([])
const artifactTypes = ref<ArtifactType[]>([])
const testingRepos = ref<number[]>([])
const formRef = ref()

const form = reactive<ArtifactRepoForm>({
  name: '',
  type_id: 0,
  url: '',
  username: '',
  password: '',
})

const filters = reactive({
  typeId: '',
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
    title: '仓库信息',
    dataIndex: 'name',
    slotName: 'name',
    width: 300,
  },
  {
    title: '制品类型',
    dataIndex: 'type',
    slotName: 'type',
    width: 120,
  },
  {
    title: '认证状态',
    dataIndex: 'auth',
    slotName: 'auth',
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
    width: 200,
    align: 'center',
  },
]

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入仓库名称' },
    { minLength: 2, message: '仓库名称至少2个字符' },
  ],
  type_id: [
    { required: true, message: '请选择制品类型' },
  ],
  url: [
    { required: true, message: '请输入仓库地址' },
  ],
}

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

function resetForm() {
  form.name = ''
  form.type_id = 0
  form.url = ''
  form.username = ''
  form.password = ''
  editingArtifactRepo.value = null
  showCreateModal.value = false
  formRef.value?.resetFields()
}

// 事件处理
function handlePageChange(page: number) {
  pagination.current = page
  loadArtifactRepos()
}

function handlePageSizeChange(pageSize: number) {
  pagination.pageSize = pageSize
  pagination.current = 1
  loadArtifactRepos()
}

function editArtifactRepo(artifactRepo: ArtifactRepo) {
  editingArtifactRepo.value = artifactRepo
  form.name = artifactRepo.name
  form.type_id = artifactRepo.type_id
  form.url = artifactRepo.url
  form.username = artifactRepo.username || ''
  form.password = '' // 不回显密码
  showCreateModal.value = true
}

function deleteArtifactRepo(artifactRepo: ArtifactRepo) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除制品仓库 "${artifactRepo.name}" 吗？此操作不可恢复。`,
    onOk: async () => {
      try {
        // TODO: 调用删除API
        // await artifactRepoApi.delete(artifactRepo.id)
        Message.success('删除成功')
        loadArtifactRepos()
      }
      catch (error) {
        console.error(error)
        Message.error('删除失败')
      }
    },
  })
}

async function testConnection(artifactRepo: ArtifactRepo) {
  try {
    testingRepos.value.push(artifactRepo.id)
    // TODO: 调用测试连接API
    // await artifactRepoApi.testConnection(artifactRepo.id)
    Message.success(`制品仓库 ${artifactRepo.name} 连接正常`)
  }
  catch (error) {
    console.error(error)
    Message.error(`制品仓库 ${artifactRepo.name} 连接失败`)
  }
  finally {
    testingRepos.value = testingRepos.value.filter(id => id !== artifactRepo.id)
  }
}

async function handleSubmit() {
  try {
    const valid = await formRef.value?.validate()
    if (!valid)
      return

    loading.value = true

    if (editingArtifactRepo.value) {
      // TODO: 调用更新API
      // await artifactRepoApi.update(editingArtifactRepo.value.id, form)
      Message.success('更新成功')
    }
    else {
      // TODO: 调用创建API
      // await artifactRepoApi.create(form)
      Message.success('添加成功')
    }

    resetForm()
    loadArtifactRepos()
  }
  catch (error) {
    console.error(error)
    Message.error(editingArtifactRepo.value ? '更新失败' : '添加失败')
  }
  finally {
    loading.value = false
  }
}

// 加载数据
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
      { id: 4, name: 'MAVEN', description: 'Maven仓库', created_at: '' },
      { id: 5, name: 'PYPI', description: 'Python包', created_at: '' },
    ]
  }
  catch (error) {
    console.error(error)
    Message.error('加载制品类型失败')
  }
}

async function loadArtifactRepos() {
  try {
    loading.value = true
    // TODO: 调用API获取制品仓库列表
    // const response = await artifactRepoApi.getList({
    //   page: pagination.current,
    //   pageSize: pagination.pageSize,
    //   ...filters
    // })
    // artifactRepos.value = response.data.list
    // pagination.total = response.data.total

    // 模拟数据
    artifactRepos.value = [
      {
        id: 1,
        name: 'Docker Hub',
        type_id: 1,
        url: 'docker.io',
        username: 'myuser',
        password: '***',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        artifact_type: { id: 1, name: 'DOCKER', description: 'Docker镜像', created_at: '' },
      },
      {
        id: 2,
        name: 'NPM Registry',
        type_id: 2,
        url: 'registry.npmjs.org',
        username: '',
        password: '',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        artifact_type: { id: 2, name: 'NPM', description: 'NPM包', created_at: '' },
      },
    ]
    pagination.total = 2
  }
  catch (error) {
    console.error(error)
    Message.error('加载制品仓库列表失败')
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  loadArtifactTypes()
  loadArtifactRepos()
})
</script>

<template>
  <div class="p-6">
    <!-- 页面标题和操作 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          制品仓库管理
        </h1>
        <p class="text-gray-600">
          管理各类制品仓库配置
        </p>
      </div>
      <a-button type="primary" @click="showCreateModal = true">
        <template #icon>
          <IconPlus />
        </template>
        添加仓库
      </a-button>
    </div>

    <!-- 筛选器 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-select v-model="filters.typeId" placeholder="选择制品类型" allow-clear @change="loadArtifactRepos">
            <a-option value="">
              全部类型
            </a-option>
            <a-option v-for="type in artifactTypes" :key="type.id" :value="type.id">
              {{ type.name }}
            </a-option>
          </a-select>
        </a-col>
        <a-col :span="8">
          <a-input-search v-model="filters.keyword" placeholder="搜索仓库名称或地址" @search="loadArtifactRepos" />
        </a-col>
        <a-col :span="4">
          <a-button @click="loadArtifactRepos">
            <template #icon>
              <IconRefresh />
            </template>
            刷新
          </a-button>
        </a-col>
      </a-row>
    </div>

    <!-- 制品仓库列表 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <a-table
        :columns="columns"
        :data="artifactRepos"
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
              {{ record.url }}
            </p>
          </div>
        </template>

        <template #type="{ record }">
          <a-tag :color="getTypeColor(record.artifact_type?.name)">
            {{ record.artifact_type?.name || '未知类型' }}
          </a-tag>
        </template>

        <template #auth="{ record }">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 rounded-full" :class="record.username ? 'bg-green-500' : 'bg-gray-400'" />
            <span class="text-sm" :class="record.username ? 'text-green-600' : 'text-gray-500'">
              {{ record.username ? '已配置认证' : '无认证' }}
            </span>
          </div>
        </template>

        <template #created_at="{ record }">
          {{ formatTime(record.created_at) }}
        </template>

        <template #actions="{ record }">
          <a-space>
            <a-button type="text" size="small" :loading="testingRepos.includes(record.id)" @click="testConnection(record)">
              <template #icon>
                <IconWifi />
              </template>
              测试连接
            </a-button>
            <a-button type="text" size="small" @click="editArtifactRepo(record)">
              <template #icon>
                <IconEdit />
              </template>
              编辑
            </a-button>
            <a-button type="text" size="small" status="danger" @click="deleteArtifactRepo(record)">
              <template #icon>
                <IconDelete />
              </template>
              删除
            </a-button>
          </a-space>
        </template>
      </a-table>
    </div>

    <!-- 新建/编辑制品仓库弹窗 -->
    <a-modal
      v-model:visible="showCreateModal"
      :title="editingArtifactRepo ? '编辑制品仓库' : '添加制品仓库'"
      width="600px"
      @ok="handleSubmit"
      @cancel="resetForm"
    >
      <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
        <a-form-item field="name" label="仓库名称">
          <a-input v-model="form.name" placeholder="请输入仓库名称" />
        </a-form-item>

        <a-form-item field="type_id" label="制品类型">
          <a-select v-model="form.type_id" placeholder="请选择制品类型">
            <a-option v-for="type in artifactTypes" :key="type.id" :value="type.id">
              {{ type.name }} - {{ type.description }}
            </a-option>
          </a-select>
        </a-form-item>

        <a-form-item field="url" label="仓库地址">
          <a-input v-model="form.url" placeholder="请输入仓库地址" />
        </a-form-item>

        <a-form-item field="username" label="用户名">
          <a-input v-model="form.username" placeholder="请输入用户名（可选）" />
        </a-form-item>

        <a-form-item field="password" label="密码">
          <a-input-password v-model="form.password" placeholder="请输入密码（可选）" />
        </a-form-item>

        <a-alert type="info" class="mt-4">
          <template #icon>
            <IconInfoCircle />
          </template>
          密码将被加密存储。不同类型的制品仓库可能需要不同的认证方式。
        </a-alert>
      </a-form>
    </a-modal>
  </div>
</template>
