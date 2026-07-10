import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export function SettingsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState({
    email: true,
    messages: true,
    favorites: false,
    marketing: false,
  })
  const [profile, setProfile] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: '+54 11 4567-8900',
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-y-auto p-6">
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Configuración</h1>
      <p className="mb-8 text-slate-500">Administrá tu perfil y preferencias</p>

      <div className="mx-auto w-full max-w-2xl space-y-6">
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Perfil</h2>
          <div className="mb-5 flex items-center gap-4">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-green-200"
            />
            <div>
              <p className="font-semibold text-slate-900">{user?.name}</p>
              <p className="text-sm text-slate-500 capitalize">{user?.role}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                Nombre completo
              </label>
              <input
                id="name"
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </div>
            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-700">
                Teléfono
              </label>
              <input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </div>
          </div>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Notificaciones</h2>
          <div className="space-y-3">
            {(
              [
                ['email', 'Alertas por correo'],
                ['messages', 'Nuevos mensajes'],
                ['favorites', 'Cambios en favoritos'],
                ['marketing', 'Novedades y promociones'],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-100 px-4 py-3 hover:bg-slate-50"
              >
                <span className="text-sm text-slate-700">{label}</span>
                <input
                  type="checkbox"
                  checked={notifications[key]}
                  onChange={(e) =>
                    setNotifications({ ...notifications, [key]: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-400"
                />
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Preferencias</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="language" className="mb-1 block text-sm font-medium text-slate-700">
                Idioma
              </label>
              <select
                id="language"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-400"
                defaultValue="es"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label htmlFor="currency" className="mb-1 block text-sm font-medium text-slate-700">
                Moneda
              </label>
              <select
                id="currency"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-400"
                defaultValue="usd"
              >
                <option value="usd">USD</option>
                <option value="ars">ARS</option>
              </select>
            </div>
          </div>
        </section>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            className="btn-animated rounded-lg bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-cyan-600"
          >
            Guardar cambios
          </button>
          {saved && (
            <span className="text-sm font-medium text-green-600">
              Cambios guardados correctamente
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
