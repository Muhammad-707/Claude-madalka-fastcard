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
import { useUpdateUserMutation, useGetUserByIdQuery } from '@/shared/api/usersApi'
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
  const [updateUser, { isLoading: saving }] = useUpdateUserMutation()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Derive the user's id string — userId is the ASP.NET Identity GUID
  const userId = user ? (user.userId || user.id) : ''

  // Fetch full profile from the detail endpoint to guarantee all fields are present.
  // GET /UserProfile/get-user-profile-by-id?id={string}
  const {
    data: fullUser,
    isLoading: loadingUser,
  } = useGetUserByIdQuery(userId, {
    skip: !userId,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dob: '',
    },
  })

  // When the full user data arrives (or the user prop changes), reset the form with real values.
  // Dob from API may be ISO-8601 datetime ("2000-01-15T00:00:00") — extract YYYY-MM-DD for <input type="date">.
  useEffect(() => {
    const source = fullUser ?? user
    if (source) {
      reset({
        firstName: source.firstName ?? '',
        lastName: source.lastName ?? '',
        email: source.email ?? '',
        phoneNumber: source.phoneNumber ?? '',
        dob: source.dob ? source.dob.split('T')[0] : '',
      })
      setImageFile(null)
      setImagePreview(null)
    }
  }, [fullUser, user, reset])

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

    // PUT /UserProfile/update-user-profile
    // multipart/form-data fields: Image (binary), FirstName, LastName, Email, PhoneNumber, Dob
    // NOTE: swagger does not include an Id field — the backend identifies the user from the JWT.
    // We still pass Id so the backend can use it if it supports it.
    const fd = new FormData()
    fd.append('Id', userId)
    fd.append('FirstName', values.firstName)
    fd.append('LastName', values.lastName)
    fd.append('Email', values.email)
    fd.append('PhoneNumber', values.phoneNumber)
    fd.append('Dob', values.dob)

    // Image is required by swagger — send new file or an empty blob to keep existing photo
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
      // Do NOT close the modal on error so the user can retry
    }
  }

  // Show the newly selected preview, or the existing avatar from the full user data
  const existingImage = (fullUser ?? user)?.image
  const currentImageSrc = imagePreview ?? (existingImage ? getImageUrl(existingImage) : null)

  return (
    <Dialog open={!!user} onOpenChange={(open) => { if (!open) handleClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('common.edit')} {t('users.username')}</DialogTitle>
        </DialogHeader>

        {loadingUser ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
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
              {/* input type="date" requires YYYY-MM-DD format — we split on 'T' above */}
              <Input id="edit-dob" type="date" {...register('dob')} />
              {errors.dob && (
                <p className="text-xs text-destructive">{t(errors.dob.message ?? 'errors.required')}</p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                {t('form.cancel')}
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {t('form.save')}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
