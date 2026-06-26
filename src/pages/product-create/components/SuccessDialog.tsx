import { useTranslation } from 'react-i18next'
import { CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'

interface SuccessDialogProps {
  open: boolean
  onAddNew: () => void
}

export function SuccessDialog({ open, onAddNew }: SuccessDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-sm text-center" onInteractOutside={(e) => e.preventDefault()}>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="rounded-full bg-primary/10 p-4">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold">{t('products.successAdded')}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {t('common.successAdded')}
            </p>
          </div>
          <div className="flex gap-3 mt-2">
            <Button variant="outline" asChild>
              <Link to="/products">{t('products.title')}</Link>
            </Button>
            <Button onClick={onAddNew} className="gap-1">
              <span>+</span> {t('products.addNew2')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
