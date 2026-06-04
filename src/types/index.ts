// ── PERFIS ──
export type Perfil = 'super_admin' | 'admin' | 'owner' | 'manager' | 'operador' | 'visualizador'

// ── PLANOS ──
export type Plano = 'free' | 'starter' | 'pro' | 'enterprise'

// ── STATUS ASSINATURA ──
export type StatusAssinatura = 'trial' | 'ativo' | 'suspenso' | 'cancelado'

// ── MÓDULOS ──
export interface ModulosAtivos {
  demandas: boolean
  projetos: boolean
  financeiro: boolean
  portal_cliente: boolean
  notificacoes: boolean
}

// ── LIMITES ──
export interface LimitesEmpresa {
  demandas_mes: number
  projetos_ativos: number
  usuarios_projeto: number
}

// ── EMPRESA ──
export interface Empresa {
  id: string
  nome: string
  cnpj?: string
  email: string
  slug: string
  plano: Plano
  status: StatusAssinatura
  dominio_customizado?: string
  modulos: ModulosAtivos
  limites: LimitesEmpresa
  trial_expira_em?: string
  created_at: string
  updated_at: string
}

// ── USUÁRIO ──
export interface Usuario {
  id: string
  empresa_id?: string
  nome: string
  email: string
  perfil: Perfil
  avatar_url?: string
  is_super_admin: boolean
  created_at: string
  updated_at: string
}

// ── STATUS DEMANDA ──
export type StatusDemanda =
  | 'Não Atendido'
  | 'Aguardando Aprovação de Orçamento'
  | 'Executado — Ag. Faturamento'
  | 'Faturar'
  | 'Faturado'

// ── PRIORIDADE ──
export type Prioridade = 'baixa' | 'media' | 'alta' | 'critica'

// ── DEMANDA ──
export interface Demanda {
  id: string
  empresa_id: string
  titulo: string
  descricao?: string
  categoria?: string
  prioridade: Prioridade
  status: StatusDemanda
  responsavel_id?: string
  solicitante?: string
  data_abertura?: string
  data_atend?: string
  data_prazo_sla?: string
  sla_violado?: boolean
  valor_orcado?: number
  valor_aprovado?: number
  n_protocolo?: string
  observacoes?: string
  created_at: string
  updated_at: string
}

// ── LOJA ──
export interface Loja {
  id: string
  empresa_id: string
  numero: string
  nome: string
  cnpj?: string
  cidade?: string
}

// ── STATUS PROJETO ──
export type StatusProjeto = 'planejamento' | 'em_andamento' | 'pausado' | 'concluido' | 'cancelado'

// ── PROJETO ──
export interface Projeto {
  id: string
  empresa_id: string
  nome: string
  descricao?: string
  cliente?: string
  status: StatusProjeto
  data_inicio?: string
  data_fim?: string
  responsavel_id?: string
  created_at: string
  updated_at: string
}

// ── STATUS ATIVIDADE ──
export type StatusAtividade = 'backlog' | 'em_andamento' | 'revisao' | 'concluido'

// ── ATIVIDADE ──
export interface Atividade {
  id: string
  projeto_id: string
  empresa_id: string
  titulo: string
  descricao?: string
  status: StatusAtividade
  responsavel_id?: string
  data_prazo?: string
  created_at: string
  updated_at: string
}
