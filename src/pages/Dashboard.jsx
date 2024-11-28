import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

export default function Dashboard() {
  const navigate = useNavigate()
  const { theme, updateTheme } = useTheme()
  const [colors, setColors] = useState(theme)
  const [savedMessage, setSavedMessage] = useState('')

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    if (!isAuthenticated) {
      navigate('/dashboard-login')
    }
  }, [navigate])

  const handleColorChange = (key, value) => {
    setColors(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = () => {
    updateTheme(colors)
    setSavedMessage('Changes saved successfully!')
    setTimeout(() => setSavedMessage(''), 3000)
  }

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    navigate('/dashboard-login')
  }

  const handleReset = () => {
    const defaultTheme = {
      primary: '#DB2777',
      secondary: '#F9FAFB',
      text: '#1F2937',
      background: '#FFFFFF'
    }
    setColors(defaultTheme)
    updateTheme(defaultTheme)
    setSavedMessage('Theme reset to defaults!')
    setTimeout(() => setSavedMessage(''), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Theme Settings</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-white bg-gray-600 rounded-md"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Color Settings */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color (Buttons & Header)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={colors.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="h-10 w-20"
                  />
                  <input
                    type="text"
                    value={colors.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="border rounded px-3 py-1.5 w-32"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={colors.secondary}
                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                    className="h-10 w-20"
                  />
                  <input
                    type="text"
                    value={colors.secondary}
                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                    className="border rounded px-3 py-1.5 w-32"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Preview</h3>
              <div 
                className="rounded-lg p-4 mb-4"
                style={{ backgroundColor: colors.secondary }}
              >
                <div 
                  className="rounded-lg p-4 text-white mb-4"
                  style={{ backgroundColor: colors.primary }}
                >
                  Header Preview
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-medium mb-2">Menu Item Preview</h4>
                  <p className="text-sm text-gray-600 mb-3">Sample description text</p>
                  <div className="flex justify-between items-center">
                    <span style={{ color: colors.primary }} className="font-bold">$12.99</span>
                    <button
                      className="px-4 py-2 rounded-lg text-white text-sm"
                      style={{ backgroundColor: colors.primary }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm text-gray-600 border rounded-md"
            >
              Reset to Defaults
            </button>
            <div className="flex items-center space-x-4">
              {savedMessage && (
                <span className="text-green-600 text-sm">{savedMessage}</span>
              )}
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-pink-600 text-white rounded-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}