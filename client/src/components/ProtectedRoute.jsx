import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    if (user.role === 'school') return <Navigate to="/school-dashboard" replace />;
    return <Navigate to="/student-dashboard" replace />;
  }
  return children;
};

export default ProtectedRoute;
