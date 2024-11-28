import { useTheme } from '../contexts/ThemeContext'

export default function CategorySlider({ categories, activeCategory, onCategorySelect }) {
  const { theme } = useTheme()
  
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="py-3 px-4">
        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium min-w-fit ${
                activeCategory === category.id
                  ? 'text-white shadow-sm'
                  : 'text-gray-600 bg-gray-100'
              }`}
              style={{ 
                backgroundColor: activeCategory === category.id ? theme.primary : undefined 
              }}
            >
              {category.name.en}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}