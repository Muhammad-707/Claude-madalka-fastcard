# 11 — System Components

Реализовать ВСЕ до контентных страниц. На базе shadcn где возможно. Без макета (системные).

## ErrorBoundary
Глобальный (оборачивает приложение в `app`) + лёгкий page-level. «Что-то пошло не так» + кнопка «обновить». Тексты через `t()`.

## ProtectedRoute (adminOnly)
```tsx
function ProtectedRoute() {
  const isAdmin = useAppSelector(selectIsAdmin)  // токен валиден И role==='Admin'
  const location = useLocation()
  if (!isAdmin) return <Navigate to="/login" state={{ from: location }} replace />
  return <Outlet />
}
```
Оборачивает весь AdminLayout. Авторизованного админа с `/login` редиректить на `/dashboard`.

## PageLoader
Полноэкранный спиннер — `Suspense fallback` для всех lazy-роутов.

## NotFoundPage (404)
«404 Not Found» + кнопка на `/dashboard`. Роут `*`.

## EmptyState
Иконка + заголовок + подпись + (опц.) действие. Для пустых таблиц (нет пользователей, 204 у товаров, нет категорий/брендов). Использовать макетные empty-состояния («No Orders Yet», «Add new products») где есть.

## NetworkError
При `isError` от RTK Query: иконка + «Ошибка сети» + кнопка «Повторить» (`refetch`).

## ConfirmDialog
shadcn `alert-dialog`. Обязателен перед КАЖДЫМ delete (товар, пользователь, категория, бренд, bulk-delete). Promise-обёртка или контролируемый стейт.

## Toaster
`<Toaster/>` (sonner) в `app/providers`. Все успехи/ошибки — через `toast`. Ошибка API — `errors[0]`.

### Чек-лист
- [ ] ErrorBoundary глобальный
- [ ] ProtectedRoute(adminOnly) на AdminLayout
- [ ] PageLoader на lazy-роутах
- [ ] NotFoundPage на `*`
- [ ] EmptyState (users/products/categories/brands)
- [ ] NetworkError при ошибке запроса
- [ ] ConfirmDialog перед каждым delete (вкл. bulk)
- [ ] Toaster подключён
