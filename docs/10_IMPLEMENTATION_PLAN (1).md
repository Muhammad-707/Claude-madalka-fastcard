# 10 — Implementation Plan

Подробные шаги — в `ROADMAP.md` (корень проекта). Этот файл — правила исполнения плана для команды `start`.

## Принцип
Идти строго по фазам `ROADMAP.md` сверху вниз, по одному шагу. На каждом шаге:
1. Прочитать нужный `docs/*.md` (API → 03/07, дизайн → 04/09, страница → 08, системное → 11).
2. Открыть макет в `design-export/`.
3. Реализовать шаг (shadcn/ui + Tailwind + RTK Query + i18n + адаптив, 3 состояния).
4. `npm run type-check` + `npm run lint` → починить.
5. Отметить шаг `[x]` в `ROADMAP.md`.
6. По `stop` — чекпоинт в `CLAUDE.md`, лог в `.claude/sessions/`, `git add/commit/push`.

## Порядок фаз (кратко)
1. Фундамент → 2. App-каркас → 3. Системные компоненты → 4. Auth + Layout → 5. Dashboard → 6. Users(Orders) → 7. Products(+create/edit) → 8. Other(Categories/Brands/Banners) → 9. Полировка.

Не перепрыгивать фазы: системные компоненты и Layout — до контентных страниц. Каждая страница не считается готовой без loading/empty/error, i18n, dark/light и mobile.

Полный чек-лист готовности — в `CLAUDE.md` → Definition of Done. Блокеры и журнал решений — в `ROADMAP.md`.
