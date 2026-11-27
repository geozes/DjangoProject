import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ListTodo } from 'lucide-react'
import api from '../services/api'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('auth/token/', {
        username,
        password,
      })

      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)

      navigate('/')
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Incorrect username or password.')
      } else {
        setError('Unable to connect to the server. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">

        <div className="flex justify-center items-center gap-2 mb-6">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <ListTodo size={25} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">TaskFlow</h1>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 text-center">
          Welcome back
        </h2>

        <p className="text-slate-500 text-center mt-2 mb-6">
          Sign in to manage your tasks.
        </p>

        {location.state?.message && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-4">
            {location.state.message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold p-3 rounded-lg"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-semibold">
            Create account
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login