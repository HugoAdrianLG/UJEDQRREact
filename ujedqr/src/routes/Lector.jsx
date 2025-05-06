import React, { useRef, useEffect, useState } from 'react';
import jsQR from 'jsqr';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import '../components/LectorCodigo.css'


function QRScanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streamStarted, setStreamStarted] = useState(false);
  const [scannedCodes, setScannedCodes] = useState([]);

  useEffect(() => {
    const constraints = { video: true };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setStreamStarted(true);
        };
      })
      .catch((err) => {
        console.error('Error al acceder a la cámara:', err);
      });

    return () => {
      if (videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scannedCodes.length > 0) {
        convertToExcel(scannedCodes);
      }
    }, 30 * 24 * 60 * 60 * 1000); // 30 días en milisegundos

    return () => clearTimeout(timer);
  }, [scannedCodes]);

  const handleScan = () => {
    if (!streamStarted) {
      console.log('La cámara aún no está lista.');
      return;
    }

    const video = videoRef.current;
    const canvasElement = canvasRef.current;
    const canvas = canvasElement.getContext('2d');

    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
    const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);

    const code = jsQR(imageData.data, imageData.width, imageData.height);
    
    if (code) {
      console.log('Resultado del escaneo:', code.data);
      const scannedData = `${code.data},${new Date().toLocaleString()}\n`;
      setScannedCodes([...scannedCodes, scannedData]);
      saveCodesToCSV([...scannedCodes, scannedData]);
    } else {
      console.log('No se encontró ningún código QR.');
    }
  };

  const saveCodesToCSV = (codes) => {
    const csvContent = "Data,Hora\n" + codes.join("");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'scanned_codes.csv');
  };

  const convertToExcel = async (codes) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Escaneos');
    
    worksheet.columns = [
      { header: 'Data', key: 'data' },
      { header: 'Hora', key: 'hora' },
    ];

    codes.forEach((code) => {
      const [data, hora] = code.split(',');
      worksheet.addRow({ data, hora });
    });

    const excelBuffer = await workbook.xlsx.writeBuffer();
    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(excelBlob, 'scanned_codes.xlsx');
    setScannedCodes([]); // Limpiar los códigos después de la conversión
  };

  return (
    <div className='app-container'>
       <div className="main-container">
      <h2 className="form-title">Lector de Codigo</h2>
      <video
        ref={videoRef}
        style={{ width: '100%' }}
        muted
        playsInline
        onCanPlay={() => {
          videoRef.current.play().catch((err) => {
            console.error('Error al reproducir el video:', err);
          });
        }}
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <button  className="red-rounded-button" onClick={handleScan}>Escanear QR</button>
      </div>
    </div>
  );
}

export default QRScanner;
