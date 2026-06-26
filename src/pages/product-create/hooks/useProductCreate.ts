import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useAddProductMutation } from '@/shared/api/productsApi'
import { useGetCategoriesQuery, useGetSubCategoriesQuery } from '@/shared/api/categoriesApi'
import { useGetBrandsQuery } from '@/shared/api/brandsApi'

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

export type ProductFormValues = z.infer<typeof schema>

export function useProductCreate() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [addProduct, { isLoading }] = useAddProductMutation()
  const [images, setImages] = useState<File[]>([])
  const [showSuccess, setShowSuccess] = useState(false)

  const form = useForm<ProductFormValues>({
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

  const selectedCategoryId = form.watch('categoryId')
  const hasDiscount = form.watch('hasDiscount')

  const { data: categories } = useGetCategoriesQuery()
  const { data: subCategories } = useGetSubCategoriesQuery(
    selectedCategoryId > 0 ? selectedCategoryId : undefined,
    { skip: !selectedCategoryId || selectedCategoryId === 0 },
  )
  const { data: brandsData } = useGetBrandsQuery({ PageSize: 100 })

  const brands = brandsData?.data ?? []

  async function onSubmit(values: ProductFormValues) {
    const fd = new FormData()
    fd.append('ProductName', values.productName)
    fd.append('Code', values.code)
    fd.append('Description', values.description)
    fd.append('BrandId', String(values.brandId))
    fd.append('ColorId', String(values.colorId))
    fd.append('SubCategoryId', String(values.subCategoryId))
    fd.append('Quantity', String(values.quantity))
    fd.append('Price', String(values.price))
    fd.append('HasDiscount', String(values.hasDiscount))
    if (values.hasDiscount && values.discountPrice) {
      fd.append('DiscountPrice', String(values.discountPrice))
    }
    if (values.weight) fd.append('Weight', values.weight)
    if (values.size) fd.append('Size', values.size)
    images.forEach((file) => fd.append('Images', file))

    try {
      await addProduct(fd).unwrap()
      setShowSuccess(true)
    } catch {
      toast.error(t('errors.somethingWrong'))
    }
  }

  function handleAddNew() {
    setShowSuccess(false)
    form.reset()
    setImages([])
  }

  function handleGoToProducts() {
    navigate('/products')
  }

  return {
    form,
    isLoading,
    images,
    setImages,
    showSuccess,
    setShowSuccess,
    categories: categories ?? [],
    subCategories: subCategories ?? [],
    brands,
    hasDiscount,
    onSubmit,
    handleAddNew,
    handleGoToProducts,
  }
}
