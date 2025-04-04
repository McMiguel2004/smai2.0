import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null para indicar "pendiente"

  useEffect(() => {
    // Verificamos la autenticación igual que en el Navbar
    fetch('http://localhost:5000/api/auth/me', {
      method: 'GET',
      credentials: 'include', // Para enviar cookies
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("No autenticado");
      })
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  if (isAuthenticated === null) {
    // Mientras se verifica, podemos retornar null o un loader si prefieres
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
