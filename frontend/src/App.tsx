import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Header from './components/layout/Header'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CartPage from './pages/CartPage'
import OrdersPage from './pages/OrdersPage'
import ProductsPage from './pages/ProductsPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'

function hasSession() {
  return Boolean(localStorage.getItem('token'))
}

function ProtectedRoute({ children }) {
  return hasSession() ? children : <Navigate to="/login" replace />
}

function AppShell() {
  const { pathname } = useLocation()
  const isAuthPage = ['/', '/login'].includes(pathname)

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {!isAuthPage && hasSession() && <Header />}
      <main className="min-h-0 flex-1">
        <Routes>
          <Route path="/" element={hasSession() ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
          <Route path="/login" element={hasSession() ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={hasSession() ? '/dashboard' : '/login'} replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
