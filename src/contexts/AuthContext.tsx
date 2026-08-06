import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { getDb, getFirebaseAuth, isFirebaseConfigured } from '../lib/firebase'
import { isAdminEmail, isStrongEnoughPassword, sanitizeText } from '../lib/security'

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: 'user' | 'admin'
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  getIdToken: () => Promise<string | null>
}

const DEFAULT_AVATARS = {
  admin:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  user:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function ensureUserProfile(firebaseUser: FirebaseUser): Promise<User> {
  const db = getDb()
  const ref = doc(db, 'users', firebaseUser.uid)
  const snapshot = await getDoc(ref)

  if (snapshot.exists()) {
    const data = snapshot.data()
    return {
      id: firebaseUser.uid,
      name: String(data.name ?? firebaseUser.displayName ?? 'Usuario'),
      email: String(data.email ?? firebaseUser.email ?? ''),
      avatar: String(data.avatar ?? DEFAULT_AVATARS.user),
      role: data.role === 'admin' ? 'admin' : 'user',
    }
  }

  const email = (firebaseUser.email ?? '').toLowerCase()
  const role: User['role'] = isAdminEmail(email) ? 'admin' : 'user'
  const name =
    sanitizeText(firebaseUser.displayName ?? email.split('@')[0] ?? 'Usuario', 80) || 'Usuario'

  const profile: User = {
    id: firebaseUser.uid,
    name,
    email,
    avatar: role === 'admin' ? DEFAULT_AVATARS.admin : DEFAULT_AVATARS.user,
    role,
  }

  await setDoc(ref, {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return profile
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isFirebaseConfigured()
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(configured)

  useEffect(() => {
    if (!configured) {
      setLoading(false)
      return
    }

    const auth = getFirebaseAuth()
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      void (async () => {
        if (!nextUser) {
          setFirebaseUser(null)
          setUser(null)
          setLoading(false)
          return
        }

        try {
          const profile = await ensureUserProfile(nextUser)
          setFirebaseUser(nextUser)
          setUser(profile)
        } catch {
          await signOut(auth)
          setFirebaseUser(null)
          setUser(null)
        } finally {
          setLoading(false)
        }
      })()
    })

    return unsubscribe
  }, [configured])

  const login = useCallback(async (email: string, password: string) => {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase Auth no está configurado.')
    }

    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail || !password) {
      throw new Error('Completá email y contraseña.')
    }

    if (!isStrongEnoughPassword(password)) {
      throw new Error('La contraseña debe tener al menos 8 caracteres.')
    }

    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), normalizedEmail, password)
    } catch {
      throw new Error('Credenciales incorrectas o cuenta no autorizada.')
    }
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase Auth no está configurado.')
    }

    const normalizedEmail = email.trim().toLowerCase()
    const safeName = sanitizeText(name, 80)
    if (!safeName) {
      throw new Error('Ingresá tu nombre.')
    }
    if (!normalizedEmail || !password) {
      throw new Error('Completá email y contraseña.')
    }
    if (!isStrongEnoughPassword(password)) {
      throw new Error('La contraseña debe tener al menos 8 caracteres.')
    }

    try {
      const credential = await createUserWithEmailAndPassword(
        getFirebaseAuth(),
        normalizedEmail,
        password,
      )
      await updateProfile(credential.user, { displayName: safeName })
      // El perfil en Firestore se crea en onAuthStateChanged vía ensureUserProfile
    } catch (error: unknown) {
      const code =
        typeof error === 'object' && error !== null && 'code' in error
          ? String((error as { code?: string }).code)
          : ''

      if (code.includes('email-already-in-use')) {
        throw new Error('Ese correo ya está registrado. Probá iniciar sesión.')
      }
      if (code.includes('weak-password')) {
        throw new Error('La contraseña es demasiado débil. Usá al menos 8 caracteres.')
      }
      if (code.includes('invalid-email')) {
        throw new Error('El correo no es válido.')
      }
      throw new Error('No se pudo crear la cuenta. Intentá de nuevo.')
    }
  }, [])

  const logout = useCallback(async () => {
    if (!isFirebaseConfigured()) {
      setUser(null)
      setFirebaseUser(null)
      return
    }
    await signOut(getFirebaseAuth())
    setUser(null)
    setFirebaseUser(null)
  }, [])

  const getIdToken = useCallback(async () => {
    if (!firebaseUser) return null
    return firebaseUser.getIdToken()
  }, [firebaseUser])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: user !== null,
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
      getIdToken,
    }),
    [user, loading, login, register, logout, getIdToken],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
