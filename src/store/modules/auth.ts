import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LoginForm, RegisterForm, User } from '../../types/auth'
import { authApi } from '../../api/auth'



export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)

  // 登录
  const login = async (loginForm: LoginForm) => {
    loading.value = true
    try {
      const response = await authApi.login(loginForm)
      token.value = response.data.token
      user.value = response.data.user
      localStorage.setItem('token', token.value)
      return { success: true }
    } catch (error: any) {
      return { success: false, message: error.message || '登录失败' }
    } finally {
      loading.value = false
    }
  }

  // 注册
  const register = async (registerForm: RegisterForm) => {
    loading.value = true
    try {
      const response = await authApi.register(registerForm)
      console.log("response:", response);
      return { success: true, message: '注册成功，请登录' };

    } catch (error: any) {
      return { success: false, message: error.message || '注册失败' }
    } finally {
      loading.value = false
    }
  }

  // 登出
  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  // 获取用户信息
  const getUserInfo = async () => {
    if (!token.value) return
    try {
      const response = await authApi.getUserInfo()
      user.value = response.data
    } catch (error) {
      logout()
    }
  }

  return {
    user,
    token,
    loading,
    login,
    register,
    logout,
    getUserInfo
  }
}, {
  persist: {
    key: 'auth-store',
  }
})