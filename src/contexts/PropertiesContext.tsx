import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { properties as initialProperties, enrichProperty, withPropertyDefaults, type Property } from '../data/properties'

interface PropertiesContextValue {
  properties: Property[]
  addProperty: (property: Parameters<typeof withPropertyDefaults>[0]) => void
  updateProperty: (id: number, updates: Partial<Property>) => void
  deleteProperty: (id: number) => void
}

const STORAGE_KEY = 'mobihouse-properties'

const BROKEN_IMAGE_URL =
  'https://images.unsplash.com/photo-1605276374101-dee2a0ed3cd6?w=500&h=300&fit=crop'

function loadProperties(): Property[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialProperties

    const stored = (JSON.parse(raw) as Property[]).map((property) =>
      enrichProperty(property, initialProperties),
    )
    const fixed = stored.map((property) =>
      property.image === BROKEN_IMAGE_URL
        ? enrichProperty(
            {
              ...property,
              image: initialProperties.find((p) => p.id === property.id)?.image ?? property.image,
            },
            initialProperties,
          )
        : property,
    )

    if (fixed.some((property, index) => property.image !== stored[index].image)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fixed))
    }

    return fixed
  } catch {
    return initialProperties
  }
}

const PropertiesContext = createContext<PropertiesContextValue | null>(null)

export function PropertiesProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(loadProperties)

  const persist = useCallback((next: Property[]) => {
    setProperties(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const addProperty = useCallback(
    (property: Parameters<typeof withPropertyDefaults>[0]) => {
      persist([
        ...properties,
        enrichProperty({ ...withPropertyDefaults(property), id: Date.now() }, initialProperties),
      ])
    },
    [properties, persist],
  )

  const updateProperty = useCallback(
    (id: number, updates: Partial<Property>) => {
      persist(
        properties.map((p) =>
          p.id === id ? enrichProperty({ ...p, ...updates }, initialProperties) : p,
        ),
      )
    },
    [properties, persist],
  )

  const deleteProperty = useCallback(
    (id: number) => {
      persist(properties.filter((p) => p.id !== id))
    },
    [properties, persist],
  )

  const value = useMemo(
    () => ({ properties, addProperty, updateProperty, deleteProperty }),
    [properties, addProperty, updateProperty, deleteProperty],
  )

  return (
    <PropertiesContext.Provider value={value}>
      {children}
    </PropertiesContext.Provider>
  )
}

export function useProperties() {
  const ctx = useContext(PropertiesContext)
  if (!ctx) {
    throw new Error('useProperties debe usarse dentro de PropertiesProvider')
  }
  return ctx
}
