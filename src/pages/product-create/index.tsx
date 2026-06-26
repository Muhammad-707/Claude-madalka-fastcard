import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Controller } from 'react-hook-form'
import { useProductCreate } from './hooks/useProductCreate'
import { ColorSelector } from './components/ColorSelector'
import { ImageUploader } from './components/ImageUploader'
import { SuccessDialog } from './components/SuccessDialog'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import { Switch } from '@/shared/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'

export default function ProductCreatePage() {
  const { t } = useTranslation()
  const {
    form,
    isLoading,
    images,
    setImages,
    showSuccess,
    categories,
    subCategories,
    brands,
    hasDiscount,
    onSubmit,
    handleAddNew,
  } = useProductCreate()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = form

  const colorId = watch('colorId')

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/products" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            {t('products.title')}
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">{t('products.addNew2')}</span>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to="/products">{t('form.cancel')}</Link>
          </Button>
          <Button
            form="product-form"
            type="submit"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t('products.saveProduct')}
          </Button>
        </div>
      </div>

      <form id="product-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — main info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="productName">{t('form.name')}</Label>
                  <Input id="productName" placeholder="Product name" {...register('productName')} />
                  {errors.productName && (
                    <p className="text-xs text-destructive">{t(errors.productName.message ?? 'errors.required')}</p>
                  )}
                </div>
                <div className="space-y-1.5 sm:w-32">
                  <Label htmlFor="code">{t('products.code')}</Label>
                  <Input id="code" placeholder="Code" {...register('code')} />
                  {errors.code && (
                    <p className="text-xs text-destructive">{t(errors.code.message ?? 'errors.required')}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">{t('products.description')}</Label>
                <Textarea
                  id="description"
                  placeholder="Description"
                  rows={4}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-xs text-destructive">{t(errors.description.message ?? 'errors.required')}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>{t('form.category')}</Label>
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value > 0 ? String(field.value) : ''}
                        onValueChange={(v) => {
                          field.onChange(Number(v))
                          setValue('subCategoryId', 0)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.categoryName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.categoryId && (
                    <p className="text-xs text-destructive">{t('errors.required')}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label>{t('form.subCategory')}</Label>
                  <Controller
                    name="subCategoryId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value > 0 ? String(field.value) : ''}
                        onValueChange={(v) => field.onChange(Number(v))}
                        disabled={subCategories.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sub category" />
                        </SelectTrigger>
                        <SelectContent>
                          {subCategories.map((sc) => (
                            <SelectItem key={sc.id} value={String(sc.id)}>
                              {sc.subCategoryName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.subCategoryId && (
                    <p className="text-xs text-destructive">{t('errors.required')}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label>{t('form.brand')}</Label>
                  <Controller
                    name="brandId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value > 0 ? String(field.value) : ''}
                        onValueChange={(v) => field.onChange(Number(v))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Brands" />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.map((b) => (
                            <SelectItem key={b.id} value={String(b.id)}>
                              {b.brandName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.brandId && (
                    <p className="text-xs text-destructive">{t('errors.required')}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="bg-card border rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {t('products.price')}
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="price">{t('products.price')}</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register('price')}
                  />
                  {errors.price && (
                    <p className="text-xs text-destructive">{t('errors.required')}</p>
                  )}
                </div>

                {hasDiscount && (
                  <div className="space-y-1.5">
                    <Label htmlFor="discountPrice">{t('products.discountPrice')}</Label>
                    <Input
                      id="discountPrice"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...register('discountPrice')}
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="quantity">{t('products.quantity')}</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="0"
                    {...register('quantity')}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="weight">{t('products.weight')}</Label>
                  <Input id="weight" placeholder="e.g. 200g" {...register('weight')} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="size">{t('products.size')}</Label>
                  <Input id="size" placeholder="e.g. M / 42" {...register('size')} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Controller
                  name="hasDiscount"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="hasDiscount"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="hasDiscount">{t('products.hasDiscount')}</Label>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            <div className="bg-card border rounded-xl p-5">
              <Controller
                name="colorId"
                control={control}
                render={({ field }) => (
                  <ColorSelector
                    value={colorId > 0 ? colorId : null}
                    onChange={(id) => field.onChange(id)}
                  />
                )}
              />
              {errors.colorId && (
                <p className="text-xs text-destructive mt-1">{t('errors.required')}</p>
              )}
            </div>

            <div className="bg-card border rounded-xl p-5">
              <ImageUploader newFiles={images} onFilesChange={setImages} />
            </div>
          </div>
        </div>
      </form>

      <SuccessDialog open={showSuccess} onAddNew={handleAddNew} />
    </div>
  )
}
