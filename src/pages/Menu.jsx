import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { menuCategories, allergenTypes } from '../data/menuData';
import { 
  Search, 
  X, 
  Globe, 
  ChevronDown, 
  AlertTriangle, 
  Heart, 
  Filter, 
  Star, 
  Clock,
  ArrowLeft,
  ShoppingBag,
  Menu as MenuIcon
} from 'lucide-react';

// Mobile-optimized Category Tabs
const MobileCategories = ({ categories, activeCategory, onCategoryChange, theme }) => {
  const scrollRef = useRef(null);
  
  // Auto-scroll to active category
  useEffect(() => {
    if (scrollRef.current) {
      const activeElement = scrollRef.current.querySelector('.active-category');
      if (activeElement) {
        const scrollLeft = activeElement.offsetLeft - (scrollRef.current.clientWidth / 2) + (activeElement.clientWidth / 2);
        scrollRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [activeCategory]);
  
  return (
    <div 
      ref={scrollRef}
      className="flex overflow-x-auto py-3 px-2 hide-scrollbar sticky top-0 bg-white z-10 border-b border-gray-100"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {categories.map(category => (
        <button
          key={category.id}
          className={`flex-shrink-0 px-4 py-2 mx-1 rounded-full text-sm font-medium transition-all ${
            activeCategory === category.id 
              ? 'active-category text-white shadow-md'
              : 'text-gray-600 bg-gray-100'
          }`}
          style={{ 
            backgroundColor: activeCategory === category.id ? theme.primary : undefined 
          }}
          onClick={() => onCategoryChange(category.id)}
        >
          {category.name}
        </button>
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
    { code: 'fr', name: 'Français' }
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

// Mobile Optimized Filter Sheet
const MobileFilterSheet = ({ 
  isOpen, 
  onClose, 
  selectedAllergens, 
  onAllergenToggle, 
  filterOptions, 
  onFilterChange, 
  theme 
}) => {
  // Prevent body scroll when filter is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
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
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[80vh] overflow-y-auto"
          >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
                aria-label="Close filters"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
                  Dietary Restrictions
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {allergenTypes.map(allergen => (
                    <button
                      key={allergen.id}
                      onClick={() => onAllergenToggle(allergen.id)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedAllergens.includes(allergen.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {allergen.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-3">Sort by</h3>
                <div className="grid grid-cols-2 gap-2">
                  {filterOptions.sortOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => onFilterChange('sort', option.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center ${
                        filterOptions.activeSort === option.id
                          ? 'text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                      style={{ 
                        backgroundColor: filterOptions.activeSort === option.id ? theme.primary : undefined 
                      }}
                    >
                      {option.id === 'popular' && <Star className="w-3 h-3 mr-1" />}
                      {option.id === 'newest' && <Clock className="w-3 h-3 mr-1" />}
                      {option.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-full py-3 rounded-lg font-medium text-white mt-4"
                style={{ backgroundColor: theme.primary }}
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
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
      className={`bg-white rounded-xl shadow-sm overflow-hidden relative ${
        hasAllergenWarning ? 'ring-1 ring-red-500' : ''
      }`}
    >
      {/* Image with favorite button and allergen warning */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {item.image ? (
          <img 
            src={item.image} 
            alt={item.name[language]} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}
        
        <button
          onClick={() => onFavoriteToggle(item.id)}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
          />
        </button>
        
        {hasAllergenWarning && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md flex items-center">
            <AlertTriangle className="w-3 h-3 mr-1" />
            <span>Allergen</span>
          </div>
        )}
        
        {item.isPopular && (
          <div className="absolute bottom-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-md flex items-center">
            <Star className="w-3 h-3 mr-1" />
            <span>Popular</span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-3">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-gray-800 flex-1">{item.name[language]}</h3>
          <span className="font-bold text-lg" style={{ color: theme.primary }}>
            ${item.price.toFixed(2)}
          </span>
        </div>
        
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {item.description[language]}
        </p>
        
        {/* Add to cart controls */}
        {showControls ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                aria-label="Decrease quantity"
              >
                <span className="text-gray-600 font-bold">-</span>
              </button>
              <span className="font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                aria-label="Increase quantity"
              >
                <span className="text-gray-600 font-bold">+</span>
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
            className="w-full py-2 rounded-full text-sm font-medium flex items-center justify-center"
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
                          <span className="font-medium" style={{ color: theme.primary }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"
                          >
                            <span className="text-gray-600 font-bold">-</span>
                          </button>
                          <span className="font-medium mx-3">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"
                          >
                            <span className="text-gray-600 font-bold">+</span>
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const searchInputRef = useRef(null);
  
  // Filter options
  const [filterOptions, setFilterOptions] = useState({
    activeSort: 'default',
    sortOptions: [
      { id: 'default', name: 'Default' },
      { id: 'popular', name: 'Popular' },
      { id: 'newest', name: 'New Items' },
      { id: 'price-asc', name: 'Price: Low to High' },
      { id: 'price-desc', name: 'Price: High to Low' }
    ]
  });
  
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
  
  // Apply filters to menu items
  const handleFilterChange = (type, value) => {
    if (type === 'sort') {
      setFilterOptions(prev => ({
        ...prev,
        activeSort: value
      }));
    }
  };
  
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
  const filterItems = useCallback(() => {
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
    
    // Apply sort
    switch (filterOptions.activeSort) {
      case 'popular':
        filtered.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        // Keep default order
        break;
    }
    
    return filtered;
  }, [activeCategory, language, searchQuery, filterOptions.activeSort]);
  
  const filteredItems = filterItems();
  
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
      {/* Mobile Optimized Header */}
      <header
        className="sticky top-0 z-20"
        style={{ backgroundColor: theme.primary }}
      >
        {/* Menu Bar */}
        <div className="px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleSearch}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
              aria-label={isSearchOpen ? "Close search" : "Search menu"}
            >
              {isSearchOpen ? <X className="w-5 h-5 text-white" /> : <Search className="w-5 h-5 text-white" />}
            </button>
            
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
              aria-label="Open filters"
            >
              <Filter className="w-5 h-5 text-white" />
            </button>
            
            <EnhancedLanguageSwitcher 
              currentLanguage={language} 
              onLanguageChange={setLanguage} 
            />
          </div>
        </div>
        
        {/* Welcome Banner */}
        <AnimatePresence>
          {showWelcome && !isSearchOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-center py-3"
            >
              <h1 className="text-2xl font-bold text-white mb-1">
                {t('header.welcome')}
              </h1>
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full">
                <p className="text-white text-sm">
                  Table <span className="font-semibold">{tableNumber}</span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Search Input */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-4 pb-3"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search menu..."
                  className="w-full py-2.5 pl-10 pr-4 bg-white/95 backdrop-blur-sm rounded-xl text-gray-700 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      {/* Category Navigation */}
      <MobileCategories 
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        theme={theme}
      />
      
      {/* Applied Filter Pills */}
      {(selectedAllergens.length > 0 || filterOptions.activeSort !== 'default') && (
        <div className="flex overflow-x-auto py-2 px-4 hide-scrollbar bg-white border-b border-gray-100">
          {selectedAllergens.map(allergenId => {
            const allergen = allergenTypes.find(a => a.id === allergenId);
            if (!allergen) return null;
            
            return (
              <div key={allergenId} className="flex items-center bg-red-50 text-red-700 text-xs rounded-full px-3 py-1 mr-2 whitespace-nowrap">
                <span>{allergen.name}</span>
                <button 
                  onClick={() => toggleAllergen(allergenId)}
                  className="ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
          
          {filterOptions.activeSort !== 'default' && (
            <div className="flex items-center bg-gray-100 text-gray-700 text-xs rounded-full px-3 py-1 mr-2 whitespace-nowrap">
              <span>
                {filterOptions.sortOptions.find(o => o.id === filterOptions.activeSort)?.name}
              </span>
              <button 
                onClick={() => handleFilterChange('sort', 'default')}
                className="ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Status Message for Filters */}
      {searchQuery && (
        <div className="px-4 py-3 bg-white border-b border-gray-100">
          <p className="text-sm text-gray-600">
            {filteredItems.length} results for "{searchQuery}"
          </p>
        </div>
      )}
      
      {/* Menu Items Grid */}
      <div className="px-4 py-4">
        {filteredItems.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No items found</h3>
            <p className="text-gray-500 max-w-xs">
              Try adjusting your search or filters to find what you're looking for
            </p>
            {(searchQuery || selectedAllergens.length > 0 || filterOptions.activeSort !== 'default') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedAllergens([]);
                  handleFilterChange('sort', 'default');
                }}
                className="mt-4 px-4 py-2 rounded-lg text-white font-medium"
                style={{ backgroundColor: theme.primary }}
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <MobileMenuItem
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
        )}
        
        {/* Bottom spacing for floating button */}
        <div className="h-20"></div>
      </div>
      
      {/* Filter Sheet */}
      <MobileFilterSheet 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedAllergens={selectedAllergens}
        onAllergenToggle={toggleAllergen}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        theme={theme}
      />
      
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