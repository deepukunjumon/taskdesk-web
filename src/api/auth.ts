import { apiClient } from '@/api/client'
import type { ApiResponse, User } from '@/types'

interface LoginPayload {
  email: string
  password: string
}

interface LoginResult {
  user: User
  token: string
}

export function login(payload: LoginPayload) {
  return apiClient.post<ApiResponse<LoginResult>>('/login', payload).then((res) => res.data.data)
}

export function logout() {
  return apiClient.post('/logout')
}

export function me() {
  return apiClient.get<ApiResponse<User>>('/me').then((res) => res.data.data)
}
