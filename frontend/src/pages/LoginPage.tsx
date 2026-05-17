import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api'

export default function LoginPage() {
  const [email, setEmail] = useState('demo@example.com')
  const [password, setPassword] = useState('demo123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const session = await login(email, password)
      localStorage.setItem('token', session.token)
      localStorage.setItem('user', JSON.stringify(session.user))
      navigate('/dashboard', { replace: true })
    } catch {
      setError('Invalid credentials or API unavailable. Use demo@example.com / demo123 after starting the backend.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-orange-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl">🥬</div>
          <h1 className="text-2xl font-bold text-gray-900">FreshCart Market</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to manage fresh fruits and veg orders</p>
        </div>
        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm">
          <p className="mb-1 font-bold text-blue-800">Demo Credentials</p>
          <p className="text-blue-700">Email: <span className="font-mono">demo@example.com</span></p>
          <p className="text-blue-700">Password: <span className="font-mono">demo123</span></p>
        </div>
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Email" />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Password" />
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-green-600 py-3 font-bold text-white hover:bg-green-700 disabled:opacity-60">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
