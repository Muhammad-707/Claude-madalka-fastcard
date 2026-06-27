import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAppSelector } from '@/app/hooks'
import { selectIsAdmin } from '@/features/auth/model/authSlice'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/ui/form'
import { useLoginPage } from './hooks/useLoginPage'

import img1 from "@/assets/Group 1116606595 (3).png"

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isAdmin = useAppSelector(selectIsAdmin)
  const { form, isLoading, onSubmit, showPassword, setShowPassword } = useLoginPage()

  useEffect(() => {
    if (isAdmin) navigate('/dashboard', { replace: true })
  }, [isAdmin, navigate])

  return (
    <div className="min-h-screen flex">
      {/* Left panel — dark gradient */}
      <div
        className="hidden lg:flex lg:w-[53%] flex-col justify-center p-16 lg:p-24 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1d3a4a 0%, #0f1e35 45%, #07111f 100%)',
        }}
      >
        {/* Subtle glow effect */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 bg-blue-400 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <p className="text-white text-[22px] font-normal mb-4 tracking-wide whitespace-nowrap">
            {t('auth.welcome')}
          </p>
          <img
            src={img1}
            alt="fastcart"
            className="w-[350px] object-contain"
          />
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center px-6 bg-white dark:bg-card">
        <div className="w-full max-w-[400px]">
          <h1 className="text-2xl font-bold text-foreground mb-7">
            {t('auth.login')}
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email / userName field */}
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t('auth.email')}
                        autoComplete="username"
                        disabled={isLoading}
                        className="h-12 px-4 text-sm border-border rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          placeholder={t('auth.password')}
                          autoComplete="current-password"
                          disabled={isLoading}
                          className="h-12 px-4 pr-11 text-sm border-border rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          tabIndex={-1}
                        >
                          {showPassword
                            ? <EyeOff className="h-5 w-5" />
                            : <Eye className="h-5 w-5" />
                          }
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Forgot password */}
              <div className="text-center py-1">
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                >
                  {t('auth.forgot')}
                </button>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base font-medium rounded-lg"
              >
                {isLoading
                  ? <Loader2 className="h-5 w-5 animate-spin" />
                  : t('auth.login')
                }
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}