import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { supabase } from "../../lib/supabase"
import { Shield, Building2, CreditCard, BarChart3, Pencil, Power, Plus, Search } from "lucide-react"

type TabType = "empresas" | "planos" | "metricas"

interface Empresa {
  id: string
  nome: string
  email: string
  plano: string
  status: string
  modulos_ativos: string[]
  created_at: string
}

export default function SuperAdminPage() {
  const { isSuperAdmin } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>("empresas")
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!isSuperAdmin) {
      navigate("/")
      return
    }
    loadEmpresas()
  }, [isSuperAdmin, navigate])

  async function loadEmpresas() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setEmpresas(data || [])
    } catch (error) {
      console.error('Erro ao carregar empresas:', error)
    } finally {
      setLoading(false)
    }
  }

  function getPlanoPill(plano: string) {
    switch (plano?.toLowerCase()) {
      case 'free': return <span className="pill-gray bg-gray-700 text-gray-300">Free</span>
      case 'starter': return <span className="pill-blue bg-blue-900 text-blue-200">Starter</span>
      case 'pro': return <span className="pill-green bg-vluma-green-light text-green-800">Pro</span>
      case 'enterprise': return <span className="pill-amber bg-vluma-gold-light text-yellow-800">Enterprise</span>
      default: return <span className="pill-gray bg-gray-700 text-gray-300">{plano}</span>
    }
  }

  function getStatusPill(status: string) {
    switch (status?.toLowerCase()) {
      case 'trial': return <span className="pill-amber">Trial</span>
      case 'ativo': return <span className="pill-green">Ativo</span>
      case 'suspenso': return <span className="pill-red">Suspenso</span>
      case 'cancelado': return <span className="pill-gray bg-gray-700 text-gray-300">Cancelado</span>
      default: return <span className="pill-gray bg-gray-700 text-gray-300">{status}</span>
    }
  }

  const filteredEmpresas = empresas.filter(empresa =>
    empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="text-vluma-green" size={28} />
          <h1 className="text-vluma-text text-3xl font-bold">Super Admin</h1>
          <span className="pill-green bg-vluma-green-light text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full tracking-wide">VLUMA ONLY</span>
        </div>
        <p className="text-vluma-muted text-sm">Controle total da plataforma Operax · VLUMA</p>
      </div>

      {/* TABS */}
      <div className="flex gap-2 mb-6 border-b border-vluma-border">
        <button
          onClick={() => setActiveTab("empresas")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 ${
            activeTab === "empresas"
              ? "text-vluma-green border-vluma-green"
              : "text-vluma-muted border-transparent hover:text-vluma-text hover:border-white/10"
          }`}
        >
          <Building2 size={16} />
          Empresas
        </button>
        <button
          onClick={() => setActiveTab("planos")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 ${
            activeTab === "planos"
              ? "text-vluma-green border-vluma-green"
              : "text-vluma-muted border-transparent hover:text-vluma-text hover:border-white/10"
          }`}
        >
          <CreditCard size={16} />
          Planos
        </button>
        <button
          onClick={() => setActiveTab("metricas")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 ${
            activeTab === "metricas"
              ? "text-vluma-green border-vluma-green"
              : "text-vluma-muted border-transparent hover:text-vluma-text hover:border-white/10"
          }`}
        >
          <BarChart3 size={16} />
          Métricas
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "empresas" && (
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-vluma-muted" size={16} />
              <input
                type="text"
                placeholder="Buscar empresas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-64"
              />
            </div>
            <button className="btn-primary">
              <Plus size={16} />
              Nova Empresa
            </button>
          </div>

          {loading ? (
            <div className="card flex items-center justify-center py-12">
              <p className="text-vluma-muted">Carregando empresas...</p>
            </div>
          ) : filteredEmpresas.length === 0 ? (
            <div className="card flex flex-col items-center justify-center py-12">
              <Building2 className="text-vluma-muted mb-4" size={48} />
              <p className="text-vluma-muted mb-2">Nenhuma empresa encontrada</p>
              <p className="text-vluma-muted text-sm">Comece criando uma nova empresa</p>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-vluma-border">
                    <th className="text-left text-vluma-muted text-xs font-medium uppercase tracking-wider px-4 py-3">Nome</th>
                    <th className="text-left text-vluma-muted text-xs font-medium uppercase tracking-wider px-4 py-3">Email</th>
                    <th className="text-left text-vluma-muted text-xs font-medium uppercase tracking-wider px-4 py-3">Plano</th>
                    <th className="text-left text-vluma-muted text-xs font-medium uppercase tracking-wider px-4 py-3">Status</th>
                    <th className="text-left text-vluma-muted text-xs font-medium uppercase tracking-wider px-4 py-3">Módulos ativos</th>
                    <th className="text-left text-vluma-muted text-xs font-medium uppercase tracking-wider px-4 py-3">Criado em</th>
                    <th className="text-right text-vluma-muted text-xs font-medium uppercase tracking-wider px-4 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmpresas.map((empresa) => (
                    <tr key={empresa.id} className="border-b border-vluma-border hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-vluma-text font-medium">{empresa.nome}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-vluma-muted text-sm">{empresa.email}</span>
                      </td>
                      <td className="px-4 py-3">{getPlanoPill(empresa.plano)}</td>
                      <td className="px-4 py-3">{getStatusPill(empresa.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {Array.isArray(empresa.modulos_ativos) && empresa.modulos_ativos.map((modulo, idx) => (
                            <span key={idx} className="text-xs text-vluma-muted bg-white/5 px-2 py-0.5 rounded">{modulo}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-vluma-muted text-sm">
                          {new Date(empresa.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="text-vluma-muted hover:text-vluma-green transition-colors p-1.5 rounded-lg hover:bg-white/5" title="Editar">
                            <Pencil size={16} />
                          </button>
                          <button className="text-vluma-muted hover:text-vluma-green transition-colors p-1.5 rounded-lg hover:bg-white/5" title="Suspender/Ativar">
                            <Power size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "planos" && (
        <div className="card flex flex-col items-center justify-center py-12 animate-fade-in">
          <CreditCard className="text-vluma-muted mb-4" size={48} />
          <p className="text-vluma-muted mb-2">Em desenvolvimento</p>
          <p className="text-vluma-muted text-sm">Gerenciamento de planos em breve</p>
        </div>
      )}

      {activeTab === "metricas" && (
        <div className="card flex flex-col items-center justify-center py-12 animate-fade-in">
          <BarChart3 className="text-vluma-muted mb-4" size={48} />
          <p className="text-vluma-muted mb-2">Em desenvolvimento</p>
          <p className="text-vluma-muted text-sm">Métricas e analytics em breve</p>
        </div>
      )}
    </div>
  )
}
