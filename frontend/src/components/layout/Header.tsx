import { NavLink, Link, useNavigate } from 'react-router-dom'

const NAV = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/cart', label: 'Cart' },
  { to: '/orders', label: 'Orders' },
  { to: '/products', label: 'Products' },
  { to: '/reports', label: 'Reports' },
  { to: '/settings', label: 'Settings' },
]

export default function Header() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  return (
    <header className="w-full shrink-0 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 md:px-6">
        <div className="flex shrink-0 items-center gap-2">
          <Link to="/dashboard" className="text-lg font-bold text-green-700 hover:text-green-800">
            FreshCart Market
          </Link>
        </div>
        <nav className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2 sm:gap-3" aria-label="Main">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                'rounded-md px-3 py-2 text-sm font-bold transition-colors ' +
                (isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-green-600')
              }
            >
              {item.label}
            </NavLink>
          ))}
          <button type="button" onClick={handleLogout} className="rounded-md px-3 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-red-600">
            Logout
          </button>
        </nav>
      </div>
    </header>
  )
}
