import { useNavigate, useParams } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

export default function ChoicePage() {
  const navigate = useNavigate()
  const { tableNumber } = useParams()
  const { theme } = useTheme()

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.secondary }}>
      {/* Header */}
      <div style={{ backgroundColor: theme.primary }}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-white text-center">SERVED</h1>
          <p className="text-white text-center text-sm opacity-90">Table {tableNumber}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Main Options (Large) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Menu Option */}
          <button
            onClick={() => navigate(`/menu/${tableNumber}`)}
            className="relative overflow-hidden rounded-2xl shadow-lg h-80"
            style={{ backgroundColor: theme.primary }}
          >
            <div className="p-8 flex flex-col items-center justify-center h-full">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-24 w-24 text-white mb-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <h2 className="text-3xl font-bold text-white mb-3">Menu</h2>
              <p className="text-white/90 text-center text-lg">Browse our menu and place your order</p>
            </div>
          </button>

          {/* Games Option */}
          <button
            onClick={() => navigate(`/games/${tableNumber}`)}
            className="relative overflow-hidden rounded-2xl shadow-lg h-80 bg-gray-800"
          >
            <div className="p-8 flex flex-col items-center justify-center h-full">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-24 w-24 text-white mb-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-3xl font-bold text-white mb-3">Games</h2>
              <p className="text-white/90 text-center text-lg">Play games while you wait</p>
            </div>
          </button>
        </div>

        {/* Secondary Options (Small) */}
        <div className="grid grid-cols-2 gap-4">
          {/* Allergen Info Option */}
          <button
            onClick={() => navigate(`/allergens/${tableNumber}`)}
            className="relative overflow-hidden rounded-xl shadow-md h-32 bg-rose-600"
          >
            <div className="p-4 flex flex-col items-center justify-center h-full">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 text-white mb-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-lg font-bold text-white">Allergen Info</h2>
            </div>
          </button>

          {/* FAQ Option */}
          <button
            onClick={() => navigate(`/faq`)}
            className="relative overflow-hidden rounded-xl shadow-md h-32 bg-indigo-600"
          >
            <div className="p-4 flex flex-col items-center justify-center h-full">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 text-white mb-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-lg font-bold text-white">FAQ</h2>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}