import { NavLink, useNavigate } from 'react-router-dom'
import { HiOutlineArrowRightOnRectangle } from 'react-icons/hi2'
import { MobihouseLogo } from './MobihouseLogo'
import { UserMenu } from './UserMenu'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/propiedades', label: 'Propiedades' },
  { to: '/mapa', label: 'Mapa Interactivo' },
  { to: '/favoritos', label: 'Favoritos' },
  { to: '/mensajes', label: 'Mensajes' },
  { to: '/configuracion', label: 'Configuración' },
]

export function Navbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
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
          <button
            type="button"
            onClick={handleLogout}
            className="btn-animated flex items-center gap-1.5 px-1 py-1 text-sm font-medium text-[#666666] hover:text-red-600"
          >
            <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
            Cerrar Sesión
          </button>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
