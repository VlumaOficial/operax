import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { supabase } from "../../lib/supabase"
import { Shield, Building2, CreditCard, BarChart3, Pencil, Power, Plus, Search, X, Check, AlertTriangle } from "lucide-react"

type TabType = "empresas" | "planos" | "metricas"

interface Empresa {
  id: string
  nome: string
  email: string
  slug?: string
  cnpj?: string
  plano: string
  status: string
  modulos_ativos: string[]
  limites: {
    demandas_mes: number
    projetos_ativos: number
    usuarios_por_projeto: number
  }
  created_at: string
}

interface EmpresaFormData {
  nome: string
  email: string
  slug: string
  cnpj: string
  plano: string
  status: string
  modulos_ativos: string[]
  limites: {
    demandas_mes: number
    projetos_ativos: number
    usuarios_por_projeto: number
  }
}

export default function SuperAdminPage() {
  const { isSuperAdmin } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>("empresas")
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null)
  const [formData, setFormData] = useState<EmpresaFormData>({
    nome: "",
    email: "",
    slug: "",
    cnpj: "",
    plano: "free",
    status: "trial",
    modulos_ativos: [],
    limites: {
      demandas_mes: 10,
      projetos_ativos: 3,
      usuarios_por_projeto: 5
    }
  })
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [confirmAction, setConfirmAction] = useState<{ empresa: Empresa, action: 'suspend' | 'activate' } | null>(null)

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

  function generateSlug(nome: string) {
    return nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  function openModal(empresa?: Empresa) {
    if (empresa) {
      setEditingEmpresa(empresa)
      setFormData({
        nome: empresa.nome,
        email: empresa.email,
        slug: empresa.slug || generateSlug(empresa.nome),
        cnpj: empresa.cnpj || "",
        plano: empresa.plano,
        status: empresa.status,
        modulos_ativos: empresa.modulos_ativos || [],
        limites: empresa.limites || {
          demandas_mes: 10,
          projetos_ativos: 3,
          usuarios_por_projeto: 5
        }
      })
    } else {
      setEditingEmpresa(null)
      setFormData({
        nome: "",
        email: "",
        slug: "",
        cnpj: "",
        plano: "free",
        status: "trial",
        modulos_ativos: [],
        limites: {
          demandas_mes: 10,
          projetos_ativos: 3,
          usuarios_por_projeto: 5
        }
      })
    }
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingEmpresa(null)
    setFeedback(null)
  }

  function handleNomeChange(nome: string) {
    setFormData({
      ...formData,
      nome,
      slug: generateSlug(nome)
    })
  }

  function toggleModulo(modulo: string) {
    setFormData({
      ...formData,
      modulos_ativos: formData.modulos_ativos.includes(modulo)
        ? formData.modulos_ativos.filter(m => m !== modulo)
        : [...formData.modulos_ativos, modulo]
    })
  }

  async function saveEmpresa() {
    if (!formData.nome || !formData.email || !formData.slug) {
      setFeedback({ type: 'error', message: 'Preencha os campos obrigatórios' })
      return
    }

    setSaving(true)
    try {
      if (editingEmpresa) {
        const { error } = await supabase
          .from('empresas')
          .update({
            nome: formData.nome,
            email: formData.email,
            slug: formData.slug,
            cnpj: formData.cnpj || null,
            plano: formData.plano,
            status: formData.status,
            modulos_ativos: formData.modulos_ativos,
            limites: formData.limites
          })
          .eq('id', editingEmpresa.id)

        if (error) throw error
        setFeedback({ type: 'success', message: 'Empresa atualizada com sucesso' })
      } else {
        const { error } = await supabase
          .from('empresas')
          .insert({
            nome: formData.nome,
            email: formData.email,
            slug: formData.slug,
            cnpj: formData.cnpj || null,
            plano: formData.plano,
            status: formData.status,
            modulos_ativos: formData.modulos_ativos,
            limites: formData.limites
          })

        if (error) throw error
        setFeedback({ type: 'success', message: 'Empresa criada com sucesso' })
      }

      await loadEmpresas()
      setTimeout(closeModal, 1500)
    } catch (error) {
      console.error('Erro ao salvar empresa:', error)
      setFeedback({ type: 'error', message: 'Erro ao salvar empresa' })
    } finally {
      setSaving(false)
    }
  }

  function toggleEmpresaStatus(empresa: Empresa) {
    const newStatus = empresa.status === 'ativo' ? 'suspenso' : 'ativo'
    setConfirmAction({ empresa, action: newStatus === 'suspenso' ? 'suspend' : 'activate' })
  }

  async function confirmToggleStatus() {
    if (!confirmAction) return

    const { empresa, action } = confirmAction
    const newStatus = action === 'suspend' ? 'suspenso' : 'ativo'

    try {
      const { error } = await supabase
        .from('empresas')
        .update({ status: newStatus })
        .eq('id', empresa.id)

      if (error) throw error
      await loadEmpresas()
      setFeedback({ type: 'success', message: `Empresa ${newStatus === 'suspenso' ? 'suspensa' : 'ativada'} com sucesso` })
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      setFeedback({ type: 'error', message: 'Erro ao alterar status' })
    } finally {
      setConfirmAction(null)
    }
  }

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
            <button onClick={() => openModal()} className="btn-primary">
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
                          <button onClick={() => openModal(empresa)} className="text-vluma-muted hover:text-vluma-green transition-colors p-1.5 rounded-lg hover:bg-white/5" title="Editar">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => toggleEmpresaStatus(empresa)} className="text-vluma-muted hover:text-vluma-green transition-colors p-1.5 rounded-lg hover:bg-white/5" title="Suspender/Ativar">
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

      {/* MODAL NOVA/EDITAR EMPRESA */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-vluma-text text-xl font-bold">
                {editingEmpresa ? 'Editar Empresa' : 'Nova Empresa'}
              </h2>
              <button onClick={closeModal} className="text-vluma-muted hover:text-vluma-text transition-colors p-1 rounded-lg hover:bg-white/5">
                <X size={20} />
              </button>
            </div>

            {feedback && (
              <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                feedback.type === 'success' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
              }`}>
                {feedback.type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
                {feedback.message}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="label">Nome da empresa *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleNomeChange(e.target.value)}
                  className="input"
                  placeholder="Nome da empresa"
                />
              </div>

              <div>
                <label className="label">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input"
                  placeholder="email@empresa.com"
                />
              </div>

              <div>
                <label className="label">Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="input"
                  placeholder="slug-da-empresa"
                />
              </div>

              <div>
                <label className="label">CNPJ</label>
                <input
                  type="text"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                  className="input"
                  placeholder="00.000.000/0000-00"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Plano</label>
                  <select
                    value={formData.plano}
                    onChange={(e) => setFormData({ ...formData, plano: e.target.value })}
                    className="input"
                  >
                    <option value="free">Free</option>
                    <option value="starter">Starter</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="label">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="input"
                  >
                    <option value="trial">Trial</option>
                    <option value="ativo">Ativo</option>
                    <option value="suspenso">Suspenso</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Módulos ativos</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Demandas', 'Projetos', 'Financeiro', 'Portal Cliente', 'Notificações'].map((modulo) => (
                    <label key={modulo} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.modulos_ativos.includes(modulo)}
                        onChange={() => toggleModulo(modulo)}
                        className="w-4 h-4 rounded border-vluma-border bg-transparent text-vluma-green focus:ring-vluma-green"
                      />
                      <span className="text-vluma-text text-sm">{modulo}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Limites</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="label text-xs">Demandas/mês</label>
                    <input
                      type="number"
                      value={formData.limites.demandas_mes}
                      onChange={(e) => setFormData({
                        ...formData,
                        limites: { ...formData.limites, demandas_mes: parseInt(e.target.value) || 0 }
                      })}
                      className="input"
                      placeholder="-1 = ilimitado"
                    />
                  </div>
                  <div>
                    <label className="label text-xs">Projetos ativos</label>
                    <input
                      type="number"
                      value={formData.limites.projetos_ativos}
                      onChange={(e) => setFormData({
                        ...formData,
                        limites: { ...formData.limites, projetos_ativos: parseInt(e.target.value) || 0 }
                      })}
                      className="input"
                      placeholder="-1 = ilimitado"
                    />
                  </div>
                  <div>
                    <label className="label text-xs">Usuários/projeto</label>
                    <input
                      type="number"
                      value={formData.limites.usuarios_por_projeto}
                      onChange={(e) => setFormData({
                        ...formData,
                        limites: { ...formData.limites, usuarios_por_projeto: parseInt(e.target.value) || 0 }
                      })}
                      className="input"
                      placeholder="-1 = ilimitado"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={closeModal} className="btn-secondary" disabled={saving}>
                Cancelar
              </button>
              <button onClick={saveEmpresa} className="btn-primary" disabled={saving}>
                {saving ? 'Salvando...' : (editingEmpresa ? 'Salvar' : 'Criar Empresa')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-vluma-gold" size={24} />
              <h3 className="text-vluma-text text-lg font-bold">Confirmar ação</h3>
            </div>
            <p className="text-vluma-muted mb-6">
              Tem certeza que deseja {confirmAction.action === 'suspend' ? 'suspender' : 'ativar'} a empresa "{confirmAction.empresa.nome}"?
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmAction(null)} className="btn-secondary">
                Cancelar
              </button>
              <button onClick={confirmToggleStatus} className="btn-primary">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
