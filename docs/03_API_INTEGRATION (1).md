# 03 — API Integration (полный Swagger)

**Base URL:** `https://store-api.softclub.tj` · **Swagger:** `/swagger/v1/swagger.json`
**Картинки:** `https://store-api.softclub.tj/images/{fileName}` — ⚠️ подтвердить путь на реальном файле. Хелпер `getImageUrl(name)`.
В админке почти всё — под токеном (🔒). Без `Authorization: Bearer <token>` приходит **401**.

## Envelope
Обычный: `{ data: T | null, errors: string[], statusCode: number }`
Пагинация: `{ pageNumber, pageSize, totalPage, totalRecord, data: T[], errors, statusCode }`
Всегда читать `errors[]`; ошибку показывать `toast.error(errors[0])`.
`GET /Product/get-products` может вернуть **204** = пусто (НЕ ошибка) → пустой массив.

## Account
| Метод | Путь | Тело |
|---|---|---|
| POST | `/Account/register` | `{ userName, phoneNumber, email, password, confirmPassword }` |
| POST | `/Account/login` | `{ userName, password }` → `data` = **JWT** |

JWT payload: `sid`, `name`, `email`, `role` (**`string[]`** — массив ролей, например `["SuperAdmin", "User"]`), `exp`, `iss`, `aud`. В админку пускать если `role.includes('Admin') || role.includes('SuperAdmin')`. Используй хелпер `hasAdminRole(role)` из `shared/lib/jwt.ts` (docs/06).

## Brand
| Метод | Путь | Параметры |
|---|---|---|
| GET | `/Brand/get-brands` | `BrandName?`, `BrandId?`, `PageNumber?`, `PageSize?` → paginated `{ id, brandName }` |
| GET | `/Brand/get-brand-by-id` | `id` |
| POST 🔒 | `/Brand/add-brand` | `BrandName` (query) |
| PUT 🔒 | `/Brand/update-brand` | `Id`, `BrandName` (query) |
| DELETE 🔒 | `/Brand/delete-brand` | `id` (query) |

## Category
| Метод | Путь | Параметры |
|---|---|---|
| GET | `/Category/get-categories` | → `{ id, categoryName, categoryImage, subCategories:[{id, subCategoryName}] }` |
| GET | `/Category/get-category-by-id` | `id` |
| POST 🔒 | `/Category/add-category` | multipart: `CategoryImage`(file), `CategoryName` |
| PUT 🔒 | `/Category/update-category` | multipart: `Id`, `CategoryImage`, `CategoryName` |
| DELETE 🔒 | `/Category/delete-category` | `id` (query) |

## SubCategory
| Метод | Путь | Параметры |
|---|---|---|
| GET | `/SubCategory/get-sub-category` | → `{ id, subCategoryName }` |
| GET | `/SubCategory/get-sub-category-by-id` | `id` |
| POST 🔒 | `/SubCategory/add-sub-category` | `CategoryId`, `SubCategoryName` (query) |
| PUT 🔒 | `/SubCategory/update-sub-category` | `Id`, `CategoryId`, `SubCategoryName` (query) |
| DELETE 🔒 | `/SubCategory/delete-sub-category` | `id` (query) |

## Color
| Метод | Путь | Параметры |
|---|---|---|
| GET | `/Color/get-colors` | `ColorName?`, `PageNumber?`, `PageSize?` → paginated `{ id, colorName }` |
| GET | `/Color/get-color-by-id` | `id` → `{ id, colorName }` |
| POST 🔒 | `/Color/add-color` | `ColorName` (query) |
| PUT 🔒 | `/Color/update-color` | `Id`, `ColorName` (query) |
| DELETE 🔒 | `/Color/delete-color` | `id` (query) |

## Product
| Метод | Путь | Параметры |
|---|---|---|
| GET | `/Product/get-products` | `UserId?`,`ProductName?`,`MinPrice?`,`MaxPrice?`,`BrandId?`,`ColorId?`,`CategoryId?`,`SubcategoryId?`,`PageNumber?`,`PageSize?` → paginated; **204=пусто** |
| GET | `/Product/get-product-by-id` | `id` (404 если нет) |
| POST 🔒 | `/Product/add-product` | multipart: `Images[]`,`BrandId`,`ColorId`,`ProductName`,`Description`,`Quantity`,`Weight`,`Size`,`Code`,`Price`,`HasDiscount`,`DiscountPrice`,`SubCategoryId` |
| PUT 🔒 | `/Product/update-product` | query: `Id`,`BrandId`,`ColorId`,`ProductName`,`Description`,`Quantity`,`Weight`,`Size`,`Code`,`Price`,`HasDiscount`,`DiscountPrice`,`SubCategoryId` |
| POST 🔒 | `/Product/add-image-to-product` | multipart: `ProductId`, `Files[]` |
| DELETE 🔒 | `/Product/delete-image-from-product` | `imageId` (query) |
| DELETE 🔒 | `/Product/delete-product` | `id` (query) |

## Cart 🔒 (для админки обычно не нужно, но есть)
`GET /Cart/get-products-from-cart`, `POST add-product-to-cart?id`, `PUT increase…?id`, `PUT reduce…?id`, `DELETE delete-product-from-cart?id`, `DELETE clear-cart`.

## UserProfile 🔒 (это «Orders» → пользователи)
| Метод | Путь | Параметры |
|---|---|---|
| GET | `/UserProfile/get-user-profiles` | `UserName?`, `PageNumber?`, `PageSize?` → paginated пользователи |
| GET | `/UserProfile/get-user-profile-by-id` | `id` |
| PUT | `/UserProfile/update-user-profile` | multipart: `Image`,`FirstName`,`LastName`,`Email`,`PhoneNumber`,`Dob` |
| DELETE | `/UserProfile/delete-user` | `id` (query) |
| POST | `/UserProfile/addrole-from-user` | `UserId`, `RoleId` (query) |
| DELETE | `/UserProfile/remove-role-from-user` | `UserId`, `RoleId` (query) |
| GET | `/UserProfile/get-user-roles` | список ролей |

---

## ⚠️ Что использовать для каждой страницы (важно)
- **Dashboard счётчики:** Products = `totalRecord` из get-products; Customers = `totalRecord` из get-user-profiles; Categories = длина get-categories; Brands = `totalRecord` из get-brands.
- **Orders** — API заказов НЕТ → страница работает на `get-user-profiles`.
- **Banners** — API НЕТ → только дизайн (заглушка/локальный стейт).
- **Sales/Cost/Profit** — нет → заменены (см. выше).
- Регистрация может вернуть 500 на дубликат — обработать.

## Типы → `shared/api/types.ts`
```ts
export interface ApiEnvelope<T> { data: T | null; errors: string[]; statusCode: number }
export interface Paginated<T> { pageNumber:number; pageSize:number; totalPage:number; totalRecord:number; data:T[]; errors:string[]; statusCode:number }
export interface Brand { id:number; brandName:string }
export interface Color { id:number; colorName:string }
export interface SubCategory { id:number; subCategoryName:string }
export interface Category { id:number; categoryName:string; categoryImage:string; subCategories:SubCategory[] }
export interface ProductImage { id:number; imageName:string }
export interface Product { id:number; productName:string; description:string; price:number; hasDiscount:boolean; discountPrice?:number; quantity:number; code:string; weight?:string; size?:string; brandId:number; brandName?:string; colorId:number; colorName?:string; subCategoryId:number; images:ProductImage[] }
export interface UserProfile { id:string; firstName:string; lastName:string; userName?:string; email:string; phoneNumber:string; dob:string; image?:string; role?:string }
export interface Role { id:string; name:string }
export interface LoginDto { userName:string; password:string }
```
> Точные имена полей `Product`/`UserProfile` сверить с реальными ответами. `any` запрещён.
