export interface LoginForm {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
  agreement: boolean
}

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: User
}
