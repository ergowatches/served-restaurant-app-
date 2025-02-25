import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, Home } from 'lucide-react';

export default function PaymentConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const [countdown, setCountdown] = useState(5);
  
  // Get order details from location state
  const orderDetails = location.state?.orderDetails || {
    orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
    total: 0,
    items: [],
    timestamp: new Date().toISOString()
  };
  
  // Auto redirect to home after countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate('/menu/1', { replace: true });
    }
  }, [countdown, navigate]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Success Header */}
          <div 
            className="p-6 text-center" 
            style={{ backgroundColor: theme.primary }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-4">
              <CheckCircle className="w-8 h-8" style={{ color: theme.primary }} />
            </div>
            <h1 className="text-2xl font-bold text-white">Payment Successful!</h1>
            <p className="text-white text-opacity-80 mt-1">
              Your order has been placed
            </p>
          </div>
          
          {/* Order Details */}
          <div className="p-6">
            <div className="border-b border-gray-100 pb-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Order ID</span>
                <span className="font-medium">{orderDetails.orderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Date & Time</span>
                <span className="font-medium">
                  {new Date(orderDetails.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="border-b border-gray-100 pb-4 mb-4">
              <h3 className="font-medium mb-3">Order Summary</h3>
              <div className="space-y-2">
                {orderDetails.items.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-sm">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-sm font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span style={{ color: theme.primary }}>
                ${typeof orderDetails.total === 'number' 
                  ? orderDetails.total.toFixed(2) 
                  : parseFloat(orderDetails.total || 0).toFixed(2)
                }
              </span>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="bg-gray-50 p-6 border-t border-gray-100">
            <p className="text-sm text-gray-600 text-center">
              Please show this screen to restaurant staff when collecting your order.
            </p>
            <p className="text-sm text-gray-600 text-center mt-1">
              Redirecting to home in {countdown} seconds...
            </p>
          </div>
        </motion.div>
        
        {/* Action Buttons */}
        <div className="flex space-x-4 mt-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center px-5 py-2 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          
          <button
            onClick={() => navigate('/menu/1', { replace: true })}
            className="flex items-center justify-center px-5 py-2 rounded-lg text-white font-medium"
            style={{ backgroundColor: theme.primary }}
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </button>
        </div>
      </div>
    </div>
  );
}