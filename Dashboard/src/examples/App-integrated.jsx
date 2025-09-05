import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Admin Components
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUserProfile from './pages/admin/AdminUserProfile'
import AdminApplications from './pages/admin/AdminApplications'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import UserManagement from './pages/admin/UserManagement'

// User Components (from teammate)
import UserDashboard from './pages/user/UserDashboard'
import UserProfile from './pages/user/UserProfile'
import UserApplications from './pages/user/UserApplications'
import MyProfile from './pages/user/MyProfile'

// Shared Components
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import NotFound from './pages/shared/NotFound'

// Admin Layout Component
import AdminLayout from './layouts/AdminLayout'
import UserLayout from './layouts/UserLayout'
import AuthLayout from './layouts/AuthLayout'

// Route Protection
import AdminRoute from './components/shared/AdminRoute'
import UserRoute from './components/shared/UserRoute'

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Admin Routes - Protected */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="users/:userId" element={<AdminUserProfile />} />
          <Route path="applications" element={<AdminApplications />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>

        {/* User Routes - Protected */}
        <Route 
          path="/user" 
          element={
            <UserRoute>
              <UserLayout />
            </UserRoute>
          }
        >
          <Route index element={<UserDashboard />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="applications" element={<UserApplications />} />
        </Route>

        {/* Root redirects */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
