import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  LayoutDashboard,
  Ticket,
  FolderKanban,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  ChevronRight,
  Bell
} from 'lucide-react'

interface NavItem {
  label: string
  icon: React.ReactNode
  path: string
  superAdminOnly?: boolean
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/' },
  { label: 'Demandas', icon: <Ticket size={18} />, path: '/demandas' },
  { label: 'Projetos', icon: <FolderKanban size={18} />, path: '/projetos' },
  { label: 'Relatórios', icon: <BarChart3 size={18} />, path: '/relatorios' },
  { label: 'Configurações', icon: <Settings size={18} />, path: '/configuracoes' },
  { label: 'Super Admin', icon: <Shield size={18} />, path: '/super-admin', superAdminOnly: true },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const { usuario, empresa, isSuperAdmin, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  const filteredNav = navItems.filter(item => !item.superAdminOnly || isSuperAdmin)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-vluma-border">
        <div className="w-8 h-8 bg-vluma-green rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-vluma-dark font-bold text-sm">O</span>
        </div>
        {sidebarOpen && (
          <div>
            <h1 className="text-vluma-text font-bold text-base leading-none">Operax</h1>
            <p className="text-vluma-muted text-xs mt-0.5">{empresa?.nome || 'VLUMA'}</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {filteredNav.map(item => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group
                ${isActive
                  ? 'bg-vluma-green text-vluma-dark font-medium'
                  : 'text-vluma-muted hover:text-vluma-text hover:bg-vluma-border'
                }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {sidebarOpen && (
                <>
                  <span className="text-sm flex-1">{item.label}</span>
                  {isActive && <ChevronRight size={14} />}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="border-t border-vluma-border p-3">
        <div className={`flex items-center gap-3 ${sidebarOpen ? '' : 'justify-center'}`}>
          <div className="w-8 h-8 bg-vluma-border rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-vluma-text text-xs font-medium">
              {usuario?.nome?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-vluma-text text-sm font-medium truncate">{usuario?.nome}</p>
              <p className="text-vluma-muted text-xs truncate">{usuario?.email}</p>
            </div>
          )}
          {sidebarOpen && (
            <button
              onClick={handleSignOut}
              className="text-vluma-muted hover:text-vluma-red transition-colors p-1 rounded"
              title="Sair"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-vluma-dark overflow-hidden">

      {/* Sidebar Desktop */}
      <aside className={`hidden md:flex flex-col bg-vluma-card border-r border-vluma-border transition-all duration-300 ${sidebarOpen ? 'w-56' : 'w-16'}`}>
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-56 bg-vluma-card border-r border-vluma-border z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="h-14 bg-vluma-card border-b border-vluma-border flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setSidebarOpen(!sidebarOpen); setMobileOpen(!mobileOpen) }}
              className="text-vluma-muted hover:text-vluma-text transition-colors p-1 rounded"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden md:block">
              <p className="text-vluma-muted text-xs">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isSuperAdmin && (
              <span className="bg-vluma-green/20 text-vluma-green text-xs font-medium px-2 py-1 rounded-full border border-vluma-green/30">
                Super Admin
              </span>
            )}
            <button className="text-vluma-muted hover:text-vluma-text transition-colors p-2 rounded-lg hover:bg-vluma-border relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-vluma-green rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
