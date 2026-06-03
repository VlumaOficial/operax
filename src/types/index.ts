// ── PERFIS ──
export type Perfil = 'super_admin' | 'admin' | 'owner' | 'manager' | 'operador' | 'visualizador'

// ── PLANOS ──
export type Plano = 'free' | 'starter' | 'pro' | 'enterprise'

// ── STATUS ASSINATURA ──
export type StatusAssinatura = 'trial' | 'ativo' | 'suspenso' | 'cancelado'

// ── EMPRESA ──
export interface Empresa {
  id: string
  nome: string
  cnpj?: string
  email: string
  plano: Plano
  status: StatusAssinatura
  dominio_customizado?: string
  modulos: ModulosAtivos
  limites: LimitesEmpresa
  created_at: string
}

export interface ModulosAtivos {
  chamados: boolean
  projetos: boolean
  financeiro: boolean
  portal_cliente: boolean
  notificacoes: boolean
}

export interface LimitesEmpresa {
  chamados_mes: number
  projetos_ativos: number
  usuarios_projeto: number
}

// ── USUÁRIO ──
export interface Usuario {
  id: string
  empresa_id: string
  nome: string
  email: string
  perfil: Perfil
  avatar_url?: string
  created_at: string
}

// ── STATUS CHAMADO ──
export type StatusChamado =
  | 'Não Atendido'
  | 'Aguardando Aprovação de Orçamento'
  | 'Executado — Ag. Faturamento'
  | 'Faturar'
  | 'Faturado'

// ── CHAMADO ──
export interface Chamado {
  id: string
  empresa_id: string
  n_os?: string
  loja?: string
  problema?: string
  data_abertura?: string
  data_atend?: string
  acao?: string
  responsavel?: string
  status?: StatusChamado
  data_orc?: string
  itens_orc?: string
  valor_orcado?: number
  data_exec?: string
  n_protocolo?: string
  valor_aprovado?: number
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
