import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { RequireAuth } from './components/RequireAuth'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { HomePage } from './pages/HomePage'
import { PropertiesPage } from './pages/PropertiesPage'
import { PropertyDetailPage } from './pages/PropertyDetailPage'
import { MapPage } from './pages/MapPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { MessagesPage } from './pages/MessagesPage'
import { SettingsPage } from './pages/SettingsPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminPropertiesPage } from './pages/admin/AdminPropertiesPage'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="propiedades" element={<PropertiesPage />} />
        <Route path="propiedades/:id" element={<PropertyDetailPage />} />
        <Route path="mapa" element={<MapPage />} />

        <Route element={<RequireAuth />}>
          <Route path="favoritos" element={<FavoritesPage />} />
          <Route path="mensajes" element={<MessagesPage />} />
          <Route path="configuracion" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="propiedades" element={<AdminPropertiesPage />} />
        <Route path="usuarios" element={<AdminUsersPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
