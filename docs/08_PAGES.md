# 08 — Pages (все страницы детально)

> Каждая страница — копия макета из `design-export/` (docs/09). Брейкпоинты: mobile <768 (Sidebar→drawer, таблицы→карточки/скролл), tablet 768–1023, desktop ≥1024.

---

## 1. Login `/login`
**Дизайн:** split-экран. Слева тёмно-синяя панель: «Welcome to admin panel» + лого **fastcart**. Справа белая форма «Log in»: поле Email, поле Password (иконка глаза — показать/скрыть), ссылка «Forgot password?», синяя кнопка «Log in». **Без Sidebar и Header.**
**Логика:** `POST /Account/login` `{ userName, password }`. Декодировать JWT → **только `role === 'Admin'` пускать** (иначе ошибка, токен не сохранять). Успех → токен в localStorage, redirect `/dashboard`. Форма — react-hook-form + zod. Лоадер на кнопке во время запроса.

---

## 2. Dashboard `/dashboard`
**Дизайн:** как макет «Dashboard» (карточки сверху, график, справа Top selling, снизу таблицы).
**Логика (Sales/Cost/Profit заменяем — их нет в Swagger):**

**3 карточки сверху (кликабельные):**
- **Products** — кол-во товаров (`totalRecord` из `get-products`).
- **Customers** — кол-во пользователей (`totalRecord` из `get-user-profiles`).
- **Categories + Brands** — кол-во категорий (длина `get-categories`) и брендов (`totalRecord` из `get-brands`).
Клик по карточке → **переключает данные в графике** (активная карточка подсвечена). По умолчанию выбрана Products.

**График (recharts):** строится по **товарам** (не orders, их нет). Например распределение товаров по категориям/брендам/наличию, или динамика по выбранной карточке. График **работает** и меняется по выбранной карточке.

**Справа «Top selling products»:** максимум **4–5** товаров. Кнопка **«See all»** → переход на `/products`.

**Снизу «Recent Customers»** (вместо «Recent Transactions»): таблица последних пользователей — **username, email, role** и др. поля.

**Справа «Top Products by Units Sold»:** список **всех** товаров; при большом кол-ве — вертикальный скролл с **невидимым скроллбаром** (`scrollbar-width:none` / `::-webkit-scrollbar{display:none}`), прокрутка работает.

Все блоки: loading (skeleton) / empty / error.

---

## 3. Orders → Users `/users`
**(в Swagger нет orders → страница «Orders» наполняется пользователями.)**
**Дизайн:** макет «Orders» (таблица с чекбоксами, тулбар, пагинация; есть состояние «No Orders Yet» → используем как empty «нет пользователей»).
**Логика (`/UserProfile/...`):**
- **GET** `get-user-profiles` (paginated) — таблица: чекбокс, username, email, role, телефон и т.д.
- **Поиск** по `UserName` (debounce) + **фильтр** (по роли — User/Admin; «in/out stock» к пользователям не применим, используем роль/статус).
- **Пагинация** (PageNumber/PageSize) — в URL.
- **Чекбоксы строк** + «выбрать все» + **bulk delete** выбранных (через ConfirmDialog → `delete-user` по каждому id).
- **Add** пользователя — модалка (форма; если бэк добавляет пользователей только через register — использовать `/Account/register`).
- **Edit** — модалка (`update-user-profile`, multipart).
- **Delete** — модалка-подтверждение (`delete-user`).
- Роли при необходимости: `get-user-roles`, `addrole-from-user`, `remove-role-from-user`.
- Каждое действие → toast + автоинвалидция списка (RTK Query).

---

## 4. Products `/products`
**Дизайн:** макет «Products» (таблица: чекбокс, фото, название, цена, кол-во, категория, статус, действия edit/delete). Кнопка **«Add new»** (синяя) сверху справа. Пустое состояние «Add new products».
**Логика:**
- **GET** `get-products` (paginated, **204=empty**) + поиск/фильтры (brand, color, category, subcategory, price) + пагинация.
- **Add** — **отдельная страница** `/products/create` (в макете «Products / Add new»): форма add-product (multipart): загрузка **изображений**, выбор **бренда**, **цвета** (+ модалка «New color» → `add-color`), **категории/подкатегории**, название, описание (rich-text как в макете), кол-во, вес, размер, код, цена, тумблер **HasDiscount** + DiscountPrice. Кнопка Save → `add-product` → модалка **«Successfully add»** → возврат к списку.
- **Edit** — **отдельная страница** `/products/:id/edit`: предзаполнить из `get-product-by-id`, сохранить `update-product`; управление изображениями (`add-image-to-product`, `delete-image-from-product`).
- **Delete** — **модалка** из макета (Delete product / Delete boxes) → `delete-product` → toast.
- Использовать модалки **из макета** (Successfully add, Delete product, New color, Option). Если какой-то модалки нет — собрать на shadcn `dialog`/`alert-dialog` в том же стиле.

---

## 5. Other → Categories `/categories`
**Дизайн:** макет «Categories» (сетка карточек категорий с иконкой + название, edit/delete на карточке, пагинация). Кнопка «Add category». Модалка «Add category» из макета.
**Логика:**
- **GET** `get-categories`.
- **Add** — модалка: `CategoryName` + загрузка `CategoryImage` (multipart) → `add-category`.
- **Edit** — модалка: `update-category` (multipart, с Id).
- **Delete** — ConfirmDialog → `delete-category`.
- Toast + автоинвалидция (tag Category).
- **Подкатегории** (нужны для товаров): CRUD `get/add/update/delete-sub-category` — внутри категории или отдельным блоком.

## 5b. Other → Brands `/brands`
**Дизайн:** макет «Brands» (список брендов с edit/delete + панель «Add new brand» с инпутом и кнопкой). 
**Логика:** `get-brands` (paginated) · add `add-brand?BrandName` · edit `update-brand` · delete `delete-brand` (ConfirmDialog). Toast + tag Brand.

## 5c. Other → Banners `/banners`
**Дизайн:** по макету (если есть в `design-export/`).
**Логика:** в Swagger **нет API баннеров** → сделать **только дизайн** (статика/локальный стейт-заглушка, CRUD по UI без сервера). Если позже появится эндпоинт — подключить как остальные через RTK Query. Отметить в ROADMAP как блокер.

---

## Общий layout (кроме `/login`)
`AdminLayout` = **Sidebar** (Dashboard / Orders / Products / Other→Categories,Brands,Banners) + **Header/Topbar** (поиск, LangSwitcher, ThemeToggle, аватар админа, logout) + `<Outlet/>`. Активный пункт меню подсвечен. На мобиле Sidebar — drawer.

## 404 `*`
NotFoundPage по макету/системному стилю + кнопка «На главную» (`/dashboard`).
