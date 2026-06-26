import { useEffect } from 'react'
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
import { useUpdateUserMutation } from '@/shared/api/usersApi'
import type { UserProfile } from '@/shared/api/types'

const schema = z.object({
  firstName: z.string().min(1, 'errors.required'),
  lastName: z.string().min(1, 'errors.required'),
  email: z.string().email('errors.invalidEmail'),
  phoneNumber: z.string().min(5, 'errors.required'),
})

type EditUserFormValues = z.infer<typeof schema>

interface EditUserDialogProps {
  user: UserProfile | null
  onClose: () => void
}

export function EditUserDialog({ user, onClose }: EditUserDialogProps) {
  const { t } = useTranslation()
  const [updateUser, { isLoading }] = useUpdateUserMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      })
    }
  }, [user, reset])

  async function onSubmit(values: EditUserFormValues) {
    if (!user) return
    const fd = new FormData()
    fd.append('Id', user.id)
    fd.append('FirstName', values.firstName)
    fd.append('LastName', values.lastName)
    fd.append('Email', values.email)
    fd.append('PhoneNumber', values.phoneNumber)
    try {
      await updateUser(fd).unwrap()
      toast.success(t('common.successUpdated'))
      onClose()
    } catch {
      toast.error(t('errors.somethingWrong'))
    }
  }

  return (
    <Dialog open={!!user} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('common.edit')} {t('users.username')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-first">First name</Label>
              <Input id="edit-first" {...register('firstName')} />
              {errors.firstName && (
                <p className="text-xs text-destructive">{t(errors.firstName.message ?? 'errors.required')}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-last">Last name</Label>
              <Input id="edit-last" {...register('lastName')} />
              {errors.lastName && (
                <p className="text-xs text-destructive">{t(errors.lastName.message ?? 'errors.required')}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-email">{t('users.email')}</Label>
            <Input id="edit-email" type="email" {...register('email')} />
            {errors.email && (
              <p className="text-xs text-destructive">{t(errors.email.message ?? 'errors.required')}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-phone">{t('users.phone')}</Label>
            <Input id="edit-phone" {...register('phoneNumber')} />
            {errors.phoneNumber && (
              <p className="text-xs text-destructive">{t(errors.phoneNumber.message ?? 'errors.required')}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
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
