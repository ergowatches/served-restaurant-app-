import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { menuCategories, allergenTypes } from '../data/menuData';
import { motion, AnimatePresence } from 'framer-motion';
import EnhancedFloatingCart from '../components/EnhancedFloatingCart';
import EnhancedCartDrawer from '../components/EnhancedCartDrawer';
import LanguageSwitcher from '../components/LanguageSwitcher';
import MenuButton from '../components/MenuButton';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

// CategoryIcon Component
const CategoryIcon = ({ category }) => {
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
  return icons[category] || icons.all;
};

// MenuItem Component
const MenuItem = ({ item, hasAllergenWarning, onAddToCart, language, theme, allergenTypes, selectedAllergens }) => {
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    const processedItem = {
      id: item.id,
      price: item.price,
      name: item.name[language],
      description: item.description[language],
      quantity: quantity
    };
    
    onAddToCart(processedItem);
    setQuantity(1);
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white rounded-xl shadow-sm transition-all duration-300 ${
        isHovered ? 'shadow-md transform translate-y-[-2px]' : ''
      } ${hasAllergenWarning ? 'ring-2 ring-red-200' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 text-lg">
              {item.name[language]}
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              {item.description[language]}
            </p>
            {hasAllergenWarning && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {item.allergens.map(allergen => (
                  selectedAllergens.includes(allergen) && (
                    <span key={allergen} className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-lg">
                      {allergenTypes.find(a => a.id === allergen).name[language]}
                    </span>
                  )
                ))}
              </div>
            )}
          </div>
          {hasAllergenWarning && (
            <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-lg whitespace-nowrap">
              {language === 'en' ? 'Contains Allergens' : 'Contiene Alérgenos'}
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-lg" style={{ color: theme.primary }}>
              ${item.price}
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}
              >
                -
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}
              >
                +
              </button>
            </div>
          </div>
          
          <motion.button
            onClick={handleAddToCart}
            className="flex items-center space-x-2 text-white px-5 py-2 rounded-lg text-sm"
            style={{ backgroundColor: theme.primary }}
            whileTap={{ scale: 0.95 }}
            animate={isAdding ? { scale: [1, 1.1, 1] } : {}}
          >
            <span>{language === 'en' ? 'Add' : 'Añadir'}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Main Menu Component
export default function Menu() {
  const { tableNumber } = useParams();
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const { t, language, setLanguage } = useLanguage();
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setShowWelcome(window.scrollY <= 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { id: 'all', name: t('categories.all') },
    { id: 'appetizers', name: t('categories.appetizers') },
    { id: 'mains', name: t('categories.mains') },
    { id: 'drinks', name: t('categories.drinks') },
    { id: 'desserts', name: t('categories.desserts') }
  ];

  const filteredCategories = activeCategory === 'all' 
    ? menuCategories 
    : menuCategories.filter(category => category.id === activeCategory);

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      return [...prevCart, item];
    });
  };

  const EnhancedFloatingCart = ({ items, total, onClick }) => {
    const { theme } = useTheme();
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed left-0 right-0 bottom-6 px-4 z-30"
      >
        <div className="max-w-lg mx-auto">
          <button
            onClick={onClick}
            className="w-full bg-white rounded-full shadow-lg px-6 py-3 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                  />
                </svg>
                <span 
                  className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center"
                >
                  {itemCount}
                </span>
              </div>
              <span>View Cart</span>
            </div>
            <span className="font-medium" style={{ color: theme.primary }}>${total}</span>
          </button>
        </div>
      </motion.div>
    );
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  };

  const toggleAllergen = (allergenId) => {
    setSelectedAllergens(current =>
      current.includes(allergenId)
        ? current.filter(id => id !== allergenId)
        : [...current, allergenId]
    );
  };

  const hasAllergen = (item) => {
    return selectedAllergens.some(allergen => item.allergens.includes(allergen));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
        style={{ backgroundColor: theme.primary }}
      >
        <div className="relative px-4 py-6">
          <div className="absolute right-4 top-4 flex items-center space-x-3">
            <MenuButton />
            <LanguageSwitcher 
              currentLanguage={language} 
              onLanguageChange={setLanguage} 
            />
          </div>

          <AnimatePresence>
            {showWelcome && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center pt-8"
              >
                <h1 className="text-3xl font-bold text-white mb-2">
                  {t('header.welcome')}
                </h1>
                <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <p className="text-white text-sm">
                    Table <span className="font-semibold">{tableNumber}</span>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Category Navigation */}
      <div className="bg-white shadow-md sticky top-0 z-20">
        <div className="px-4 py-3">
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-medium min-w-fit transition-all ${
                  activeCategory === category.id
                    ? 'text-white shadow-md'
                    : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                }`}
                style={{ 
                  backgroundColor: activeCategory === category.id ? theme.primary : undefined 
                }}
                whileTap={{ scale: 0.95 }}
              >
                <CategoryIcon category={category.id} />
                <span>{category.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Allergen Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white border-y border-gray-100"
      >
        <div className="px-4 py-3">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Allergen Alerts</h3>
          <div className="flex flex-wrap gap-2">
            {allergenTypes.map((allergen) => (
              <motion.button
                key={allergen.id}
                onClick={() => toggleAllergen(allergen.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedAllergens.includes(allergen.id)
                    ? 'bg-red-50 text-red-700 ring-1 ring-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {allergen.name[language]}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Menu Content */}
      <div className="px-4 py-6">
        <AnimatePresence mode="sync">
          {filteredCategories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 last:mb-0"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {t(`categories.${category.id}`)}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.items.map((item) => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    hasAllergenWarning={hasAllergen(item)}
                    onAddToCart={addToCart}
                    language={language}
                    theme={theme}
                    allergenTypes={allergenTypes}
                    selectedAllergens={selectedAllergens}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Mobile-only Quick Jump Categories */}
<motion.div 
  initial={{ opacity: 0, y: 100 }}
  animate={{ opacity: 1, y: 0 }}
  className="md:hidden fixed left-0 right-0 bottom-24 px-4 z-20"
>
  <div className="max-w-lg mx-auto bg-white/90 backdrop-blur-lg rounded-full shadow-lg px-4 py-2 flex justify-center gap-2">
    {categories.map((category) => (
      <button
        key={category.id}
        onClick={() => setActiveCategory(category.id)}
        className={`p-2 rounded-full transition-all ${
          activeCategory === category.id
            ? 'text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        style={{ 
          backgroundColor: activeCategory === category.id ? theme.primary : undefined 
        }}
      >
        <CategoryIcon category={category.id} />
      </button>
    ))}
  </div>
</motion.div>

      {/* Cart */}
      <AnimatePresence>
        {cart.length > 0 && (
          <EnhancedFloatingCart 
            items={cart} 
            total={calculateTotal()} 
            onClick={() => setIsCartOpen(true)} 
          />
        )}
      </AnimatePresence>

      <EnhancedCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        total={calculateTotal()}
      />
    </div>
  );
}