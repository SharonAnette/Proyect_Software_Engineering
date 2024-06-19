const { Pool } = require("pg");
require('dotenv').config(); // Para cargar variables de entorno desde un archivo .env

// Configura los parámetros de conexión usando variables de entorno
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = pool;
