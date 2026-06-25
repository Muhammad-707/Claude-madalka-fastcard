---
name: build-page
description: Построить одну страницу админки Fastcart как копию макета из design-export/ и подключить к Swagger через RTK Query. Использовать для любого роута из docs/08 (login, dashboard, users, products, product-create, product-edit, categories, brands, banners, not-found). Вызов — /build-page <route>.
---

# /build-page <route>

Реализовать (или доработать) одну страницу до продакшен-качества. Design-first.

## Шаги
1. Открыть `docs/08_PAGES.md` для роута из `$ARGUMENTS` — перечитать описание + общий layout.
2. Открыть макет(ы) в `design-export/` (карта в `docs/09`). Нет макета → спросить пользователя, не выдумывать.
3. Снять токены с макета (цвета/размеры/отступы/иконки/состояния/бейджи) — docs/04.
4. Подключить нужные эндпоинты через RTK Query (docs/03, docs/07): создать/проверить query/mutation + теги.
5. Свёрстать на shadcn/ui + Tailwind как **копию макета**. Логика — в `hooks/`, не в JSX. Переиспользовать `shared/ui` и `entities/*`.
6. Тексты через `t()` (docs/05). Состояния loading(skeleton)/empty/error + 204. dark/light.
7. Адаптив desktop/tablet/mobile (Sidebar→drawer, таблицы→карточки).
8. `npm run type-check` + `npm run lint`; починить. Сообщить, что построено и отклонения/блокеры.

## Definition of done
- Роут рендерится, тянет реальные данные, все действия (CRUD/поиск/фильтр/пагинация/модалки) работают.
- Нет `any`, нет fetch/axios в компонентах (только RTK Query), нет ошибок в консоли.
- Визуально совпадает с макетом на desktop и mobile, в light и dark.

$ARGUMENTS
