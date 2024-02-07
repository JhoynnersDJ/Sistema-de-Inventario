const express = require('express');
const router = express.Router();
const VentaModel = require('../Modelo/VentaModel');
const ProductoModel = require('../Modelo/ProductoModel'); // Asegúrate de importar el modelo de Producto

// Ruta para realizar una venta
router.post('/realizar-venta', async (req, res) => {
  try {
    // Obtén los datos del cuerpo de la solicitud
    const { productos_vendidos, id_punto_venta, metodo_pago, total_venta } = req.body;
    console.log(req.body);
    // Crea una nueva instancia de venta
    const nuevaVenta = new VentaModel({
      productos_vendidos,
      fecha: new Date(),
      hora: new Date().toLocaleTimeString(),
      metodo_pago,
      id_punto_venta,
      total_venta,
    });

    // Guarda la venta en la base de datos
    await nuevaVenta.save();

    // Respuesta exitosa
    res.status(201).json({ message: 'Venta realizada con éxito.' });
    console.log('Venta realizada exitosamente');
  } catch (error) {
    console.error(error);
    // Manejo de errores
    res.status(500).json({ error: 'Hubo un error al realizar la venta.' });
  }
});

module.exports = router;
