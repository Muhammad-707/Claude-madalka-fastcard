import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useAppDispatch } from '@/app/hooks'
import { setCredentials } from '@/features/auth/model/authSlice'
import { useLoginMutation } from '@/shared/api/authApi'
import { decodeToken, setToken, hasAdminRole } from '@/shared/lib/jwt'

const loginSchema = z.object({
  userName: z.string().min(1, 'errors.required'),
  password: z.string().min(1, 'errors.required'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export function useLoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [login, { isLoading }] = useLoginMutation()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { userName: '', password: '' },
  })

  async function onSubmit(values: LoginFormValues) {
    try {
      const result = await login(values).unwrap()
      console.log('[Login] ✅ RTK unwrap result:', result)

      const token = result.data
      if (!token) {
        console.log('[Login] ❌ result.data is empty:', result.data, '| errors:', result.errors)
        toast.error(result.errors[0] ?? t('errors.loginFailed'))
        return
      }

      console.log('[Login] 🔑 Raw token (first 80 chars):', token.slice(0, 80))

      const payload = decodeToken(token)
      console.log('[Login] 📦 Decoded payload:', payload)
      console.log('[Login] 🗝 All payload keys:', payload ? Object.keys(payload) : 'null')

      const role = payload?.role
      const adminCheck = payload ? hasAdminRole(payload.role) : false
      console.log('[Login] 👤 payload.role:', role, '| type:', typeof role, '| isArray:', Array.isArray(role))
      console.log('[Login] 🔐 hasAdminRole result:', adminCheck)

      if (!payload || !adminCheck) {
        toast.error(t('auth.onlyAdmin'))
        return
      }

      setToken(token)
      dispatch(setCredentials({ token, user: payload }))
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      console.error('[Login] 💥 catch block — raw error:', err)
      const apiErr = err as { data?: { errors?: string[] }; status?: unknown }
      console.error('[Login] 💥 err.status:', apiErr?.status, '| err.data:', apiErr?.data)
      toast.error(apiErr?.data?.errors?.[0] ?? t('errors.loginFailed'))
    }
  }

  return { form, isLoading, onSubmit, showPassword, setShowPassword }
}
