const STATS = [
  { id: 1, label: 'Revenue Today', value: '$2,845', detail: '+18% vs yesterday', accent: 'bg-green-500' },
  { id: 2, label: 'Active Orders', value: '42', detail: '9 preparing', accent: 'bg-orange-500' },
  { id: 3, label: 'Cart Items', value: '156', detail: 'across customers', accent: 'bg-blue-500' },
  { id: 4, label: 'Low Stock', value: '7', detail: 'needs restock', accent: 'bg-red-500' },
]
const ACTIVITY = [
  { id: 1, title: 'Mango box payment received', time: '5 min ago', status: 'paid' },
  { id: 2, title: 'Spinach inventory updated', time: '18 min ago', status: 'stock' },
  { id: 3, title: 'Order #1042 moved to delivery', time: '32 min ago', status: 'delivery' },
]

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Fresh store dashboard</h1>
        <p className="text-gray-500">Track produce inventory, carts, payments, and fulfillment workflow.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map(stat => (
          <div key={stat.id} className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className={'mb-4 h-2 w-12 rounded-full ' + stat.accent} />
            <p className="text-sm font-bold text-gray-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="mt-1 text-sm text-green-600">{stat.detail}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Workflow status</h2>
          <div className="grid gap-3 sm:grid-cols-4">
            {['Cart', 'Paid', 'Packing', 'Delivered'].map(stage => (
              <div key={stage} className="rounded-xl bg-gray-50 p-4 text-center">
                <p className="text-sm font-bold text-gray-500">{stage}</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{stage === 'Cart' ? '24' : stage === 'Paid' ? '18' : stage === 'Packing' ? '11' : '37'}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Notifications</h2>
          <div className="space-y-3">
            {ACTIVITY.map(item => (
              <div key={item.id} className="rounded-xl bg-green-50 p-3">
                <p className="font-bold text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-500">{item.time} · {item.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}