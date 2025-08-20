<script setup lang="ts">
import type { HostGroup, HostGroupForm } from '../../types/devops'
import { Message, Modal } from '@arco-design/web-vue'
import { IconDelete, IconEdit, IconPlus } from '@arco-design/web-vue/es/icon'
import { onMounted, reactive, ref } from 'vue'

// 响应式数据
const loading = ref(false)
const showCreateModal = ref(false)
const editingHostGroup = ref<HostGroup | null>(null)
const hostGroups = ref<HostGroup[]>([])
const formRef = ref()

const form = reactive<HostGroupForm>({
  name: '',
  description: '',
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
    title: '主机组名称',
    dataIndex: 'name',
    slotName: 'name',
    width: 300,
  },
  {
    title: '主机数量',
    dataIndex: 'hostCount',
    slotName: 'hostCount',
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
    width: 150,
    align: 'center',
  },
]

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入主机组名称' },
    { minLength: 2, message: '主机组名称至少2个字符' },
  ],
}

// 工具函数
function formatTime(time: string) {
  return new Date(time).toLocaleString('zh-CN')
}

function resetForm() {
  form.name = ''
  form.description = ''
  editingHostGroup.value = null
  showCreateModal.value = false
  formRef.value?.resetFields()
}

// 事件处理
function handlePageChange(page: number) {
  pagination.current = page
  loadHostGroups()
}

function handlePageSizeChange(pageSize: number) {
  pagination.pageSize = pageSize
  pagination.current = 1
  loadHostGroups()
}

function editHostGroup(hostGroup: HostGroup) {
  editingHostGroup.value = hostGroup
  form.name = hostGroup.name
  form.description = hostGroup.description || ''
  showCreateModal.value = true
}

function deleteHostGroup(hostGroup: HostGroup) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除主机组 "${hostGroup.name}" 吗？此操作不可恢复。`,
    onOk: async () => {
      try {
        // TODO: 调用删除API
        // await hostGroupApi.delete(hostGroup.id)
        Message.success('删除成功')
        loadHostGroups()
      }
      catch (error) {
        console.error(error)
        Message.error('删除失败')
      }
    },
  })
}

async function handleSubmit() {
  try {
    const valid = await formRef.value?.validate()
    if (!valid)
      return

    loading.value = true

    if (editingHostGroup.value) {
      // TODO: 调用更新API
      // await hostGroupApi.update(editingHostGroup.value.id, form)
      Message.success('更新成功')
    }
    else {
      // TODO: 调用创建API
      // await hostGroupApi.create(form)
      Message.success('创建成功')
    }

    resetForm()
    loadHostGroups()
  }
  catch (error) {
    console.error(error)
    Message.error(editingHostGroup.value ? '更新失败' : '创建失败')
  }
  finally {
    loading.value = false
  }
}

// 加载数据
async function loadHostGroups() {
  try {
    loading.value = true
    // TODO: 调用API获取主机组列表
    // const response = await hostGroupApi.getList({
    //   page: pagination.current,
    //   pageSize: pagination.pageSize
    // })
    // hostGroups.value = response.data.list
    // pagination.total = response.data.total

    // 模拟数据
    hostGroups.value = [
      {
        id: 1,
        name: '生产环境',
        description: '生产环境服务器组',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: '测试环境',
        description: '测试环境服务器组',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ]
    pagination.total = 2
  }
  catch (error) {
    console.error(error)
    Message.error('加载主机组列表失败')
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  loadHostGroups()
})
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- 页面标题和操作 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          主机组管理
        </h1>
        <p class="text-gray-600">
          管理部署目标主机的分组
        </p>
      </div>
      <a-button type="primary" @click="showCreateModal = true">
        <template #icon>
          <IconPlus />
        </template>
        新建主机组
      </a-button>
    </div>

    <!-- 主机组列表 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <a-table
        :columns="columns"
        :data="hostGroups"
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
            <p v-if="record.description" class="text-sm text-gray-500">
              {{ record.description }}
            </p>
          </div>
        </template>

        <template #hostCount="{ record }">
          <a-tag color="blue">
            {{ record.hostCount || 0 }} 台主机
          </a-tag>
        </template>

        <template #created_at="{ record }">
          {{ formatTime(record.created_at) }}
        </template>

        <template #actions="{ record }">
          <a-space>
            <a-button type="text" size="small" @click="editHostGroup(record)">
              <template #icon>
                <IconEdit />
              </template>
              编辑
            </a-button>
            <a-button type="text" size="small" status="danger" @click="deleteHostGroup(record)">
              <template #icon>
                <IconDelete />
              </template>
              删除
            </a-button>
          </a-space>
        </template>
      </a-table>
    </div>

    <!-- 新建/编辑主机组弹窗 -->
    <a-modal
      v-model:visible="showCreateModal"
      :title="editingHostGroup ? '编辑主机组' : '新建主机组'"
      @ok="handleSubmit"
      @cancel="resetForm"
    >
      <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
        <a-form-item field="name" label="主机组名称">
          <a-input v-model="form.name" placeholder="请输入主机组名称" />
        </a-form-item>

        <a-form-item field="description" label="描述">
          <a-textarea v-model="form.description" placeholder="请输入主机组描述（可选）" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
