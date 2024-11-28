import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, TrendingUp } from 'lucide-react';

const QuickFilters = ({
  isOpen,
  onToggle,
  selectedAllergens,
  onAllergenChange,
  searchOpen,
  onSearchToggle,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="relative z-20">
      {/* Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute top-0 left-0 right-0 bg-white shadow-md"
          >
            <div className="p-4 flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search menu..."
                className="flex-1 outline-none text-gray-800"
                autoFocus
              />
              <button
                onClick={() => onSearchToggle(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions Bar */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSearchToggle(!searchOpen)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => onToggle(!isOpen)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <button
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-sm font-medium"
        >
          <TrendingUp className="w-4 h-4" />
          Popular
        </button>
      </div>

      {/* Expanded Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="p-4">
              <h3 className="font-medium text-gray-800 mb-3">Dietary Preferences</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal'].map(pref => (
                  <button
                    key={pref}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
                  >
                    {pref}
                  </button>
                ))}
              </div>

              <h3 className="font-medium text-gray-800 mb-3">Sort By</h3>
              <div className="flex flex-wrap gap-2">
                {['Price: Low to High', 'Price: High to Low', 'Most Popular', 'Spiciness'].map(sort => (
                  <button
                    key={sort}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
                  >
                    {sort}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuickFilters;