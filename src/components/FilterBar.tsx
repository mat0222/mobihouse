import { HiOutlineMagnifyingGlass } from 'react-icons/hi2'
import type { PropertyBadge } from '../data/properties'
import type { PropertyFilters } from '../hooks/usePropertyFilters'

interface FilterBarProps {
  filters: PropertyFilters
  onChange: (filters: PropertyFilters) => void
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const update = (partial: Partial<PropertyFilters>) => {
    onChange({ ...filters, ...partial })
  }

  return (
    <div className="mb-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="search" className="text-xs font-medium text-slate-500">
            Buscar
          </label>
          <div className="relative">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="search"
              type="text"
              placeholder="Nombre o precio..."
              value={filters.search}
              onChange={(e) => update({ search: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="type" className="text-xs font-medium text-slate-500">
            Tipo (Venta/Alquiler)
          </label>
          <select
            id="type"
            value={filters.type}
            onChange={(e) => update({ type: e.target.value as PropertyBadge | 'all' })}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-cyan-400"
          >
            <option value="all">Todos</option>
            <option value="NUEVO">Nuevo</option>
            <option value="EN VENTA">En venta</option>
            <option value="EN ALQUILER">En alquiler</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="location" className="text-xs font-medium text-slate-500">
            Ubicación
          </label>
          <input
            id="location"
            type="text"
            placeholder="Ej: Palermo, Belgrano..."
            value={filters.location}
            onChange={(e) => update({ location: e.target.value })}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="bedrooms" className="text-xs font-medium text-slate-500">
            Habitaciones (mín.)
          </label>
          <select
            id="bedrooms"
            value={filters.bedrooms}
            onChange={(e) => update({ bedrooms: e.target.value })}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-cyan-400"
          >
            <option value="">Cualquiera</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>
      </div>

      {(filters.search || filters.type !== 'all' || filters.location || filters.bedrooms) && (
        <button
          type="button"
          onClick={() =>
            onChange({
              search: '',
              type: 'all',
              location: '',
              maxPrice: '',
              bedrooms: '',
            })
          }
          className="btn-animated mt-3 text-xs font-medium text-cyan-600 hover:text-cyan-700"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  )
}
