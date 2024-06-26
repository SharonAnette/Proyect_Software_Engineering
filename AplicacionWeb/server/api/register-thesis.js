const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", async (req, res) => {
  const {
    titulo_de_tesis,
    fecha_de_publicacion,
    carrera,
    archivo_pdf,
    autores,
    asesores,
    etiquetas,
  } = req.body;

  let id_autores = []; // Array para almacenar los IDs de los autores

  try {
    // Insertar autores si no existen y obtener sus IDs
    for (const autor of autores) {
      let autorId = null;
      // Verificar si el autor ya existe en la base de datos
      const autorExistente = await db.query(
        "SELECT id_autor FROM autor WHERE apellido_paterno = $1 AND apellido_materno = $2 AND nombres = $3",
        [autor.apellido_paterno, autor.apellido_materno, autor.nombres]
      );
      if (autorExistente.rows.length > 0) {
        autorId = autorExistente.rows[0].id_autor;
      } else {
        // Si no existe, insertar el nuevo autor y obtener su ID
        const nuevoAutor = await db.query(
          "INSERT INTO autor (apellido_paterno, apellido_materno, nombres) VALUES ($1, $2, $3) RETURNING id_autor",
          [autor.apellido_paterno, autor.apellido_materno, autor.nombres]
        );
        autorId = nuevoAutor.rows[0].id_autor;
      }
      id_autores.push(autorId);
    }

    // Insertar la nueva tesis
    const nuevaTesis = await db.query(
      "INSERT INTO tesis (titulo_de_tesis, fecha_de_publicacion, carrera, archivo_pdf) VALUES ($1, $2, $3, $4) RETURNING id_tesis",
      [titulo_de_tesis, fecha_de_publicacion, carrera, archivo_pdf]
    );
    const id_tesis = nuevaTesis.rows[0].id_tesis;

    // Relacionar autores con la nueva tesis
    for (const id_autor of id_autores) {
      await db.query(
        "INSERT INTO tesis_autor (id_tesis, id_autor) VALUES ($1, $2)",
        [id_tesis, id_autor]
      );
    }

    // Relacionar asesores con la nueva tesis
    for (const id_asesor of asesores) {
      await db.query(
        "INSERT INTO tesis_asesor (id_tesis, id_asesor) VALUES ($1, $2)",
        [id_tesis, id_asesor]
      );
    }

    // Relacionar etiquetas con la nueva tesis
    for (const id_etiqueta of etiquetas) {
      await db.query(
        "INSERT INTO tesis_etiqueta (id_tesis, id_etiqueta) VALUES ($1, $2)",
        [id_tesis, id_etiqueta]
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
