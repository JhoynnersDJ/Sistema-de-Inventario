const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors'); // Importa el módulo 'cors'
const productosRoutes = require('./producto/producto'); // Asegúrate de ajustar la ruta al archivo talleres.js
const PuntoVentaRoutes = require('./punto_de_venta/punto'); // Asegúrate de ajustar la ruta al archivo talleres.js
const VentaRoutes = require('./venta/venta'); // Asegúrate de ajustar la ruta al archivo talleres.js
const CierreRoutes = require('./cierre/cierre'); // Asegúrate de ajustar la ruta al archivo talleres.js

app.use(express.json());
app.use(cors());

// Conexión a la base de datos Omniservices
const uri = "mongodb+srv://jhoysantaella15:Melon24@cluster0.zrpgq2r.mongodb.net/BeatrizInventario?retryWrites=true&w=majority";
mongoose.connect(uri, {
  serverSelectionTimeoutMS: 30000, // Aumenta el tiempo de espera a 30 segundos
})
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
  })
  .catch((error) => {
    console.error('Error en la conexión a la base de datos:', error);
  });

    //Middleware para las rutas de los productos 
        app.use('/productos', productosRoutes); 

    //Middleware para las rutas de los productos 
        app.use('/punto', PuntoVentaRoutes);

    //Middleware para las rutas de los productos 
    app.use('/venta', VentaRoutes);

    //Middleware para las rutas de los productos 
    app.use('/cierre', CierreRoutes);
  //Servidor


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://192.168.1.50:${PORT}`);
});