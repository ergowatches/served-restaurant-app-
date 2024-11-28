import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const CategoryIcon = ({ category, isActive }) => {
  const icons = {
    all: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
    appetizers: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    mains: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v18H3z" />
      </svg>
    ),
    drinks: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    desserts: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18z" />
      </svg>
    ),
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
    <div className="bg-white shadow-md sticky top-0 z-20">
      <div className="relative">
        <div className="overflow-x-auto scrollbar-hide px-4 py-3 flex gap-3 snap-x snap-mandatory">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex flex-col items-center snap-start min-w-[80px] ${
                activeCategory === category.id ? 'scale-105' : ''
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center mb-1 transition-all ${
                  activeCategory === category.id 
                    ? 'shadow-lg' 
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