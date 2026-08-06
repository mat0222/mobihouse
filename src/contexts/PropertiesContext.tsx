import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { withPropertyDefaults, type Property } from '../data/properties'
import { isFirebaseConfigured } from '../lib/firebase'
import { useAuth } from './AuthContext'
import {
  createProperty,
  deletePropertyFromFirestore,
  seedPropertiesIfEmpty,
  subscribeToProperties,
  updatePropertyInFirestore,
} from '../services/propertiesService'

interface PropertiesContextValue {
  properties: Property[]
  loading: boolean
  error: string | null
  configured: boolean
  addProperty: (property: Parameters<typeof withPropertyDefaults>[0]) => Promise<void>
  updateProperty: (id: string, updates: Partial<Property>) => Promise<void>
  deleteProperty: (id: string) => Promise<void>
}

const PropertiesContext = createContext<PropertiesContextValue | null>(null)

function formatFirebaseError(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: string }).code)
      : ''
  const message = error instanceof Error ? error.message : 'No se pudo conectar con Firebase'

  if (code.includes('permission-denied') || message.toLowerCase().includes('permission')) {
    return 'No tenés permisos para esta acción. Si sos admin, verificá las reglas de Firestore y tu rol en la colección users.'
  }

  if (code.includes('not-found') || message.toLowerCase().includes('not found')) {
    return 'No se encontró la base Firestore. Creá Firestore Database en la consola de Firebase.'
  }

  return message
}

export function PropertiesProvider({ children }: { children: ReactNode }) {
  const configured = isFirebaseConfigured()
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(
    configured
      ? null
      : 'Firebase no está configurado. Agregá las variables VITE_FIREBASE_* en tu archivo .env',
  )

  useEffect(() => {
    if (!configured) {
      setLoading(false)
      return
    }

    if (authLoading) {
      setLoading(true)
      return
    }

    let unsubscribe: (() => void) | undefined
    let cancelled = false

    const start = async () => {
      try {
        setLoading(true)
        setError(null)

        // Solo un admin puede sembrar datos iniciales
        if (isAuthenticated && isAdmin) {
          try {
            await seedPropertiesIfEmpty()
          } catch {
            // Si el seed falla por permisos u otro motivo, igual intentamos leer.
          }
        }

        if (cancelled) return

        unsubscribe = subscribeToProperties(
          (next) => {
            if (cancelled) return
            setProperties(next)
            setLoading(false)
            setError(null)
          },
          (subscribeError) => {
            if (cancelled) return
            setError(formatFirebaseError(subscribeError))
            setLoading(false)
          },
        )
      } catch (startError) {
        if (cancelled) return
        setError(formatFirebaseError(startError))
        setLoading(false)
      }
    }

    void start()

    return () => {
      cancelled = true
      unsubscribe?.()
    }
  }, [configured, isAuthenticated, isAdmin, authLoading])

  const addProperty = useCallback(
    async (property: Parameters<typeof withPropertyDefaults>[0]) => {
      try {
        await createProperty(property)
      } catch (err) {
        throw new Error(formatFirebaseError(err))
      }
    },
    [],
  )

  const updateProperty = useCallback(async (id: string, updates: Partial<Property>) => {
    const payload = { ...updates }
    if (updates.image && !updates.images) {
      payload.images = [updates.image]
    }
    try {
      await updatePropertyInFirestore(id, payload)
    } catch (err) {
      throw new Error(formatFirebaseError(err))
    }
  }, [])

  const deleteProperty = useCallback(async (id: string) => {
    try {
      await deletePropertyFromFirestore(id)
    } catch (err) {
      throw new Error(formatFirebaseError(err))
    }
  }, [])

  const value = useMemo(
    () => ({
      properties,
      loading: loading || authLoading,
      error,
      configured,
      addProperty,
      updateProperty,
      deleteProperty,
    }),
    [
      properties,
      loading,
      authLoading,
      error,
      configured,
      addProperty,
      updateProperty,
      deleteProperty,
    ],
  )

  return (
    <PropertiesContext.Provider value={value}>{children}</PropertiesContext.Provider>
  )
}

export function useProperties() {
  const ctx = useContext(PropertiesContext)
  if (!ctx) {
    throw new Error('useProperties debe usarse dentro de PropertiesProvider')
  }
  return ctx
}
