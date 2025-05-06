import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Auth/AuthProvider';
import QRCode from 'qrcode.react';
import axios from 'axios';


const UsuarioQR = () => {
  const [dataQR, setDataFromDB] = useState('');
  const auth = useContext(AuthContext)

  useEffect(() => {
    axios.get('http://localhost:5000/datos/'+ auth.authData.matricula, {
      headers: {
        Accept: "application/json",
        Authorization: 'Bearer ' + auth.authData.token
      }
    })
      .then(response => {
        console.log('Data from API:', response.data);
        setDataFromDB(response.data); // Verifica que los datos sean los esperados
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div  className='app-container' style={{ textAlign: 'center', }}>
      {/* Contenedor del código QR con el logo */}
      <div className='main-container' >
        {dataQR && (
          <QRCode
            value={JSON.stringify(dataQR)} // Asegúrate de que los datos sean interpretados correctamente
            size={400}
            fgColor="#000"
            bgColor="#fff"
            level="H"
            renderAs="canvas"
          />
        )}
      </div>
    </div>
  );
};

export default UsuarioQR;
