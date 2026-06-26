import { useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Upload, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { useUpdateCategoryMutation } from '@/shared/api/categoriesApi'
import type { Category } from '@/shared/api/types'

interface EditCategoryDialogProps {
  category: Category | null
  onClose: () => void
}

export function EditCategoryDialog({ category, onClose }: EditCategoryDialogProps) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation()

  useEffect(() => {
    if (category) setName(category.categoryName)
  }, [category])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!category || !name.trim()) return
    const fd = new FormData()
    fd.append('Id', String(category.id))
    fd.append('CategoryName', name.trim())
    if (file) fd.append('CategoryImage', file)
    try {
      await updateCategory(fd).unwrap()
      toast.success(t('common.successUpdated'))
      onClose()
    } catch {
      toast.error(t('errors.somethingWrong'))
    }
  }

  return (
    <Dialog open={!!category} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('category.editCategory')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-cat-name">{t('category.categoryName')}</Label>
            <Input
              id="edit-cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div
            className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => inputRef.current?.click()}
            onDrop={(e) => { e.preventDefault(); setFile(e.dataTransfer.files[0] ?? null) }}
            onDragOver={(e) => e.preventDefault()}
          >
            {file ? (
              <p className="text-sm font-medium text-primary">{file.name}</p>
            ) : (
              <>
                <Upload className="w-5 h-5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Click to replace image</p>
              </>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('form.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t('form.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
