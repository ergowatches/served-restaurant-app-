export default function MenuItem({ item, onAddToCart }) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
            <p className="text-gray-600 mt-1 text-sm">{item.description}</p>
            <p className="text-lg font-bold text-pink-600 mt-2">
              ${item.price}
            </p>
          </div>
          <button
            onClick={() => onAddToCart(item)}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Add
          </button>
        </div>
      </div>
    )
  }