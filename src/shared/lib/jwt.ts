import { jwtDecode } from 'jwt-decode'

type RawJwt = Record<string, unknown>

const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'

export interface JwtPayload {
  sid: string
  name: string
  email: string
  role: string[]
  exp: number
  iss: string
  aud: string
}

function extractRoles(raw: RawJwt): string[] {
  const value = raw[ROLE_CLAIM] ?? raw['role']
  if (!value) return []
  return Array.isArray(value) ? (value as string[]) : [value as string]
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
    const raw = jwtDecode<RawJwt>(token)
    return { ...raw, role: extractRoles(raw) } as JwtPayload
  } catch {
    return null
  }
}

export function isTokenValid(token: string): boolean {
  const payload = decodeToken(token)
  if (!payload) return false
  return payload.exp * 1000 > Date.now()
}

export function hasAdminRole(role: string[]): boolean {
  return role?.includes('Admin') || role?.includes('SuperAdmin')
}

export function isAdminToken(token: string): boolean {
  const payload = decodeToken(token)
  if (!payload) return false
  return hasAdminRole(payload.role) && isTokenValid(token)
}
