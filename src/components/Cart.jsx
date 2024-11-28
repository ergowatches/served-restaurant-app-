export default function Cart({ items, onRemove, total }) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Your Order
        </h2>
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Your cart is empty</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center pb-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-gray-600 text-sm">${item.price}</p>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-pink-600 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex justify-between font-bold text-gray-800">
                <span>Total:</span>
                <span className="text-pink-600">${total}</span>
              </div>
            </div>
            <button className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg text-base font-medium mt-4">
              Place Order
            </button>
          </div>
        )}
      </div>
    )
  }