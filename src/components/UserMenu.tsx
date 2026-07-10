import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  HiOutlineShieldCheck,
  HiOutlineUser,
  HiOutlineCog6Tooth,
  HiChevronDown,
} from 'react-icons/hi2'
import { useAuth } from '../contexts/AuthContext'

export function UserMenu() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (!user) return null

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="btn-animated flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-slate-50"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <img
          src={user.avatar}
          alt={user.name}
          className="h-8 w-8 rounded-full object-cover ring-2 ring-[#004d40]/20"
        />
        <HiChevronDown
          className={`h-4 w-4 text-[#666666] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-52 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          <div className="border-b border-slate-100 px-4 py-2.5">
            <p className="text-sm font-medium text-slate-800">{user.name}</p>
          </div>
          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                navigate('/admin')
              }}
              className="btn-animated flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-cyan-50 hover:text-cyan-700"
            >
              <HiOutlineShieldCheck className="h-4 w-4 text-cyan-500" />
              Panel Administrativo
            </button>
          )}
          <Link
            to="/configuracion"
            onClick={() => setOpen(false)}
            className="btn-animated flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            <HiOutlineUser className="h-4 w-4" />
            Mi perfil
          </Link>
          <Link
            to="/configuracion"
            onClick={() => setOpen(false)}
            className="btn-animated flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            <HiOutlineCog6Tooth className="h-4 w-4" />
            Configuración
          </Link>
        </div>
      )}
    </div>
  )
}
