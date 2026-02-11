interface SelectCardProps {
  label: string
  description?: string
  isSelected: boolean
  onClick: () => void
}

export function SelectCard({ label, description, isSelected, onClick }: SelectCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left px-3 py-2.5 rounded-default text-sm
        transition-all duration-150
        ${isSelected
          ? 'bg-ash text-obsidian'
          : 'bg-obsidian text-ash/60 border border-ash/10 hover:border-ash/30 hover:text-bone'
        }
      `}
    >
      <span className="font-medium block">{label}</span>
      {description && (
        <span className={`text-xs block mt-0.5 ${isSelected ? 'text-obsidian/60' : 'text-ash/30'}`}>
          {description}
        </span>
      )}
    </button>
  )
}
