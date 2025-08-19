<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- 页面标题和操作 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">主机管理</h1>
        <p class="text-gray-600">管理部署目标主机（Agent节点）</p>
      </div>
      <a-button type="primary" @click="showCreateModal = true">
        <template #icon>
          <icon-plus />
        </template>
        添加主机
      </a-button>
    </div>

    <!-- 筛选器 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-select v-model="filters.hostGroupId" placeholder="选择主机组" allow-clear @change="loadHosts">
            <a-option value="">全部主机组</a-option>
            <a-option v-for="group in hostGroups" :key="group.id" :value="group.id">
              {{ group.name }}
            </a-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <a-select v-model="filters.status" placeholder="选择状态" allow-clear @change="loadHosts">
            <a-option value="">全部状态</a-option>
            <a-option value="ONLINE">在线</a-option>
            <a-option value="OFFLINE">离线</a-option>
          </a-select>
        </a-col>
        <a-col :span="8">
          <a-input-search v-model="filters.keyword" placeholder="搜索主机名称或IP" @search="loadHosts" />
        </a-col>
        <a-col :span="4">
          <a-button @click="refreshHosts">
            <template #icon>
              <icon-refresh />
            </template>
            刷新状态
          </a-button>
        </a-col>
      </a-row>
    </div>

    <!-- 主机列表 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <a-table :columns="columns" :data="hosts" :loading="loading" :pagination="pagination"
        @page-change="handlePageChange" @page-size-change="handlePageSizeChange">
        <template #name="{ record }">
          <div>
            <p class="font-medium text-gray-900">{{ record.name }}</p>
            <p class="text-sm text-gray-500">{{ record.ip }}:{{ record.port }}</p>
          </div>
        </template>

        <template #hostGroup="{ record }">
          <a-tag color="blue">{{ record.host_group?.name || '未分组' }}</a-tag>
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
            <a-button type="text" size="small" @click="testConnection(record)">
              <template #icon>
                <icon-wifi />
              </template>
              测试连接
            </a-button>
            <a-button type="text" size="small" @click="editHost(record)">
              <template #icon>
                <icon-edit />
              </template>
              编辑
            </a-button>
            <a-button type="text" size="small" status="danger" @click="deleteHost(record)">
              <template #icon>
                <icon-delete />
              </template>
              删除
            </a-button>
          </a-space>
        </template>
      </a-table>
    </div>

    <!-- 新建/编辑主机弹窗 -->
    <a-modal v-model:visible="showCreateModal" :title="editingHost ? '编辑主机' : '添加主机'" @ok="handleSubmit"
      @cancel="resetForm">
      <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
        <a-form-item field="host_group_id" label="主机组">
          <a-select v-model="form.host_group_id" placeholder="请选择主机组">
            <a-option v-for="group in hostGroups" :key="group.id" :value="group.id">
              {{ group.name }}
            </a-option>
          </a-select>
        </a-form-item>

        <a-form-item field="name" label="主机名称">
          <a-input v-model="form.name" placeholder="请输入主机名称" />
        </a-form-item>

        <a-form-item field="ip" label="IP地址">
          <a-input v-model="form.ip" placeholder="请输入IP地址或域名" />
        </a-form-item>

        <a-form-item field="port" label="Agent端口">
          <a-input-number v-model="form.port" placeholder="请输入Agent服务端口" :min="1" :max="65535" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import { IconPlus, IconEdit, IconDelete, IconRefresh, IconWifi } from '@arco-design/web-vue/es/icon'
import type { Host, HostForm, HostGroup } from '../../types/devops'

// 响应式数据
const loading = ref(false)
const showCreateModal = ref(false)
const editingHost = ref<Host | null>(null)
const hosts = ref<Host[]>([])
const hostGroups = ref<HostGroup[]>([])
const formRef = ref()

const form = reactive<HostForm>({
  host_group_id: 0,
  name: '',
  ip: '',
  port: 8080
})

const filters = reactive({
  hostGroupId: '',
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
    title: '主机信息',
    dataIndex: 'name',
    slotName: 'name',
    width: 250
  },
  {
    title: '主机组',
    dataIndex: 'host_group',
    slotName: 'hostGroup',
    width: 120
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
  host_group_id: [
    { required: true, message: '请选择主机组' }
  ],
  name: [
    { required: true, message: '请输入主机名称' },
    { minLength: 2, message: '主机名称至少2个字符' }
  ],
  ip: [
    { required: true, message: '请输入IP地址' }
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
  form.host_group_id = 0
  form.name = ''
  form.ip = ''
  form.port = 8080
  editingHost.value = null
  showCreateModal.value = false
  formRef.value?.resetFields()
}

// 事件处理
const handlePageChange = (page: number) => {
  pagination.current = page
  loadHosts()
}

const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.current = 1
  loadHosts()
}

const editHost = (host: Host) => {
  editingHost.value = host
  form.host_group_id = host.host_group_id
  form.name = host.name
  form.ip = host.ip
  form.port = host.port
  showCreateModal.value = true
}

const deleteHost = (host: Host) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除主机 "${host.name}" 吗？此操作不可恢复。`,
    onOk: async () => {
      try {
        // TODO: 调用删除API
        // await hostApi.delete(host.id)
        Message.success('删除成功')
        loadHosts()
      } catch (error) {
        Message.error('删除失败')
      }
    }
  })
}

const testConnection = async (host: Host) => {
  try {
    loading.value = true
    // TODO: 调用测试连接API
    // await hostApi.testConnection(host.id)
    Message.success(`主机 ${host.name} 连接正常`)
  } catch (error) {
    Message.error(`主机 ${host.name} 连接失败`)
  } finally {
    loading.value = false
  }
}

const refreshHosts = async () => {
  try {
    loading.value = true
    // TODO: 调用刷新状态API
    // await hostApi.refreshStatus()
    Message.success('状态刷新完成')
    loadHosts()
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

    if (editingHost.value) {
      // TODO: 调用更新API
      // await hostApi.update(editingHost.value.id, form)
      Message.success('更新成功')
    } else {
      // TODO: 调用创建API
      // await hostApi.create(form)
      Message.success('添加成功')
    }

    resetForm()
    loadHosts()
  } catch (error) {
    Message.error(editingHost.value ? '更新失败' : '添加失败')
  } finally {
    loading.value = false
  }
}

// 加载数据
const loadHostGroups = async () => {
  try {
    // TODO: 调用API获取主机组列表
    // const response = await hostGroupApi.getAll()
    // hostGroups.value = response.data

    // 模拟数据
    hostGroups.value = [
      { id: 1, name: '生产环境', description: '生产环境服务器组', created_at: '', updated_at: '' },
      { id: 2, name: '测试环境', description: '测试环境服务器组', created_at: '', updated_at: '' }
    ]
  } catch (error) {
    Message.error('加载主机组失败')
  }
}

const loadHosts = async () => {
  try {
    loading.value = true
    // TODO: 调用API获取主机列表
    // const response = await hostApi.getList({
    //   page: pagination.current,
    //   pageSize: pagination.pageSize,
    //   ...filters
    // })
    // hosts.value = response.data.list
    // pagination.total = response.data.total

    // 模拟数据
    hosts.value = [
      {
        id: 1,
        host_group_id: 1,
        name: '生产服务器1',
        ip: '192.168.1.100',
        port: 8080,
        status: 'ONLINE',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        host_group: { id: 1, name: '生产环境', description: '', created_at: '', updated_at: '' }
      },
      {
        id: 2,
        host_group_id: 1,
        name: '生产服务器2',
        ip: '192.168.1.101',
        port: 8080,
        status: 'OFFLINE',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        host_group: { id: 1, name: '生产环境', description: '', created_at: '', updated_at: '' }
      }
    ]
    pagination.total = 2
  } catch (error) {
    Message.error('加载主机列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadHostGroups()
  loadHosts()
})
</script>