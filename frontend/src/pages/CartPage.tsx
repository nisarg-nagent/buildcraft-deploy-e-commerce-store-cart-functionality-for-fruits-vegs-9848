import { useEffect, useState } from 'react'
import { fetchCart } from '../api'

const CART = [
  { id: 1, name: 'Strawberries', qty: 3, price: 5.49, unit: 'box' },
  { id: 2, name: 'Avocados', qty: 6, price: 1.75, unit: 'each' },
  { id: 3, name: 'Carrots', qty: 2, price: 2.25, unit: 'bag' },
]

export default function CartPage() {
  const [items, setItems] = useState(CART)
  const [coupon, setCoupon] = useState('FRESH10')
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0)
  const discount = coupon ? subtotal * 0.1 : 0
  const total = subtotal - discount + 4.99

  useEffect(() => {
    let active = true
    fetchCart()
      .then(data => {
        if (active && Array.isArray(data?.items)) setItems(data.items)
      })
      .catch(() => undefined)
    return () => { active = false }
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Customer Cart</h1>
        <p className="text-gray-500">Preview cart contents and payment summary.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl border bg-white p-5 shadow-sm">
              <div>
                <h2 className="font-bold text-gray-900">{item.name}</h2>
                <p className="text-sm text-gray-500">{item.qty} {item.unit} × ${item.price.toFixed(2)}</p>
              </div>
              <p className="text-lg font-bold text-gray-900">${(item.qty * item.price).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Payment Summary</h2>
          <input value={coupon} onChange={e => setCoupon(e.target.value)} className="mb-4 w-full rounded-lg border px-4 py-2" placeholder="Coupon code" />
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-green-700"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>$4.99</span></div>
            <div className="border-t pt-3 text-lg font-bold"><div className="flex justify-between"><span>Total</span><span>${total.toFixed(2)}</span></div></div>
          </div>
          <button className="mt-5 w-full rounded-lg bg-orange-500 py-3 font-bold text-white hover:bg-orange-600">Pay Securely</button>
        </div>
      </div>
    </div>
  )
}
