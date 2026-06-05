import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [erro, setErro] = useState('')

  async function handleLogin(e: React.FormEvent) {
    console.log("handleLogin chamado", email)
    e.preventDefault()
    setLoading(true)
    setErro('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) { setErro('E-mail ou senha incorretos.'); } else { navigate('/')}
    setLoading(false)
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
  }

  async function handleMicrosoft() {
    await supabase.auth.signInWithOAuth({ provider: 'azure', options: { redirectTo: window.location.origin } })
  }

  return (
    <div className="min-h-screen bg-vluma-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-vluma-green tracking-tight">Operax</h1>
          <p className="text-vluma-muted mt-2 text-sm">Gestão Operacional Inteligente</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <h2 className="text-vluma-text font-semibold text-lg mb-6">Entrar na plataforma</h2>

          {/* OAuth */}
          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={handleGoogle}
              className="flex items-center justify-center gap-3 w-full py-2.5 px-4 rounded-lg border border-vluma-border hover:border-vluma-green bg-vluma-dark text-vluma-text text-sm font-medium transition-all duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar com Google
            </button>

            <button
              onClick={handleMicrosoft}
              className="flex items-center justify-center gap-3 w-full py-2.5 px-4 rounded-lg border border-vluma-border hover:border-vluma-green bg-vluma-dark text-vluma-text text-sm font-medium transition-all duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#f25022" d="M1 1h10v10H1z"/>
                <path fill="#00a4ef" d="M13 1h10v10H13z"/>
                <path fill="#7fba00" d="M1 13h10v10H1z"/>
                <path fill="#ffb900" d="M13 13h10v10H13z"/>
              </svg>
              Continuar com Microsoft
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-vluma-border"></div>
            <span className="text-vluma-muted text-xs">ou entre com e-mail</span>
            <div className="flex-1 h-px bg-vluma-border"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="label">E-mail</label>
              <input
                type="email"
                className="input"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Senha</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
              />
            </div>

            {erro && (
              <div className="bg-vluma-red-light border border-red-300 text-red-700 text-sm px-3 py-2 rounded-lg">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary justify-center py-2.5 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-vluma-muted text-xs mt-6">
          © 2026 VLUMA Tecnologia · Todos os direitos reservados
        </p>
      </div>
    </div>
  )
}
