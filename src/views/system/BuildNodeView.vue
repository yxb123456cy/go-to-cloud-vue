<template>
  <div class="p-6">
    <!-- 页面标题和操作 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">构建节点配置</h1>
        <p class="text-gray-600">管理分布式构建节点</p>
      </div>
      <a-button type="primary" @click="showCreateModal = true">
        <template #icon>
          <icon-plus />
        </template>
        添加节点
      </a-button>
    </div>

    <!-- 筛选器 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-select v-model="filters.status" placeholder="选择状态" allow-clear @change="loadBuildNodes">
            <a-option value="">全部状态</a-option>
            <a-option value="ONLINE">在线</a-option>
            <a-option value="OFFLINE">离线</a-option>
          </a-select>
        </a-col>
        <a-col :span="8">
          <a-input-search v-model="filters.keyword" placeholder="搜索节点名称或IP" @search="loadBuildNodes" />
        </a-col>
        <a-col :span="4">
          <a-button @click="refreshNodes">
            <template #icon>
              <icon-refresh />
            </template>
            刷新状态
          </a-button>
        </a-col>
      </a-row>
    </div>

    <!-- 构建节点列表 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <a-table :columns="columns" :data="buildNodes" :loading="loading" :pagination="pagination"
        @page-change="handlePageChange" @page-size-change="handlePageSizeChange">
        <template #name="{ record }">
          <div>
            <p class="font-medium text-gray-900">{{ record.name }}</p>
            <p class="text-sm text-gray-500">{{ record.ip }}:{{ record.port }}</p>
          </div>
        </template>

        <template #status="{ record }">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 rounded-full" :class="record.status === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'"></div>
            <a-tag :color="record.status === 'ONLINE' ? 'green' : 'red'">
              {{ record.status === 'ONLINE' ? '在线' : '离线' }}
            </a-tag>
          </div>
        </template>

        <template #created_at="{ record }">
          {{ formatTime(record.created_at) }}
        </template>

        <template #actions="{ record }">
          <a-space>
            <a-button type="text" size="small" @click="testConnection(record)"
              :loading="testingNodes.includes(record.id)">
              <template #icon>
                <icon-wifi />
              </template>
              测试连接
            </a-button>
            <a-button type="text" size="small" @click="editBuildNode(record)">
              <template #icon>
                <icon-edit />
              </template>
              编辑
            </a-button>
            <a-button type="text" size="small" status="danger" @click="deleteBuildNode(record)">
              <template #icon>
                <icon-delete />
              </template>
              删除
            </a-button>
          </a-space>
        </template>
      </a-table>
    </div>

    <!-- 新建/编辑构建节点弹窗 -->
    <a-modal v-model:visible="showCreateModal" :title="editingBuildNode ? '编辑构建节点' : '添加构建节点'" width="600px"
      @ok="handleSubmit" @cancel="resetForm">
      <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
        <a-form-item field="name" label="节点名称">
          <a-input v-model="form.name" placeholder="请输入节点名称" />
        </a-form-item>

        <a-form-item field="ip" label="节点IP">
          <a-input v-model="form.ip" placeholder="请输入节点IP地址" />
        </a-form-item>

        <a-form-item field="port" label="SSH/API端口">
          <a-input-number v-model="form.port" placeholder="请输入端口号" :min="1" :max="65535" />
        </a-form-item>

        <a-alert type="info" class="mt-4">
          <template #icon>
            <icon-info-circle />
          </template>
          构建节点用于分布式构建任务。请确保节点已安装Docker和相关构建工具。
        </a-alert>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import { IconPlus, IconEdit, IconDelete, IconRefresh, IconWifi, IconInfoCircle } from '@arco-design/web-vue/es/icon'
import type { BuildNode, BuildNodeForm } from '../../types/devops'

// 响应式数据
const loading = ref(false)
const showCreateModal = ref(false)
const editingBuildNode = ref<BuildNode | null>(null)
const buildNodes = ref<BuildNode[]>([])
const testingNodes = ref<number[]>([])
const formRef = ref()

const form = reactive<BuildNodeForm>({
  name: '',
  ip: '',
  port: 22
})

const filters = reactive({
  status: '',
  keyword: ''
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
    title: '节点信息',
    dataIndex: 'name',
    slotName: 'name',
    width: 250
  },
  {
    title: '状态',
    dataIndex: 'status',
    slotName: 'status',
    width: 100
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    slotName: 'created_at',
    width: 180
  },
  {
    title: '操作',
    slotName: 'actions',
    width: 200,
    align: 'center'
  }
]

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入节点名称' },
    { minLength: 2, message: '节点名称至少2个字符' }
  ],
  ip: [
    { required: true, message: '请输入节点IP地址' }
  ],
  port: [
    { required: true, message: '请输入端口号' },
    { type: 'number', min: 1, max: 65535, message: '端口号范围1-65535' }
  ]
}

// 工具函数
const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN')
}

const resetForm = () => {
  form.name = ''
  form.ip = ''
  form.port = 22
  editingBuildNode.value = null
  showCreateModal.value = false
  formRef.value?.resetFields()
}

// 事件处理
const handlePageChange = (page: number) => {
  pagination.current = page
  loadBuildNodes()
}

const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.current = 1
  loadBuildNodes()
}

const editBuildNode = (buildNode: BuildNode) => {
  editingBuildNode.value = buildNode
  form.name = buildNode.name
  form.ip = buildNode.ip
  form.port = buildNode.port
  showCreateModal.value = true
}

const deleteBuildNode = (buildNode: BuildNode) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除构建节点 "${buildNode.name}" 吗？此操作不可恢复。`,
    onOk: async () => {
      try {
        // TODO: 调用删除API
        // await buildNodeApi.delete(buildNode.id)
        Message.success('删除成功')
        loadBuildNodes()
      } catch (error) {
        Message.error('删除失败')
      }
    }
  })
}

const testConnection = async (buildNode: BuildNode) => {
  try {
    testingNodes.value.push(buildNode.id)
    // TODO: 调用测试连接API
    // await buildNodeApi.testConnection(buildNode.id)
    Message.success(`构建节点 ${buildNode.name} 连接正常`)
  } catch (error) {
    Message.error(`构建节点 ${buildNode.name} 连接失败`)
  } finally {
    testingNodes.value = testingNodes.value.filter(id => id !== buildNode.id)
  }
}

const refreshNodes = async () => {
  try {
    loading.value = true
    // TODO: 调用刷新状态API
    // await buildNodeApi.refreshStatus()
    Message.success('状态刷新完成')
    loadBuildNodes()
  } catch (error) {
    Message.error('刷新状态失败')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  try {
    const valid = await formRef.value?.validate()
    if (!valid) return

    loading.value = true

    if (editingBuildNode.value) {
      // TODO: 调用更新API
      // await buildNodeApi.update(editingBuildNode.value.id, form)
      Message.success('更新成功')
    } else {
      // TODO: 调用创建API
      // await buildNodeApi.create(form)
      Message.success('添加成功')
    }

    resetForm()
    loadBuildNodes()
  } catch (error) {
    Message.error(editingBuildNode.value ? '更新失败' : '添加失败')
  } finally {
    loading.value = false
  }
}

// 加载数据
const loadBuildNodes = async () => {
  try {
    loading.value = true
    // TODO: 调用API获取构建节点列表
    // const response = await buildNodeApi.getList({
    //   page: pagination.current,
    //   pageSize: pagination.pageSize,
    //   ...filters
    // })
    // buildNodes.value = response.data.list
    // pagination.total = response.data.total

    // 模拟数据
    buildNodes.value = [
      {
        id: 1,
        name: '构建节点1',
        ip: '192.168.1.200',
        port: 22,
        status: 'ONLINE',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        name: '构建节点2',
        ip: '192.168.1.201',
        port: 22,
        status: 'OFFLINE',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString()
      }
    ]
    pagination.total = 2
  } catch (error) {
    Message.error('加载构建节点列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadBuildNodes()
})
</script>