import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

const useAuth = (isProtectedRoute) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      axios.get('http://localhost:3000/users/session', { withCredentials: true })
        .then((response) => {
          if (response.status === 200) {
            setIsAuthenticated(true);
            if (location.pathname === '/') {
              navigate('/private');
            }
          }
        })
        .catch((error) => {
          if (isProtectedRoute) {
            setIsAuthenticated(false);
            const message = error.response?.data?.message || "Error de autenticación.";
            toast.error(message);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    };

    checkAuth();
  }, [isProtectedRoute, navigate]);

  return { isAuthenticated, loading };
};

export default useAuth;