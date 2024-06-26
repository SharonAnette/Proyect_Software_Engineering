const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors'); // Agregar cors para manejar peticiones desde otros dominios
const asesoresRouter = require('./api/asesores');
const etiquetasRouter = require('./api/etiquetas');
const loginRouter = require('./api/login');
const registerThesisRouter = require('./api/register-thesis');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/asesores', asesoresRouter);
app.use('/api/etiquetas', etiquetasRouter);
app.use('/api/login', loginRouter);
app.use('/api/register-thesis', registerThesisRouter);

// Ruta raíz para redirigir a userIndex.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/userIndex.html'));
});

// Rutas para servir las páginas HTML
app.get('/adminIndex', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/adminIndex.html'));
});

app.get('/asesorIndex', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/asesorIndex.html'));
});

app.get('/adminAbout', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/adminAbout.html'));
});

app.get('/adminContact', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/adminContact.html'));
});

app.get('/asesorAbout', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/asesorAbout.html'));
});

app.get('/asesorContact', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/asesorContact.html'));
});

app.get('/adminThesis-form', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/adminThesis-form.html'));
});

app.get('/asesorThesis-form', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/asesorThesis-form.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
