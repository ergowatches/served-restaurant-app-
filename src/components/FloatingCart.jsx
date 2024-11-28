import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'

export default function FloatingCart({ items, total, onClick }) {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const itemCount = items.length
  
  if (itemCount === 0) return null

  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: theme.primary }}
      className="fixed bottom-6 left-4 right-4 max-w-xl mx-auto text-white py-4 px-6 rounded-full shadow-lg flex justify-between items-center"
    >
      <div className="flex items-center">
        <span className="px-3 py-1 rounded-full text-sm mr-3 font-medium"
              style={{ backgroundColor: `${theme.primary}dd` }}>
          {itemCount}
        </span>
        <span className="font-medium">{t('cart.viewCart')}</span>
      </div>
      <span className="font-bold text-lg">${total}</span>
    </button>
  )
}