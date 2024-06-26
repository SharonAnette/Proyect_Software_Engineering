const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // Ajusta la ruta según tu estructura de archivos
const router = express.Router();

router.post('/', async (req, res) => {
    const { username, password, userType } = req.body;

    try {
        let query;
        if (userType === 'admin') {
            query = 'SELECT * FROM administrador WHERE nombre_de_usuario = $1 AND contrasena = $2';
        } else if (userType === 'asesor') {
            query = 'SELECT * FROM asesor WHERE nombre_de_usuario = $1 AND contrasena = $2';
        } else {
            return res.status(400).json({ success: false, message: 'Invalid user type' });
        }

        const result = await pool.query(query, [username, password]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            const token = jwt.sign({ username: user.nombre_de_usuario, userType }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
});

module.exports = router;
