import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home } from 'lucide-react'
import { Button } from '@/shared/ui/button'

export default function NotFoundPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4 px-4">
        <h1 className="text-8xl font-bold text-primary/20">404</h1>
        <h2 className="text-2xl font-bold text-foreground">{t('errors.notFound')}</h2>
        <p className="text-muted-foreground">
          Запрашиваемая страница не существует или была перемещена.
        </p>
        <Button onClick={() => navigate('/dashboard')} className="mt-4 gap-2">
          <Home className="h-4 w-4" />
          {t('common.goHome')}
        </Button>
      </div>
    </div>
  )
}
