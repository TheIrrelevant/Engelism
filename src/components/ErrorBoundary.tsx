import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[Engelism] Error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="border border-ash/20 rounded-card p-8 text-center">
          <h2 className="font-warbler text-2xl text-bone mb-2">Something went wrong</h2>
          <p className="text-ash/60 text-sm mb-4">{this.state.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, message: '' })}
            className="px-6 py-2 rounded-default text-sm font-bold uppercase tracking-wider bg-ash text-obsidian hover:opacity-90 transition-all duration-150"
          >
            Try Again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
