import { useTheme } from '../contexts/ThemeContext'

export default function ItemList({ items, onItemSelect }) {
  const { theme } = useTheme()

  return (
    <div className="space-y-6 px-4">
      {items.map((item) => (
        <div key={item.id} className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">{item.type}</h3>
          </div>
          <div>
            {item.variants.map((variant, index) => (
              <button
                key={variant.id}
                onClick={() => onItemSelect(variant)}
                className={`w-full flex justify-between items-center p-4 text-left ${
                  index !== item.variants.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex-1">
                  <span className="block text-gray-800 font-medium">
                    {variant.name.en}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-base" style={{ color: theme.primary }}>
                    £{variant.price.toFixed(2)}
                  </span>
                  <span 
                    className="text-white text-sm px-4 py-2 rounded-lg"
                    style={{ backgroundColor: theme.primary }}
                  >
                    Add
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}