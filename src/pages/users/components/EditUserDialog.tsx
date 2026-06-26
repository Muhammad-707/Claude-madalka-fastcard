import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, UserCircle } from 'lucide-react'
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
import { getImageUrl } from '@/shared/lib/getImageUrl'
import type { UserProfile } from '@/shared/api/types'

const schema = z.object({
  firstName: z.string().min(1, 'errors.required'),
  lastName: z.string().min(1, 'errors.required'),
  email: z.string().email('errors.invalidEmail'),
  phoneNumber: z.string().min(5, 'errors.required'),
  dob: z.string().min(1, 'errors.required'),
})

type EditUserFormValues = z.infer<typeof schema>

interface EditUserDialogProps {
  user: UserProfile | null
  onClose: () => void
}

export function EditUserDialog({ user, onClose }: EditUserDialogProps) {
  const { t } = useTranslation()
  const [updateUser, { isLoading }] = useUpdateUserMutation()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      phoneNumber: user?.phoneNumber ?? '',
      dob: user?.dob ? user.dob.split('T')[0] : '',
    },
  })

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        email: user.email ?? '',
        phoneNumber: user.phoneNumber ?? '',
        dob: user.dob ? user.dob.split('T')[0] : '',
      })
      setImageFile(null)
      setImagePreview(null)
    }
  }, [user, reset])

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setImageFile(file)
    if (file) {
      setImagePreview(URL.createObjectURL(file))
    } else {
      setImagePreview(null)
    }
  }

  function handleClose() {
    setImageFile(null)
    setImagePreview(null)
    onClose()
  }

  async function onSubmit(values: EditUserFormValues) {
    if (!user) return
    const fd = new FormData()
    // Send Id/UserId so backend can identify which user to update
    fd.append('Id', user.userId || user.id)
    fd.append('FirstName', values.firstName)
    fd.append('LastName', values.lastName)
    fd.append('Email', values.email)
    fd.append('PhoneNumber', values.phoneNumber)
    fd.append('Dob', values.dob)
    // Image is required by swagger — send new file or empty blob to keep existing
    if (imageFile) {
      fd.append('Image', imageFile)
    } else {
      fd.append('Image', new Blob([], { type: 'image/jpeg' }), 'current.jpg')
    }
    try {
      await updateUser(fd).unwrap()
      toast.success(t('common.successUpdated'))
      handleClose()
    } catch {
      toast.error(t('errors.somethingWrong'))
    }
  }

  const currentImageSrc = imagePreview ?? (user?.image ? getImageUrl(user.image) : null)

  return (
    <Dialog open={!!user} onOpenChange={(open) => { if (!open) handleClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('common.edit')} {t('users.username')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Avatar preview */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
              {currentImageSrc ? (
                <img src={currentImageSrc} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-10 h-10 text-muted-foreground/40" />
              )}
            </div>
            <div className="flex-1 space-y-1">
              <Label htmlFor="edit-image">{t('users.photo')}</Label>
              <Input
                id="edit-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="h-auto py-1.5 text-sm"
              />
              <p className="text-xs text-muted-foreground">{t('users.photoHint')}</p>
            </div>
          </div>

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

          <div className="space-y-1.5">
            <Label htmlFor="edit-dob">{t('users.dob')}</Label>
            <Input id="edit-dob" type="date" {...register('dob')} />
            {errors.dob && (
              <p className="text-xs text-destructive">{t(errors.dob.message ?? 'errors.required')}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
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
