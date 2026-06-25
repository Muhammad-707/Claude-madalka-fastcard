import { WifiOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/button'

interface NetworkErrorProps {
  onRetry?: () => void
  message?: string
}

export function NetworkError({ onRetry, message }: NetworkErrorProps) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <WifiOff className="h-12 w-12 text-destructive/50 mb-4" strokeWidth={1.5} />
      <h3 className="text-base font-semibold text-foreground mb-1">
        {t('errors.network')}
      </h3>
      {message && (
        <p className="text-sm text-muted-foreground max-w-xs mb-4">{message}</p>
      )}
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
          {t('common.retry')}
        </Button>
      )}
    </div>
  )
}
