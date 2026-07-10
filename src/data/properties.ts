export type PropertyBadge = 'NUEVO' | 'EN ALQUILER' | 'EN VENTA'
export type PropertyType = 'Departamento' | 'Casa' | 'Loft' | 'PH'
export type Amenity = 'Piscina' | 'Gimnasio' | 'Ascensor' | 'Seguridad 24/7'

export interface PropertyAgent {
  name: string
  avatar: string
  whatsapp: string
  email: string
}

export interface Property {
  id: number
  price: string
  title: string
  badge: PropertyBadge
  bedrooms: number
  bathrooms: number
  area: number
  image: string
  images: string[]
  lat: number
  lng: number
  type: PropertyType
  garages: number
  description: string
  amenities: Amenity[]
  agent: PropertyAgent
}

export const MAP_CENTER = { lat: -34.5889, lng: -58.4200 }

export const DEFAULT_AGENT: PropertyAgent = {
  name: 'Andrés García',
  avatar:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  whatsapp: '+5491112345678',
  email: 'andres@mobihouse.com',
}

export const DEFAULT_AMENITIES: Amenity[] = [
  'Piscina',
  'Gimnasio',
  'Ascensor',
  'Seguridad 24/7',
]

const DEFAULT_DESCRIPTION =
  'Propiedad moderna con excelente ubicación, ambientes luminosos y acabados de calidad. Ideal para quienes buscan confort y conectividad con los principales puntos de la ciudad.'

export function withPropertyDefaults(
  property: Partial<Property> &
    Pick<Property, 'price' | 'title' | 'badge' | 'bedrooms' | 'bathrooms' | 'area' | 'image' | 'lat' | 'lng'>,
): Omit<Property, 'id'> {
  return {
    ...property,
    type: property.type ?? 'Departamento',
    garages: property.garages ?? 1,
    description: property.description ?? DEFAULT_DESCRIPTION,
    amenities: property.amenities ?? DEFAULT_AMENITIES,
    agent: property.agent ?? DEFAULT_AGENT,
    images: property.images ?? [property.image],
  }
}

export const properties: Property[] = [
  {
    id: 1,
    price: '$179.000',
    title: 'Dpto. 2 Amb. Recoleta',
    badge: 'NUEVO',
    bedrooms: 3,
    bathrooms: 1,
    area: 100,
    lat: -34.5875,
    lng: -58.3974,
    type: 'Departamento',
    garages: 1,
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&h=500&fit=crop',
    ],
    description:
      'Departamento luminoso en Recoleta con balcón, cocina integrada y excelente conectividad. A pasos de parques, cafés y transporte público.',
    amenities: DEFAULT_AMENITIES,
    agent: DEFAULT_AGENT,
  },
  {
    id: 2,
    price: '$310.000',
    title: 'Loft Moderno Palermo',
    badge: 'EN ALQUILER',
    bedrooms: 2,
    bathrooms: 1,
    area: 110,
    lat: -34.5889,
    lng: -58.4303,
    type: 'Loft',
    garages: 1,
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1600573472592-401b853a3fde?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop',
    ],
    description:
      'Loft de diseño en Palermo con doble altura, amplios ventanales y terminaciones premium. Perfecto para quienes buscan estilo urbano y comodidad.',
    amenities: DEFAULT_AMENITIES,
    agent: DEFAULT_AGENT,
  },
  {
    id: 3,
    price: '$650.000',
    title: 'Casa Barrio Cerrado Belgrano',
    badge: 'EN VENTA',
    bedrooms: 3,
    bathrooms: 1,
    area: 120,
    lat: -34.5627,
    lng: -58.4560,
    type: 'Casa',
    garages: 2,
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cd2e?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1600210492493-3a8f3f9b0f8f?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=500&fit=crop',
    ],
    description:
      'Casa en barrio cerrado con jardín, parrilla y espacios familiares. Seguridad las 24 horas y amenities de club dentro del complejo.',
    amenities: DEFAULT_AMENITIES,
    agent: DEFAULT_AGENT,
  },
  {
    id: 4,
    price: '$520.000',
    title: 'Dpto. 4 Amb. Palermo Hollywood',
    badge: 'EN VENTA',
    bedrooms: 4,
    bathrooms: 2,
    area: 130,
    lat: -34.5833,
    lng: -58.4333,
    type: 'Departamento',
    garages: 2,
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d9362d?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=500&fit=crop',
    ],
    description:
      'Amplio departamento de 4 ambientes en Palermo Hollywood con terraza, suite principal y cochera doble. Zona gastronómica y cultural.',
    amenities: DEFAULT_AMENITIES,
    agent: DEFAULT_AGENT,
  },
]

export function enrichProperty(
  property: Partial<Property> & Pick<Property, 'id' | 'price' | 'title' | 'badge' | 'bedrooms' | 'bathrooms' | 'area' | 'image' | 'lat' | 'lng'>,
  seedList: Property[] = properties,
): Property {
  const seed = seedList.find((item) => item.id === property.id)
  return withPropertyDefaults({
    ...property,
    type: property.type ?? seed?.type,
    garages: property.garages ?? seed?.garages,
    description: property.description ?? seed?.description,
    amenities: property.amenities ?? seed?.amenities,
    agent: property.agent ?? seed?.agent,
    images: property.images ?? seed?.images ?? [property.image],
  }) as Property
}
