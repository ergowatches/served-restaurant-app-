import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { ChevronLeft, CreditCard, Users, Tag, CheckCircle, Minus, Plus } from 'lucide-react';
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
        className="bg-white border-b sticky top-0 z-10 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 font-medium hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <h1 className="text-xl font-bold" style={{ color: theme.primary }}>Payment</h1>
            <div className="w-16"></div> {/* Placeholder for balance */}
          </div>
        </div>
      </motion.div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Split Mode Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-gray-500" />
            Split Bill
          </h2>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setSplitMode('equal')}
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center ${
                splitMode === 'equal'
                  ? 'text-white shadow-md'
                  : 'text-gray-600 bg-gray-100'
              }`}
              style={{ 
                backgroundColor: splitMode === 'equal' ? theme.primary : undefined 
              }}
            >
              <Users className="w-4 h-4 mr-2" />
              Split Equally
            </button>
            <button
              onClick={() => setSplitMode('items')}
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center ${
                splitMode === 'items'
                  ? 'text-white shadow-md'
                  : 'text-gray-600 bg-gray-100'
              }`}
              style={{ 
                backgroundColor: splitMode === 'items' ? theme.primary : undefined 
              }}
            >
              <CreditCard className="w-4 h-4 mr-2" />
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
            <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-gray-500" />
              Order Summary
            </h2>
            
            <div className="divide-y divide-gray-100">
              {items.map(item => (
                <div key={item.id} className="py-3 flex justify-between group hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="bg-gray-100 rounded-md h-10 w-10 flex items-center justify-center text-gray-600 font-medium">
                      {item.quantity}x
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium group-hover:text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  <span className="font-medium whitespace-nowrap" style={{ color: theme.primary }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
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
            <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <Tag className="w-5 h-5 mr-2 text-gray-500" />
              Discount Code
            </h2>
            
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
                disabled={!discountCode}
                style={{ backgroundColor: discountCode ? theme.primary : 'rgb(229, 231, 235)' }}
                className={`text-white px-6 py-2 rounded-lg font-medium transition-opacity ${
                  !discountCode ? 'cursor-not-allowed text-gray-500' : 'hover:opacity-90'
                }`}
              >
                Apply
              </button>
            </div>
            
            {appliedDiscount && (
              <div className="mt-3 text-green-600 text-sm flex items-center bg-green-50 p-2 rounded-lg border border-green-100">
                <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <div>
                  <span className="font-medium">{appliedDiscount.code}</span> - 
                  {appliedDiscount.type === 'percentage' 
                    ? ` ${appliedDiscount.amount * 100}% off`
                    : ` $${appliedDiscount.amount} off`
                  }
                </div>
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
              <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-gray-500" />
                Split Equally
              </h2>
              
              <div className="flex items-center justify-center space-x-6 mb-6">
                <button 
                  onClick={() => setSplitCount(Math.max(1, splitCount - 1))}
                  className="w-10 h-10 rounded-full font-bold transition-all hover:scale-105 flex items-center justify-center"
                  style={{ 
                    backgroundColor: `${theme.primary}15`,
                    color: theme.primary 
                  }}
                >
                  <Minus className="w-4 h-4" />
                </button>
                
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-gray-800">
                    {splitCount}
                  </span>
                  <span className="text-sm text-gray-500">
                    {splitCount === 1 ? 'person' : 'people'}
                  </span>
                </div>
                
                <button 
                  onClick={() => setSplitCount(Math.min(10, splitCount + 1))}
                  className="w-10 h-10 rounded-full font-bold transition-all hover:scale-105 flex items-center justify-center"
                  style={{ 
                    backgroundColor: `${theme.primary}15`,
                    color: theme.primary 
                  }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-1">Each person pays</p>
                <p className="text-2xl font-bold" style={{ color: theme.primary }}>
                  ${amountPerPerson}
                </p>
              </div>
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
                <span>${total.toFixed(2)}</span>
              </div>
              {appliedDiscount && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold border-t border-gray-100 pt-4 mt-2">
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
          className="w-full text-white py-4 rounded-xl font-medium text-lg shadow-lg hover:opacity-90 transition-all flex items-center justify-center space-x-2"
        >
          <CreditCard className="w-5 h-5 mr-1" />
          <span>Proceed to Payment</span>
        </motion.button>
      </div>
    </div>
  );
}