import {Navigate, useLocation} from 'react-router-dom';
import {hasRole, isAuthenticated} from '../utils/authStorage';

export const ProtectedRoute = ({children, requiredRole}) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{from: location}}/>;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/" replace/>;
  }

  return children;
};