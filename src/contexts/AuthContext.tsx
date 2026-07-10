import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: 'user' | 'admin'
}

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

const STORAGE_KEY = 'mobihouse-auth'

const demoUsers: User[] = [
  {
    id: '1',
    name: 'Andrés García',
    email: 'andres@mobihouse.com',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    role: 'admin',
  },
  {
    id: '2',
    name: 'María López',
    email: 'maria@mobihouse.com',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
    role: 'user',
  },
]

function loadStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadStoredUser)

  const login = useCallback((email: string, password: string) => {
    const found = demoUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    )
    if (!found || password.length < 4) return false

    setUser(found)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(found))
    return true
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isAdmin: user?.role === 'admin',
      login,
      logout,
    }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
