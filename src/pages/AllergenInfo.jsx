import { useNavigate, useParams } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { allergenTypes } from '../data/menuData'

export default function AllergenInfo() {
  const navigate = useNavigate()
  const { tableNumber } = useParams()
  const { theme } = useTheme()

  const allergenDetails = [
    {
      id: 'gluten',
      name: 'Gluten',
      description: 'Found in wheat, barley, rye, and some oat products.',
      commonIn: ['Breads', 'Pasta', 'Pastries', 'Some sauces'],
      severity: 'Can cause severe reactions in people with celiac disease'
    },
    {
      id: 'dairy',
      name: 'Dairy',
      description: 'Includes all milk-based products.',
      commonIn: ['Milk', 'Cheese', 'Yogurt', 'Ice cream', 'Some sauces'],
      severity: 'Can cause reactions in lactose intolerant individuals'
    },
    {
      id: 'nuts',
      name: 'Nuts',
      description: 'Includes various tree nuts and peanuts.',
      commonIn: ['Desserts', 'Some Asian dishes', 'Baked goods'],
      severity: 'Can cause severe allergic reactions'
    },
    {
      id: 'shellfish',
      name: 'Shellfish',
      description: 'Includes crustaceans and mollusks.',
      commonIn: ['Seafood dishes', 'Some Asian cuisine', 'Seafood stock'],
      severity: 'Can cause severe allergic reactions'
    },
    {
      id: 'eggs',
      name: 'Eggs',
      description: 'Found in many baked goods and dishes.',
      commonIn: ['Baked goods', 'Mayonnaise', 'Some sauces', 'Pasta'],
      severity: 'Can cause allergic reactions'
    },
    {
      id: 'soy',
      name: 'Soy',
      description: 'Common in Asian cuisine and processed foods.',
      commonIn: ['Asian dishes', 'Vegetarian alternatives', 'Some sauces'],
      severity: 'Can cause allergic reactions'
    }
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.secondary }}>
      {/* Header */}
      <div style={{ backgroundColor: theme.primary }}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(`/choice/${tableNumber}`)}
              className="text-white font-medium flex items-center"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-white">Allergen Information</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Important Notice */}
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-rose-800 mb-2">Important Notice</h2>
          <p className="text-rose-700">
            If you have severe allergies, please inform our staff before placing your order. 
            While we take precautions, cross-contamination is possible in our kitchen.
          </p>
        </div>

        {/* Allergen List */}
        <div className="space-y-6">
          {allergenDetails.map((allergen) => (
            <div key={allergen.id} className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{allergen.name}</h3>
              <p className="text-gray-600 mb-4">{allergen.description}</p>
              
              <div className="space-y-2">
                <div>
                  <h4 className="font-medium text-gray-800">Commonly Found In:</h4>
                  <ul className="list-disc list-inside text-gray-600 ml-2">
                    {allergen.commonIn.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium text-gray-800">Severity:</h4>
                  <p className="text-gray-600">{allergen.severity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Need More Information?</h2>
          <p className="text-gray-600 mb-4">
            Our staff is trained to handle allergen-related questions and can provide detailed information about specific dishes.
          </p>
          <button
            onClick={() => navigate('/faq')}
            style={{ backgroundColor: theme.primary }}
            className="text-white px-6 py-2 rounded-lg"
          >
            View FAQ
          </button>
        </div>
      </div>
    </div>
  )
}