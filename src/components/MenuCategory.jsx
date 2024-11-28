import MenuItem from './MenuItem'

export default function MenuCategory({ category, onAddToCart }) {
  return (
    <div id={category.id} className="space-y-4 scroll-mt-20">
      <h2 className="text-xl font-bold text-gray-800">
        {category.name}
      </h2>
      <div className="grid gap-4">
        {category.items.map((item) => (
          <MenuItem key={item.id} item={item} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  )
}