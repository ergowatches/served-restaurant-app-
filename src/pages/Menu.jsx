import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import EnhancedCategoryNav from '../components/EnhancedCategoryNav';
import EnhancedMenuItem from '../components/EnhancedMenuItem';
import AllergenFilter from '../components/AllergenFilter';
import EnhancedFloatingCart from '../components/EnhancedFloatingCart';
import EnhancedCartDrawer from '../components/EnhancedCartDrawer';
import { menuCategories, allergenTypes } from '../data/menuData';
import MenuButton from '../components/MenuButton';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Menu() {
  const { tableNumber } = useParams();
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const { t, language, setLanguage } = useLanguage();
  const { theme } = useTheme();

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
      {/* Welcome Header */}
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

      {/* Enhanced Category Navigation */}
      <EnhancedCategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Allergen Filter */}
      <AllergenFilter
        selectedAllergens={selectedAllergens}
        onAllergenToggle={toggleAllergen}
      />

      {/* Menu Items Grid */}
      <div className="px-4 py-6">
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 gap-4">
            {filteredItems.map((item) => (
              <EnhancedMenuItem
                key={item.id}
                item={item}
                onAddToCart={addToCart}
                hasAllergenWarning={selectedAllergens.some(allergen => 
                  item.allergens.includes(allergen)
                )}
                language={language}
                theme={theme}
              />
            ))}
          </div>
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