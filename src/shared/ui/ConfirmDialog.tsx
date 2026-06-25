import { useTranslation } from 'react-i18next'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  onConfirm: () => void
  loading?: boolean
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  loading = false,
}: ConfirmDialogProps) {
  const { t } = useTranslation()
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title ?? t('common.confirmDelete')}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{t('common.no')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? '...' : t('common.yes')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
