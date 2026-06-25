# ROADMAP — Fastcart Admin

> `start` читает этот файл сверху вниз и берёт **первый невыполненный** шаг.
> `stop` ставит `[x]`, пишет чекпоинт в `CLAUDE.md`, лог в `.claude/sessions/`, делает git commit+push.
> Детали каждого шага — в соответствующем `docs/*.md`.

**Легенда:** `[ ]` todo · `[~]` в работе · `[x]` готово · `[!]` блокер

## Поток работы (диаграмма)

```mermaid
flowchart LR
  A[start] --> B[Прочитать CLAUDE.md + чекпоинт + docs]
  B --> C[Найти первый невыполненный шаг ROADMAP]
  C --> D[Открыть макет в design-export/]
  D --> E[Сверстать на shadcn/ui по макету]
  E --> F[Подключить RTK Query из Swagger]
  F --> G[loading/empty/error + i18n + адаптив]
  G --> H[type-check + lint]
  H --> I{Готово?}
  I -- да --> J[Отметить шаг [x]]
  I -- нет --> E
  J --> K[stop: чекпоинт + git add/commit/push]
```

---

## Фаза 1 — Фундамент
- [x] Зависимости (docs/02), alias `@/`, `.env` / `.env.example`, `.gitignore`
- [x] Tailwind + CSS-переменные тем (синяя админ-палитра, docs/04) + шрифты
- [x] shadcn init + базовые компоненты (button, input, table, dialog, sheet, dropdown, select, checkbox, badge, skeleton, sonner, tabs, switch, form, avatar, pagination)
- [x] `shared/api/baseApi.ts` (RTK Query, prepareHeaders, 401) + `shared/api/types.ts` (docs/03, docs/07)
- [x] `shared/lib`: `getImageUrl`, `jwt`, форматтеры

## Фаза 2 — App-каркас
- [ ] Redux store + RTK Query middleware + hooks (docs/07)
- [ ] i18n + словари ru/en/tj (docs/05)
- [ ] Провайдеры (Redux, Theme, i18n, Router) в `app/providers`
- [ ] Роутер + lazy + `<Suspense>` + глобальный `<ErrorBoundary>` (docs/11)

## Фаза 3 — Системные компоненты (ДО страниц)
- [ ] ErrorBoundary, PageLoader, NotFoundPage(404), EmptyState, NetworkError, ConfirmDialog, ProtectedRoute(adminOnly), Toaster (docs/11)

## Фаза 4 — Auth + Layout
- [ ] authApi (login) + authSlice + jwt-decode + проверка `role === 'Admin'` (docs/06)
- [ ] Страница `/login` по макету `design-export` (split, eye-toggle, only admin)
- [ ] `widgets/Sidebar` + `widgets/Header` (Topbar) + LangSwitcher + ThemeToggle (docs/04)
- [ ] AdminLayout (Sidebar+Header+Outlet) для всех роутов кроме `/login`; ProtectedRoute подключён

## Фаза 5 — Dashboard
- [ ] productsApi, usersApi, categoriesApi, brandsApi, colorsApi (RTK Query)
- [ ] 3 карточки (Products / Customers / Categories+Brands) — кликабельные
- [ ] График recharts по товарам, переключается карточками
- [ ] Top selling products (4–5 + See all → /products)
- [ ] Recent Customers (username/email/role)
- [ ] Top Products by Units Sold (скролл, невидимый скроллбар)

## Фаза 6 — Users (Orders)
- [ ] Таблица пользователей (get-user-profiles) + пагинация + поиск + фильтр (роль)
- [ ] Чекбоксы строк + bulk-delete + ConfirmDialog
- [ ] Add / Edit / Delete пользователя через модалки
- [ ] Роли: get-user-roles, addrole/remove-role (если нужно)

## Фаза 7 — Products
- [ ] Список товаров (таблица по макету) + поиск/фильтр/пагинация
- [ ] Страница `/products/create` (форма add-product: images, brand, color, name, desc, qty, weight, size, code, price, hasDiscount, discountPrice, subCategory)
- [ ] Страница `/products/:id/edit` (update-product + add/delete image)
- [ ] Модалки: Successfully add, Delete product, New color (add-color), Option — из макета
- [ ] Выбор/добавление цвета и подкатегории внутри формы

## Фаза 8 — Other
- [ ] `/categories` — список (get-categories) + add/edit/delete (multipart image) через модалки
- [ ] `/brands` — список (get-brands) + add/edit/delete через модалки
- [ ] `/banners` — дизайн по макету (в Swagger нет API баннеров → static; появится — добавить)
- [ ] Подкатегории — CRUD (нужны для товаров): get/add/update/delete

## Фаза 9 — Полировка
- [ ] Скелетоны/лоадеры везде, тосты на каждое действие
- [ ] Полный mobile-проход (Sidebar drawer, таблицы → карточки)
- [ ] A11y, иконки/изображения, единый стиль; `type-check` + `lint` + `build`
- [ ] Проверка dark/light на всех экранах

## Блокеры / открытые вопросы
- [!] **Orders** — нет API → страница «Orders» наполняется пользователями.
- [!] **Banners** — нет API → только дизайн.
- [!] **Sales/Cost/Profit** на дашборде — нет API → заменены на Products / Customers / Categories+Brands.
- [?] Путь к картинкам (`/images/{file}`?) — подтвердить на реальном файле.
- [?] «in/out stock» чекбокс для Users — у пользователей нет stock; используем фильтр по роли + чекбоксы строк для bulk-delete. Уточнить, если нужен иной смысл.

## Журнал решений
- (пусто — `stop` дописывает)