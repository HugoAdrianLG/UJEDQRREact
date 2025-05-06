const express = require('express')
const router = express.Router();
const connection = require('./connection')
const jwt = require('jwt-simple')
const moment = require('moment')

function createToken(matricula, userType){
  const subject ={matricula, userType}
  const payload={
    sub: JSON.stringify(subject),
    iat: moment().unix(),
    exp: moment().add(7,'days').unix()
  }
  return jwt.encode(payload,'UJEDQRASSISTANCE')
}


exports.requireLogin = function (req, res, next) {
  if (req.headers.authorization){
    try{
      var token = req.headers.authorization.split(" ")[1];
      var payload = jwt.decode(token,'UJEDQRASSISTANCE');
      var subject = JSON.parse(payload.sub)
      if (!subject.matricula || !subject.userType)
        throw new Error()

    }
    catch(error){
      res.status(403).json({error: 'Forbidden'});
    }
    req.session = subject
    next();
  }
  else{
    res.status(403).json({error: 'Forbidden'});
  }
}

exports.login = function (req, res){
  const { matricula, password } = req.body;

  const alumnoQuery = `SELECT * FROM alumnos WHERE Matricula = '${matricula}' AND contraseña = '${password}'`;
  const maestroQuery = `SELECT * FROM maestros WHERE Matricula = '${matricula}' AND contraseña = '${password}'`;

  connection.query(alumnoQuery, (errorAlumno, resultsAlumno) => {
    if (errorAlumno) {
      res.status(500).json({ error: 'Error en la base de datos' });
      return;
    }

    if (resultsAlumno.length > 0) {
      // Establecer la sesión para el usuario autenticado como alumno
      /* req.session.user = {
        userType: 'alumno',
        matricula: matricula // Guardar la matrícula en la sesión si es necesario
      }; */
      res.status(200).json({ token: createToken(matricula,'alumno'), role: 'alumno' });
      return;
    }

    connection.query(maestroQuery, (errorMaestro, resultsMaestro) => {
      if (errorMaestro) {
        res.status(500).json({ error: 'Error en la base de datos' });
        return;
      }

      if (resultsMaestro.length > 0) {
        // Establecer la sesión para el usuario autenticado como maestro
       /*  req.session.user = {
          userType: 'maestro',
          matricula: matricula // Guardar la matrícula en la sesión si es necesario
        }; */
        res.status(200).json({token: createToken(matricula, 'maestro'), role: 'maestro'});
        return;
      }

      res.status(401).json({ error: 'Credenciales inválidas' });
    });
  });
}
  
// Ruta para obtener datos para el código QR
exports.qr = function (req, res) {
    const matricula = req.params.matricula;
  
    // Consulta para obtener datos de la tabla de alumnos
    const queryAlumnos = 'SELECT Matricula, Nombre FROM alumnos WHERE matricula = ?';
    connection.query(queryAlumnos, [matricula], (errorAlumnos, resultsAlumnos) => {
      if (errorAlumnos) {
        console.error('Error al obtener datos de alumnos:', errorAlumnos);
        res.status(500).json({ error: 'Error al obtener datos para el código QR' });
        return;
      }
  
      // Consulta para obtener datos de la tabla de maestros
      const queryMaestros = 'SELECT Matricula, Nombre FROM maestros WHERE matricula = ?';
      connection.query(queryMaestros, [matricula], (errorMaestros, resultsMaestros) => {
        if (errorMaestros) {
          console.error('Error al obtener datos de maestros:', errorMaestros);
          res.status(500).json({ error: 'Error al obtener datos para el código QR' });
          return;
        }
  
        if (resultsAlumnos.length > 0) {
          // Si la matrícula corresponde a un alumno
          res.json(resultsAlumnos);
        } else if (resultsMaestros.length > 0) {
          // Si la matrícula corresponde a un maestro
          res.json(resultsMaestros);
        } else {
          // Si no se encontraron datos para la matrícula
          res.status(404).json({ error: 'No se encontraron datos para la matrícula proporcionada' });
        }
      });
    });
  }

  exports.logout = function (req, res){
    req.session.destroy((err)=>{
      if(err){
        console.error(err);
      }
      else{
        res.redirect('/login')
      }
    })
  }
  