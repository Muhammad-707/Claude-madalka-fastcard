const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://store-api.softclub.tj'

export function getImageUrl(fileName: string | undefined | null): string {
  if (!fileName) return '/placeholder.png'
  if (fileName.startsWith('http')) return fileName
  return `${BASE_URL}/images/${fileName}`
}
