import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import EnhancedCategoryNav from '../components/EnhancedCategoryNav';
import EnhancedMenuItem from '../components/EnhancedMenuItem';
import EnhancedFloatingCart from '../components/EnhancedFloatingCart';
import EnhancedCartDrawer from '../components/EnhancedCartDrawer';
import { menuCategories, allergenTypes } from '../data/menuData';
import { ChevronDown, Globe, Menu as MenuIcon, AlertTriangle } from 'lucide-react';

// Improved Language Switcher Component
const ImprovedLanguageSwitcher = ({ currentLanguage, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' }
  ];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-white text-sm"
      >
        <Globe className="w-4 h-4" />
        <span>{languages.find(lang => lang.code === currentLanguage)?.name}</span>
        <ChevronDown className="w-3 h-3" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                onLanguageChange(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                currentLanguage === lang.code ? 'font-medium text-blue-600' : 'text-gray-700'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Improved Allergen Filter Component
const ImprovedAllergenFilter = ({ selectedAllergens, onAllergenToggle }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const allergens = [
    { id: 'gluten', name: 'Gluten' },
    { id: 'dairy', name: 'Dairy' },
    { id: 'nuts', name: 'Nuts' },
    { id: 'shellfish', name: 'Shellfish' },
    { id: 'eggs', name: 'Eggs' },
  ];

  return (
    <div className="px-4 py-3 bg-white border-t border-b border-gray-100">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-sm text-gray-600"
      >
        <span className="font-medium flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Dietary Restrictions
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="mt-3 flex flex-wrap gap-2">
          {allergens.map(allergen => (
            <button
              key={allergen.id}
              onClick={() => onAllergenToggle(allergen.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedAllergens.includes(allergen.id)
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {allergen.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Menu() {
  const { tableNumber } = useParams();
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const { t, language, setLanguage } = useLanguage();
  const { theme } = useTheme();
  const [favorites, setFavorites] = useState([]);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setShowWelcome(window.scrollY <= 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Categories data
  const categories = [
    { id: 'all', name: t('categories.all') },
    { id: 'appetizers', name: t('categories.appetizers') },
    { id: 'mains', name: t('categories.mains') },
    { id: 'drinks', name: t('categories.drinks') },
    { id: 'desserts', name: t('categories.desserts') }
  ];

  const toggleAllergen = (allergenId) => {
    setSelectedAllergens(current =>
      current.includes(allergenId)
        ? current.filter(id => id !== allergenId)
        : [...current, allergenId]
    );
  };

  const toggleFavorite = (itemId) => {
    setFavorites(current =>
      current.includes(itemId)
        ? current.filter(id => id !== itemId)
        : [...current, itemId]
    );
  };

  // Filter menu items
  const filteredItems = menuCategories
    .filter(category => activeCategory === 'all' || category.id === activeCategory)
    .flatMap(category => category.items);

  // Cart functions
  const addToCart = (item) => {
    navigator.vibrate && navigator.vibrate(50);
    setCart(prevCart => {
      const processedItem = {
        ...item,
        name: item.name[language],
        description: item.description[language],
        quantity: item.quantity
      };
      
      const existingItem = prevCart.find(i => i.id === item.id);
      if (existingItem) {
        return prevCart.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prevCart, processedItem];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateCartQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Improved Header */}
      <div
        className="relative"
        style={{ backgroundColor: theme.primary }}
      >
        <div className="relative px-4 py-6">
          <div className="absolute right-4 top-4 flex items-center space-x-3">
            <button className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white">
              <MenuIcon className="w-5 h-5" />
            </button>
            <ImprovedLanguageSwitcher 
              currentLanguage={language} 
              onLanguageChange={setLanguage} 
            />
          </div>

          {showWelcome && (
            <div className="text-center pt-8 pb-4">
              <h1 className="text-3xl font-bold text-white mb-2">
                {t('header.welcome')}
              </h1>
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <p className="text-white text-sm">
                  Table <span className="font-semibold">{tableNumber}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Navigation */}
      <EnhancedCategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Improved Allergen Filter */}
      <ImprovedAllergenFilter
        selectedAllergens={selectedAllergens}
        onAllergenToggle={toggleAllergen}
      />

      {/* Menu Items Grid with better spacing */}
      <div className="px-4 py-6 space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <EnhancedMenuItem
              key={item.id}
              item={item}
              isFavorite={favorites.includes(item.id)}
              onFavoriteToggle={() => toggleFavorite(item.id)}
              onAddToCart={addToCart}
              hasAllergenWarning={selectedAllergens.some(allergen => 
                item.allergens.includes(allergen)
              )}
              language={language}
              theme={theme}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Cart Components */}
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
        onUpdateQuantity={updateCartQuantity}
        total={calculateTotal()}
      />
    </div>
  );
}