import { useCallback, useState } from 'react'
import type { DragEvent, ChangeEvent } from 'react'

interface ImageUploadProps {
  onUpload: (file: File) => void
  preview: string | null
  onClear: () => void
}

export function ImageUpload({ onUpload, preview, onClear }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      onUpload(file)
    }
  }, [onUpload])

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleFileInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUpload(file)
    }
  }, [onUpload])

  // Preview state
  if (preview) {
    return (
      <div className="relative group">
        <img
          src={preview}
          alt="Reference"
          className="w-full h-full object-contain rounded-card"
        />
        <button
          onClick={onClear}
          className="
            absolute top-3 right-3 w-8 h-8 rounded-full
            bg-obsidian/80 text-bone text-sm font-bold
            opacity-0 group-hover:opacity-100
            transition-opacity duration-150
            flex items-center justify-center
            hover:bg-obsidian
          "
        >
          ✕
        </button>
      </div>
    )
  }

  // Upload state
  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        border-2 border-dashed rounded-card p-12
        flex flex-col items-center justify-center
        cursor-pointer transition-all duration-200
        h-full min-h-[300px]
        ${isDragging
          ? 'border-ash/60 bg-ash/5'
          : 'border-ash/15 hover:border-ash/30'
        }
      `}
    >
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInput}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload" className="cursor-pointer text-center">
        <div className="text-ash/30 text-4xl mb-4">+</div>
        <p className="text-ash/50 text-sm mb-1">
          {isDragging ? 'Drop image here' : 'Drag & drop or click to upload'}
        </p>
        <p className="text-ash/30 text-xs">JPG, PNG, WebP</p>
      </label>
    </div>
  )
}
