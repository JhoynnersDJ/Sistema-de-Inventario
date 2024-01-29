const express = require('express');
const router = express.Router();
const ProductoModel = require("../Modelo/ProductoModel");
const TipoProductoModel = require("../Modelo/TipoProductoModel");

// Ruta para registrar un nuevo tipo de producto
router.post('/registro-tipo-producto', async (req, res) => {
    try {
      // Obtén los datos del cuerpo de la solicitud
      const { nombre } = req.body;
  
      // Verifica que se proporcionó el nombre del tipo de producto
      if (!nombre) {
        return res.status(400).json({ error: 'El nombre del tipo de producto es obligatorio.' });
      }
  
      // Crea una nueva instancia de tipo de producto
      const nuevoTipoProducto = new TipoProductoModel({ nombre });
  
      // Guarda el tipo de producto en la base de datos
      await nuevoTipoProducto.save();
  
      // Respuesta exitosa
      res.status(201).json({ message: 'Tipo de producto registrado con éxito.' });
      console.log('Registro de tipo de producto exitoso');
    } catch (error) {
      console.error(error);
      // Manejo de errores
      res.status(500).json({ error: 'Hubo un error al registrar el tipo de producto.' });
    }
  });

    // Ruta para registrar un nuevo producto
    router.post('/registro-producto', async (req, res) => {
        try {
      // Obtén los datos del cuerpo de la solicitud
      const { nombre, id_tipo, peso_kg, costo } = req.body;
  
      // Verifica que se proporcionaron todos los campos necesarios
      if (!nombre || !id_tipo || !peso_kg || !costo) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios para registrar un producto.' });
      }
  
      // Crea una nueva instancia de producto
      const nuevoProducto = new ProductoModel({ nombre, id_tipo, peso_kg, costo });
  
      // Guarda el producto en la base de datos
      await nuevoProducto.save();
  
      // Respuesta exitosa
      res.status(201).json({ message: 'Producto registrado con éxito.' });
      console.log('Registro de producto exitoso');
    } catch (error) {
      console.error(error);
      // Manejo de errores
      res.status(500).json({ error: 'Hubo un error al registrar el producto.' });
    }
  });

  router.get('/buscar-producto-por-nombre/:nombreProducto', async (req, res) => {
    const nombreProducto = req.params.nombreProducto;
  
    try {
      const productosEncontrados = await ProductoModel.find({ nombre: new RegExp(nombreProducto, 'i') });
  
      if (productosEncontrados.length > 0) {
        res.status(200).json({ productos: productosEncontrados });
      } else {
        res.status(404).json({ mensaje: 'No se encontraron productos' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al buscar productos' });
    }
  });

module.exports = router;