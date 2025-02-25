import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { Coffee, Pizza, Award, Wine, Cake } from 'lucide-react';

const CategoryIcon = ({ category, isActive }) => {
  const icons = {
    all: <Award className="w-5 h-5" />,
    appetizers: <Award className="w-5 h-5" />,
    mains: <Pizza className="w-5 h-5" />,
    drinks: <Wine className="w-5 h-5" />,
    desserts: <Cake className="w-5 h-5" />,
  };
  
  return (
    <div className={`transition-colors ${isActive ? 'text-white' : 'text-gray-600'}`}>
      {icons[category] || icons.all}
    </div>
  );
};

const EnhancedCategoryNav = ({ categories, activeCategory, onCategoryChange }) => {
  const { theme } = useTheme();
  
  return (
    <div className="bg-white shadow-sm sticky top-0 z-20">
      <div className="relative px-4 py-3">
        <div className="overflow-x-auto scrollbar-hide flex gap-4 snap-x snap-mandatory">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex flex-col items-center snap-start min-w-[80px] transition-all ${
                activeCategory === category.id ? 'scale-105' : ''
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center mb-1 transition-all shadow-sm ${
                  activeCategory === category.id 
                    ? 'shadow-md' 
                    : 'hover:bg-gray-50'
                }`}
                style={{
                  backgroundColor: activeCategory === category.id 
                    ? theme.primary 
                    : '#f3f4f6'
                }}
              >
                <CategoryIcon 
                  category={category.id} 
                  isActive={activeCategory === category.id}
                />
              </div>
              <span className={`text-xs font-medium transition-colors ${
                activeCategory === category.id 
                  ? 'text-gray-900' 
                  : 'text-gray-600'
              }`}>
                {category.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedCategoryNav;