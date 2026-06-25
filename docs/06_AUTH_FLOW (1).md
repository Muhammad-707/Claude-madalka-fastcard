# 06 — Auth Flow (вход только для админа)

## Логин
`POST /Account/login` с `{ userName, password }` → `data` = JWT.
1. Декодировать `jwt-decode` → `sid`, `name`, `email`, `role`.
2. **Если `role !== 'Admin'`** → НЕ сохранять токен, показать `toast.error(t('auth.onlyAdmin'))`, остаться на `/login`. В админку пускаются только администраторы.
3. Если Admin → сохранить токен в `localStorage[access_token]`, записать `authSlice`, редирект на `/dashboard`.

```ts
interface JwtPayload { sid:string; name:string; email:string; role:'User'|'Admin'; exp:number; iss:string; aud:string }
```

> В макете поле подписано «Email», но Swagger принимает `userName`. Подписывать по макету, а в запрос класть значение как `userName` (либо переименовать лейбл — согласовать). Пароль — с eye-toggle.

## Сессия
На старте: прочитать токен, проверить `exp` и `role === 'Admin'`; иначе очистить и считать неавторизованным (отправить на `/login`).

## Logout
Удалить токен, очистить `authSlice`, редирект `/login`.

## 401
Перехват в baseApi (docs/07): очистить токен + редирект `/login`.

## ProtectedRoute
Весь AdminLayout под `<ProtectedRoute adminOnly>`: нет токена/не админ → `Navigate` на `/login`. Авторизованного админа со страницы `/login` редиректить на `/dashboard`.

| Роут | Доступ |
|---|---|
| `/login` | только гость |
| `/dashboard`, `/users`, `/products`, `/products/create`, `/products/:id/edit`, `/categories`, `/brands`, `/banners` | только Admin |
