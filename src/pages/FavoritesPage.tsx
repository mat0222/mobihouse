import { HiOutlineHeart } from 'react-icons/hi2'
import { Link } from 'react-router-dom'
import { PropertyCard } from '../components/PropertyCard'
import { useFavorites } from '../contexts/FavoritesContext'
import { useProperties } from '../contexts/PropertiesContext'

export function FavoritesPage() {
  const { favorites } = useFavorites()
  const { properties } = useProperties()
  const favoriteProperties = properties.filter((p) => favorites.includes(p.id))

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-y-auto p-6">
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Mis Favoritos</h1>
      <p className="mb-6 text-slate-500">
        {favoriteProperties.length}{' '}
        {favoriteProperties.length === 1 ? 'propiedad guardada' : 'propiedades guardadas'}
      </p>

      {favoriteProperties.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-white p-16 shadow-sm">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
            <HiOutlineHeart className="h-8 w-8 text-rose-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Aún no tenés favoritos</h2>
          <p className="mt-2 max-w-sm text-center text-sm text-slate-500">
            Guardá propiedades que te interesen haciendo clic en el corazón de cada tarjeta.
          </p>
          <Link
            to="/propiedades"
            className="btn-animated btn-primary mt-6 rounded-lg bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-cyan-600"
          >
            Explorar propiedades
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
          {favoriteProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  )
}
