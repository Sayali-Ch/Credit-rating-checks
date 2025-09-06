import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const UserRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }
  
  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />
  }
  
  return children
}

export default UserRoute
