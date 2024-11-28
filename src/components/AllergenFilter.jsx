import { useLanguage } from '../contexts/LanguageContext'
import { allergenTypes } from '../data/menuData'

export default function AllergenFilter({ selectedAllergens, onAllergenToggle }) {
  const { language } = useLanguage()
  
  return (
    <div className="bg-white shadow-sm border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Allergen Alerts:</h3>
          <div className="flex flex-wrap gap-2">
            {allergenTypes.map((allergen) => (
              <button
                key={allergen.id}
                onClick={() => onAllergenToggle(allergen.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                  ${selectedAllergens.includes(allergen.id)
                    ? 'bg-red-100 text-red-800 border-2 border-red-200'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent'
                  }`}
              >
                {allergen.name[language]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}