import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function MenuButton() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleFAQClick = () => {
    setIsOpen(false)
    navigate('/faq')
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white p-2 rounded-lg"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
          <button
            onClick={handleFAQClick}
            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            FAQ
          </button>
        </div>
      )}
    </div>
  )
}