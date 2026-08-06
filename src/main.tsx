import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { FavoritesProvider } from './contexts/FavoritesContext'
import { PropertiesProvider } from './contexts/PropertiesContext'

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={routerBasename}>
      <AuthProvider>
        <PropertiesProvider>
          <FavoritesProvider>
            <App />
          </FavoritesProvider>
        </PropertiesProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
