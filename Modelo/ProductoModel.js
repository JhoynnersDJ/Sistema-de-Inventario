const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: String,
  id_tipo: { type: mongoose.Schema.Types.ObjectId, ref: 'TipoProducto' },
  peso_kg: Number,
  costo: Number
});

const ProductoModel = mongoose.model('Producto', productoSchema);

module.exports = ProductoModel;
