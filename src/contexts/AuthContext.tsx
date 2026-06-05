import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Usuario, Empresa } from '../types'

interface AuthContextType {
  session: Session | null
  user: User | null
  usuario: Usuario | null
  empresa: Empresa | null
  isSuperAdmin: boolean
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  usuario: null,
  empresa: null,
  isSuperAdmin: false,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) carregarPerfil(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) carregarPerfil(session.user.id)
      else {
        setUsuario(null)
        setEmpresa(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function carregarPerfil(userId: string) {
    console.log("carregarPerfil chamado", userId)
    try {
      const { data: u } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single()

      if (u) {
        setUsuario(u)
        if (u.empresa_id) {
          const { data: e } = await supabase
            .from('empresas')
            .select('*')
            .eq('id', u.empresa_id)
            .single()
          if (e) setEmpresa(e)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUsuario(null)
    setEmpresa(null)
  }

  const isSuperAdmin = usuario?.is_super_admin ?? false

  return (
    <AuthContext.Provider value={{ session, user, usuario, empresa, isSuperAdmin, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
