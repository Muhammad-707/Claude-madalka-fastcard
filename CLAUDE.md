# CLAUDE.md — ТЗ Админ-панели Fastcart (для Claude Code)

> Claude Code читает этот файл автоматически при старте в директории проекта.
> Здесь главные правила и ссылки на детальные документы в `docs/`.
> Это **админ-панель** магазина Fastcart (бэкенд тот же: `https://store-api.softclub.tj`).
> Клиентская витрина — отдельный проект.

---

## 🎯 Что нужно построить

Полноценная **админ-панель** (фронтенд) на React + TypeScript для управления магазином Fastcart: товары, категории, подкатегории, бренды, цвета, пользователи, баннеры. Работает с готовым бэкендом по Swagger и **RTK Query**. Вход — только для администратора.

**Главная задача Claude Code:** превратить пустой Vite-стартер в полностью рабочую админку: точная копия дизайна из папки `design-export/`, вся логика из Swagger, адаптив + mobile, dark/light, i18n (ru/en/tj).

---

## 🔥 САМОЕ ВАЖНОЕ ПРАВИЛО — Design-first (папка `design-export/`)

**Claude Code НЕ ВЫДУМЫВАЕТ дизайн.** Все макеты экспортированы из Figma в папку **`design-export/`** (PNG/SVG/JPG). Каждая страница и компонент строится как **визуальная копия** соответствующего макета из этой папки.

Workflow для **каждой** страницы/компонента:
1. 🖼 Открыть нужный файл(ы) из `design-export/` (см. `docs/09_DESIGN_EXPORT.md` — карта «макет → страница»).
2. 📏 Снять с макета: цвета, размеры, отступы, типографику, иконки, состояния (hover/active/disabled/empty), бейджи статусов.
3. 🧩 Определить, какие компоненты shadcn/ui взять за базу.
4. ✍️ Сверстать **пиксель-в-пиксель** на shadcn/ui + Tailwind. Значение из макета `padding: 24px` → `p-6`, не «на глаз».
5. 🌐 Все тексты — через `t('...')` (i18n). Хардкод запрещён.
6. 📱 Сделать адаптив (desktop / tablet / mobile) — см. `docs/08_PAGES.md`.
7. ✅ Проверить `npm run type-check` и `npm run lint`.

Если в `design-export/` нет нужного экрана — **спросить пользователя**, не выдумывать. Исключение — системные компоненты (`docs/11`), ThemeToggle, LangSwitcher, toasts, скелетоны: их строим сами.

Дизайн обязан быть **красивым и профессиональным**, как в Figma: аккуратные иконки (lucide-react), подходящие изображения/плейсхолдеры, чистые отступы, единый стиль.

---

## 📐 Стек (обязательный, не отступать)

| Категория | Технология |
|---|---|
| Framework | **React 18 + TypeScript** |
| Bundler | **Vite** (уже настроен) |
| UI | **shadcn/ui** (Radix + Tailwind) |
| Стили | **Tailwind CSS** |
| State / данные | **Redux Toolkit + RTK Query** |
| HTTP (внутри RTK Query) | **fetchBaseQuery** (или axiosBaseQuery) |
| Routing | **react-router-dom v6** (+ lazy) |
| Forms | **react-hook-form + zod** |
| i18n | **react-i18next** (ru / en / tj) |
| Темы | dark / light через CSS variables (`next-themes` или своя) |
| Иконки | **lucide-react** |
| Уведомления | **sonner** |
| Графики | **recharts** (дашборд) |
| Linting | **Oxlint** |

⚠️ Версии — последние стабильные. Импорты строго через alias `@/`.

> Отличие от клиентского проекта: данные тянем через **RTK Query** (`createApi`), а не `createAsyncThunk`. См. `docs/07_RTK_QUERY.md`.

---

## 🗂 Структура папок (СТРОГО — см. `docs/01_ARCHITECTURE.md`)

```
src/
├── app/
│   ├── store.ts                # configureStore + middleware RTK Query
│   ├── hooks.ts                # useAppDispatch/useAppSelector
│   └── providers/              # Redux, Theme, i18n, Router
├── pages/                      # по папке на страницу
│   ├── login/
│   ├── dashboard/
│   ├── users/                  # («Orders» в макете → пользователи)
│   ├── products/               # список товаров
│   ├── product-create/         # add (отдельная страница)
│   ├── product-edit/           # edit (отдельная страница)
│   ├── categories/
│   ├── brands/
│   ├── banners/
│   └── not-found/
├── widgets/                    # Sidebar, Header (Topbar)
├── features/                   # auth, theme-toggle, lang-switcher, bulk-select
├── entities/                   # product-row, user-row, category-card, brand-row
├── shared/
│   ├── api/                    # baseApi (RTK Query) + слайсы эндпоинтов + types
│   ├── config/                 # константы, env
│   ├── lib/                    # утилиты (getImageUrl, formatters, jwt)
│   ├── ui/                     # shadcn-компоненты
│   ├── hooks/                  # useDebounce и т.п.
│   └── types/
├── i18n/  (index.ts, locales/{ru,en,tj}.json)
├── assets/
├── App.tsx  main.tsx  index.css
```

`design-export/` лежит в корне проекта (рядом с `src/`) — это исходники макетов, не трогать, только читать.

---

## 🔑 Главные правила для Claude Code

1. **Никакой логики в JSX.** Логика — в хуках страницы (`useUsersPage`) и в RTK Query эндпоинтах.
2. **Каждая страница = папка** с `index.tsx` (только композиция) + `components/` + `hooks/` + `types.ts`.
3. **Все запросы — только через RTK Query** (`baseApi.injectEndpoints`). Никаких `axios.get` в компонентах.
4. **Один baseApi** в `shared/api/baseApi.ts`. `prepareHeaders` добавляет `Authorization: Bearer <token>` из localStorage. На `401` → logout + redirect `/login`.
5. **JWT в localStorage** под `access_token`. Декодировать `jwt-decode` → `sid`, `role`, `name`, `email`.
6. **Вход только для админа.** После логина проверять `role === 'Admin'`. Не админ → не пускать (ошибка), токен не сохранять. См. `docs/06_AUTH_FLOW.md`.
7. **Все строки — через `t()`** (i18n). Хардкода нет.
8. **Тема — через CSS variables.** Класс `dark` на `<html>`. Переключатель в Header.
9. **Адаптив обязателен:** desktop ≥1024, tablet 768–1023, mobile <768. На мобиле Sidebar → drawer (sheet), таблицы → карточки/скролл.
10. **Все формы — react-hook-form + zod.**
11. **Никаких отключений линтера.** Мешает правило — переписать код.
12. **Типы Swagger — руками** в `shared/api/types.ts`. `any` запрещён.
13. **Sidebar + Header (Topbar) — widgets.** Показываются на ВСЕХ страницах, **кроме `/login`**.
14. **Системные компоненты обязательны** (`docs/11`): ErrorBoundary (глобальный + page-level), ProtectedRoute (adminOnly), PageLoader, NotFoundPage (404), EmptyState, NetworkError, ConfirmDialog (перед каждым delete), Toaster (sonner).
15. **Все роуты lazy** (`React.lazy` + `<Suspense fallback={<PageLoader/>}>`).
16. **Каждое async-действие = 3 состояния:** loading (skeleton/spinner), success, error (NetworkError/toast).
17. **Строго по `docs/10_IMPLEMENTATION_PLAN.md`** / `ROADMAP.md`. Перед шагом — прочитать нужный `.md`.

---

## 🧱 Header (Topbar) + Sidebar

- **Sidebar** (слева, тёмный): лого Fastcart, пункты — Dashboard, Orders (→ Users), Products, Other (Categories / Brands / Banners). Активный пункт подсвечен. На мобиле — drawer.
- **Header/Topbar** (сверху): поиск, **LangSwitcher** (RU/EN/TJ, сохранять в `i18nextLng`) + **ThemeToggle** (☀️/🌙), аватар/имя админа, выход. Их нет в макете — добавить аккуратно, не ломая дизайн.
- На `/login` **ни Sidebar, ни Header не показываются** — это отдельный полноэкранный layout.

---

## 📄 Страницы (кратко; детали — `docs/08_PAGES.md`)

1. **Login** — split-экран, вход только админ (userName + password из Swagger).
2. **Dashboard** — 3 интерактивные карточки (Products / Customers / Categories+Brands), кликабельный график (recharts, по товарам, не по orders), Top selling products (4–5 + See all → Products), Recent Customers (username/email/role), Top Products by Units Sold (скролл с невидимым скроллбаром).
3. **Orders → Users** — таблица пользователей (нет orders в Swagger): get, поиск, фильтр, пагинация, чекбоксы + bulk delete, add/edit/delete через модалки.
4. **Products** — список товаров; add и edit на **отдельных страницах** (как в макете), delete — модалка; модалки из макета (Successfully add, Delete product, new color, Option).
5. **Other → Categories / Brands / Banners** — CRUD категорий и брендов через модалки; Banners — дизайн (в Swagger нет эндпоинта баннеров; если появится — добавить логику).
6. **404 / системные экраны**.

---

## 📚 Документация по модулям (читать ПЕРЕД кодом, по порядку)

1. `docs/01_ARCHITECTURE.md` — FSD, структура, naming, диаграммы
2. `docs/02_TECH_STACK.md` — библиотеки + установка
3. `docs/03_API_INTEGRATION.md` — весь Swagger + типы + поведение
4. `docs/04_DESIGN_SYSTEM.md` — токены админки (синяя тема), shadcn, темы, Header/Sidebar
5. `docs/05_I18N.md` — i18next, словари ru/en/tj
6. `docs/06_AUTH_FLOW.md` — логин только админа, JWT, ProtectedRoute
7. `docs/07_RTK_QUERY.md` — baseApi, эндпоинты, теги, инвалидция кэша
8. `docs/08_PAGES.md` — ВСЕ страницы детально (по твоим объяснениям)
9. `docs/09_DESIGN_EXPORT.md` — как работать с папкой `design-export/`
10. `docs/10_IMPLEMENTATION_PLAN.md` — пошаговый план (+ `ROADMAP.md`)
11. `docs/11_SYSTEM_COMPONENTS.md` — ErrorBoundary, 404, Loader, ProtectedRoute и др.

---

## ✅ Definition of Done

- [ ] Все страницы из `docs/08_PAGES.md` реализованы и работают
- [ ] Каждая страница — **визуальная копия** макета из `design-export/`
- [ ] Все нужные эндпоинты Swagger подключены через RTK Query
- [ ] Вход работает **только для админа**; не админ не попадает внутрь
- [ ] Sidebar + Header на всех страницах кроме `/login`
- [ ] Dashboard: 3 кликабельные карточки управляют графиком; график по товарам работает
- [ ] Users (Orders): get/search/filter/pagination/чекбоксы/bulk-delete/add/edit/delete
- [ ] Products: список + add-страница + edit-страница + delete-модалка + модалки цветов/опций
- [ ] Categories/Brands: CRUD с модалками; Banners: дизайн (или логика, если есть API)
- [ ] dark/light сохраняется в localStorage; ru/en/tj переключается мгновенно
- [ ] Desktop/tablet/mobile — всё адаптивно и красиво
- [ ] `npm run type-check` без ошибок; `npm run lint` без ошибок; `npm run build` проходит
- [ ] Нет хардкод-строк, нет `any`
- [ ] Все системные компоненты (`docs/11`) реализованы
- [ ] Все роуты lazy-loaded

---

## 🔐 Переменные окружения (`.env` + `.env.example`)

```env
VITE_API_BASE_URL=https://store-api.softclub.tj
VITE_TOKEN_KEY=access_token
VITE_DEFAULT_LANG=ru
```
В `.gitignore`: `.env`, `node_modules`, `dist`.

---
---

## 🕹️ Управление сессией (команды START / STOP)

### 📥 `stop` / `стоп` (сохранить и выйти)
Когда пользователь пишет в чат `stop` или `стоп`, Claude Code обязан:
1. Остановить текущую генерацию.
2. В конец этого файла, в раздел `## 📍 Последний чекпоинт`, записать человеческим языком: над какой страницей/компонентом/фичей работал и какой следующий шаг.
3. Обновить чекбоксы в `ROADMAP.md` / `docs/10_IMPLEMENTATION_PLAN.md`.
4. Записать лог сессии в `.claude/sessions/SESSION-<дата>-<NN>.md` (шаблон — в `.claude/skills/stop`).
5. Выполнить: `npm run lint`.
6. `git add .`
7. `git commit -m "checkpoint: paused on [страница/фича]"`
8. `git push origin main`
9. Попрощаться и завершить сессию.

### 🚀 `start` / `старт` (продолжить)
Когда пользователь пишет `start` или `старт`, Claude Code обязан:
1. Прочитать `## 📍 Последний чекпоинт` внизу этого файла + последний лог в `.claude/sessions/`.
2. Прочитать `ROADMAP.md` / `docs/10` — найти первый невыполненный шаг.
3. Проверить статус файлов и `git log`.
4. Молча, без лишних вопросов, продолжить ровно с того места, используя макеты из `design-export/`, shadcn/ui и Taste Skill.

---

## 📍 Последний чекпоинт
- **Статус:** Фазы 1–4 завершены (Session 1, 2026-06-26).
- **Что сделано:** Фаза 1 — Vite+TS+Tailwind+shadcn+baseApi+types+utils. Фаза 2 — authSlice, Redux store, i18n (ru/en/tj), Providers (Redux+Theme), router с lazy+Suspense, global ErrorBoundary. Фаза 3 — PageLoader, EmptyState, NetworkError, ConfirmDialog, NotFoundPage, ProtectedRoute, Toaster. Фаза 4 — authApi (login mutation), loginPage (split-design, eye-toggle, only Admin), Sidebar (logo+nav+Other expandable+mobile drawer), Header (search+ThemeToggle+LangSwitcher+bell+user dropdown+logout), AdminLayout. `type-check` ✅ `lint` ✅ 0 ошибок.
- **Следующий шаг:** Фаза 5 — Dashboard (RTK Query API слайсы + 3 карточки + recharts график + Top selling + Recent customers + Top by units).
- **Прошлая сессия:** нет (все в одной).

---

**Старт работы: прочитать все `docs/` по порядку, затем следовать `ROADMAP.md` / `docs/10_IMPLEMENTATION_PLAN.md`.**