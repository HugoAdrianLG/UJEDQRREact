import React from 'react';
import axios from 'axios'; 

function LogoutButton() {
  const handleLogout = async () => {
    try {
      // Realizar la solicitud al servidor para cerrar sesión
      const response = await axios.get('http://localhost:5000/logout', { withCredentials: true });

      // Verificar si se redirige después de cerrar sesión
      if (response.status === 200 && response.data.redirect) {
        window.location.href = response.data.redirect; // Redirigir a la URL especificada por el servidor
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="top-section">
    <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}

export default LogoutButton;
