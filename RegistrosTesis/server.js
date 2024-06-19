const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const port = 3000;
const path = require('path');
const pool = require('./db');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Middleware para servir archivos estáticos desde la carpeta "public"
app.use(express.static("public"));

// Ruta para la página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); // Envía el archivo HTML
});

// Ruta para manejar el envío del formulario
app.post('/submit-thesis', async (req, res) => {
  try {
    // Asegúrate de que el archivo se haya cargado correctamente
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No se cargó ningún archivo.');
    }

    // 'archivo' es el nombre del campo de entrada en el formulario
    let archivoPDF = req.files.archivo;

    // Aquí puedes guardar el archivo en el sistema de archivos o donde prefieras

    // Inserta los datos en la base de datos
    const queryResult = await pool.query(
      'INSERT INTO public.tesis (titulo_de_tesis, fecha_de_publicacion, archivo_pdf) VALUES ($1, $2, $3) RETURNING id_tesis',
      [req.body.titulo, req.body.fecha, archivoPDF.data] // Asegúrate de que los nombres de los campos coincidan con los del formulario
    );

    res.status(201).send(`Tesis añadida con ID: ${queryResult.rows[0].id_tesis}`);
  } catch (error) {
    console.error("Error al insertar los datos de la tesis:", error);
    res.status(500).send("Error al insertar los datos de la tesis");
  }
}); 

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
