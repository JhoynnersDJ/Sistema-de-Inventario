const express = require('express');
const router = express.Router();
const CierreDiarioModel = require('../Modelo/CiereDiarioModel');
const VentaModel = require('../Modelo/VentaModel');

// Ruta para realizar un cierre de venta
router.post('/realizar-cierre', async (req, res) => {
  try {
    // Obtén las ventas diarias para todos los puntos de venta (puedes ajustar según tu lógica)
    const ventasDiarias = await VentaModel.find();

    // Calcula el total de ventas diarias y el monto por punto de venta
    const totalVentasDiarias = ventasDiarias.reduce((total, venta) => total + venta.total_venta, 0);
    
    // Agrupa las ventas por punto de venta
    const ventasPorPunto = ventasDiarias.reduce((acumulador, venta) => {
      const puntoVentaIndex = acumulador.findIndex(item => item.punto_venta.equals(venta.id_punto_venta));
      if (puntoVentaIndex === -1) {
        acumulador.push({ punto_venta: venta.id_punto_venta, monto: venta.total_venta });
      } else {
        acumulador[puntoVentaIndex].monto += venta.total_venta;
      }
      return acumulador;
    }, []);

    // Calcula el total en efectivo sumando las ventas que fueron pagadas en efectivo
    const ventaEfectivo = ventasDiarias.reduce((total, venta) => {
      if (venta.metodo_pago === 'efectivo') {
        return total + venta.total_venta;
      }
      return total;
    }, 0);

    // Crea una nueva instancia de cierre de venta con la hora de cierre actual
    const nuevoCierre = new CierreDiarioModel({
      fecha: new Date(),
      hora_cierre: new Date().toLocaleTimeString(),
      total_ventas: totalVentasDiarias,
      ventas_diarias: ventasDiarias.map(venta => venta._id),
      ventas_por_punto: ventasPorPunto,
      venta_efectivo: ventaEfectivo,
    });

    // Guarda el cierre de venta en la base de datos
    await nuevoCierre.save();

    // Respuesta exitosa con la información del cierre de venta realizado
    res.status(201).json({ message: 'Cierre de venta realizado con éxito.', cierre: nuevoCierre });
    console.log('Cierre de venta realizado exitosamente');
  } catch (error) {
    console.error(error);
    // Manejo de errores
    res.status(500).json({ error: 'Hubo un error al realizar el cierre de venta.' });
  }
});

module.exports = router;
