import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

const EnhancedMenuItem = ({
  item,
  isFavorite,
  onFavoriteToggle,
  onAddToCart,
  hasAllergenWarning,
  language,
  theme
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    onAddToCart({
      ...item,
      quantity,
    });
    setIsAdding(true);
    setQuantity(1);
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-xl shadow-sm overflow-hidden ${
        hasAllergenWarning ? 'ring-2 ring-red-200' : ''
      }`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 text-lg">
              {item.name[language]}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {item.description[language]}
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={onFavoriteToggle}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
              }`}
            />
          </motion.button>
        </div>

        {/* Allergen Warnings */}
        {hasAllergenWarning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2"
          >
            <div className="flex flex-wrap gap-1">
              {item.allergens.map(allergen => (
                <span
                  key={allergen}
                  className="px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600"
                >
                  {allergen}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Price and Actions */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold" style={{ color: theme.primary }}>
                ${item.price}
              </span>
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${theme.primary}15` }}
                >
                  -
                </motion.button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${theme.primary}15` }}
                >
                  +
                </motion.button>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              animate={isAdding ? { scale: [1, 1.1, 1] } : {}}
              onClick={handleAddToCart}
              className="px-6 py-2 rounded-full text-white font-medium"
              style={{ backgroundColor: theme.primary }}
            >
              Add to Cart
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedMenuItem;