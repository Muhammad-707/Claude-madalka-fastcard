/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_TOKEN_KEY: string
  readonly VITE_DEFAULT_LANG: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
