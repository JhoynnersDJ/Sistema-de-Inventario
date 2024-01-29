const mongoose = require('mongoose');

const tipoProductoSchema = new mongoose.Schema({
  nombre: String
});

const TipoProductoModel = mongoose.model('TipoProducto', tipoProductoSchema);

module.exports = TipoProductoModel;
