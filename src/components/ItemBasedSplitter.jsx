import { useState } from 'react';
import { motion } from 'framer-motion';

const ItemBasedSplitter = ({ items, total, appliedDiscount = null, theme }) => {
  const [payers, setPayers] = useState([
    { id: 1, name: 'Person 1', items: [], paid: false },
  ]);
  const [itemAssignments, setItemAssignments] = useState(
    items.map(item => ({ ...item, assignedTo: [] }))
  );

  // Add a new payer
  const addPayer = () => {
    setPayers([
      ...payers,
      { 
        id: payers.length + 1, 
        name: `Person ${payers.length + 1}`,
        items: [],
        paid: false 
      }
    ]);
  };

  // Toggle item assignment to a payer
  const toggleItemAssignment = (itemId, payerId) => {
    setItemAssignments(currentItems =>
      currentItems.map(item => {
        if (item.id === itemId) {
          const isCurrentlyAssigned = item.assignedTo.includes(payerId);
          return {
            ...item,
            assignedTo: isCurrentlyAssigned
              ? item.assignedTo.filter(id => id !== payerId)
              : [...item.assignedTo, payerId]
          };
        }
        return item;
      })
    );
  };

  // Calculate subtotal for a specific payer
  const calculatePayerSubtotal = (payerId) => {
    const payerItems = itemAssignments.filter(item => 
      item.assignedTo.includes(payerId)
    );
    
    // If item is shared, split price by number of people sharing
    return payerItems.reduce((sum, item) => {
      const splitAmount = item.price / item.assignedTo.length;
      return sum + splitAmount;
    }, 0);
  };

  // Calculate discount amount for a payer based on their proportion of the total
  const calculatePayerDiscount = (payerId) => {
    if (!appliedDiscount) return 0;
    
    const payerSubtotal = calculatePayerSubtotal(payerId);
    const proportion = payerSubtotal / total;
    
    if (appliedDiscount.type === 'percentage') {
      return payerSubtotal * appliedDiscount.amount;
    }
    return appliedDiscount.amount * proportion;
  };

  // Mark a payer as paid
  const markAsPaid = (payerId) => {
    setPayers(currentPayers =>
      currentPayers.map(payer =>
        payer.id === payerId ? { ...payer, paid: true } : payer
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Payer Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Split by Items</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={addPayer}
              className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Add Person
            </button>
            <span className="text-sm text-gray-500">
              {payers.length} {payers.length === 1 ? 'person' : 'people'} splitting
            </span>
          </div>
        </div>
      </motion.div>

      {/* Item Assignment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Select Items</h2>
          <div className="space-y-4">
            {itemAssignments.map(item => (
              <div 
                key={item.id} 
                className="border rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">${item.price}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.assignedTo.length} {item.assignedTo.length === 1 ? 'person' : 'people'} sharing
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {payers.map(payer => (
                    <button
                      key={payer.id}
                      onClick={() => toggleItemAssignment(item.id, payer.id)}
                      disabled={payer.paid}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        item.assignedTo.includes(payer.id)
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      } ${payer.paid ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {payer.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Payment Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Summary</h2>
          <div className="space-y-4">
            {payers.map(payer => {
              const subtotal = calculatePayerSubtotal(payer.id);
              const discount = calculatePayerDiscount(payer.id);
              const finalTotal = subtotal - discount;

              return (
                <div 
                  key={payer.id} 
                  className="border rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-800">{payer.name}</h3>
                    {payer.paid ? (
                      <span className="text-green-600 text-sm font-medium">Paid</span>
                    ) : (
                      <button
                        onClick={() => markAsPaid(payer.id)}
                        className="bg-green-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-green-700 transition-colors"
                      >
                        Pay ${finalTotal.toFixed(2)}
                      </button>
                    )}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium pt-1 border-t border-gray-100 mt-1">
                      <span>Total</span>
                      <span style={{ color: theme.primary }}>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ItemBasedSplitter;