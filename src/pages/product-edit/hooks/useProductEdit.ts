import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useAddImageToProductMutation,
  useDeleteImageFromProductMutation,
} from '@/shared/api/productsApi'
import { useGetCategoriesQuery, useGetSubCategoriesQuery } from '@/shared/api/categoriesApi'
import { useGetBrandsQuery } from '@/shared/api/brandsApi'
import { useGetColorsQuery } from '@/shared/api/colorsApi'

const schema = z.object({
  productName: z.string().min(1, 'errors.required'),
  code: z.string().min(1, 'errors.required'),
  description: z.string().min(1, 'errors.required'),
  categoryId: z.coerce.number().min(1, 'errors.required'),
  subCategoryId: z.coerce.number().min(1, 'errors.required'),
  brandId: z.coerce.number().min(1, 'errors.required'),
  colorId: z.coerce.number().min(1, 'errors.required'),
  quantity: z.coerce.number().min(0),
  price: z.coerce.number().min(0.01, 'errors.required'),
  hasDiscount: z.boolean(),
  discountPrice: z.coerce.number().optional(),
  weight: z.string().optional(),
  size: z.string().optional(),
})

export type ProductEditFormValues = z.infer<typeof schema>

export function useProductEdit() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const productId = Number(id)

  const [newImages, setNewImages] = useState<File[]>([])
  const [initialized, setInitialized] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const initializedRef = useRef(false)

  const { data: product, isLoading: productLoading } = useGetProductByIdQuery(productId, {
    skip: !productId,
  })
  const [updateProduct] = useUpdateProductMutation()
  const [addImage, { isLoading: addingImage }] = useAddImageToProductMutation()
  const [deleteImage] = useDeleteImageFromProductMutation()

  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery()
  const { data: brandsData, isLoading: brandsLoading } = useGetBrandsQuery({ PageSize: 100 })
  const { data: colorsData, isLoading: colorsLoading } = useGetColorsQuery({ PageSize: 100 })

  const brands = brandsData?.data ?? []
  const colors = colorsData?.data ?? []

  const form = useForm<ProductEditFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      productName: '',
      code: '',
      description: '',
      categoryId: 0,
      subCategoryId: 0,
      brandId: 0,
      colorId: 0,
      quantity: 0,
      price: 0,
      hasDiscount: false,
      discountPrice: undefined,
      weight: '',
      size: '',
    },
  })

  useEffect(() => {
    if (product) {
      console.log('[DEBUG GET Product]', JSON.stringify(product, null, 2))
    }
  }, [product])

  // Wait for all dependent data before computing IDs and populating the form.
  // Using a ref to avoid double-init in React Strict Mode without blocking re-init on product change.
  useEffect(() => {
    if (!product || categoriesLoading || brandsLoading || colorsLoading) return

    // 1. Map color string to colorId
    const matchedColor = colors.find(
      (c) => c.colorName.toLowerCase() === product.color?.toLowerCase()
    )
    const finalColorId = matchedColor?.id ?? 0

    // 2. Map brand string to brandId
    const matchedBrand = brands.find(
      (b) => b.brandName.toLowerCase() === product.brand?.toLowerCase()
    )
    const finalBrandId = matchedBrand?.id ?? 0

    // 3. Derive categoryId from subCategoryId via embedded subCategories
    const subCatId = product.subCategoryId ?? 0
    let finalCategoryId = 0
    if (subCatId && categories?.length) {
      const matchedCat = categories.find((cat) =>
        cat.subCategories.some((sc) => sc.id === subCatId)
      )
      if (matchedCat) finalCategoryId = matchedCat.id
    }

    form.reset({
      productName: product.productName ?? '',
      code: product.code ?? '',
      description: product.description ?? '',
      categoryId: finalCategoryId,
      subCategoryId: subCatId,
      brandId: finalBrandId,
      colorId: finalColorId,
      quantity: product.quantity ?? 0,
      price: product.price ?? 0,
      hasDiscount: product.hasDiscount ?? false,
      discountPrice: product.discountPrice,
      weight: product.weight ?? '',
      size: product.size ?? '',
    })

    if (!initializedRef.current) {
      initializedRef.current = true
      setInitialized(true)
    }
  }, [product, categories, categoriesLoading, brands, brandsLoading, colors, colorsLoading, form])

  const selectedCategoryId = form.watch('categoryId')
  const hasDiscount = form.watch('hasDiscount')

  // Subcategory select options via dedicated endpoint (more reliable than embedded data).
  const { data: subCategoriesData } = useGetSubCategoriesQuery(selectedCategoryId, {
    skip: selectedCategoryId === 0,
  })
  const subCategories = subCategoriesData ?? []

  async function onSubmit(values: ProductEditFormValues) {
    const originalCode = product?.code ?? ''
    const codeChanged = values.code !== originalCode

    // Fields shared by every PUT request; Code is added per-call.
    const baseParams = {
      Id: productId,
      ProductName: values.productName,
      Description: values.description,
      BrandId: values.brandId,
      ColorId: values.colorId,
      SubCategoryId: values.subCategoryId,
      Quantity: values.quantity,
      Price: values.price,
      HasDiscount: values.hasDiscount,
      DiscountPrice: values.hasDiscount ? values.discountPrice : undefined,
      Weight: values.weight || undefined,
      Size: values.size || undefined,
    }

    setIsSaving(true)
    try {
      if (codeChanged) {
        // User typed a new code → single PUT; backend checks uniqueness only against
        // other products, so a genuinely new code won't collide.
        await updateProduct({ ...baseParams, Code: values.code }).unwrap()
      } else {
        // Code unchanged: backend bug — it counts the product itself as a duplicate.
        // Workaround: swap to a guaranteed-unique tempCode (step 1), then restore the
        // original code (step 2). At step-2 time, the product no longer holds
        // originalCode so the uniqueness check passes.
        const suffix = `-tmp${Date.now()}`
        const tempCode = `${originalCode.slice(0, 50 - suffix.length)}${suffix}`

        // Step 1 — save everything with tempCode
        await updateProduct({ ...baseParams, Code: tempCode }).unwrap()

        // Step 2 — restore original code
        try {
          await updateProduct({ ...baseParams, Code: originalCode }).unwrap()
        } catch (step2Err) {
          // Step 1 succeeded (data saved) but step 2 failed (original code not restored).
          // Leave the user on the edit page so they can retry immediately.
          console.error('[DEBUG PUT Step2 Error]', JSON.stringify(step2Err, null, 2))
          toast.warning(
            `Данные сохранены, но код товара временно изменён на «${tempCode}». Нажмите «Сохранить» ещё раз, чтобы восстановить исходный код.`
          )
          return
        }
      }

      // Upload any newly-added images only after all PUT steps succeed.
      for (const file of newImages) {
        const fd = new FormData()
        fd.append('ProductId', String(productId))
        fd.append('Files', file)
        await addImage(fd).unwrap()
      }

      toast.success(t('common.successUpdated'))
      navigate('/products')
    } catch (err) {
      const errMsg =
        (err as { data?: { errors?: string[] } })?.data?.errors?.[0] ??
        t('errors.somethingWrong')
      console.error('[DEBUG PUT Error]', JSON.stringify(err, null, 2))
      toast.error(errMsg)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteImage(imageId: number) {
    try {
      await deleteImage(imageId).unwrap()
      toast.success(t('common.successDeleted'))
    } catch {
      toast.error(t('errors.somethingWrong'))
    }
  }

  // Normalize product images (API returns 'images' instead of 'imageName')
  const normalizedImages = (product?.images ?? []).map((img) => ({
    id: img.id,
    imageName: img.images ?? img.imageName ?? '',
  }))

  return {
    form,
    product,
    productLoading,
    initialized,
    saving: isSaving || addingImage,
    newImages,
    setNewImages,
    categories: categories ?? [],
    subCategories,
    brands,
    hasDiscount,
    onSubmit,
    handleDeleteImage,
    normalizedImages,
  }
}
