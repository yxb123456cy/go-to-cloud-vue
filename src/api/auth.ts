import axios from 'axios'
import type { AuthResponse, LoginForm, RegisterForm, User } from '../types/auth'


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  // 登录
  login: (data: LoginForm) =>
    api.post<AuthResponse>('/auth/login', data),

  // 注册
  register: (data: RegisterForm) =>
    api.post('/auth/register', data),

  // 获取用户信息
  getUserInfo: () =>
    api.get<User>('/auth/me'),

  // 刷新token
  refreshToken: () =>
    api.post<{ token: string }>('/auth/refresh')
}