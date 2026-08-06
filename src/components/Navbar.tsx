import { Link, NavLink, useNavigate } from 'react-router-dom'
import { HiOutlineArrowRightOnRectangle } from 'react-icons/hi2'
import { MobihouseLogo } from './MobihouseLogo'
import { UserMenu } from './UserMenu'
import { useAuth } from '../contexts/AuthContext'

type NavItem = { to: string; label: string; end?: boolean }

const publicNavItems: NavItem[] = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/propiedades', label: 'Propiedades' },
  { to: '/mapa', label: 'Mapa Interactivo' },
]

const authNavItems: NavItem[] = [
  { to: '/favoritos', label: 'Favoritos' },
  { to: '/mensajes', label: 'Mensajes' },
  { to: '/configuracion', label: 'Configuración' },
]

export function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const navItems = isAuthenticated ? [...publicNavItems, ...authNavItems] : publicNavItems

  const handleLogout = () => {
    void logout().then(() => navigate('/'))
  }

  return (
    <header className="shrink-0 border-b border-slate-200 bg-white">
      <div className="flex items-center px-8 py-4">
        <div className="flex flex-1 items-center">
          <NavLink to="/" className="flex shrink-0 items-center gap-2.5">
            <MobihouseLogo className="h-8 w-8 text-[#004d40]" />
            <span className="text-xl font-bold tracking-tight text-[#004d40]">MobiHouse</span>
          </NavLink>
        </div>

        <nav className="flex flex-1 items-center justify-center gap-1">
          {navItems.map(({ to, label, end }, index) => (
            <div key={to} className="flex items-center">
              {index > 0 && (
                <span className="mx-3 text-sm text-[#cccccc]" aria-hidden="true">
                  |
                </span>
              )}
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-1 py-1 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-b-[3px] border-[#004d40] pb-0.5 text-[#004d40]'
                      : 'text-[#666666] hover:text-[#004d40]'
                  }`
                }
              >
                {label}
              </NavLink>
            </div>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-3">
          {isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={handleLogout}
                className="btn-animated flex items-center gap-1.5 px-1 py-1 text-sm font-medium text-[#666666] hover:text-red-600"
              >
                <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
                Cerrar Sesión
              </button>
              <UserMenu />
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn-animated px-1 py-1 text-sm font-medium text-[#666666] hover:text-[#004d40]"
              >
                Ingresar
              </Link>
              <Link
                to="/registro"
                className="btn-animated rounded-lg bg-[#004d40] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#00695c]"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
