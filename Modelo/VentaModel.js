const mongoose = require('mongoose');

const productoVendidoSchema = new mongoose.Schema({
  id_producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
  cantidad_vendida_kg: Number
});

const ventaSchema = new mongoose.Schema({
  productos_vendidos: [productoVendidoSchema],
  total_venta: Number,
  fecha: Date,
  hora: String,
  metodo_pago: String,
  id_punto_venta: { type: mongoose.Schema.Types.ObjectId, ref: 'PuntoVenta' }
});

const VentaModel = mongoose.model('Venta', ventaSchema);

module.exports = VentaModel;
