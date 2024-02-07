document.addEventListener('DOMContentLoaded',async function () {
    const ventaBtn = document.getElementById('ventaBtn');
    const ventaModal = new bootstrap.Modal(document.getElementById('ventaModal'));
    const metodoPagoSelect = document.getElementById('metodoPago');
    const puntoVentaOptions = document.getElementById('puntoVentaOptions');
    const ventaForm = document.getElementById('ventaForm');
    const productoInput = document.getElementById('producto');
    const precioProductoInput = document.getElementById('precioProducto');
    const pesoKgInput = document.getElementById('pesoKg');
    const precioVentaInput = document.getElementById('precioVenta');
    const agregarProductoBtn = document.getElementById('agregarProductoBtn');
    const productosTablaBody = document.getElementById('productosTablaBody');
    const sugerenciasProductos = document.getElementById('sugerenciasProductos');
    const puntoVentaSelect = document.getElementById('puntoVenta');
    let metodoPagoSeleccionado = false;
    let metodoPagoSelec;
    let id_punto_venta; 
    let totalVenta;

    // Cargar dinámicamente las opciones del select desde la base de datos
  try {
    const response = await fetch('http://localhost:8000/punto/puntos-venta');
    const data = await response.json();

    if (response.ok) {
      // Limpiar las opciones existentes del select
      puntoVentaSelect.innerHTML = '';

      // Llenar el select con las opciones obtenidas desde la base de datos
      data.puntosVenta.forEach(puntoVenta => {
        const option = document.createElement('option');
        option.value = puntoVenta._id; // Puedes usar el ID u otro campo único
        option.textContent = puntoVenta.nombre; // Asegúrate de tener un campo 'nombre' en tu modelo
        puntoVentaSelect.appendChild(option);
      });
    } else {
      console.log('Error al obtener puntos de venta:', data.error);
    }
  } catch (error) {
    console.error('Error al obtener puntos de venta:', error);
  }
  // Variable global para almacenar el ID del punto de venta seleccionado
let idPuntoVentaSeleccionado = null;

function capturarIdPuntoVenta() {
  // Obtener el elemento select
  const puntoVentaSelect = document.getElementById('puntoVenta');

  // Obtener el valor seleccionado (ID del punto de venta)
  idPuntoVentaSeleccionado = puntoVentaSelect.value;

  // Puedes imprimir en la consola para verificar que se captura correctamente
  console.log('ID del Punto de Venta seleccionado:', idPuntoVentaSeleccionado);
}
  // Función para obtener los productos de la venta desde la tabla
  function obtenerProductosVenta() {
    const filasProductos = productosTablaBody.querySelectorAll('tr');
    const productosVenta = [];

    filasProductos.forEach(fila => {
        const nombre = fila.querySelector('td:nth-child(1)').textContent;
        const precioProducto = parseFloat(fila.querySelector('td:nth-child(2)').textContent.replace('$', ''));
        const pesoKg = parseFloat(fila.querySelector('td:nth-child(3)').textContent.replace('KG', ''));
        const precioVenta = parseFloat(fila.querySelector('td:nth-child(4)').textContent.replace('$', ''));

        productosVenta.push({
            nombre,
            precioProducto,
            pesoKg,
            precioVenta,
        });
    });

    return productosVenta;
}
    // Mostrar u ocultar opciones específicas para Punto de Venta según el método de pago seleccionado
metodoPagoSelect.addEventListener('change', function () {
  if (metodoPagoSelect.value === 'punto_venta') {
    metodoPagoSelec = metodoPagoSelect.value;   
    puntoVentaOptions.style.display = 'block';
    capturarIdPuntoVenta();
  } else {
    puntoVentaOptions.style.display = 'none';
  }
  metodoPagoSelec = metodoPagoSelect.value;
  metodoPagoSeleccionado = true;
});

// Escuchar cambios en el select de punto de venta
puntoVentaSelect.addEventListener('change', function () {
  // Llamar a la función para capturar el ID del punto de venta solo si se selecciona el método de pago "punto_venta"
  if (metodoPagoSelect.value === 'punto_venta') {
    capturarIdPuntoVenta();
  }
})
  
    // Al cargar la página, asegurarse de que las opciones específicas para Punto de Venta estén ocultas
    puntoVentaOptions.style.display = 'none';
  
    ventaBtn.addEventListener('click', function () {
      // Reiniciar el estado del campo de método de pago al abrir el modal
      metodoPagoSeleccionado = false;
      metodoPagoSelect.disabled = false;
      puntoVentaOptions.style.display = 'none';
      ventaModal.show();
    });
  
    // Manejar el botón para agregar producto
    agregarProductoBtn.addEventListener('click', function () {
      // Verificar que el método de pago esté seleccionado
      if (!metodoPagoSeleccionado) {
        alert('Seleccione un método de pago antes de agregar productos.');
        return;
      }
  
      // Obtener la información del producto desde el formulario
      const producto = productoInput.value;
      const precioProducto = parseFloat(precioProductoInput.value);
      const pesoKg = parseFloat(pesoKgInput.value);
      const precioVenta = parseFloat(precioVentaInput.value);
  
      // Validar que el producto tenga información válida
      if (!producto || isNaN(precioProducto) || isNaN(pesoKg) || isNaN(precioVenta)) {
        alert('Ingrese información válida para el producto.');
        return;
      }
  
      // Crear una nueva fila para la tabla con la información del producto
      const nuevaFila = document.createElement('tr');
      nuevaFila.innerHTML = `
        <td>${producto}</td>
        <td>${precioProducto}$</td>
        <td>${pesoKg} KG</td>
        <td>${precioVenta}$</td>
        <td><button class="btn btn-danger btn-sm" onclick="eliminarFila(this)">Eliminar</button></td>
      `;
  
      // Agregar la nueva fila a la tabla
      productosTablaBody.appendChild(nuevaFila);
  
      // Deshabilitar el campo de método de pago después de agregar el primer producto
      metodoPagoSelect.disabled = true;
  
      // Limpiar los campos del formulario de producto
      productoInput.value = '';
      precioProductoInput.value = '0';
      pesoKgInput.value = '';
      precioVentaInput.value = '0';
      // Limpiar las sugerencias después de agregar el producto
      sugerenciasProductos.innerHTML = '';
      calcularTotalVenta();
    });
// Función para calcular el total de la venta y actualizar la fila del total
function calcularTotalVenta() {
  const filasProductos = productosTablaBody.querySelectorAll('tr');
   totalVenta = 0;

  filasProductos.forEach(fila => {
      const precioVentaCelula = fila.querySelector('td:nth-child(4)');
      if (precioVentaCelula) {
          const precioVenta = parseFloat(precioVentaCelula.textContent.replace('$', ''));
          console.log('Precio de venta:', precioVenta); // Agrega este console.log()
          if (!isNaN(precioVenta)) {
              totalVenta += precioVenta;
          }
      }
      return totalVenta;
  });

  // Actualizar la celda del total con el nuevo total
  const totalVentaElemento = document.getElementById('totalVenta');
  if (totalVentaElemento) {
      totalVentaElemento.textContent = `$${totalVenta.toFixed(2)}`;
  }

  console.log('Total de la venta:', totalVenta); // Agrega este console.log() para verificar el total
}
  
      // Manejar el envío del formulario de venta
      ventaForm.addEventListener('submit',async function (event) {
        event.preventDefault();
    
        // Realizar operaciones necesarias con la información del formulario
        const productosVenta = obtenerProductosVenta();
        // Imprimir los productos de la venta en la consola
console.log('Productos de la venta:', productosVenta); 
        // Limpiar la tabla de productos después de registrar la venta

        
        productosTablaBody.innerHTML = '';
        // Cerrar el modal después de realizar la venta
        ventaModal.hide();
        //Variables esenciales para la venta
// Implementa esta función según tu lógica
        
    // Aquí es donde debes agregar la lógica para enviar la información al backend
      // Puedes utilizar fetch u otras bibliotecas para realizar la petición HTTP
      try {
        console.log("total antes de: ",totalVenta);
                const requestBody = {
                productos_vendidos: productosVenta,
                id_punto_venta: idPuntoVentaSeleccionado, // Asegúrate de tener la variable con el ID del punto de venta
                metodo_pago: metodoPagoSelec, // Asegúrate de tener la variable con el método de pago
                total_venta:totalVenta,
        }
  const response = await fetch('http://localhost:8000/venta/realizar-venta', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
});
        const data = await response.json();
        
        if (response.ok) {
            console.log('Venta realizada con éxito:', data.message);
        } else {
            console.log('Error al realizar la venta:', data.error);
        }
    } catch (error) {
        console.error('Error al realizar la venta:', error);
    }
      });
    
      productoInput.addEventListener('input', async function () {
          const nombreProducto = productoInput.value.trim();
        
          if (!nombreProducto) {
            sugerenciasProductos.innerHTML = '';
            return;
          }
        
          if (nombreProducto.length > 0) {
            console.log('Enviando petición al backend...');
        
            try {
              const response = await fetch(`http://localhost:8000/productos/buscar-producto-por-nombre/${nombreProducto}`);
              const data = await response.json();
        
              if (response.ok) {
                // Actualizar las sugerencias con el resultado de la búsqueda
                actualizarSugerenciasProductos(data.productos);
                console.log('Productos encontrados:', data.productos);
        
                // Actualizar el valor del input precioProducto con el costo del primer producto encontrado
                if (data.productos.length > 0) {
                  const costoProducto = data.productos[0].costo;
                  precioProductoInput.value = costoProducto.toFixed(2);
                }
              } else {
                console.log('Error en la respuesta:', data.mensaje);
              }
            } catch (error) {
              console.error('Error al buscar productos:', error);
            }
          }
        });
  
// Función para actualizar las sugerencias de productos
function actualizarSugerenciasProductos(sugerencias) {
  // Obtener el contenedor de sugerencias
  const sugerenciasProductos = document.getElementById('sugerenciasProductos');

  // Verificar si el contenedor existe
  if (!sugerenciasProductos) {
    console.error('Error: Contenedor de sugerencias no encontrado.');
    return;
  }

  // Limpiar las sugerencias anteriores
  sugerenciasProductos.innerHTML = '';

  // Crear elementos para cada sugerencia
  sugerencias.forEach(sugerencia => {
    const sugerenciaElement = document.createElement('div');
    sugerenciaElement.classList.add('sugerencia-item');
    sugerenciaElement.textContent = sugerencia.nombre;

    // Manejar clic en la sugerencia para llenar el campo de producto y actualizar precioProducto
    sugerenciaElement.addEventListener('click', function () {
      productoInput.value = sugerencia.nombre;
      sugerenciasProductos.innerHTML = ''; // Limpiar las sugerencias después de seleccionar

      // Actualizar el valor del input precioProducto con el costo del producto seleccionado
      precioProductoInput.value = sugerencia.costo.toFixed(2);

      // Habilitar el input de precioProducto y restablecer estilos
      precioProductoInput.disabled = true;
      precioProductoInput.style.border = '1px solid #ddd';
      precioProductoInput.style.backgroundColor = '#f8f9fa';
      precioProductoInput.style.color = '#6c757d';
      precioProductoInput.style.pointerEvents = 'none';
    });

    // Agregar la sugerencia al contenedor
    sugerenciasProductos.appendChild(sugerenciaElement);
  });

  // Mostrar el contenedor de sugerencias
  sugerenciasProductos.style.display = 'block';
}

// Manejar cambios en el campo de pesoKg para calcular el precio de venta
pesoKgInput.addEventListener('input', function () {
  const costo = parseFloat(precioProductoInput.value);
  const peso = parseFloat(pesoKgInput.value);

  if (!isNaN(costo) && !isNaN(peso)) {
    const precioVentaCalculado = costo * peso;
    precioVentaInput.value = precioVentaCalculado.toFixed(2);
  }
});

// Manejar cambios en el campo de precioVenta para calcular el peso
precioVentaInput.addEventListener('input', function () {
  const costo = parseFloat(precioProductoInput.value);
  const precioVenta = parseFloat(precioVentaInput.value);

  if (!isNaN(costo) && !isNaN(precioVenta) && costo !== 0) {
    const pesoCalculado = precioVenta / costo;
    pesoKgInput.value = pesoCalculado.toFixed(2);
  }
});

  });
  