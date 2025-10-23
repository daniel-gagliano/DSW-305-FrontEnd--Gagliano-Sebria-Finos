import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/authContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'ADMIN' | 'CLIENTE' | 'public'>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, userRole } = useAuth();

  // Si se permite acceso público, mostrar directamente
  if (allowedRoles.includes('public')) {
    return <>{children}</>;
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si hay roles especificados y el usuario no tiene ninguno de ellos
  if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;