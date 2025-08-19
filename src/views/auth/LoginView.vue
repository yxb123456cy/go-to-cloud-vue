<template>
  <div class="min-h-screen flex">
    <!-- 左侧内容区 -->
    <div class="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">欢迎回来</h2>
          <p class="text-gray-600">登录您的账户以继续使用</p>
        </div>

        <a-form ref="formRef" :model="loginForm" :rules="rules" layout="vertical" @submit="handleSubmit"
          class="space-y-6">
          <a-form-item field="email" label="邮箱地址" class="mb-4">
            <a-input v-model="loginForm.email" placeholder="请输入邮箱地址" size="large"
              class="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <template #prefix>
                <icon-email class="text-gray-400" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item field="password" label="密码" class="mb-4">
            <a-input-password v-model="loginForm.password" placeholder="请输入密码" size="large"
              class="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <template #prefix>
                <icon-lock class="text-gray-400" />
              </template>
            </a-input-password>
          </a-form-item>

          <div class="flex items-center justify-between mb-6">
            <a-checkbox v-model="loginForm.remember" class="text-sm text-gray-600">
              记住我
            </a-checkbox>
            <a-link class="text-sm text-blue-600 hover:text-blue-500">
              忘记密码？
            </a-link>
          </div>

          <a-button type="primary" html-type="submit" size="large" :loading="authStore.loading"
            class="w-full h-12 bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 rounded-lg font-medium">
            登录
          </a-button>
        </a-form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">或者</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <a-button class="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg">
              <template #icon>
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </template>
              Google
            </a-button>

            <a-button class="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg">
              <template #icon>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
                </svg>
              </template>
              GitHub
            </a-button>
          </div>
        </div>

        <p class="mt-8 text-center text-sm text-gray-600">
          还没有账户？
          <router-link to="/register" class="font-medium text-blue-600 hover:text-blue-500">
            立即注册
          </router-link>
        </p>
      </div>
    </div>

    <!-- 右侧装饰区 -->
    <div class="hidden lg:block relative w-0 flex-1">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div class="max-w-md text-center px-8">
          <div class="w-32 h-32 mx-auto mb-8 bg-white rounded-full shadow-lg flex items-center justify-center">
            <svg class="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Stardust Admin</h3>
          <p class="text-gray-600 leading-relaxed">
            现代化的中后台管理系统，为您提供高效、安全、易用的管理体验。
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

import { IconEmail, IconLock } from '@arco-design/web-vue/es/icon'
import { useAuthStore } from '../../store/modules/auth'
import type { LoginForm } from '../../types/auth'

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref()

const loginForm = reactive<LoginForm>({
  email: '',
  password: '',
  remember: false
})

const rules = {
  email: [
    { required: true, message: '请输入邮箱地址' },
    { type: 'email', message: '请输入正确的邮箱格式' }
  ],
  password: [
    { required: true, message: '请输入密码' },
    { minLength: 6, message: '密码长度不能少于6位' }
  ]
}

const handleSubmit = async () => {
  try {
    const valid = await formRef.value?.validate()
    if (!valid) return

    const result = await authStore.login(loginForm)
    if (result.success) {
      Message.success('登录成功')
      router.push('/dashboard')
    } else {
      Message.error(result.message)
    }
  } catch (error) {
    Message.error('登录失败，请重试')
  }
}
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>