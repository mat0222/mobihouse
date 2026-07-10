import { Link } from 'react-router-dom'
import {
  HiOutlineBuildingOffice2,
  HiOutlineUsers,
  HiOutlineChatBubbleLeftRight,
  HiOutlineHeart,
} from 'react-icons/hi2'
import { useProperties } from '../../contexts/PropertiesContext'
import { useFavorites } from '../../contexts/FavoritesContext'
import { conversations } from '../../data/messages'

const stats = [
  { label: 'Propiedades activas', key: 'properties', icon: HiOutlineBuildingOffice2, color: 'text-cyan-600 bg-cyan-50' },
  { label: 'Usuarios registrados', key: 'users', icon: HiOutlineUsers, color: 'text-violet-600 bg-violet-50' },
  { label: 'Consultas pendientes', key: 'messages', icon: HiOutlineChatBubbleLeftRight, color: 'text-amber-600 bg-amber-50' },
  { label: 'Favoritos totales', key: 'favorites', icon: HiOutlineHeart, color: 'text-rose-600 bg-rose-50' },
] as const

export function AdminDashboardPage() {
  const { properties } = useProperties()
  const { favorites } = useFavorites()
  const unread = conversations.reduce((s: number, c) => s + c.unread, 0)

  const values: Record<(typeof stats)[number]['key'], number> = {
    properties: properties.length,
    users: 24,
    messages: unread,
    favorites: favorites.length,
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Panel Administrativo</h1>
      <p className="mb-8 text-slate-500">Vista general de la plataforma MobiHouse</p>

      <div className="mb-8 grid grid-cols-4 gap-4">
        {stats.map(({ label, key, icon: Icon, color }) => (
          <div key={key} className="rounded-xl bg-white p-5 shadow-sm">
            <div className={`mb-3 inline-flex rounded-lg p-2.5 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{values[key]}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Acciones rápidas</h2>
          <div className="space-y-2">
            <Link
              to="/admin/propiedades"
              className="btn-animated block rounded-lg border border-slate-100 px-4 py-3 text-sm font-medium text-slate-700 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
            >
              Gestionar propiedades →
            </Link>
            <Link
              to="/admin/usuarios"
              className="btn-animated block rounded-lg border border-slate-100 px-4 py-3 text-sm font-medium text-slate-700 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
            >
              Gestionar usuarios →
            </Link>
          </div>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Actividad reciente</h2>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex justify-between border-b border-slate-50 pb-2">
              <span>Nueva consulta — Loft Palermo</span>
              <span className="text-slate-400">Hace 10 min</span>
            </li>
            <li className="flex justify-between border-b border-slate-50 pb-2">
              <span>Propiedad actualizada — Belgrano</span>
              <span className="text-slate-400">Ayer</span>
            </li>
            <li className="flex justify-between">
              <span>Usuario registrado — María López</span>
              <span className="text-slate-400">Lun</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
