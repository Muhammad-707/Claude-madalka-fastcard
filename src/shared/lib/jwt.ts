import { jwtDecode } from 'jwt-decode'

export interface JwtPayload {
  sid: string
  name: string
  email: string
  role: 'User' | 'Admin'
  exp: number
  iss: string
  aud: string
}

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY ?? 'access_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token)
  } catch {
    return null
  }
}

export function isTokenValid(token: string): boolean {
  const payload = decodeToken(token)
  if (!payload) return false
  return payload.exp * 1000 > Date.now()
}

export function isAdminToken(token: string): boolean {
  const payload = decodeToken(token)
  if (!payload) return false
  return payload.role === 'Admin' && isTokenValid(token)
}
