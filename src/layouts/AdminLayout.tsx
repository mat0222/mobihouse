import { useMemo, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import {
  HiOutlineArchiveBox,
  HiOutlineArrowLeft,
  HiOutlineBell,
  HiOutlineBuildingOffice2,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
  HiOutlineChatBubbleLeftRight,
  HiOutlineClipboardDocumentList,
  HiOutlineCog6Tooth,
  HiOutlineCurrencyDollar,
  HiOutlineDocumentText,
  HiOutlineHeart,
  HiOutlineHomeModern,
  HiOutlineKey,
  HiOutlineMagnifyingGlass,
  HiOutlineMap,
  HiOutlineMegaphone,
  HiOutlineBars3,
  HiOutlineUsers,
  HiOutlineXMark,
} from 'react-icons/hi2'
import { MobihouseLogo } from '../components/MobihouseLogo'
import { useAuth } from '../contexts/AuthContext'
import { useAdminData } from '../admin/AdminDataContext'
import { useProperties } from '../contexts/PropertiesContext'

const primaryNav = [
  { to: '/admin', label: 'Inicio', icon: HiOutlineChartBar, end: true },
  { to: '/admin/propiedades', label: 'Propiedades', icon: HiOutlineBuildingOffice2 },
  { to: '/admin/clientes', label: 'Clientes', icon: HiOutlineUsers },
  { to: '/admin/agenda', label: 'Agenda', icon: HiOutlineCalendarDays },
  { to: '/admin/mensajes', label: 'Consultas', icon: HiOutlineChatBubbleLeftRight },
]

const opsNav = [
  { to: '/admin/ventas', label: 'Ventas', icon: HiOutlineCurrencyDollar },
  { to: '/admin/alquileres', label: 'Alquileres', icon: HiOutlineKey },
  { to: '/admin/contratos', label: 'Contratos', icon: HiOutlineDocumentText },
  { to: '/admin/pagos', label: 'Pagos', icon: HiOutlineArchiveBox },
  { to: '/admin/publicaciones', label: 'Publicaciones', icon: HiOutlineMegaphone },
]

const insightNav = [
  { to: '/admin/reportes', label: 'Reportes', icon: HiOutlineClipboardDocumentList },
  { to: '/admin/favoritos', label: 'Favoritos', icon: HiOutlineHeart },
  { to: '/admin/mapa', label: 'Mapa', icon: HiOutlineMap },
  { to: '/admin/documentos', label: 'Documentos', icon: HiOutlineHomeModern },
]

const systemNav = [
  { to: '/admin/usuarios', label: 'Usuarios', icon: HiOutlineUsers },
  { to: '/admin/notificaciones', label: 'Notificaciones', icon: HiOutlineBell },
  { to: '/admin/auditoria', label: 'Auditoría', icon: HiOutlineClipboardDocumentList },
  { to: '/admin/configuracion', label: 'Configuración', icon: HiOutlineCog6Tooth },
]

function NavGroup({
  title,
  items,
  onNavigate,
}: {
  title: string
  items: { to: string; label: string; icon: typeof HiOutlineChartBar; end?: boolean }[]
  onNavigate?: () => void
}) {
  return (
    <div className="mb-4">
      <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </p>
      <div className="space-y-0.5">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export function AdminLayout() {
  const { isAuthenticated, isAdmin, loading, user } = useAuth()
  const { unreadCount, clients, contracts, notifications } = useAdminData()
  const { properties } = useProperties()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return []
    const results: { label: string; to: string }[] = []
    for (const p of properties) {
      if (p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)) {
        results.push({ label: `Propiedad · ${p.title}`, to: `/admin/propiedades/${p.id}` })
      }
    }
    for (const c of clients) {
      const name = `${c.firstName} ${c.lastName}`.toLowerCase()
      if (name.includes(q) || c.id.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)) {
        results.push({
          label: `Cliente · ${c.firstName} ${c.lastName}`,
          to: `/admin/clientes/${c.id}`,
        })
      }
    }
    for (const ct of contracts) {
      if (ct.number.toLowerCase().includes(q) || ct.id.toLowerCase().includes(q)) {
        results.push({ label: `Contrato · ${ct.number}`, to: '/admin/contratos' })
      }
    }
    return results.slice(0, 8)
  }, [query, properties, clients, contracts])

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

  const sidebar = (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900 text-white">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-5">
        <div className="flex items-center gap-2.5">
          <MobihouseLogo className="h-7 w-7 text-cyan-400" />
          <div>
            <p className="text-sm font-bold">MobiHouse</p>
            <p className="text-[11px] text-slate-400">CRM Inmobiliario</p>
          </div>
        </div>
        <button
          type="button"
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <HiOutlineXMark className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <NavGroup title="Principal" items={primaryNav} onNavigate={() => setSidebarOpen(false)} />
        <NavGroup title="Operaciones" items={opsNav} onNavigate={() => setSidebarOpen(false)} />
        <NavGroup title="Insights" items={insightNav} onNavigate={() => setSidebarOpen(false)} />
        <NavGroup title="Sistema" items={systemNav} onNavigate={() => setSidebarOpen(false)} />
      </nav>

      <div className="border-t border-slate-800 p-3">
        <NavLink
          to="/"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Volver al sitio
        </NavLink>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <div className="hidden lg:flex">{sidebar}</div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Cerrar menú"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10">{sidebar}</div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
          <button
            type="button"
            className="rounded-lg border border-slate-200 p-2 text-slate-600 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <HiOutlineBars3 className="h-5 w-5" />
          </button>

          <div className="relative min-w-0 flex-1">
            <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setShowSearch(true)
              }}
              onFocus={() => setShowSearch(true)}
              onBlur={() => window.setTimeout(() => setShowSearch(false), 150)}
              placeholder="Buscar cliente, propiedad, contrato..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-cyan-400 focus:bg-white"
            />
            {showSearch && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                {searchResults.map((r) => (
                  <button
                    key={r.to + r.label}
                    type="button"
                    className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-cyan-50"
                    onMouseDown={() => {
                      navigate(r.to)
                      setQuery('')
                      setShowSearch(false)
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/admin/notificaciones"
            className="relative rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
          >
            <HiOutlineBell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </Link>

          <div className="hidden items-center gap-2 sm:flex">
            <img
              src={user?.avatar}
              alt=""
              className="h-8 w-8 rounded-full object-cover ring-2 ring-cyan-100"
            />
            <div className="leading-tight">
              <p className="text-xs font-semibold text-slate-800">{user?.name ?? 'Admin'}</p>
              <p className="text-[11px] text-slate-500">Administrador</p>
            </div>
          </div>
        </header>

        {!notifications[0]?.read && (
          <div className="border-b border-amber-100 bg-amber-50 px-4 py-2 text-xs text-amber-900">
            {notifications.find((n) => !n.read)?.body ?? 'Tenés notificaciones sin leer'}
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
