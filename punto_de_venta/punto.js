const express = require('express');
const router = express.Router();
const PuntoVentaModel = require('../Modelo/PuntoDeVentaModel');

// Ruta para registrar un nuevo punto de venta
router.post('/registro-punto-venta', async (req, res) => {
  try {
    // Obtén los datos del cuerpo de la solicitud
    const { nombre, banco } = req.body;

    // Verifica que se proporcionaron todos los campos necesarios
    if (!nombre || !banco) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios para registrar un punto de venta.' });
    }

    // Crea una nueva instancia de punto de venta
    const nuevoPuntoVenta = new PuntoVentaModel({ nombre, banco });

    // Guarda el punto de venta en la base de datos
    await nuevoPuntoVenta.save();

    // Respuesta exitosa
    res.status(201).json({ message: 'Punto de venta registrado con éxito.' });
    console.log('Registro de punto de venta exitoso');
  } catch (error) {
    console.error(error);
    // Manejo de errores
    res.status(500).json({ error: 'Hubo un error al registrar el punto de venta.' });
  }
});

module.exports = router;
