import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { useAddUserMutation, useGetRolesQuery, useAddRoleMutation, usersApi } from '@/shared/api/usersApi'
import { useAppDispatch } from '@/app/hooks'
import type { Paginated, UserProfile } from '@/shared/api/types'

const schema = z
  .object({
    userName: z.string().min(3, 'errors.required'),
    email: z.string().email('errors.invalidEmail'),
    phoneNumber: z.string().min(5, 'errors.required'),
    password: z.string().min(6, 'errors.required'),
    confirmPassword: z.string().min(1, 'errors.required'),
    roleId: z.string().min(1, 'errors.required'),
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
  const dispatch = useAppDispatch()
  const [addUser, { isLoading: registering }] = useAddUserMutation()
  const [addRole, { isLoading: assigningRole }] = useAddRoleMutation()
  const { data: roles = [], isLoading: loadingRoles } = useGetRolesQuery()

  const isLoading = registering || assigningRole

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<AddUserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      userName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      roleId: '',
    },
  })

  // Set the default role to "User" once the roles list loads
  useEffect(() => {
    if (roles.length > 0) {
      const userRole = roles.find((r) => r.name === 'User') ?? roles[0]
      setValue('roleId', userRole.id)
    }
  }, [roles, setValue])

  async function onSubmit(values: AddUserFormValues) {
    try {
      // Step 1: Register the new account
      await addUser({
        userName: values.userName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
        confirmPassword: values.confirmPassword,
      }).unwrap()

      // Step 2: Find the newly created user by username to get their ID
      let newUserId = ''
      try {
        const searchResult = await dispatch(
          usersApi.endpoints.getUsers.initiate(
            { UserName: values.userName, PageSize: 5 },
            { forceRefetch: true },
          ),
        )
        const page = searchResult.data as Paginated<UserProfile> | undefined
        const found = page?.data?.find(
          (u) => (u.userName ?? '').toLowerCase() === values.userName.toLowerCase(),
        )
        newUserId = found ? (found.userId || found.id) : ''
      } catch {
        // non-fatal: role assignment will be skipped
      }

      // Step 3: Assign the selected role
      if (newUserId && values.roleId) {
        await addRole({ UserId: newUserId, RoleId: values.roleId }).unwrap()
      }

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

          <div className="space-y-1.5">
            <Label>{t('users.role')}</Label>
            <Controller
              control={control}
              name="roleId"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
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
              )}
            />
            {errors.roleId && (
              <p className="text-xs text-destructive">{t(errors.roleId.message ?? 'errors.required')}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>
              {t('form.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading || loadingRoles}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t('form.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
