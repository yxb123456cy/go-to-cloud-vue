<script setup lang="ts">
import type { ImageRepo, ImageRepoForm } from '../../types/devops'
import { Message, Modal } from '@arco-design/web-vue'
import { IconDelete, IconEdit, IconInfoCircle, IconPlus, IconRefresh, IconWifi } from '@arco-design/web-vue/es/icon'
import { onMounted, reactive, ref } from 'vue'

// 响应式数据
const loading = ref(false)
const showCreateModal = ref(false)
const editingImageRepo = ref<ImageRepo | null>(null)
const imageRepos = ref<ImageRepo[]>([])
const testingRepos = ref<number[]>([])
const formRef = ref()

const form = reactive<ImageRepoForm>({
  name: '',
  url: '',
  username: '',
  password: '',
})

const filters = reactive({
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
  url: [
    { required: true, message: '请输入仓库地址' },
  ],
}

// 工具函数
function formatTime(time: string) {
  return new Date(time).toLocaleString('zh-CN')
}

function resetForm() {
  form.name = ''
  form.url = ''
  form.username = ''
  form.password = ''
  editingImageRepo.value = null
  showCreateModal.value = false
  formRef.value?.resetFields()
}

// 事件处理
function handlePageChange(page: number) {
  pagination.current = page
  loadImageRepos()
}

function handlePageSizeChange(pageSize: number) {
  pagination.pageSize = pageSize
  pagination.current = 1
  loadImageRepos()
}

function editImageRepo(imageRepo: ImageRepo) {
  editingImageRepo.value = imageRepo
  form.name = imageRepo.name
  form.url = imageRepo.url
  form.username = imageRepo.username || ''
  form.password = '' // 不回显密码
  showCreateModal.value = true
}

function deleteImageRepo(imageRepo: ImageRepo) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除镜像仓库 "${imageRepo.name}" 吗？此操作不可恢复。`,
    onOk: async () => {
      try {
        // TODO: 调用删除API
        // await imageRepoApi.delete(imageRepo.id)
        Message.success('删除成功')
        loadImageRepos()
      }
      catch (error) {
        console.error(error)
        Message.error('删除失败')
      }
    },
  })
}

async function testConnection(imageRepo: ImageRepo) {
  try {
    testingRepos.value.push(imageRepo.id)
    // TODO: 调用测试连接API
    // await imageRepoApi.testConnection(imageRepo.id)
    Message.success(`镜像仓库 ${imageRepo.name} 连接正常`)
  }
  catch (error) {
    console.error(error)
    Message.error(`镜像仓库 ${imageRepo.name} 连接失败`)
  }
  finally {
    testingRepos.value = testingRepos.value.filter(id => id !== imageRepo.id)
  }
}

async function handleSubmit() {
  try {
    const valid = await formRef.value?.validate()
    if (!valid)
      return

    loading.value = true

    if (editingImageRepo.value) {
      // TODO: 调用更新API
      // await imageRepoApi.update(editingImageRepo.value.id, form)
      Message.success('更新成功')
    }
    else {
      // TODO: 调用创建API
      // await imageRepoApi.create(form)
      Message.success('添加成功')
    }

    resetForm()
    loadImageRepos()
  }
  catch (error) {
    console.error(error)
    Message.error(editingImageRepo.value ? '更新失败' : '添加失败')
  }
  finally {
    loading.value = false
  }
}

// 加载数据
async function loadImageRepos() {
  try {
    loading.value = true
    // TODO: 调用API获取镜像仓库列表
    // const response = await imageRepoApi.getList({
    //   page: pagination.current,
    //   pageSize: pagination.pageSize,
    //   ...filters
    // })
    // imageRepos.value = response.data.list
    // pagination.total = response.data.total

    // 模拟数据
    imageRepos.value = [
      {
        id: 1,
        name: 'Docker Hub',
        url: 'docker.io',
        username: 'myuser',
        password: '***',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: '私有仓库',
        url: 'registry.example.com',
        username: '',
        password: '',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ]
    pagination.total = 2
  }
  catch (error) {
    console.error(error)
    Message.error('加载镜像仓库列表失败')
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  loadImageRepos()
})
</script>

<template>
  <div class="p-6">
    <!-- 页面标题和操作 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          镜像仓库管理
        </h1>
        <p class="text-gray-600">
          管理Docker镜像仓库配置
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
        <a-col :span="8">
          <a-input-search v-model="filters.keyword" placeholder="搜索仓库名称或地址" @search="loadImageRepos" />
        </a-col>
        <a-col :span="4">
          <a-button @click="loadImageRepos">
            <template #icon>
              <IconRefresh />
            </template>
            刷新
          </a-button>
        </a-col>
      </a-row>
    </div>

    <!-- 镜像仓库列表 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <a-table
        :columns="columns"
        :data="imageRepos"
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
            <a-button type="text" size="small" @click="editImageRepo(record)">
              <template #icon>
                <IconEdit />
              </template>
              编辑
            </a-button>
            <a-button type="text" size="small" status="danger" @click="deleteImageRepo(record)">
              <template #icon>
                <IconDelete />
              </template>
              删除
            </a-button>
          </a-space>
        </template>
      </a-table>
    </div>

    <!-- 新建/编辑镜像仓库弹窗 -->
    <a-modal
      v-model:visible="showCreateModal"
      :title="editingImageRepo ? '编辑镜像仓库' : '添加镜像仓库'"
      width="600px"
      @ok="handleSubmit"
      @cancel="resetForm"
    >
      <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
        <a-form-item field="name" label="仓库名称">
          <a-input v-model="form.name" placeholder="请输入仓库名称" />
        </a-form-item>

        <a-form-item field="url" label="仓库地址">
          <a-input v-model="form.url" placeholder="请输入仓库地址，如：registry.example.com" />
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
          密码将被加密存储。如果不填写认证信息，将使用匿名访问。
        </a-alert>
      </a-form>
    </a-modal>
  </div>
</template>
