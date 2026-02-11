interface OptionPillProps {
  label: string
  isSelected: boolean
  onClick: () => void
}

export function OptionPill({ label, isSelected, onClick }: OptionPillProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-sm text-xs font-medium uppercase tracking-wider
        transition-all duration-150
        ${isSelected
          ? 'bg-ash text-obsidian'
          : 'bg-obsidian text-ash/40 border border-ash/10 hover:border-ash/30'
        }
      `}
    >
      {label}
    </button>
  )
}
