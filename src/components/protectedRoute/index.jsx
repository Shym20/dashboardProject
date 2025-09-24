import { Navigate } from 'react-router-dom';
import { useAuthenticated } from '../../hooks/useAuthenticated.hook';


const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
