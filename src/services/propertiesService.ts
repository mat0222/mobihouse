import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Unsubscribe,
} from 'firebase/firestore'
import { getDb } from '../lib/firebase'
import { sanitizeText, sanitizeUrl } from '../lib/security'
import {
  enrichProperty,
  properties as seedProperties,
  withPropertyDefaults,
  type Property,
} from '../data/properties'

const COLLECTION = 'properties'

type PropertyInput = Parameters<typeof withPropertyDefaults>[0]

function stripId(property: Property): Omit<Property, 'id'> {
  return {
    price: property.price,
    title: property.title,
    badge: property.badge,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.area,
    image: property.image,
    images: property.images,
    lat: property.lat,
    lng: property.lng,
    type: property.type,
    garages: property.garages,
    description: property.description,
    amenities: property.amenities,
    features: property.features,
    agent: property.agent,
  }
}

function mapDocToProperty(id: string, data: Record<string, unknown>): Property {
  return enrichProperty({
    id,
    price: String(data.price ?? ''),
    title: String(data.title ?? ''),
    badge: data.badge as Property['badge'],
    bedrooms: Number(data.bedrooms ?? 0),
    bathrooms: Number(data.bathrooms ?? 0),
    area: Number(data.area ?? 0),
    image: String(data.image ?? ''),
    images: Array.isArray(data.images) ? (data.images as string[]) : undefined,
    lat: Number(data.lat ?? 0),
    lng: Number(data.lng ?? 0),
    type: data.type as Property['type'] | undefined,
    garages: data.garages !== undefined ? Number(data.garages) : undefined,
    description: data.description !== undefined ? String(data.description) : undefined,
    amenities: Array.isArray(data.amenities)
      ? (data.amenities as Property['amenities'])
      : undefined,
    features: data.features as Property['features'] | undefined,
    agent: data.agent as Property['agent'] | undefined,
  })
}

export async function seedPropertiesIfEmpty(): Promise<void> {
  const db = getDb()
  const snapshot = await getDocs(collection(db, COLLECTION))

  if (!snapshot.empty) return

  await Promise.all(
    seedProperties.map((property) =>
      addDoc(collection(db, COLLECTION), {
        ...stripId(property),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }),
    ),
  )
}

export function subscribeToProperties(
  onData: (properties: Property[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const db = getDb()
  const propertiesQuery = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))

  return onSnapshot(
    propertiesQuery,
    (snapshot) => {
      const properties = snapshot.docs.map((document) =>
        mapDocToProperty(document.id, document.data() as Record<string, unknown>),
      )
      onData(properties)
    },
    (error) => onError(error),
  )
}

export async function createProperty(input: PropertyInput): Promise<string> {
  const db = getDb()
  const data = withPropertyDefaults({
    ...input,
    title: sanitizeText(input.title, 120),
    price: sanitizeText(input.price, 40),
    image: sanitizeUrl(input.image) || input.image,
    description: input.description
      ? sanitizeText(input.description, 2000)
      : input.description,
  })
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updatePropertyInFirestore(
  id: string,
  updates: Partial<Property>,
): Promise<void> {
  const db = getDb()
  const payload: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  }

  const fields: (keyof Omit<Property, 'id'>)[] = [
    'price',
    'title',
    'badge',
    'bedrooms',
    'bathrooms',
    'area',
    'image',
    'images',
    'lat',
    'lng',
    'type',
    'garages',
    'description',
    'amenities',
    'features',
    'agent',
  ]

  for (const field of fields) {
    if (updates[field] !== undefined) {
      const value = updates[field]
      if (field === 'title' || field === 'price' || field === 'description') {
        payload[field] = sanitizeText(String(value ?? ''), field === 'description' ? 2000 : 120)
      } else if (field === 'image') {
        payload[field] = sanitizeUrl(String(value ?? '')) || value
      } else {
        payload[field] = value
      }
    }
  }

  await updateDoc(doc(db, COLLECTION, id), payload)
}

export async function deletePropertyFromFirestore(id: string): Promise<void> {
  const db = getDb()
  await deleteDoc(doc(db, COLLECTION, id))
}
