# 02 — Tech Stack (установка)

```bash
# Redux Toolkit + RTK Query
npm i @reduxjs/toolkit react-redux

# jwt
npm i jwt-decode

# routing, формы, i18n, темы, тосты, графики, утилиты
npm i react-router-dom
npm i react-hook-form zod @hookform/resolvers
npm i i18next react-i18next i18next-browser-languagedetector
npm i next-themes
npm i sonner
npm i recharts
npm i clsx tailwind-merge class-variance-authority lucide-react
```

> RTK Query идёт внутри `@reduxjs/toolkit` — отдельный пакет не нужен. HTTP — через `fetchBaseQuery` (axios не обязателен).

## shadcn/ui
```bash
npx shadcn@latest init
npx shadcn@latest add button input label form table dialog alert-dialog sheet \
  dropdown-menu select checkbox switch badge skeleton sonner tabs avatar \
  separator tooltip pagination card textarea
```

## package.json — скрипты
```jsonc
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "oxlint",
    "type-check": "tsc --noEmit"
  }
}
```

## alias `@/`
`tsconfig`: `"paths": { "@/*": ["./src/*"] }`
`vite.config.ts`: `resolve.alias['@'] = path.resolve(__dirname,'./src')`

Не ставить: другие UI-киты, другой state-менеджер. Только shadcn + RTK Query.
