const express = require('express');
const router = express.Router();
const VentaModel = require('../Modelo/VentaModel');
const ProductoModel = require('../Modelo/ProductoModel'); // Asegúrate de importar el modelo de Producto

// Ruta para realizar una venta
router.post('/realizar-venta', async (req, res) => {
  try {
    // Obtén los datos del cuerpo de la solicitud
    const { productos_vendidos, id_punto_venta, metodo_pago } = req.body;
    console.log(req.body);
    // Verifica que se proporcionaron todos los campos necesarios
    if (!productos_vendidos || !id_punto_venta || !metodo_pago) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios para realizar una venta.' });
    }

    // Calcula el total de la venta sumando los costos de los productos vendidos
    const totalVenta = productos_vendidos.reduce(async (totalPromise, producto) => {
      // Obtén el precio del producto desde la base de datos (asumiendo que el modelo de Producto tiene un campo 'costo')
      const productoBD = await ProductoModel.findById(producto.id_producto);
      if (productoBD) {
        const total = await totalPromise;
        return total + productoBD.costo * producto.cantidad_vendida_kg;
      }
      return totalPromise;
    }, Promise.resolve(0));

    // Crea una nueva instancia de venta
    const nuevaVenta = new VentaModel({
      productos_vendidos,
      total_venta: await totalVenta,
      fecha: new Date(),
      hora: new Date().toLocaleTimeString(),
      metodo_pago,
      id_punto_venta
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
