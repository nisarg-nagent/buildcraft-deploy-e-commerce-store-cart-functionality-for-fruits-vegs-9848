import { useEffect, useState } from 'react'
import { fetchOrders } from '../api'

const ORDERS = [
  { id: 'ORD-1042', customer: 'Maya Patel', total: '$48.20', status: 'packing', date: '2025-05-16' },
  { id: 'ORD-1041', customer: 'Noah Kim', total: '$32.75', status: 'paid', date: '2025-05-16' },
  { id: 'ORD-1040', customer: 'Lina Gomez', total: '$61.10', status: 'delivered', date: '2025-05-15' },
  { id: 'ORD-1039', customer: 'Arun Shah', total: '$24.40', status: 'pending', date: '2025-05-15' },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState(ORDERS)
  const [status, setStatus] = useState('All')
  const filtered = orders.filter(order => status === 'All' || order.status === status)
  const badge = orderStatus => orderStatus === 'delivered' ? 'bg-green-100 text-green-700' : orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'

  useEffect(() => {
    let active = true
    fetchOrders()
      .then(data => {
        if (active && Array.isArray(data)) setOrders(data)
      })
      .catch(() => undefined)
    return () => { active = false }
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Workflow</h1>
          <p className="text-gray-500">Collaborate across payment, packing, and delivery statuses.</p>
        </div>
        <select value={status} onChange={e => setStatus(e.target.value)} className="rounded-lg border px-4 py-2">
          <option>All</option><option>pending</option><option>paid</option><option>packing</option><option>delivered</option>
        </select>
      </div>
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        {filtered.map(order => (
          <div key={order.id} className="grid gap-3 border-b p-5 last:border-b-0 md:grid-cols-5 md:items-center">
            <div className="font-bold text-gray-900">{order.id}</div>
            <div className="text-gray-700">{order.customer}</div>
            <div className="font-bold text-gray-900">{order.total}</div>
            <div><span className={'rounded-full px-3 py-1 text-sm font-bold ' + badge(order.status)}>{order.status}</span></div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-500">{order.date}</span>
              <button className="rounded-lg border px-3 py-2 text-sm font-bold text-gray-700">Update</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
