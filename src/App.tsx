import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Pages
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import ChamadosPage from './pages/chamados/ChamadosPage'
import SuperAdminPage from './pages/superadmin/SuperAdminPage'
import PortalPage from './pages/portal/PortalPage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-vluma-dark flex items-center justify-center">
      <div className="text-vluma-green text-lg font-medium animate-pulse">Carregando...</div>
    </div>
  )
  return session ? <>{children}</> : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      {/* Público */}
      <Route path="/login" element={<Login />} />
      <Route path="/portal/:empresaSlug" element={<PortalPage />} />

      {/* Privado */}
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/chamados" element={<PrivateRoute><ChamadosPage /></PrivateRoute>} />
      <Route path="/super-admin" element={<PrivateRoute><SuperAdminPage /></PrivateRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
