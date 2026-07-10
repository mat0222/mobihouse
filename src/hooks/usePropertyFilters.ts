import { useMemo, useState } from 'react'
import type { Property, PropertyBadge } from '../data/properties'

export interface PropertyFilters {
  search: string
  type: PropertyBadge | 'all'
  location: string
  maxPrice: string
  bedrooms: string
}

const defaultFilters: PropertyFilters = {
  search: '',
  type: 'all',
  location: '',
  maxPrice: '',
  bedrooms: '',
}

function parsePrice(price: string): number {
  return Number(price.replace(/[$.\s]/g, ''))
}

export function usePropertyFilters(properties: Property[]) {
  const [filters, setFilters] = useState<PropertyFilters>(defaultFilters)

  const filtered = useMemo(() => {
    return properties.filter((property) => {
      const search = filters.search.toLowerCase()
      if (
        search &&
        !property.title.toLowerCase().includes(search) &&
        !property.price.toLowerCase().includes(search)
      ) {
        return false
      }

      if (filters.type !== 'all' && property.badge !== filters.type) {
        return false
      }

      if (
        filters.location &&
        !property.title.toLowerCase().includes(filters.location.toLowerCase())
      ) {
        return false
      }

      if (filters.maxPrice) {
        const max = Number(filters.maxPrice)
        if (!Number.isNaN(max) && parsePrice(property.price) > max) {
          return false
        }
      }

      if (filters.bedrooms) {
        const beds = Number(filters.bedrooms)
        if (!Number.isNaN(beds) && property.bedrooms < beds) {
          return false
        }
      }

      return true
    })
  }, [properties, filters])

  const resetFilters = () => setFilters(defaultFilters)

  return { filters, setFilters, filtered, resetFilters }
}
