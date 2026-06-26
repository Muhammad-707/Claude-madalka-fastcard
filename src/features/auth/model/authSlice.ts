import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {
  getToken,
  decodeToken,
  isTokenValid,
  hasAdminRole,
  removeToken,
  type JwtPayload,
} from '@/shared/lib/jwt'

interface AuthState {
  token: string | null
  user: JwtPayload | null
}

function getInitialState(): AuthState {
  const token = getToken()
  if (!token) return { token: null, user: null }
  const payload = decodeToken(token)
  if (!payload || !isTokenValid(token) || !hasAdminRole(payload.role)) {
    removeToken()
    return { token: null, user: null }
  }
  return { token, user: payload }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; user: JwtPayload }>) {
      state.token = action.payload.token
      state.user = action.payload.user
    },
    logout(state) {
      state.token = null
      state.user = null
      removeToken()
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer

export const selectToken = (state: { auth: AuthState }) => state.auth.token
export const selectUser = (state: { auth: AuthState }) => state.auth.user
export const selectIsAdmin = (state: { auth: AuthState }) =>
  !!state.auth.user && hasAdminRole(state.auth.user.role)
