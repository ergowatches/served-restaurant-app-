import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

export default function TableInput() {
  const [tableNumber, setTableNumber] = useState('')
  const navigate = useNavigate()
  const { theme } = useTheme()

const handleSubmit = (e) => {
  e.preventDefault()
  if (tableNumber) {
    navigate(`/choice/${tableNumber}`)  // Changed from /menu/ to /choice/
  }
}

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.secondary }}>
      {/* Header */}
      <div style={{ backgroundColor: theme.primary }}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-white text-center">SERVED</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
              Welcome to Your Table
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label 
                  htmlFor="tableNumber" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Please enter your table number
                </label>
                <input
                  type="number"
                  id="tableNumber"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2"
                  style={{ 
                    focusRing: theme.primary,
                    '--tw-ring-color': theme.primary 
                  }}
                  required
                  min="1"
                  placeholder="Enter table number"
                />
              </div>
              <button
                type="submit"
                style={{ backgroundColor: theme.primary }}
                className="w-full text-white py-3 rounded-lg font-medium text-base"
              >
                View Menu
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}