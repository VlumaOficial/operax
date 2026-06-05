import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  LayoutDashboard, Ticket, FolderKanban, BarChart3,
  Settings, LogOut, Menu, X, Shield, Bell,
  ChevronRight, ExternalLink
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
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  const filteredNav = navItems.filter(item => !item.superAdminOnly || isSuperAdmin)

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full"
      style={{
        background: 'linear-gradient(180deg, #1a2e1a 0%, #161B22 40%, #0f1419 100%)'
      }}
    >
      {/* Logo + Toggle */}
      <div className={`flex items-center border-b border-vluma-border h-14 px-3 ${collapsed && !mobile ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-vluma-green rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-vluma-green/20">
            <span className="text-vluma-dark font-bold text-sm">O</span>
          </div>
          {(!collapsed || mobile) && (
            <div>
              <h1 className="text-vluma-text font-bold text-sm leading-none">Operax</h1>
              <p className="text-vluma-muted text-[10px] mt-0.5 truncate max-w-[100px]">{empresa?.nome || 'VLUMA'}</p>
            </div>
          )}
        </div>
        {(!collapsed || mobile) && (
          <button
            onClick={() => mobile ? setMobileOpen(false) : setCollapsed(true)}
            className="text-vluma-muted hover:text-vluma-text transition-colors p-1 rounded hidden md:flex"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {filteredNav.map(item => {
          const isActive = location.pathname === item.path
          return (
            <div key={item.path} className="relative group">
              <Link
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-2.5 py-2.5 rounded-lg transition-all duration-150
                  ${collapsed && !mobile ? 'justify-center' : ''}
                  ${isActive
                    ? 'bg-vluma-green text-vluma-dark font-medium shadow-md shadow-vluma-green/20'
                    : 'text-vluma-muted hover:text-vluma-text hover:bg-white/5'
                  }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {(!collapsed || mobile) && (
                  <>
                    <span className="text-sm flex-1">{item.label}</span>
                    {isActive && <ChevronRight size={14} />}
                  </>
                )}
              </Link>
              {/* Tooltip quando collapsed */}
              {collapsed && !mobile && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-vluma-card border border-vluma-border rounded text-vluma-text text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {item.label}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Expand button quando collapsed */}
      {collapsed && !mobile && (
        <div className="px-2 pb-2">
          <button
            onClick={() => setCollapsed(false)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-vluma-muted hover:text-vluma-text hover:bg-white/5 transition-all"
            title="Expandir menu"
          >
            <Menu size={18} />
          </button>
        </div>
      )}

      {/* User + Footer */}
      <div className="border-t border-vluma-border">
        {/* User */}
        <div className={`p-3 flex items-center gap-2.5 ${collapsed && !mobile ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-vluma-green/20 border border-vluma-green/30 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-vluma-green text-xs font-semibold">
              {usuario?.nome?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          {(!collapsed || mobile) && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-vluma-text text-xs font-medium truncate">{usuario?.nome}</p>
                <p className="text-vluma-muted text-[10px] truncate">{usuario?.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="text-vluma-muted hover:text-red-400 transition-colors p-1 rounded flex-shrink-0"
                title="Sair"
              >
                <LogOut size={15} />
              </button>
            </>
          )}
        </div>

        {/* VLUMA Footer */}
        {(!collapsed || mobile) && (
          <div className="px-3 pb-3">
            
            <a
              href="https://www.vluma.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 group"
            >
              <img src="/logo-vluma.png" alt="VLUMA" className="w-5 h-5 rounded-full flex-shrink-0" />
              <span className="text-[10px] text-vluma-muted group-hover:text-vluma-green transition-colors">
                Desenvolvido por VLUMA
              </span>
              <ExternalLink size={9} className="text-vluma-muted group-hover:text-vluma-green transition-colors" />
            </a>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-vluma-dark overflow-hidden">

      {/* Sidebar Desktop */}
      <aside className={`hidden md:flex flex-col border-r border-vluma-border transition-all duration-300 flex-shrink-0 ${collapsed ? 'w-[60px]' : 'w-56'}`}>
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-56 border-r border-vluma-border z-10">
            <SidebarContent mobile />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="h-14 bg-vluma-card border-b border-vluma-border flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => collapsed ? setCollapsed(false) : setMobileOpen(!mobileOpen)}
              className="text-vluma-muted hover:text-vluma-text transition-colors p-1.5 rounded-lg hover:bg-white/5 md:hidden"
            >
              <Menu size={20} />
            </button>
            <p className="text-vluma-muted text-xs hidden md:block">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isSuperAdmin && (
              <span className="bg-vluma-green/10 text-vluma-green text-[10px] font-semibold px-2.5 py-1 rounded-full border border-vluma-green/20 tracking-wide">
                SUPER ADMIN
              </span>
            )}
            <button className="text-vluma-muted hover:text-vluma-text transition-colors p-2 rounded-lg hover:bg-white/5 relative">
              <Bell size={17} />
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
