# 04 — Design System (админка)

> Точные значения — из макетов `design-export/`. Ниже базовые токены админки (тёмный sidebar + синий акцент). Если макет даёт другое — макет в приоритете.

## Палитра (admin)
| Токен | Значение | Где |
|---|---|---|
| primary (blue) | `#2F6BFF` (синий) | кнопки Add/Save/Log in, активные элементы |
| primary-hover | затемнить ~8% | hover кнопок |
| sidebar-bg | `#16223C` / тёмно-синий | боковое меню, левая панель логина |
| sidebar-active | `#2F6BFF` / подсветка | активный пункт |
| content-bg | `#F6F8FB` | фон рабочей области |
| card | `#FFFFFF` | карточки/таблицы |
| text | `#0F172A` | основной текст |
| text-muted | `#64748B` | вторичный текст |
| border | `#E2E8F0` | бордеры, разделители |
| success | `#16A34A` | статус «Full»/in stock/Paid |
| warning | `#F59E0B` | «Pending» |
| danger | `#DC2626` | «Cancelled»/out of stock/delete |

Шрифт: как в макете (обычно Inter/SF). Радиус: по макету (обычно 8px). Контейнер контента: на всю ширину минус sidebar, с внутренними отступами.

## Темы (CSS variables → `index.css`)
Переменные в формате shadcn (`--background`,`--foreground`,`--primary`,`--card`,`--muted`,`--border`,`--sidebar`...) для `:root` и `.dark`. Класс `dark` на `<html>`.
- **light:** content-bg светлый, card белый, sidebar тёмно-синий.
- **dark:** content-bg тёмный (`#0B1220`), card `#111A2E`, текст светлый, sidebar ещё темнее; синий акцент сохраняется.
Переключение — ThemeToggle в Header, выбор в localStorage.

## Кнопки
- **primary:** синий фон, белый текст, радиус по макету.
- **outline/ghost:** для второстепенных.
- **danger:** красная — необратимые действия (в ConfirmDialog).

## Статус-бейджи (таблицы)
shadcn `badge` с цветами success/warning/danger по статусу строки (как в макете Orders/Products).

## Sidebar
Тёмный, фикс. слева (ширина ~240px), лого сверху, пункты: Dashboard, Orders, Products, Other (раскрывается: Categories/Brands/Banners). Активный — синяя подсветка/полоса. Иконки lucide. Collapse на узких экранах; на мобиле — drawer (sheet) по бургеру из Header.

## Header (Topbar)
Поиск (где нужен), справа: **LangSwitcher** (RU/EN/TJ), **ThemeToggle** (☀️/🌙), аватар+имя админа, выход. Их нет в макете — добавить аккуратно в правую часть, не ломая макет.

## Login layout (отдельный)
Split: слева тёмная панель «Welcome to admin panel» + лого fastcart; справа белая форма Email/Password (eye-toggle), «Forgot password?», синяя кнопка «Log in». Без Sidebar/Header. Адаптив: на мобиле левая панель сверху или скрыта.
