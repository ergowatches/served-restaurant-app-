import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { X, Minus, Plus, Trash2, ShoppingBag, ChevronRight } from 'lucide-react';

const EnhancedCartDrawer = ({ isOpen, onClose, items, onRemove, onUpdateQuantity, total }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [instructions, setInstructions] = useState({});

  const updateInstructions = (itemId, value) => {
    setInstructions(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  const proceedToCheckout = () => {
    navigate('/payment', {
      state: { 
        items, 
        total,
        instructions
      }
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2" strokeWidth={2.5} />
            Your Order
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center">
              <div className="w-20 h-20 mx-auto mb-6 text-gray-300 bg-gray-50 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="text-gray-800 font-medium mb-2">Your cart is empty</h3>
              <p className="text-gray-500 text-sm max-w-xs">Add some delicious items from the menu to get started</p>
              <button 
                onClick={onClose}
                className="mt-6 text-sm font-medium px-6 py-2 rounded-full hover:bg-gray-50"
                style={{ color: theme.primary }}
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {items.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">${item.price} × {item.quantity}</p>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex items-center border border-gray-200 rounded-full overflow-hidden mr-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => onRemove(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div className="mt-2">
                    <textarea
                      value={instructions[item.id] || ''}
                      onChange={(e) => updateInstructions(item.id, e.target.value)}
                      placeholder="Add special instructions..."
                      className="w-full text-sm p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200"
                      style={{ '--tw-ring-color': `${theme.primary}25` }}
                      rows="2"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Total and Checkout */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6 space-y-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span style={{ color: theme.primary }}>${total}</span>
            </div>
            <button
              onClick={proceedToCheckout}
              className="w-full py-3.5 rounded-xl text-white font-medium transition-all hover:opacity-90 shadow-md flex items-center justify-center space-x-2"
              style={{ backgroundColor: theme.primary }}
            >
              <span>Proceed to Checkout</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default EnhancedCartDrawer;