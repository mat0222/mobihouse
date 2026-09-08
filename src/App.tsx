import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { RequireAuth } from './components/RequireAuth'
import { AdminDataProvider } from './admin/AdminDataContext'
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
import { AdminPropertiesListPage } from './pages/admin/AdminPropertiesListPage'
import { AdminPropertyDetailPage } from './pages/admin/AdminPropertyDetailPage'
import { AdminClientsPage, AdminClientDetailPage } from './pages/admin/AdminClientsPage'
import { AdminAgendaPage } from './pages/admin/AdminAgendaPage'
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage'
import { AdminSalesPage } from './pages/admin/AdminSalesPage'
import {
  AdminRentalsPage,
  AdminContractsPage,
  AdminPaymentsPage,
} from './pages/admin/AdminRentalsContractsPayments'
import { AdminPublicationsPage } from './pages/admin/AdminPublicationsPage'
import { AdminReportsPage } from './pages/admin/AdminReportsPage'
import {
  AdminDocumentsPage,
  AdminFavoritesInsightsPage,
  AdminMapPage,
} from './pages/admin/AdminDocsFavoritesMap'
import {
  AdminUsersPage,
  AdminNotificationsPage,
  AdminConfigPage,
  AdminAuditPage,
} from './pages/admin/AdminSystemPages'

function AdminRoot() {
  return (
    <AdminDataProvider>
      <AdminLayout />
    </AdminDataProvider>
  )
}

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

      <Route path="/admin" element={<AdminRoot />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="propiedades" element={<AdminPropertiesListPage />} />
        <Route path="propiedades/:id" element={<AdminPropertyDetailPage />} />
        <Route path="clientes" element={<AdminClientsPage />} />
        <Route path="clientes/:id" element={<AdminClientDetailPage />} />
        <Route path="agenda" element={<AdminAgendaPage />} />
        <Route path="mensajes" element={<AdminMessagesPage />} />
        <Route path="ventas" element={<AdminSalesPage />} />
        <Route path="alquileres" element={<AdminRentalsPage />} />
        <Route path="contratos" element={<AdminContractsPage />} />
        <Route path="pagos" element={<AdminPaymentsPage />} />
        <Route path="publicaciones" element={<AdminPublicationsPage />} />
        <Route path="reportes" element={<AdminReportsPage />} />
        <Route path="documentos" element={<AdminDocumentsPage />} />
        <Route path="favoritos" element={<AdminFavoritesInsightsPage />} />
        <Route path="mapa" element={<AdminMapPage />} />
        <Route path="usuarios" element={<AdminUsersPage />} />
        <Route path="notificaciones" element={<AdminNotificationsPage />} />
        <Route path="configuracion" element={<AdminConfigPage />} />
        <Route path="auditoria" element={<AdminAuditPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
