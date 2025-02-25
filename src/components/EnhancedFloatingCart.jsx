import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { ShoppingCart, ChevronRight } from 'lucide-react';

const EnhancedFloatingCart = ({ items, total, onClick }) => {
  const { theme } = useTheme();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg px-6 py-3.5 flex items-center space-x-4 border border-gray-100"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="relative">
        <ShoppingCart className="w-6 h-6 text-gray-700" strokeWidth={2} />
        {itemCount > 0 && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center font-medium shadow-sm"
          >
            {itemCount}
          </motion.span>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-gray-600 text-sm font-medium">Your Order:</span>
        <span className="font-bold text-gray-900" style={{ color: theme.primary }}>${total}</span>
      </div>
      <div className="bg-gray-100 rounded-full p-1">
        <ChevronRight className="w-4 h-4 text-gray-500" />
      </div>
    </motion.button>
  );
};

export default EnhancedFloatingCart;