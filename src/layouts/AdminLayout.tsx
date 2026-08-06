import { NavLink, Navigate, Outlet } from 'react-router-dom'
import {
  HiOutlineChartBar,
  HiOutlineBuildingOffice2,
  HiOutlineUsers,
  HiOutlineArrowLeft,
} from 'react-icons/hi2'
import { MobihouseLogo } from '../components/MobihouseLogo'
import { useAuth } from '../contexts/AuthContext'

const adminNav = [
  { to: '/admin', label: 'Panel General', icon: HiOutlineChartBar, end: true },
  { to: '/admin/propiedades', label: 'Propiedades', icon: HiOutlineBuildingOffice2 },
  { to: '/admin/usuarios', label: 'Usuarios', icon: HiOutlineUsers },
]

export function AdminLayout() {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100 text-slate-500">
        Verificando permisos...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: '/admin' }} />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <aside className="flex w-60 shrink-0 flex-col border-r border-slate-800 bg-slate-900 text-white">
        <div className="flex items-center gap-2.5 border-b border-slate-800 px-5 py-6">
          <MobihouseLogo className="h-7 w-7 text-cyan-400" />
          <div>
            <p className="text-sm font-bold">MobiHouse</p>
            <p className="text-xs text-slate-400">Administración</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {adminNav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `btn-animated flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive
                    ? 'bg-cyan-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-800 p-3">
          <NavLink
            to="/"
            className="btn-animated flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <HiOutlineArrowLeft className="h-5 w-5" />
            Volver al sitio
          </NavLink>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}
