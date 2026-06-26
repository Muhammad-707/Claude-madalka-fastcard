import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Upload, Trash2 } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { getImageUrl } from '@/shared/lib/getImageUrl'
import type { ProductImage } from '@/shared/api/types'

interface ImageUploaderProps {
  newFiles: File[]
  onFilesChange: (files: File[]) => void
  existingImages?: ProductImage[]
  onDeleteExisting?: (imageId: number) => void
}

export function ImageUploader({
  newFiles,
  onFilesChange,
  existingImages = [],
  onDeleteExisting,
}: ImageUploaderProps) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFiles(files: FileList | null) {
    if (!files) return
    onFilesChange([...newFiles, ...Array.from(files)])
  }

  function removeNew(index: number) {
    onFilesChange(newFiles.filter((_, i) => i !== index))
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-3">
      <span className="text-sm font-medium">{t('products.images')}</span>

      <div
        className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <Upload className="w-6 h-6 text-muted-foreground" />
        <p className="text-sm text-center">
          <span className="text-primary font-medium">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-muted-foreground">SVG, JPG, PNG, or gif maximum 900×400</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {(existingImages.length > 0 || newFiles.length > 0) && (
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 px-3 py-2 bg-muted/30 text-xs text-muted-foreground font-medium">
            <span>{t('products.images')}</span>
            <span>File name</span>
            <span>{t('products.action')}</span>
          </div>

          {existingImages.map((img) => (
            <div
              key={img.id}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 px-3 py-2 border-t border-border"
            >
              <div className="w-10 h-10 rounded bg-muted overflow-hidden">
                <img
                  src={getImageUrl(img.imageName)}
                  alt={img.imageName}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm truncate">{img.imageName}</p>
              {onDeleteExisting && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => onDeleteExisting(img.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          ))}

          {newFiles.map((file, i) => (
            <div
              key={`new-${i}`}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 px-3 py-2 border-t border-border"
            >
              <div className="w-10 h-10 rounded bg-muted overflow-hidden">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm truncate">{file.name}</p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => removeNew(i)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
