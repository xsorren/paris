require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // Permite peticiones desde React
app.use(express.json()); // Para recibir JSON en el body

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Servidor funcionando correctamente' });
});

// Puerto del backend
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
