<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- 页面标题和操作 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">项目管理</h1>
        <p class="text-gray-600">管理代码项目及构建配置</p>
      </div>
      <a-button type="primary" @click="showCreateModal = true">
        <template #icon>
          <icon-plus />
        </template>
        新建项目
      </a-button>
    </div>

    <!-- 筛选器 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-input-search v-model="filters.keyword" placeholder="搜索项目名称或仓库地址" @search="loadProjects" />
        </a-col>
        <a-col :span="4">
          <a-button @click="loadProjects">
            <template #icon>
              <icon-refresh />
            </template>
            刷新
          </a-button>
        </a-col>
      </a-row>
    </div>

    <!-- 项目列表 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <a-table 
        :columns="columns" 
        :data="projects" 
        :loading="loading"
        :pagination="pagination"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template #name="{ record }">
          <div>
            <p class="font-medium text-gray-900">{{ record.name }}</p>
            <p class="text-sm text-gray-500">{{ record.repo_url }}</p>
          </div>
        </template>
        
        <template #branch="{ record }">
          <a-tag color="blue">{{ record.branch }}</a-tag>
        </template>
        
        <template #image_name="{ record }">
          <code class="text-sm bg-gray-100 px-2 py-1 rounded">{{ record.image_name }}</code>
        </template>
        
        <template #created_at="{ record }">
          {{ formatTime(record.created_at) }}
        </template>
        
        <template #actions="{ record }">
          <a-space>
            <a-button type="text" size="small" @click="buildProject(record)" :loading="buildingProjects.includes(record.id)">
              <template #icon>
                <icon-play-arrow />
              </template>
              构建
            </a-button>
            <a-button type="text" size="small" @click="viewBuilds(record)">
              <template #icon>
                <icon-history />
              </template>
              构建历史
            </a-button>
            <a-button type="text" size="small" @click="editProject(record)">
              <template #icon>
                <icon-edit />
              </template>
              编辑
            </a-button>
            <a-button type="text" size="small" status="danger" @click="deleteProject(record)">
              <template #icon>
                <icon-delete />
              </template>
              删除
            </a-button>
          </a-space>
        </template>
      </a-table>
    </div>

    <!-- 新建/编辑项目弹窗 -->
    <a-modal 
      v-model:visible="showCreateModal" 
      :title="editingProject ? '编辑项目' : '新建项目'"
      width="600px"
      @ok="handleSubmit"
      @cancel="resetForm"
    >
      <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
        <a-form-item field="name" label="项目名称">
          <a-input v-model="form.name" placeholder="请输入项目名称" />
        </a-form-item>
        
        <a-form-item field="repo_url" label="代码仓库地址">
          <a-input v-model="form.repo_url" placeholder="请输入Git仓库地址" />
        </a-form-item>
        
        <a-form-item field="branch" label="代码分支">
          <a-input v-model="form.branch" placeholder="请输入分支名称" />
        </a-form-item>
        
        <a-form-item field="build_cmd" label="构建命令">
          <a-textarea v-model="form.build_cmd" placeholder="请输入构建命令，如：npm run build" :rows="3" />
        </a-form-item>
        
        <a-form-item field="image_name" label="镜像名称">
          <a-input v-model="form.image_name" placeholder="请输入Docker镜像名称" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Message, Modal } from '@arco-design/web-vue'
import { IconPlus, IconEdit, IconDelete, IconRefresh, IconPlayArrow, IconHistory } from '@arco-design/web-vue/es/icon'
import type { Project, ProjectForm } from '../../types/devops'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const showCreateModal = ref(false)
const editingProject = ref<Project | null>(null)
const projects = ref<Project[]>([])
const buildingProjects = ref<number[]>([])
const formRef = ref()

const form = reactive<ProjectForm>({
  name: '',
  repo_url: '',
  branch: 'main',
  build_cmd: '',
  image_name: ''
})

const filters = reactive({
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
    title: '项目信息',
    dataIndex: 'name',
    slotName: 'name',
    width: 300
  },
  {
    title: '分支',
    dataIndex: 'branch',
    slotName: 'branch',
    width: 100
  },
  {
    title: '构建命令',
    dataIndex: 'build_cmd',
    width: 200,
    ellipsis: true
  },
  {
    title: '镜像名称',
    dataIndex: 'image_name',
    slotName: 'image_name',
    width: 250
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
    width: 250,
    align: 'center'
  }
]

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入项目名称' },
    { minLength: 2, message: '项目名称至少2个字符' }
  ],
  repo_url: [
    { required: true, message: '请输入代码仓库地址' }
  ],
  branch: [
    { required: true, message: '请输入代码分支' }
  ],
  build_cmd: [
    { required: true, message: '请输入构建命令' }
  ],
  image_name: [
    { required: true, message: '请输入镜像名称' }
  ]
}

// 工具函数
const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN')
}

const resetForm = () => {
  form.name = ''
  form.repo_url = ''
  form.branch = 'main'
  form.build_cmd = ''
  form.image_name = ''
  editingProject.value = null
  showCreateModal.value = false
  formRef.value?.resetFields()
}

// 事件处理
const handlePageChange = (page: number) => {
  pagination.current = page
  loadProjects()
}

const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.current = 1
  loadProjects()
}

const editProject = (project: Project) => {
  editingProject.value = project
  form.name = project.name
  form.repo_url = project.repo_url
  form.branch = project.branch
  form.build_cmd = project.build_cmd
  form.image_name = project.image_name
  showCreateModal.value = true
}

const deleteProject = (project: Project) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除项目 "${project.name}" 吗？此操作不可恢复。`,
    onOk: async () => {
      try {
        // TODO: 调用删除API
        // await projectApi.delete(project.id)
        Message.success('删除成功')
        loadProjects()
      } catch (error) {
        Message.error('删除失败')
      }
    }
  })
}

const buildProject = async (project: Project) => {
  try {
    buildingProjects.value.push(project.id)
    // TODO: 调用构建API
    // await projectApi.build(project.id)
    Message.success(`项目 ${project.name} 构建任务已启动`)
  } catch (error) {
    Message.error('启动构建失败')
  } finally {
    buildingProjects.value = buildingProjects.value.filter(id => id !== project.id)
  }
}

const viewBuilds = (project: Project) => {
  router.push(`/builds?projectId=${project.id}`)
}

const handleSubmit = async () => {
  try {
    const valid = await formRef.value?.validate()
    if (!valid) return

    loading.value = true
    
    if (editingProject.value) {
      // TODO: 调用更新API
      // await projectApi.update(editingProject.value.id, form)
      Message.success('更新成功')
    } else {
      // TODO: 调用创建API
      // await projectApi.create(form)
      Message.success('创建成功')
    }
    
    resetForm()
    loadProjects()
  } catch (error) {
    Message.error(editingProject.value ? '更新失败' : '创建失败')
  } finally {
    loading.value = false
  }
}

// 加载数据
const loadProjects = async () => {
  try {
    loading.value = true
    // TODO: 调用API获取项目列表
    // const response = await projectApi.getList({
    //   page: pagination.current,
    //   pageSize: pagination.pageSize,
    //   ...filters
    // })
    // projects.value = response.data.list
    // pagination.total = response.data.total
    
    // 模拟数据
    projects.value = [
      {
        id: 1,
        name: 'Web前端项目',
        repo_url: 'https://github.com/example/web-frontend.git',
        branch: 'main',
        build_cmd: 'npm install && npm run build',
        image_name: 'registry.example.com/web-frontend:latest',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'API服务',
        repo_url: 'https://github.com/example/api-service.git',
        branch: 'develop',
        build_cmd: 'mvn clean package -DskipTests',
        image_name: 'registry.example.com/api-service:latest',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString()
      }
    ]
    pagination.total = 2
  } catch (error) {
    Message.error('加载项目列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProjects()
})
</script>