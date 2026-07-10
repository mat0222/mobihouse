import { Navigate, Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { ChatWidget } from '../components/ChatWidget'
import { useAuth } from '../contexts/AuthContext'

export function AppLayout() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f5f7fa]">
      <Navbar />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Outlet />
      </div>
      <ChatWidget />
    </div>
  )
}
