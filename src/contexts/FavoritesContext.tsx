import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

interface FavoritesContextValue {
  favorites: number[]
  isFavorite: (id: number) => boolean
  toggleFavorite: (id: number) => void
}

const STORAGE_KEY = 'mobihouse-favorites'

function loadFavorites(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as number[]) : []
  } catch {
    return []
  }
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>(loadFavorites)

  const isFavorite = useCallback(
    (id: number) => favorites.includes(id),
    [favorites],
  )

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((fav) => fav !== id)
        : [...prev, id]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite }),
    [favorites, isFavorite, toggleFavorite],
  )

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites debe usarse dentro de FavoritesProvider')
  return ctx
}
