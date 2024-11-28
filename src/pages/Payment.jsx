import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import ItemBasedSplitter from '../components/ItemBasedSplitter';

export default function Payment() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { state } = useLocation();
  const { items, total } = state || { items: [], total: 0 };

  const [splitMode, setSplitMode] = useState('equal');
  const [splitCount, setSplitCount] = useState(1);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);

  // This would normally come from a backend
  const availableDiscounts = {
    'WELCOME10': { code: 'WELCOME10', amount: 0.1, type: 'percentage' },
    'SAVE5': { code: 'SAVE5', amount: 5, type: 'fixed' }
  };

  const applyDiscount = () => {
    const discount = availableDiscounts[discountCode.toUpperCase()];
    if (discount) {
      setAppliedDiscount(discount);
      setDiscountCode('');
    }
  };

  const calculateDiscount = () => {
    if (!appliedDiscount) return 0;
    if (appliedDiscount.type === 'percentage') {
      return (total * appliedDiscount.amount);
    }
    return appliedDiscount.amount;
  };

  const discountAmount = calculateDiscount();
  const finalTotal = total - discountAmount;
  const amountPerPerson = (finalTotal / splitCount).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b"
        style={{ borderColor: `${theme.primary}20` }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="text-gray-600 font-medium flex items-center hover:text-gray-900 transition-colors"
            >
              ← Back to Menu
            </button>
            <h1 className="text-2xl font-bold" style={{ color: theme.primary }}>Payment</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Split Mode Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setSplitMode('equal')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                splitMode === 'equal'
                  ? 'text-white shadow-lg scale-105'
                  : 'text-gray-600 bg-gray-100'
              }`}
              style={{ 
                backgroundColor: splitMode === 'equal' ? theme.primary : undefined 
              }}
            >
              Split Equally
            </button>
            <button
              onClick={() => setSplitMode('items')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                splitMode === 'items'
                  ? 'text-white shadow-lg scale-105'
                  : 'text-gray-600 bg-gray-100'
              }`}
              style={{ 
                backgroundColor: splitMode === 'items' ? theme.primary : undefined 
              }}
            >
              Split by Items
            </button>
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="divide-y divide-gray-100">
              {items.map(item => (
                <div key={item.id} className="py-3 flex justify-between group hover:bg-gray-50 rounded-lg transition-colors">
                  <div>
                    <p className="text-gray-800 font-medium group-hover:text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <span className="font-medium" style={{ color: theme.primary }}>${item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Discount Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Discount Code</h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder="Enter discount code"
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-shadow"
                style={{ '--tw-ring-color': `${theme.primary}50` }}
              />
              <button
                onClick={applyDiscount}
                style={{ backgroundColor: theme.primary }}
                className="text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Apply
              </button>
            </div>
            {appliedDiscount && (
              <div className="mt-3 text-green-600 text-sm flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Discount applied: {appliedDiscount.code}
              </div>
            )}
          </div>
        </motion.div>

        {/* Split Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {splitMode === 'equal' ? (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Split Equally</h2>
              <div className="flex items-center space-x-4 mb-4">
                <button 
                  onClick={() => setSplitCount(Math.max(1, splitCount - 1))}
                  className="w-10 h-10 rounded-full font-bold transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: `${theme.primary}15`,
                    color: theme.primary 
                  }}
                >
                  -
                </button>
                <span className="text-lg font-medium">
                  {splitCount} {splitCount === 1 ? 'person' : 'people'}
                </span>
                <button 
                  onClick={() => setSplitCount(Math.min(10, splitCount + 1))}
                  className="w-10 h-10 rounded-full font-bold transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: `${theme.primary}15`,
                    color: theme.primary 
                  }}
                >
                  +
                </button>
              </div>
              <p className="text-lg font-medium" style={{ color: theme.primary }}>
                ${amountPerPerson} per person
              </p>
            </div>
          ) : (
            <ItemBasedSplitter 
              items={items} 
              total={total} 
              appliedDiscount={appliedDiscount}
              theme={theme}
            />
          )}
        </motion.div>

        {/* Total Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-md"
        >
          <div className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${total}</span>
              </div>
              {appliedDiscount && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold border-t border-gray-100 pt-2 mt-2">
                <span>Total</span>
                <span style={{ color: theme.primary }}>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Button */}
        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ backgroundColor: theme.primary }}
          className="w-full text-white py-4 rounded-xl font-medium text-lg shadow-lg hover:opacity-90 transition-all hover:scale-[1.02]"
        >
          Proceed to Payment
        </motion.button>
      </div>
    </div>
  );
}