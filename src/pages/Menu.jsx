import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import AllergenFilter from '../components/AllergenFilter';
import { menuCategories, allergenTypes } from '../data/menuData';
import { 
  Search, 
  X, 
  Globe, 
  ChevronDown, 
  AlertTriangle, 
  Heart, 
  ShoppingBag,
  Plus,
  Minus,
  Coffee,
  Pizza,
  Award,
  Wine,
  Cake,
  ChevronUp,
  ArrowLeft
} from 'lucide-react';

// Mobile-optimized Category Tabs
const MobileCategoryNav = ({ categories, activeCategory, onCategoryChange, theme }) => {
  const scrollRef = useRef(null);
  const icons = {
    all: <Award />,
    appetizers: <Award />,
    mains: <Pizza />,
    drinks: <Wine />,
    desserts: <Cake />
  };
  
  // Auto-scroll to active category
  useEffect(() => {
    if (scrollRef.current) {
      const activeElement = scrollRef.current.querySelector(`.category-${activeCategory}`);
      if (activeElement) {
        const scrollLeft = activeElement.offsetLeft - (scrollRef.current.clientWidth / 2) + (activeElement.clientWidth / 2);
        scrollRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [activeCategory]);
  
  return (
    <div 
      ref={scrollRef}
      className="flex overflow-x-auto py-3 hide-scrollbar sticky top-16 z-20 bg-white shadow-sm border-b border-gray-100"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {categories.map(category => (
        <div
          key={category.id}
          className={`category-${category.id} flex-shrink-0 mx-2 flex flex-col items-center`}
        >
          <button
            onClick={() => onCategoryChange(category.id)}
            className={`w-16 h-16 rounded-xl flex items-center justify-center mb-1 transition-all ${
              activeCategory === category.id ? 'shadow-md' : 'hover:bg-gray-50'
            }`}
            style={{
              backgroundColor: activeCategory === category.id 
                ? theme.primary 
                : '#f3f4f6'
            }}
            aria-label={category.name}
          >
            <div className={`transition-colors ${
              activeCategory === category.id ? 'text-white' : 'text-gray-600'
            }`}>
              {icons[category.id] || icons.all}
            </div>
          </button>
          <span className={`text-xs font-medium transition-colors ${
            activeCategory === category.id ? 'text-gray-900' : 'text-gray-600'
          }`}>
            {category.name}
          </span>
        </div>
      ))}
    </div>
  );
};

// Enhanced Language Switcher
const EnhancedLanguageSwitcher = ({ currentLanguage, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'nl', name: 'Nederlands' }
  ];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-white text-sm"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4" />
        <span className="sr-only md:not-sr-only">{languages.find(lang => lang.code === currentLanguage)?.name}</span>
        <ChevronDown className="w-3 h-3" />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced Menu Item Card for mobile
const MobileMenuItem = ({ item, isFavorite, onFavoriteToggle, onAddToCart, hasAllergenWarning, language, theme }) => {
  const [quantity, setQuantity] = useState(1);
  const [showControls, setShowControls] = useState(false);
  
  const handleAddToCart = () => {
    onAddToCart({
      ...item,
      quantity
    });
    setQuantity(1);
    setShowControls(false);
    
    // Haptic feedback on add to cart (if available)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white rounded-xl shadow-sm overflow-hidden ${
        hasAllergenWarning ? 'ring-1 ring-red-500' : ''
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-medium text-gray-800">{item.name[language]}</h3>
              <span className="font-bold text-lg ml-2" style={{ color: theme.primary }}>
                ${item.price.toFixed(2)}
              </span>
            </div>
            
            <p className="text-sm text-gray-500 mb-2">
              {item.description[language]}
            </p>
            
            {/* Allergen tags */}
            {item.allergens.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {item.allergens.map((allergenId) => {
                  const allergen = allergenTypes.find(a => a.id === allergenId);
                  return allergen ? (
                    <span
                      key={allergenId}
                      className={`text-xs py-0.5 px-2 rounded-md ${
                        hasAllergenWarning && allergen.id === hasAllergenWarning
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {allergen.name[language]}
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>
          
          <button
            onClick={() => onFavoriteToggle(item.id)}
            className="ml-2 p-2 rounded-full hover:bg-gray-50"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
            />
          </button>
        </div>
        
        {/* Add to cart controls */}
        {showControls ? (
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <span className="font-medium text-gray-800">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="px-4 py-2 rounded-full text-white text-sm font-medium"
              style={{ backgroundColor: theme.primary }}
            >
              Add
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowControls(true)}
            className="w-full py-2.5 rounded-full text-sm font-medium flex items-center justify-center mt-2"
            style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}
          >
            <ShoppingBag className="w-4 h-4 mr-1" />
            Add to Order
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Enhanced Cart Bottom Sheet
const MobileCartSheet = ({ isOpen, onClose, items, onRemove, onUpdateQuantity, total, onCheckout, theme }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Handle bar for better UX */}
            <div className="w-full pt-2 pb-4 flex justify-center">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>
            
            <div className="px-4 pb-3 flex justify-between items-center border-b border-gray-100">
              <h2 className="text-lg font-semibold">Your Order</h2>
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">Your cart is empty</h3>
                <p className="text-gray-500 text-sm mb-4">Add items to get started</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-full text-white font-medium"
                  style={{ backgroundColor: theme.primary }}
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center bg-gray-50 p-3 rounded-xl">
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-800">{item.name}</h4>
                            <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                          </div>
                          <span className="font-medium ml-2" style={{ color: theme.primary }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"
                          >
                            <Minus className="w-3 h-3 text-gray-600" />
                          </button>
                          <span className="font-medium mx-3">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"
                          >
                            <Plus className="w-3 h-3 text-gray-600" />
                          </button>
                          
                          <button
                            onClick={() => onRemove(item.id)}
                            className="ml-auto text-red-500 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t border-gray-100 bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Total:</span>
                    <span className="text-xl font-bold" style={{ color: theme.primary }}>
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  
                  <button
                    onClick={onCheckout}
                    className="w-full py-3 rounded-xl font-medium text-white"
                    style={{ backgroundColor: theme.primary }}
                  >
                    Checkout (${total.toFixed(2)})
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Floating Action Button for Cart
const FloatingCartButton = ({ itemCount, total, onClick, theme }) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-5 right-5 z-30 flex items-center px-5 py-3 rounded-full shadow-lg"
      style={{ backgroundColor: theme.primary }}
    >
      <div className="relative mr-2">
        <ShoppingBag className="w-5 h-5 text-white" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-white rounded-full text-xs font-bold" style={{ color: theme.primary }}>
            {itemCount}
          </span>
        )}
      </div>
      <span className="font-medium text-white">${total.toFixed(2)}</span>
    </motion.button>
  );
};

// Main Menu Component
export default function Menu() {
  const { tableNumber } = useParams();
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const { theme } = useTheme();
  
  // States
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const searchInputRef = useRef(null);
  
  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setShowWelcome(window.scrollY <= 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Categories data - transform from your data structure
  const categories = [
    { id: 'all', name: t('categories.all') },
    ...menuCategories.map(category => ({
      id: category.id,
      name: category.name[language]
    }))
  ];
  
  // Toggle allergen filter
  const toggleAllergen = (allergenId) => {
    setSelectedAllergens(current =>
      current.includes(allergenId)
        ? current.filter(id => id !== allergenId)
        : [...current, allergenId]
    );
  };
  
  // Toggle favorite status
  const toggleFavorite = (itemId) => {
    setFavorites(current =>
      current.includes(itemId)
        ? current.filter(id => id !== itemId)
        : [...current, itemId]
    );
    
    // Save to local storage
    const updated = favorites.includes(itemId)
      ? favorites.filter(id => id !== itemId)
      : [...favorites, itemId];
      
    localStorage.setItem('favorites', JSON.stringify(updated));
  };
  
  // Load favorites from local storage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);
  
  // Toggle search mode
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
    }
  };
  
  // Filter menu items
  const getFilteredItems = () => {
    let filtered = [];
    
    // Get items from selected category
    if (activeCategory === 'all') {
      filtered = menuCategories.flatMap(category => category.items);
    } else {
      const categoryData = menuCategories.find(c => c.id === activeCategory);
      filtered = categoryData ? categoryData.items : [];
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name[language].toLowerCase().includes(query) ||
        item.description[language].toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };
  
  const filteredItems = getFilteredItems();
  
  // Check if an item has any of the selected allergens
  const hasSelectedAllergen = (item) => {
    if (selectedAllergens.length === 0) return false;
    return item.allergens.some(allergen => selectedAllergens.includes(allergen));
  };
  
  // Cart functions
  const addToCart = (item) => {
    // Haptic feedback (if available)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
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
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  const handleCheckout = () => {
    navigate('/payment', { state: { items: cart, total: calculateTotal() } });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
{/* Enhanced Mobile Header - Reliable with Better Styling */}
<header
  style={{ 
    backgroundColor: theme.primary,
    position: 'sticky',
    top: 0,
    zIndex: 30,
    width: '100%',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  }}
>
  {/* Menu Bar - Reliable Table Layout with Better Styling */}
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <tbody>
      <tr>
        <td style={{ width: '48px', padding: '14px 8px' }}>
          <button 
            onClick={() => navigate('/')}
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              WebkitTapHighlightColor: 'transparent'
            }}
            onMouseDown={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.35)'}
            onMouseUp={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'}
            onTouchStart={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.35)'}
            onTouchEnd={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'}
          >
            <ArrowLeft color="white" size={20} />
          </button>
        </td>
        
        <td style={{ textAlign: theme.logoPosition === 'center' ? 'center' : 'left', padding: '4px 0' }}>
          {theme.logo && (
            <div style={{
              display: 'inline-block',
              width: theme.logoSize === 'small' ? '32px' : theme.logoSize === 'medium' ? '40px' : '48px',
              height: theme.logoSize === 'small' ? '32px' : theme.logoSize === 'medium' ? '40px' : '48px',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              borderRadius: theme.logoShape === 'circle' ? '50%' : '6px',
              padding: '4px',
              overflow: 'hidden',
              verticalAlign: 'middle',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}>
              <img 
                src={theme.logo} 
                alt="Restaurant logo" 
                style={{
                  width: theme.logoShape === 'circle' ? '100%' : 'auto',
                  height: '100%',
                  objectFit: theme.logoShape === 'circle' ? 'cover' : 'contain',
                  display: 'block'
                }}
              />
            </div>
          )}
        </td>
        
        <td style={{ width: '98px', textAlign: 'right', padding: '14px 8px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={toggleSearch}
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                WebkitTapHighlightColor: 'transparent'
              }}
              onMouseDown={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.35)'}
              onMouseUp={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'}
              onTouchStart={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.35)'}
              onTouchEnd={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'}
            >
              {isSearchOpen ? <X color="white" size={20} /> : <Search color="white" size={20} />}
            </button>
            
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => {
                  const dropdown = document.getElementById('language-dropdown');
                  if (dropdown) {
                    if (dropdown.style.display === 'block') {
                      dropdown.style.opacity = '0';
                      dropdown.style.transform = 'translateY(10px)';
                      setTimeout(() => { dropdown.style.display = 'none'; }, 200);
                    } else {
                      dropdown.style.display = 'block';
                      setTimeout(() => {
                        dropdown.style.opacity = '1';
                        dropdown.style.transform = 'translateY(0)';
                      }, 10);
                    }
                  }
                }}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 12px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  WebkitTapHighlightColor: 'transparent'
                }}
                onMouseDown={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.35)'}
                onMouseUp={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'}
                onTouchStart={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.35)'}
                onTouchEnd={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'}
              >
                <Globe color="white" size={16} />
                <span style={{ 
                  color: 'white', 
                  marginLeft: '4px', 
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'none'
                }}>
                  {language.toUpperCase()}
                </span>
              </button>
              
              <div 
                id="language-dropdown"
                style={{
                  display: 'none',
                  opacity: '0',
                  position: 'absolute',
                  right: 0,
                  top: '44px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  width: '140px',
                  zIndex: 50,
                  padding: '6px 0',
                  transition: 'opacity 0.2s ease, transform 0.2s ease',
                  transform: 'translateY(10px)'
                }}
              >
                {[
                  { code: 'en', name: 'English' },
                  { code: 'es', name: 'Español' },
                  { code: 'nl', name: 'Nederlands' }
                ].map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      const dropdown = document.getElementById('language-dropdown');
                      if (dropdown) {
                        dropdown.style.opacity = '0';
                        dropdown.style.transform = 'translateY(10px)';
                        setTimeout(() => { dropdown.style.display = 'none'; }, 200);
                      }
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 16px',
                      border: 'none',
                      backgroundColor: language === lang.code ? '#f9fafb' : 'transparent',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: language === lang.code ? '600' : '400',
                      color: language === lang.code ? theme.primary : '#4b5563',
                      transition: 'background-color 0.15s ease',
                      borderLeft: language === lang.code ? `3px solid ${theme.primary}` : '3px solid transparent'
                    }}
                    onMouseOver={(e) => { 
                      if (language !== lang.code) e.currentTarget.style.backgroundColor = '#f3f4f6'; 
                    }}
                    onMouseOut={(e) => { 
                      if (language !== lang.code) e.currentTarget.style.backgroundColor = 'transparent'; 
                    }}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  
  {/* Welcome Banner */}
  {showWelcome && !isSearchOpen && (
    <div style={{
      textAlign: 'center',
      padding: '12px 0 16px 0',
      background: `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.1))`,
    }}>
      <h1 style={{
        fontSize: '24px', 
        fontWeight: 'bold',
        color: 'white',
        marginBottom: '8px',
        textShadow: '0 1px 3px rgba(0,0,0,0.2)'
      }}>
        {t('header.welcome')}
      </h1>
      <div style={{
        display: 'inline-block',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        padding: '6px 16px',
        borderRadius: '20px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
      }}>
        <p style={{ color: 'white', fontSize: '14px' }}>
          Table <span style={{ fontWeight: 'bold' }}>{tableNumber}</span>
        </p>
      </div>
    </div>
  )}
  
  {/* Search Input */}
  {isSearchOpen && (
    <div style={{ 
      padding: '0 16px 16px 16px',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{ 
        position: 'relative',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}>
        <div style={{ 
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)'
        }}>
          <Search color="#9ca3af" size={20} />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search menu..."
          style={{
            width: '100%',
            padding: '14px 44px 14px 48px',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: '12px',
            border: 'none',
            fontSize: '16px',
            color: '#374151',
            outline: 'none'
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f3f4f6'
            }}
          >
            <X color="#9ca3af" size={16} />
          </button>
        )}
      </div>
    </div>
  )}

  <style>
    {`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}
  </style>
</header>
      
      {/* Category Navigation */}
      <MobileCategoryNav 
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        theme={theme}
      />
      
      {/* Allergen Filter - Using your existing component */}
      <AllergenFilter 
        selectedAllergens={selectedAllergens}
        onAllergenToggle={toggleAllergen}
      />
      
      {/* Status Message for Filters and Search */}
      {(searchQuery || selectedAllergens.length > 0) && (
        <div className="bg-white px-4 py-3 border-b border-gray-100">
          {searchQuery && (
            <p className="text-sm text-gray-600 mb-2">
              {filteredItems.length} results for "{searchQuery}"
            </p>
          )}
          
          {selectedAllergens.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <span className="text-xs text-gray-500 mr-1 pt-1">Filtering by:</span>
              {selectedAllergens.map(allergenId => {
                const allergen = allergenTypes.find(a => a.id === allergenId);
                if (!allergen) return null;
                
                return (
                  <button 
                    key={allergenId}
                    onClick={() => toggleAllergen(allergenId)}
                    className="inline-flex items-center bg-red-100 text-red-800 text-xs rounded-full px-2 py-1"
                  >
                    {allergen.name[language]}
                    <X className="w-3 h-3 ml-1" />
                  </button>
                );
              })}
              
              {selectedAllergens.length > 0 && (
                <button
                  onClick={() => setSelectedAllergens([])}
                  className="text-xs text-blue-600 ml-2"
                >
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Category Headers */}
      {activeCategory === 'all' && !searchQuery && (
        <div className="pb-16"> {/* Extra padding at bottom for FAB */}
          {menuCategories.map(category => (
            <div key={category.id} className="mb-6">
              <div className="px-4 py-2 bg-gray-50 sticky top-[138px] z-10 border-y border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">
                  {category.name[language]}
                </h2>
              </div>
              
              <div className="p-4 space-y-4">
                {category.items.map(item => (
                  <MobileMenuItem
                    key={item.id}
                    item={item}
                    isFavorite={favorites.includes(item.id)}
                    onFavoriteToggle={() => toggleFavorite(item.id)}
                    onAddToCart={addToCart}
                    hasAllergenWarning={hasSelectedAllergen(item) ? item.allergens.find(a => selectedAllergens.includes(a)) : null}
                    language={language}
                    theme={theme}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Filtered Items */}
      {(activeCategory !== 'all' || searchQuery) && (
        <div className="p-4 space-y-4 pb-16"> {/* Extra padding at bottom for FAB */}
          {filteredItems.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">No items found</h3>
              <p className="text-gray-500 max-w-xs">
                Try adjusting your search or filters to find what you're looking for
              </p>
              {(searchQuery || selectedAllergens.length > 0) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedAllergens([]);
                  }}
                  className="mt-4 px-4 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: theme.primary }}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <MobileMenuItem
                  key={item.id}
                  item={item}
                  isFavorite={favorites.includes(item.id)}
                  onFavoriteToggle={() => toggleFavorite(item.id)}
                  onAddToCart={addToCart}
                  hasAllergenWarning={hasSelectedAllergen(item) ? item.allergens.find(a => selectedAllergens.includes(a)) : null}
                  language={language}
                  theme={theme}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      )}
      
      {/* Cart Sheet */}
      <MobileCartSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateCartQuantity}
        total={calculateTotal()}
        onCheckout={handleCheckout}
        theme={theme}
      />
      
      {/* Floating Cart Button */}
      <AnimatePresence>
        {cart.length > 0 && (
          <FloatingCartButton 
            itemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
            total={calculateTotal()}
            onClick={() => setIsCartOpen(true)}
            theme={theme}
          />
        )}
      </AnimatePresence>
    </div>
  );
}