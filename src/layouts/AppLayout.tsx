import { Navigate, Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { ChatWidget } from '../components/ChatWidget'
import { useAuth } from '../contexts/AuthContext'

export function AppLayout() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f5f7fa] text-slate-500">
        Cargando...
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f5f7fa]">
      <Navbar />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Outlet />
      </div>
      {isAuthenticated && <ChatWidget />}
    </div>
  )
}
