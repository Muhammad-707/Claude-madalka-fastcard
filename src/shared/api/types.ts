export interface ApiEnvelope<T> {
  data: T | null
  errors: string[]
  statusCode: number
}

export interface Paginated<T> {
  pageNumber: number
  pageSize: number
  totalPage: number
  totalRecord: number
  data: T[]
  errors: string[]
  statusCode: number
}

export interface Brand {
  id: number
  brandName: string
}

export interface Color {
  id: number
  colorName: string
}

export interface SubCategory {
  id: number
  subCategoryName: string
}

export interface Category {
  id: number
  categoryName: string
  categoryImage: string
  subCategories: SubCategory[]
}

export interface ProductImage {
  id: number
  imageName?: string
  images?: string // Exact field name from /Product/get-product-by-id
}

// Matches the actual /Product/get-products list response (data.products[])
export interface Product {
  id: number
  productName: string
  // from list endpoint
  image?: string
  categoryId?: number
  categoryName?: string
  productInMyCart?: boolean
  productInfoFromCart?: null
  // common
  price: number
  hasDiscount: boolean
  discountPrice?: number
  quantity: number
  // from get-product-by-id single endpoint
  description?: string
  code?: string
  weight?: string
  size?: string
  brand?: string // API returns "Lenovo" not brandId
  color?: string // API returns "red" not colorId
  subCategoryId?: number
  images?: ProductImage[]
}

export interface UserRole {
  id: string
  name: string
}

// Matches actual /UserProfile/get-user-profiles response
export interface UserProfile {
  id: string
  userId: string
  userName?: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  dob: string
  image?: string
  role?: string
  userRoles: UserRole[]
}

export interface Role {
  id: string
  name: string
}

export interface LoginDto {
  userName: string
  password: string
}

export interface RegisterDto {
  userName: string
  phoneNumber: string
  email: string
  password: string
  confirmPassword: string
}

export interface ProductFilters {
  UserId?: string
  ProductName?: string
  MinPrice?: number
  MaxPrice?: number
  BrandId?: number
  ColorId?: number
  CategoryId?: number
  SubcategoryId?: number
  PageNumber?: number
  PageSize?: number
}

export interface BrandFilters {
  BrandName?: string
  BrandId?: number
  PageNumber?: number
  PageSize?: number
}

export interface UserFilters {
  UserName?: string
  PageNumber?: number
  PageSize?: number
}

export interface ColorFilters {
  ColorName?: string
  PageNumber?: number
  PageSize?: number
}

export interface UpdateProductParams {
  Id: number
  BrandId: number
  ColorId: number
  ProductName: string
  Description: string
  Quantity: number
  Weight?: string
  Size?: string
  Code: string
  Price: number
  HasDiscount: boolean
  DiscountPrice?: number
  SubCategoryId: number
}

export interface AddRoleParams {
  UserId: string
  RoleId: string
}
