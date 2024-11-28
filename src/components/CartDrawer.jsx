import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useNavigate } from 'react-router-dom'

export default function CartDrawer({ isOpen, onClose, items, onRemove, total }) {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const navigate = useNavigate()
  
  if (!isOpen) return null

  const handlePlaceOrder = () => {
    navigate('/payment', { state: { items, total } })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">{t('cart.viewCart')}</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm"
            >
              {t('cart.close')}
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-500 text-center text-lg">{t('cart.empty')}</p>
              </div>
            ) : (
              <div className="space-y-5">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-800 text-lg">{item.name}</p>
                      <p style={{ color: theme.primary }} className="font-medium mt-1">${item.price}</p>
                    </div>
                    <button
                      onClick={() => onRemove(item.id)}
                      style={{ 
                        backgroundColor: `${theme.primary}15`,
                        color: theme.primary 
                      }}
                      className="px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {t('cart.remove')}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex justify-between text-xl font-bold mb-5">
                <span>{t('cart.total')}:</span>
                <span style={{ color: theme.primary }}>${total}</span>
              </div>
              <button 
                onClick={handlePlaceOrder}
                style={{ backgroundColor: theme.primary }}
                className="w-full text-white py-4 rounded-full font-medium text-lg shadow-md"
              >
                {t('cart.placeOrder')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}