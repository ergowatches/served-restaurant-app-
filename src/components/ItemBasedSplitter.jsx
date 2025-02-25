import { useState, useEffect } from 'react';
import { Users, Plus, Minus } from 'lucide-react';

export default function ItemBasedSplitter({ items, total, appliedDiscount, theme }) {
  // Ensure total is a number
  const initialTotal = typeof total === 'number' ? total : parseFloat(total || 0);
  
  const [splitItems, setSplitItems] = useState([]);
  const [people, setPeople] = useState([
    { id: 1, name: 'Person 1' },
    { id: 2, name: 'Person 2' }
  ]);
  
  useEffect(() => {
    // Initialize the split items state with the items from props
    const initialSplitItems = items.map(item => ({
      ...item,
      split: people.map(person => ({
        personId: person.id,
        percentage: 100 / people.length // Split evenly by default
      }))
    }));
    
    setSplitItems(initialSplitItems);
  }, [items, people.length]);
  
  const addPerson = () => {
    const newId = Math.max(...people.map(p => p.id)) + 1;
    const newPerson = { id: newId, name: `Person ${newId}` };
    setPeople([...people, newPerson]);
    
    // Update the split percentages for all items
    setSplitItems(prevItems => 
      prevItems.map(item => ({
        ...item,
        split: [
          ...item.split.map(split => ({
            ...split,
            percentage: split.percentage * (people.length / (people.length + 1))
          })),
          { personId: newId, percentage: 100 / (people.length + 1) }
        ]
      }))
    );
  };
  
  const removePerson = (personId) => {
    if (people.length <= 2) return; // Minimum 2 people
    
    const filteredPeople = people.filter(p => p.id !== personId);
    setPeople(filteredPeople);
    
    // Redistribute percentages for removed person
    setSplitItems(prevItems => 
      prevItems.map(item => {
        const removedSplit = item.split.find(s => s.personId === personId);
        const removedPercentage = removedSplit ? removedSplit.percentage : 0;
        const remainingSplits = item.split.filter(s => s.personId !== personId);
        
        const totalPercentage = remainingSplits.reduce((sum, s) => sum + s.percentage, 0);
        
        return {
          ...item,
          split: remainingSplits.map(split => ({
            ...split,
            percentage: totalPercentage === 0 
              ? 100 / remainingSplits.length 
              : split.percentage + (removedPercentage * (split.percentage / totalPercentage))
          }))
        };
      })
    );
  };
  
  const updateSplit = (itemId, personId, direction) => {
    // Find the item and the person's current percentage
    const itemIndex = splitItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;
    
    const item = splitItems[itemIndex];
    const personSplitIndex = item.split.findIndex(s => s.personId === personId);
    if (personSplitIndex === -1) return;
    
    // Calculate adjustment (5% increments)
    const adjustment = direction === 'increase' ? 5 : -5;
    const personCurrentPercentage = item.split[personSplitIndex].percentage;
    
    // Don't allow less than 0% or more than 100%
    if (
      (direction === 'decrease' && personCurrentPercentage <= 5) || 
      (direction === 'increase' && personCurrentPercentage >= 100)
    ) {
      return;
    }
    
    // Calculate proportional decrease for others
    const newSplits = [...item.split];
    newSplits[personSplitIndex] = {
      ...newSplits[personSplitIndex],
      percentage: personCurrentPercentage + adjustment
    };
    
    // Adjust other percentages proportionally
    const otherSplits = newSplits.filter((_, idx) => idx !== personSplitIndex);
    const totalOtherPercentage = otherSplits.reduce((sum, s) => sum + s.percentage, 0);
    
    if (totalOtherPercentage > 0) {
      const otherAdjustmentFactor = 1 - (adjustment / totalOtherPercentage);
      
      newSplits.forEach((split, idx) => {
        if (idx !== personSplitIndex) {
          newSplits[idx] = {
            ...split,
            percentage: Math.max(0, split.percentage * otherAdjustmentFactor)
          };
        }
      });
    }
    
    // Normalize to ensure sum is 100%
    const totalPercentage = newSplits.reduce((sum, s) => sum + s.percentage, 0);
    if (totalPercentage !== 100) {
      newSplits.forEach((split, idx) => {
        newSplits[idx] = {
          ...split,
          percentage: (split.percentage / totalPercentage) * 100
        };
      });
    }
    
    // Update the state
    const newSplitItems = [...splitItems];
    newSplitItems[itemIndex] = {
      ...item,
      split: newSplits
    };
    
    setSplitItems(newSplitItems);
  };
  
  // Calculate totals per person
  const calculateDiscount = () => {
    if (!appliedDiscount) return 0;
    if (appliedDiscount.type === 'percentage') {
      return initialTotal * appliedDiscount.amount;
    }
    return appliedDiscount.amount;
  };
  
  const discountAmount = calculateDiscount();
  const finalTotal = initialTotal - discountAmount;
  const discountRatio = finalTotal / initialTotal;
  
  const personTotals = people.map(person => {
    const personTotal = splitItems.reduce((sum, item) => {
      const personSplit = item.split.find(s => s.personId === person.id);
      const percentage = personSplit ? personSplit.percentage / 100 : 0;
      return sum + (item.price * item.quantity * percentage);
    }, 0);
    
    // Apply discount proportionately
    return {
      personId: person.id,
      name: person.name,
      total: personTotal * discountRatio
    };
  });
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-800 flex items-center">
          <Users className="w-5 h-5 mr-2 text-gray-500" />
          Split by Items
        </h2>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={addPerson}
            className="flex items-center justify-center p-2 rounded-full text-white"
            style={{ backgroundColor: theme.primary }}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* People List */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {people.map(person => (
          <div 
            key={person.id} 
            className="flex-shrink-0 flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100"
          >
            {person.name}
            {people.length > 2 && (
              <button 
                onClick={() => removePerson(person.id)}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <Minus className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>
      
      {/* Items List */}
      <div className="space-y-4 divide-y divide-gray-100">
        {splitItems.map(item => (
          <div key={item.id} className="pt-4">
            <div className="flex justify-between mb-2">
              <div className="flex items-start space-x-3">
                <div className="bg-gray-100 rounded-md h-10 w-10 flex items-center justify-center text-gray-600 font-medium">
                  {item.quantity}x
                </div>
                <div>
                  <p className="text-gray-800 font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
              <span className="font-medium whitespace-nowrap" style={{ color: theme.primary }}>
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
            
            {/* Split Controls */}
            <div className="bg-gray-50 p-3 rounded-lg space-y-2 mt-2">
              {item.split.map(split => {
                const person = people.find(p => p.id === split.personId);
                if (!person) return null;
                
                return (
                  <div key={`${item.id}-${split.personId}`} className="flex items-center justify-between">
                    <span className="text-sm">{person.name}</span>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateSplit(item.id, split.personId, 'decrease')}
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}
                        disabled={split.percentage <= 0}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      
                      <div className="w-16 text-center">
                        <div className="text-xs">{Math.round(split.percentage)}%</div>
                        <div className="text-xs font-medium">
                          ${((item.price * item.quantity * split.percentage / 100) * discountRatio).toFixed(2)}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => updateSplit(item.id, split.personId, 'increase')}
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}
                        disabled={split.percentage >= 100}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Person Totals */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg space-y-2">
        <h3 className="font-medium text-sm text-gray-700 mb-3">Per Person Totals</h3>
        
        {personTotals.map(personTotal => (
          <div key={personTotal.personId} className="flex justify-between">
            <span>{personTotal.name}</span>
            <span className="font-medium" style={{ color: theme.primary }}>
              ${personTotal.total.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}