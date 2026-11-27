import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ListTodo } from 'lucide-react'
import api from '../services/api'

function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      await api.post('auth/register/', {
        username: form.username,
        email: form.email,
        password: form.password,
      })

      navigate('/login', {
        state: { message: 'Account created successfully. Please log in.' },
      })
    } catch (err) {
      const data = err.response?.data

      if (data) {
        const messages = Object.entries(data)
          .map(([field, value]) => `${field}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join(' ')

        setError(messages)
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
          Create your account
        </h2>

        <p className="text-slate-500 text-center mt-2 mb-6">
          Start organizing your work today.
        </p>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Repeat your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold p-3 rounded-lg"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Register