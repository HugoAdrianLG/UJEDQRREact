import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../Auth/AuthProvider';
import '../components/Login.css'
import HeaderImage from './LogoUjed.png'


const Login= () => {
  const [matricula, setUsername] = useState('');
  const auth = useContext(AuthContext)
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const userData = {
      matricula,
      password,
    };

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        const userType = data.role;
        auth.setAuthData({
          token: data.token,
          role: data.role,
          matricula: matricula
        })

        // Redirigir al usuario según su tipo
        if (userType === 'alumno') {
          // Redirigir al dashboard de alumnos
          navigate('/qr');
        } else if (userType === 'maestro') {
          // Redirigir al dashboard de maestros
          navigate('/lector')
        }
      } else {
        const errorData = await response.json();
        console.error(errorData.error);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  return (
    <div className='app-container'>
       <div className="main-container">
        <div className="form-container">
      <h2 className="form-title">Inicio de sesión</h2>
      <form>
        <div className="input-container">

          <input
            type="text"
            value={matricula}
            onChange={(e) => setUsername(e.target.value)}
            required className="rounded-input"
            placeholder='Matricula'
          />
       
        </div>
        <div className="input-container">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required className="rounded-input"
            placeholder='Contraseña'
          />
        </div>
        <button type="button"  className="red-rounded-button" onClick={handleLogin}>
          Iniciar sesión
        </button>
      </form>
      </div>
    </div>
    </div>
  );
};

export default Login;
