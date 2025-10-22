import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/authContext';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('ADMIN' | 'CLIENTE' | 'public')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRole } = useAuth();

  // Si la ruta permite acceso público y no está autenticado, permitir acceso
  if (!isAuthenticated && allowedRoles.includes('public')) {
    return <>{children}</>;
  }

  // Si no está autenticado y la ruta no es pública, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, verificar el rol
  const hasAccess = allowedRoles.includes(userRole as 'ADMIN' | 'CLIENTE');

  // Si no tiene acceso, redirigir según el rol
  if (!hasAccess) {
    // ADMIN sin acceso -> enviar a gestión general
    if (userRole === 'ADMIN') {
      return <Navigate to="/gestion-general" replace />;
    }
    // CLIENTE sin acceso -> enviar a home
    if (userRole === 'CLIENTE') {
      return <Navigate to="/" replace />;
    }
    // Por defecto, enviar a login
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;