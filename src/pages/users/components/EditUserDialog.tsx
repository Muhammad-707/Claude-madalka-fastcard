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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import {
  useUpdateUserMutation,
  useGetUserByIdQuery,
  useGetRolesQuery,
  useAddRoleMutation,
  useRemoveRoleMutation,
} from '@/shared/api/usersApi'
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
  const [addRole, { isLoading: addingRole }] = useAddRoleMutation()
  const [removeRole, { isLoading: removingRole }] = useRemoveRoleMutation()
  const { data: roles = [], isLoading: loadingRoles } = useGetRolesQuery()

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedRoleId, setSelectedRoleId] = useState('')
  const [initialRoleId, setInitialRoleId] = useState('')

  const userId = user ? (user.userId || user.id) : ''

  const {
    data: fullUser,
    isLoading: loadingUser,
  } = useGetUserByIdQuery(userId, { skip: !userId })

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

  // Populate form fields when full user data loads
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

  // Derive the current role ID from the loaded user data and the roles list
  // Match by name (robust against stale IDs in userRoles list endpoint)
  useEffect(() => {
    if (roles.length === 0) return
    const source = fullUser ?? user
    if (!source) return

    const currentRoleName =
      source.userRoles?.[0]?.name ?? source.role ?? ''

    const matched = roles.find(
      (r) => r.name.toLowerCase() === currentRoleName.toLowerCase(),
    )
    const roleId = matched?.id ?? ''
    setSelectedRoleId(roleId)
    setInitialRoleId(roleId)
  }, [fullUser, user, roles])

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setImageFile(file)
    setImagePreview(file ? URL.createObjectURL(file) : null)
  }

  function handleClose() {
    setImageFile(null)
    setImagePreview(null)
    onClose()
  }

  async function onSubmit(values: EditUserFormValues) {
    if (!user) return

    const fd = new FormData()
    fd.append('Id', userId)
    fd.append('FirstName', values.firstName)
    fd.append('LastName', values.lastName)
    fd.append('Email', values.email)
    fd.append('PhoneNumber', values.phoneNumber)
    fd.append('Dob', values.dob)
    if (imageFile) {
      fd.append('Image', imageFile)
    } else {
      fd.append('Image', new Blob([], { type: 'image/jpeg' }), 'current.jpg')
    }

    try {
      // Update profile first
      await updateUser(fd).unwrap()

      // Then update role if it changed
      if (selectedRoleId !== initialRoleId) {
        if (initialRoleId) {
          await removeRole({ UserId: userId, RoleId: initialRoleId }).unwrap()
        }
        if (selectedRoleId) {
          await addRole({ UserId: userId, RoleId: selectedRoleId }).unwrap()
        }
        setInitialRoleId(selectedRoleId)
      }

      toast.success(t('common.successUpdated'))
      handleClose()
    } catch {
      toast.error(t('errors.somethingWrong'))
    }
  }

  const isSaving = saving || addingRole || removingRole
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
              <Input id="edit-dob" type="date" {...register('dob')} />
              {errors.dob && (
                <p className="text-xs text-destructive">{t(errors.dob.message ?? 'errors.required')}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>{t('users.role')}</Label>
              <Select
                value={selectedRoleId}
                onValueChange={setSelectedRoleId}
                disabled={loadingRoles}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('users.selectRole')} />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                {t('form.cancel')}
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {t('form.save')}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
