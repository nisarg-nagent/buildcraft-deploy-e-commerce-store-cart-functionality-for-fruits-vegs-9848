const REPORTS = [
  { id: 1, name: 'Top Products', metric: 'Bananas lead with 184 units', change: '+22%', color: '#22c55e' },
  { id: 2, name: 'Payment Success', metric: '97.4% successful payments', change: '+3%', color: '#3b82f6' },
  { id: 3, name: 'Delivery SLA', metric: '91% delivered same day', change: '-2%', color: '#f97316' },
]
const ROWS = [
  { id: 1, product: 'Organic Bananas', revenue: '$842', units: 184 },
  { id: 2, product: 'Honeycrisp Apples', revenue: '$690', units: 121 },
  { id: 3, product: 'Baby Spinach', revenue: '$512', units: 98 },
]

export default function ReportsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reporting & Export</h1>
          <p className="text-gray-500">Sales analytics for fruits, vegetables, payments, and fulfillment.</p>
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700">Export CSV</button>
      </div>
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {REPORTS.map(report => (
          <div key={report.id} className="rounded-2xl border bg-white p-5 shadow-sm">
            <span className="mb-4 block h-2 w-12 rounded-full" style={{ backgroundColor: report.color }} />
            <h2 className="font-bold text-gray-900">{report.name}</h2>
            <p className="mt-2 text-sm text-gray-500">{report.metric}</p>
            <p className="mt-3 text-lg font-bold text-gray-900">{report.change}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Revenue by product</h2>
        <div className="space-y-3">
          {ROWS.map(row => (
            <div key={row.id} className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
              <div><p className="font-bold text-gray-900">{row.product}</p><p className="text-sm text-gray-500">{row.units} units sold</p></div>
              <p className="text-lg font-bold text-green-700">{row.revenue}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}