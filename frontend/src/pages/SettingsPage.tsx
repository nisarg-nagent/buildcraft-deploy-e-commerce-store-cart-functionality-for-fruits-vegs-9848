import { useState } from 'react'

const TEAM = [
  { id: 1, name: 'Demo Admin', role: 'Owner', email: 'demo@example.com' },
  { id: 2, name: 'Packing Lead', role: 'Staff', email: 'packing@example.com' },
  { id: 3, name: 'Delivery Partner', role: 'Courier', email: 'delivery@example.com' },
]

export default function SettingsPage() {
  const [notify, setNotify] = useState(true)
  const [tax, setTax] = useState('8.25')

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Store Settings</h1>
        <p className="text-gray-500">Manage notifications, collaborators, taxes, and store preferences.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Notifications</h2>
          <label className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
            <span className="font-bold text-gray-800">Order and payment alerts</span>
            <input checked={notify} onChange={e => setNotify(e.target.checked)} type="checkbox" className="h-5 w-5" />
          </label>
          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-bold text-gray-700">Sales tax rate</span>
            <input value={tax} onChange={e => setTax(e.target.value)} className="w-full rounded-lg border px-4 py-2" />
          </label>
          <button className="mt-5 rounded-lg bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700">Save Settings</button>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Collaborators</h2>
          <div className="space-y-3">
            {TEAM.map(member => (
              <div key={member.id} className="rounded-xl bg-gray-50 p-4">
                <p className="font-bold text-gray-900">{member.name}</p>
                <p className="text-sm text-gray-500">{member.email} · {member.role}</p>
              </div>
            ))}
          </div>
          <button className="mt-5 rounded-lg border px-4 py-2 font-bold text-gray-700">Invite teammate</button>
        </div>
      </div>
    </div>
  )
}