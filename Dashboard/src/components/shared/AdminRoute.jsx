import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }
  
  if (user?.role !== 'admin') {
    return <Navigate to="/user/dashboard" replace />
  }
  
  return children
}

export default AdminRoute
