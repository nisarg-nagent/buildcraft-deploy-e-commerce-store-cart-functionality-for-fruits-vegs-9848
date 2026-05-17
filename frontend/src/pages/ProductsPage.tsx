import { useEffect, useState } from 'react'
import { fetchProducts } from '../api'

const PRODUCTS = [
  { id: 1, name: 'Organic Bananas', category: 'Fruit', price: '$2.49/lb', stock: 84, status: 'active', accent: '#facc15' },
  { id: 2, name: 'Baby Spinach', category: 'Vegetable', price: '$3.99/bag', stock: 18, status: 'active', accent: '#22c55e' },
  { id: 3, name: 'Roma Tomatoes', category: 'Vegetable', price: '$1.89/lb', stock: 9, status: 'low', accent: '#ef4444' },
  { id: 4, name: 'Honeycrisp Apples', category: 'Fruit', price: '$4.29/lb', stock: 41, status: 'active', accent: '#f97316' },
]

export default function ProductsPage() {
  const [products, setProducts] = useState(PRODUCTS)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const filtered = products.filter(product => product.name.toLowerCase().includes(search.toLowerCase()) && (category === 'All' || product.category === category))

  useEffect(() => {
    let active = true
    fetchProducts()
      .then(data => {
        if (active && Array.isArray(data)) setProducts(data)
      })
      .catch(() => undefined)
    return () => { active = false }
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products CRUD</h1>
          <p className="text-gray-500">Create, search, filter, update, and retire produce listings.</p>
        </div>
        <button className="rounded-lg bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700">Add Product</button>
      </div>
      <div className="mb-5 flex flex-wrap gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)} className="min-w-0 flex-1 rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Search products..." />
        <select value={category} onChange={e => setCategory(e.target.value)} className="rounded-lg border px-4 py-2">
          <option>All</option><option>Fruit</option><option>Vegetable</option>
        </select>
      </div>
      <div className="grid gap-4">
        {filtered.map(product => (
          <div key={product.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex min-w-0 items-center gap-4">
              <span className="h-12 w-12 shrink-0 rounded-xl" style={{ backgroundColor: product.accent }} />
              <div className="min-w-0">
                <h2 className="font-bold text-gray-900">{product.name}</h2>
                <p className="text-sm text-gray-500">{product.category} · {product.price}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-bold text-gray-700">Stock {product.stock}</span>
              <span className={product.status === 'low' ? 'rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700' : 'rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700'}>{product.status}</span>
              <button className="rounded-lg border px-3 py-2 font-bold text-gray-700">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
