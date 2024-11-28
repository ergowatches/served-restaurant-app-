import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

export default function DashboardLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { theme } = useTheme()

  const handleLogin = (e) => {
    e.preventDefault()
    // Simple authentication - in a real app, this would be handled by a backend
    if (username === 'admin' && password === 'password') {
      localStorage.setItem('isAuthenticated', 'true')
      navigate('/dashboard')
      setError('')
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.secondary }}>
      <div className="max-w-md w-full px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Login</h1>
          <p className="mt-2 text-sm text-gray-600">
            Login to access the admin dashboard
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': theme.primary }}
                required
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': theme.primary }}
                required
              />
            </div>

            <button
              type="submit"
              style={{ backgroundColor: theme.primary }}
              className="w-full text-white py-3 px-4 rounded-lg font-medium"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Default credentials for demo:<br />
              Username: admin<br />
              Password: password
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}