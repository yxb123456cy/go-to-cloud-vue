<template>
  <div class="min-h-screen flex">
    <!-- 左侧内容区 -->
    <div class="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">创建账户</h2>
          <p class="text-gray-600">注册新账户以开始使用</p>
        </div>

        <a-form ref="formRef" :model="registerForm" :rules="rules" layout="vertical" @submit="handleSubmit"
          class="space-y-6">
          <a-form-item field="username" label="用户名" class="mb-4">
            <a-input v-model="registerForm.username" placeholder="请输入用户名" size="large"
              class="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <template #prefix>
                <icon-user class="text-gray-400" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item field="email" label="邮箱地址" class="mb-4">
            <a-input v-model="registerForm.email" placeholder="请输入邮箱地址" size="large"
              class="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <template #prefix>
                <icon-email class="text-gray-400" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item field="password" label="密码" class="mb-4">
            <a-input-password v-model="registerForm.password" placeholder="请输入密码" size="large"
              class="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <template #prefix>
                <icon-lock class="text-gray-400" />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item field="confirmPassword" label="确认密码" class="mb-4">
            <a-input-password v-model="registerForm.confirmPassword" placeholder="请再次输入密码" size="large"
              class="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <template #prefix>
                <icon-lock class="text-gray-400" />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item field="agreement" class="mb-6">
            <a-checkbox v-model="registerForm.agreement" class="text-sm text-gray-600">
              我已阅读并同意
              <a-link class="text-blue-600 hover:text-blue-500">服务条款</a-link>
              和
              <a-link class="text-blue-600 hover:text-blue-500">隐私政策</a-link>
            </a-checkbox>
          </a-form-item>

          <a-button type="primary" html-type="submit" size="large" :loading="authStore.loading"
            class="w-full h-12 bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 rounded-lg font-medium">
            注册
          </a-button>
        </a-form>

        <p class="mt-8 text-center text-sm text-gray-600">
          已有账户？
          <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500">
            立即登录
          </router-link>
        </p>
      </div>
    </div>

    <!-- 右侧装饰区 -->
    <div class="hidden lg:block relative w-0 flex-1">
      <div class="absolute inset-0 bg-blue-50 flex items-center justify-center">
        <div class="max-w-md text-center px-8">
          <div class="w-32 h-32 mx-auto mb-8 bg-white rounded-full shadow-lg flex items-center justify-center">
            <svg class="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">加入我们</h3>
          <p class="text-gray-600 leading-relaxed">
            开始您的DevOps之旅，体验高效的持续集成与部署流程。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { IconEmail, IconLock, IconUser } from '@arco-design/web-vue/es/icon'
import { useAuthStore } from '../../store/modules/auth'
import type { RegisterForm } from '../../types/auth'

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref()

const registerForm = reactive<RegisterForm>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreement: false
})

const rules = {
  username: [
    { required: true, message: '请输入用户名' },
    { minLength: 3, message: '用户名长度不能少于3位' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址' },
    { type: 'email', message: '请输入正确的邮箱格式' }
  ],
  password: [
    { required: true, message: '请输入密码' },
    { minLength: 6, message: '密码长度不能少于6位' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码' },
    {
      validator: (value: string, callback: (error?: string) => void) => {
        if (value !== registerForm.password) {
          callback('两次输入的密码不一致')
        } else {
          callback()
        }
      }
    }
  ],
  agreement: [
    {
      validator: (value: boolean, callback: (error?: string) => void) => {
        if (!value) {
          callback('请阅读并同意服务条款')
        } else {
          callback()
        }
      }
    }
  ]
}

const handleSubmit = async () => {
  try {
    const valid = await formRef.value?.validate()
    if (!valid) return

    const result = await authStore.register(registerForm)
    if (result.success) {
      Message.success(result.message || '注册成功，请登录')
      router.push('/login')
    } else {
      Message.error(result.message)
    }
  } catch (error) {
    Message.error('注册失败，请重试')
  }
}
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>