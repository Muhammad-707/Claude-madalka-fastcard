# 09 — Design Export (папка `design-export/`)

Все макеты экспортированы из Figma в папку **`design-export/`** в корне проекта (PNG/JPG/SVG). Это источник дизайна — Claude Code читает изображения отсюда и верстает **пиксель-в-пиксель**. Папка только для чтения.

## Как пользоваться
1. Перед версткой страницы открыть соответствующий файл(ы) из `design-export/` (через инструмент чтения изображений Claude Code).
2. Снять с макета: точные цвета (пипетка/значения), размеры, отступы, типографику, иконки, состояния (hover/active/disabled/empty), бейджи статусов.
3. Свёрстать на shadcn/ui + Tailwind, перевести значения в классы точно (`24px`→`p-6`).
4. Сверить результат с макетом визуально; добиться сходства.

## Карта «макет → страница» (заполнить под реальные имена файлов)
| Файл в `design-export/` | Страница | Заметки |
|---|---|---|
| `login.*` | `/login` | split, eye-toggle, без sidebar/header |
| `dashboard.*` | `/dashboard` | карточки, график, top selling, recent, top-by-units |
| `orders.*`, `orders-empty.*` | `/users` | таблица + чекбоксы + empty |
| `products.*`, `products-empty.*` | `/products` | таблица + add new |
| `product-add.*` (Products / Add new) | `/products/create` | форма товара |
| `product-edit.*` | `/products/:id/edit` | (если нет — взять за основу add) |
| `modal-success.*`, `modal-delete-product.*`, `modal-new-color.*`, `modal-option.*` | модалки Products | |
| `categories.*`, `modal-add-category.*` | `/categories` | сетка + модалка |
| `brands.*`, `brand-add.*` | `/brands` | список + add new brand |
| `banners.*` | `/banners` | если есть |
| `sidebar.*`, `header.*` | widgets | если выгружены отдельно |

> Реальные имена файлов могут отличаться — сопоставить по содержимому. Если нужного экрана в папке нет — **спросить пользователя**, не выдумывать (исключения — системные компоненты, theme/lang switcher, toasts, скелетоны).

## (Опционально) Figma MCP
Если подключён `figma-developer-mcp` — можно дополнительно сверять точные токены через MCP. Но основной источник — `design-export/`.
