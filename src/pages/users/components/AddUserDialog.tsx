import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { useAddUserMutation } from '@/shared/api/usersApi'

const schema = z
  .object({
    userName: z.string().min(3, 'errors.required'),
    email: z.string().email('errors.invalidEmail'),
    phoneNumber: z.string().min(5, 'errors.required'),
    password: z.string().min(6, 'errors.required'),
    confirmPassword: z.string().min(1, 'errors.required'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type AddUserFormValues = z.infer<typeof schema>

interface AddUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddUserDialog({ open, onOpenChange }: AddUserDialogProps) {
  const { t } = useTranslation()
  const [addUser, { isLoading }] = useAddUserMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddUserFormValues>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(values: AddUserFormValues) {
    try {
      await addUser({
        userName: values.userName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
        confirmPassword: values.confirmPassword,
      }).unwrap()
      toast.success(t('common.successAdded'))
      reset()
      onOpenChange(false)
    } catch {
      toast.error(t('errors.somethingWrong'))
    }
  }

  function handleClose(open: boolean) {
    if (!open) reset()
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('users.addUser')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="add-username">{t('users.username')}</Label>
            <Input id="add-username" {...register('userName')} />
            {errors.userName && (
              <p className="text-xs text-destructive">{t(errors.userName.message ?? 'errors.required')}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="add-email">{t('users.email')}</Label>
            <Input id="add-email" type="email" {...register('email')} />
            {errors.email && (
              <p className="text-xs text-destructive">{t(errors.email.message ?? 'errors.required')}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="add-phone">{t('users.phone')}</Label>
            <Input id="add-phone" {...register('phoneNumber')} />
            {errors.phoneNumber && (
              <p className="text-xs text-destructive">{t(errors.phoneNumber.message ?? 'errors.required')}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="add-password">{t('auth.password')}</Label>
            <Input id="add-password" type="password" {...register('password')} />
            {errors.password && (
              <p className="text-xs text-destructive">{t(errors.password.message ?? 'errors.required')}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="add-confirm">Confirm password</Label>
            <Input id="add-confirm" type="password" {...register('confirmPassword')} />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message === 'Passwords do not match'
                  ? 'Passwords do not match'
                  : t(errors.confirmPassword.message ?? 'errors.required')}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>
              {t('form.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t('form.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
