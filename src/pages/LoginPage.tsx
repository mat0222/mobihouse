import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { MobihouseLogo } from '../components/MobihouseLogo'
import { useAuth } from '../contexts/AuthContext'

export function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('andres@mobihouse.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (login(email, password)) {
      navigate('/')
      return
    }

    setError('Credenciales incorrectas. Usá andres@mobihouse.com / admin123')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-[#f5f7fa] to-cyan-50 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 flex flex-col items-center text-center">
          <MobihouseLogo className="mb-3 h-12 w-12 text-green-600" />
          <h1 className="text-2xl font-bold text-slate-900">MobiHouse</h1>
          <p className="mt-1 text-sm text-slate-500">
            Ingresá a tu cuenta para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              required
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            className="btn-animated btn-primary w-full rounded-lg bg-cyan-500 py-3 text-sm font-semibold text-white hover:bg-cyan-600"
          >
            Iniciar sesión
          </button>
        </form>

        <div className="mt-6 rounded-lg bg-slate-50 p-4 text-xs text-slate-500">
          <p className="font-semibold text-slate-700">Cuentas de prueba:</p>
          <p className="mt-1">Admin: andres@mobihouse.com / admin123</p>
          <p>Usuario: maria@mobihouse.com / user1234</p>
        </div>
      </div>
    </div>
  )
}
