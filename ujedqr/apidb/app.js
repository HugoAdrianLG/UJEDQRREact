const express = require('express')
const app = express();
const PORT = 5000;
const connection = require ('./connection')
const router = require('./routes')
const cors = require('cors')
const bodyParser = require('body-parser')

const corsOptions = {
  origin: '*', 
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization,Accept,Accept-Language,Content-Language",
};
app.use(cors(corsOptions)) 

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization", "Accept", "Accept-Language", "Content-Language");
  res.setHeader("Access-Control-Allow-Request-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
      return res.status(200).end();
  }
  next();
});

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
app.set("trust proxy", true);

app.use("/", router)

app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});



