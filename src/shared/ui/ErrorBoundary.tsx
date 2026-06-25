import { Component, type ErrorInfo, type ReactNode } from 'react'
import { RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-center space-y-4 p-8">
            <h1 className="text-2xl font-bold text-foreground">Что-то пошло не так</h1>
            <p className="text-muted-foreground text-sm max-w-md">
              {this.state.error?.message ?? 'Неизвестная ошибка'}
            </p>
            <button
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4" />
              Обновить
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
