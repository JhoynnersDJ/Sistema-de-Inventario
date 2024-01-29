const mongoose = require('mongoose');

const puntoVentaSchema = new mongoose.Schema({
  nombre: String,
  banco: String
});

const PuntoVentaModel = mongoose.model('PuntoVenta', puntoVentaSchema);

module.exports = PuntoVentaModel;
