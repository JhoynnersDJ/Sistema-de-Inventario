const mongoose = require('mongoose');

const cierreDiarioSchema = new mongoose.Schema({
  fecha: Date,
  hora_cierre: String,
  total_ventas: Number,
  ventas_diarias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Venta' }],
  ventas_por_punto: [
    {
      punto_venta: { type: mongoose.Schema.Types.ObjectId, ref: 'PuntoVenta' },
      monto: Number
    }
  ],
  venta_efectivo: Number
});

const CierreDiario = mongoose.model('CierreDiario', cierreDiarioSchema);

module.exports = CierreDiario;
