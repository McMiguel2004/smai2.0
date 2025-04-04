import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/logout', {
          method: 'POST',
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Logout failed');
        }
        
        // Limpiar cualquier estado local
        setIsAuthenticated(false);
        
        // Eliminar cookies del lado del cliente por si acaso
        document.cookie = 'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        
        navigate('/login');
      } catch (error) {
        console.error('Logout failed:', error);
        // Asegurarse de redirigir incluso si falla
        setIsAuthenticated(false);
        navigate('/login');
      }
    };

    logoutUser();
  }, [navigate, setIsAuthenticated]);

  return null;
};

export default Logout;