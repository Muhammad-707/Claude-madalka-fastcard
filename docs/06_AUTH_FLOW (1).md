# 06 — Auth Flow (вход только для админа)

## Логин
`POST /Account/login` с `{ userName, password }` → `data` = JWT.
1. Декодировать `jwt-decode` → `sid`, `name`, `email`, `role`.
2. **`role` — массив строк** (`string[]`), например `["SuperAdmin", "User"]`. Допустимые роли-администраторов: `'Admin'` и `'SuperAdmin'`.
3. **Если `!hasAdminRole(payload.role)`** → НЕ сохранять токен, показать `toast.error(t('auth.onlyAdmin'))`, остаться на `/login`.
4. Если Admin/SuperAdmin → сохранить токен в `localStorage[access_token]`, записать `authSlice`, редирект на `/dashboard`.

```ts
interface JwtPayload { sid:string; name:string; email:string; role:string[]; exp:number; iss:string; aud:string }

// Хелпер в shared/lib/jwt.ts:
function hasAdminRole(role: string[]): boolean {
  return role.includes('Admin') || role.includes('SuperAdmin')
}
```

> В макете поле подписано «Email», но Swagger принимает `userName`. Подписывать по макету, а в запрос класть значение как `userName`. Пароль — с eye-toggle.

## Сессия
На старте: прочитать токен, проверить `exp` и `hasAdminRole(payload.role)`; иначе очистить и считать неавторизованным (отправить на `/login`).

## Logout
Удалить токен, очистить `authSlice`, редирект `/login`.

## 401
Перехват в baseApi (docs/07): очистить токен + редирект `/login`.

## ProtectedRoute
Весь AdminLayout под `<ProtectedRoute adminOnly>`: нет токена/не Admin или SuperAdmin → `Navigate` на `/login`. Авторизованного админа со страницы `/login` редиректить на `/dashboard`.

| Роут | Доступ |
|---|---|
| `/login` | только гость |
| `/dashboard`, `/users`, `/products`, `/products/create`, `/products/:id/edit`, `/categories`, `/brands`, `/banners` | только Admin или SuperAdmin |
