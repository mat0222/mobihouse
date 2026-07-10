import { useState } from 'react'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2'

interface AdminUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'agent'
  status: 'active' | 'inactive'
  joined: string
}

const initialUsers: AdminUser[] = [
  { id: '1', name: 'Andrés García', email: 'andres@mobihouse.com', role: 'admin', status: 'active', joined: 'Ene 2024' },
  { id: '2', name: 'María López', email: 'maria@mobihouse.com', role: 'user', status: 'active', joined: 'Mar 2024' },
  { id: '3', name: 'Laura Martínez', email: 'laura@mobihouse.com', role: 'agent', status: 'active', joined: 'Jun 2024' },
  { id: '4', name: 'Carlos Ruiz', email: 'carlos@mobihouse.com', role: 'user', status: 'inactive', joined: 'Ago 2024' },
  { id: '5', name: 'Sofía Fernández', email: 'sofia@mobihouse.com', role: 'user', status: 'active', joined: 'Oct 2024' },
]

const roleLabels = { admin: 'Administrador', user: 'Usuario', agent: 'Agente' }
const statusStyles = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-slate-100 text-slate-500',
}

export function AdminUsersPage() {
  const [users, setUsers] = useState(initialUsers)

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
          : u,
      ),
    )
  }

  const removeUser = (id: string) => {
    if (id === '1') return
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Gestión de Usuarios</h1>
      <p className="mb-8 text-slate-500">{users.length} usuarios registrados</p>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Usuario</th>
              <th className="px-5 py-3">Rol</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3">Registro</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </td>
                <td className="px-5 py-4 text-slate-600">{roleLabels[user.role]}</td>
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => toggleStatus(user.id)}
                    className={`rounded px-2 py-0.5 text-xs font-medium ${statusStyles[user.status]}`}
                  >
                    {user.status === 'active' ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td className="px-5 py-4 text-slate-500">{user.joined}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="btn-animated rounded-lg p-2 text-slate-500 hover:bg-cyan-50 hover:text-cyan-600"
                      aria-label="Editar usuario"
                    >
                      <HiOutlinePencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeUser(user.id)}
                      disabled={user.id === '1'}
                      className="btn-animated rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label="Eliminar usuario"
                    >
                      <HiOutlineTrash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
