import { Outlet, Route, Routes, Navigate, useLocation } from 'react-router-dom'
import './App.css'
import { Dashboard } from './pages/Dashboard.tsx'
import { Login } from './pages/Login.tsx'
import { useAuth } from './auth/AuthProvider.tsx'
import { TailAdminLayout } from './layouts/TailAdminLayout.tsx'

function LayoutShell() {
  return (
    <TailAdminLayout>
      <Outlet />
    </TailAdminLayout>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Public route: Login is not wrapped by admin layout */}
      <Route path="/login" element={<Login />} />
      <Route element={<LayoutShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return null
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <>{children}</>
}
