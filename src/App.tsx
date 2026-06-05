import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/layout/Layout'

// Pages
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import SuperAdminPage from './pages/superadmin/SuperAdminPage'
import PortalPage from './pages/portal/PortalPage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-vluma-dark flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-vluma-green border-t-transparent rounded-full animate-spin"></div>
        <span className="text-vluma-muted text-sm">Carregando...</span>
      </div>
    </div>
  )
  return session ? <Layout>{children}</Layout> : <Navigate to="/login" replace />
}

function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  const { isSuperAdmin, loading } = useAuth()
  if (loading) return null
  return isSuperAdmin ? <>{children}</> : <Navigate to="/" replace />
}

function AppRoutes() {
  return (
    <Routes>
      {/* Público */}
      <Route path="/login" element={<Login />} />
      <Route path="/portal/:empresaSlug" element={<PortalPage />} />

      {/* Privado */}
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/demandas" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/projetos" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/relatorios" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/configuracoes" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

      {/* Super Admin */}
      <Route path="/super-admin" element={
        <PrivateRoute><SuperAdminRoute><SuperAdminPage /></SuperAdminRoute></PrivateRoute>
      } />

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
