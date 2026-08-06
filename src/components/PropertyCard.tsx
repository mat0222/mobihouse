import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HiOutlineHeart, HiHeart } from 'react-icons/hi2'
import { MdBed, MdBathtub, MdSquareFoot } from 'react-icons/md'
import type { Property } from '../data/properties'
import { useAuth } from '../contexts/AuthContext'
import { useFavorites } from '../contexts/FavoritesContext'

const badgeStyles: Record<Property['badge'], string> = {
  NUEVO: 'bg-blue-500 text-white',
  'EN ALQUILER': 'bg-[#d4b896] text-[#5c4a32]',
  'EN VENTA': 'bg-[#a8d5a2] text-[#2d5a28]',
}

export function PropertyCard({ property }: { property: Property }) {
  const { isAuthenticated } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  const navigate = useNavigate()
  const location = useLocation()
  const favorited = isAuthenticated && isFavorite(property.id)

  const handleFavorite = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    toggleFavorite(property.id)
  }

  return (
    <article className="overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="h-44 w-full object-cover"
        />
        <span
          className={`absolute left-3 top-3 rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badgeStyles[property.badge]}`}
        >
          {property.badge}
        </span>
        <button
          type="button"
          onClick={handleFavorite}
          className={`btn-animated absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 hover:bg-white hover:shadow-md ${
            favorited ? 'text-red-500' : 'text-slate-600 hover:text-red-500'
          }`}
          aria-label={
            !isAuthenticated
              ? 'Iniciá sesión para guardar favoritos'
              : favorited
                ? 'Quitar de favoritos'
                : 'Agregar a favoritos'
          }
        >
          {favorited ? (
            <HiHeart className="h-4 w-4" />
          ) : (
            <HiOutlineHeart className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="p-4">
        <p className="text-lg font-bold text-slate-900">{property.price}</p>
        <p className="mt-0.5 text-sm text-slate-600">{property.title}</p>

        <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <MdBed className="h-4 w-4" />
            {property.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <MdBathtub className="h-4 w-4" />
            {property.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <MdSquareFoot className="h-4 w-4" />
            {property.area} m2
          </span>
        </div>

        <Link
          to={`/propiedades/${property.id}`}
          className="btn-animated btn-primary mt-4 flex w-full items-center justify-center rounded-lg bg-cyan-500 py-2.5 text-sm font-semibold text-white hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/30"
        >
          Ver Detalles
        </Link>
      </div>
    </article>
  )
}
