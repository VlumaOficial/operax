import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { LayoutDashboard, Ticket, FolderKanban, BarChart3, Settings, LogOut, Shield, Bell, ChevronsLeft, ChevronsRight, ExternalLink } from "lucide-react"

interface NavItem { label: string; icon: React.ReactNode; path: string; superAdminOnly?: boolean }

const navItems: NavItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/" },
  { label: "Demandas", icon: <Ticket size={18} />, path: "/demandas" },
  { label: "Projetos", icon: <FolderKanban size={18} />, path: "/projetos" },
  { label: "Relatórios", icon: <BarChart3 size={18} />, path: "/relatorios" },
  { label: "Configurações", icon: <Settings size={18} />, path: "/configuracoes" },
  { label: "Super Admin", icon: <Shield size={18} />, path: "/super-admin", superAdminOnly: true },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const { usuario, empresa, isSuperAdmin, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate("/login")
  }

  const filteredNav = navItems.filter(item => !item.superAdminOnly || isSuperAdmin)

  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        className={["flex flex-col transition-all duration-300 flex-shrink-0 overflow-hidden", collapsed ? "w-[56px]" : "w-56"].join(" ")}
        style={{ background: "rgba(9,24,42,0.85)", borderRight: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center h-14 px-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-8 h-8 bg-vluma-green rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <h1 className="text-vluma-text font-bold text-sm leading-none">Operax</h1>
                <p className="text-vluma-muted text-[10px] mt-0.5 truncate">{empresa?.nome || "VLUMA"}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button onClick={() => setCollapsed(true)} className="text-vluma-muted hover:text-vluma-green transition-colors p-1 rounded" title="Recolher">
              <ChevronsLeft size={16} />
            </button>
          )}
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-hidden">
          {filteredNav.map(item => {
            const isActive = location.pathname === item.path
            return (
              <div key={item.path} className="relative group">
                <Link
                  to={item.path}
                  className={["flex items-center gap-3 px-2.5 py-2.5 rounded-lg transition-all duration-150", collapsed ? "justify-center" : "", isActive ? "bg-vluma-green text-white font-medium" : "text-vluma-muted hover:text-vluma-text hover:bg-white/5"].join(" ")}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span className="text-sm">{item.label}</span>}
                </Link>
                {collapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg text-vluma-text text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50" style={{ background: "rgba(12,28,46,0.95)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    {item.label}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div className={["p-3 flex items-center gap-2.5", collapsed ? "justify-center" : ""].join(" ")}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(29,158,117,0.15)", border: "1px solid rgba(29,158,117,0.25)" }}>
              <span className="text-vluma-green text-xs font-semibold">{usuario?.nome?.charAt(0).toUpperCase() || "U"}</span>
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-vluma-text text-xs font-medium truncate">{usuario?.nome}</p>
                  <p className="text-vluma-muted text-[10px] truncate">{usuario?.email}</p>
                </div>
                <button onClick={handleSignOut} className="text-vluma-muted hover:text-red-400 transition-colors p-1 rounded" title="Sair">
                  <LogOut size={15} />
                </button>
              </>
            )}
          </div>
          {!collapsed && (
            <div className="px-3 pb-3">
              <a href="https://www.vluma.com.br" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                <img src="/logo-vluma.png" alt="VLUMA" className="w-5 h-5 rounded-full flex-shrink-0" />
                <span className="text-[10px] text-vluma-muted group-hover:text-vluma-green transition-colors">Desenvolvido por VLUMA</span>
                <ExternalLink size={9} className="text-vluma-muted group-hover:text-vluma-green transition-colors" />
              </a>
            </div>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 flex items-center justify-between px-4 flex-shrink-0" style={{ background: "rgba(6,16,28,0.8)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-3">
            {collapsed && (
              <button onClick={() => setCollapsed(false)} className="text-vluma-muted hover:text-vluma-green transition-colors p-1.5 rounded-lg hover:bg-white/5" title="Expandir">
                <ChevronsRight size={18} />
              </button>
            )}
            <p className="text-vluma-muted text-xs">
              {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isSuperAdmin && (
              <span className="text-vluma-green text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wide" style={{ background: "rgba(29,158,117,0.1)", border: "1px solid rgba(29,158,117,0.2)" }}>
                SUPER ADMIN
              </span>
            )}
            <button className="text-vluma-muted hover:text-vluma-text transition-colors p-2 rounded-lg hover:bg-white/5 relative">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-vluma-green rounded-full"></span>
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
