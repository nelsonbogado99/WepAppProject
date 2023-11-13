import React, { useEffect } from 'react';

function Dashboard() {
  useEffect(() => {
    const handleLogin = () => {
      // Realiza una conexión con el servidor al cargar el componente
      // Redirige al usuario a la URL de inicio de sesión en el backend
      window.location.href = "http://localhost:80/login";
    };

    // Llama a la función handleLogin cuando el componente se monta
    handleLogin();
  }, []);

  return null; // Devuelve un fragmento vacío
}

export default Dashboard;
