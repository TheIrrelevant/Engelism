import type { ReactNode } from 'react'

interface InfoBoxProps {
  children: ReactNode
}

export function InfoBox({ children }: InfoBoxProps) {
  return (
    <div className="border border-ash/10 rounded-default px-3 py-2 text-xs text-ash/50 leading-relaxed">
      {children}
    </div>
  )
}
