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
import { decodeToken, setToken } from '@/shared/lib/jwt'

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
      const token = result.data
      if (!token) {
        toast.error(result.errors[0] ?? t('errors.loginFailed'))
        return
      }
      const payload = decodeToken(token)
      if (!payload || payload.role !== 'Admin') {
        toast.error(t('auth.onlyAdmin'))
        return
      }
      setToken(token)
      dispatch(setCredentials({ token, user: payload }))
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      const apiErr = err as { data?: { errors?: string[] } }
      toast.error(apiErr?.data?.errors?.[0] ?? t('errors.loginFailed'))
    }
  }

  return { form, isLoading, onSubmit, showPassword, setShowPassword }
}
