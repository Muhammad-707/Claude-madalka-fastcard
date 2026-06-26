import { useState, useEffect } from 'react'
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

  const { data: product, isLoading: productLoading } = useGetProductByIdQuery(productId, {
    skip: !productId,
  })
  const [updateProduct, { isLoading: saving }] = useUpdateProductMutation()
  const [addImage, { isLoading: addingImage }] = useAddImageToProductMutation()
  const [deleteImage] = useDeleteImageFromProductMutation()

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
      form.reset({
        productName: product.productName,
        code: product.code,
        description: product.description,
        categoryId: 0,
        subCategoryId: product.subCategoryId,
        brandId: product.brandId,
        colorId: product.colorId,
        quantity: product.quantity,
        price: product.price,
        hasDiscount: product.hasDiscount,
        discountPrice: product.discountPrice,
        weight: product.weight ?? '',
        size: product.size ?? '',
      })
    }
  }, [product, form])

  const selectedCategoryId = form.watch('categoryId')
  const hasDiscount = form.watch('hasDiscount')

  const { data: categories } = useGetCategoriesQuery()
  const { data: subCategories } = useGetSubCategoriesQuery(
    selectedCategoryId > 0 ? selectedCategoryId : undefined,
    { skip: !selectedCategoryId || selectedCategoryId === 0 },
  )
  const { data: brandsData } = useGetBrandsQuery({ PageSize: 100 })
  const brands = brandsData?.data ?? []

  async function onSubmit(values: ProductEditFormValues) {
    try {
      await updateProduct({
        Id: productId,
        ProductName: values.productName,
        Code: values.code,
        Description: values.description,
        BrandId: values.brandId,
        ColorId: values.colorId,
        SubCategoryId: values.subCategoryId,
        Quantity: values.quantity,
        Price: values.price,
        HasDiscount: values.hasDiscount,
        DiscountPrice: values.hasDiscount ? values.discountPrice : undefined,
        Weight: values.weight,
        Size: values.size,
      }).unwrap()

      for (const file of newImages) {
        const fd = new FormData()
        fd.append('ProductId', String(productId))
        fd.append('Image', file)
        await addImage(fd).unwrap()
      }

      toast.success(t('common.successUpdated'))
      navigate('/products')
    } catch {
      toast.error(t('errors.somethingWrong'))
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

  return {
    form,
    product,
    productLoading,
    saving: saving || addingImage,
    newImages,
    setNewImages,
    categories: categories ?? [],
    subCategories: subCategories ?? [],
    brands,
    hasDiscount,
    onSubmit,
    handleDeleteImage,
  }
}
