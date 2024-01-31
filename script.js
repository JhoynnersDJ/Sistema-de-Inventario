document.addEventListener('DOMContentLoaded', function () {
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
    let metodoPagoSeleccionado = false;
  
    // Mostrar u ocultar opciones específicas para Punto de Venta según el método de pago seleccionado
    metodoPagoSelect.addEventListener('change', function () {
      if (metodoPagoSelect.value === 'punto_venta') {
        puntoVentaOptions.style.display = 'block';
      } else {
        puntoVentaOptions.style.display = 'none';
      }
      metodoPagoSeleccionado = true;
    });
  
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
  let totalVenta = 0;

  filasProductos.forEach(fila => {
      const precioVentaCelula = fila.querySelector('td:nth-child(4)');
      if (precioVentaCelula) {
          const precioVenta = parseFloat(precioVentaCelula.textContent.replace('$', ''));
          if (!isNaN(precioVenta)) {
              totalVenta += precioVenta;
          }
      }
  });

  // Actualizar la celda del total con el nuevo total
  const totalVentaElemento = document.getElementById('totalVenta');
  if (totalVentaElemento) {
      totalVentaElemento.textContent = `$${totalVenta.toFixed(2)}`;
  }
}
// Función para eliminar una fila de la tabla
window.eliminarFila = function (botonEliminar) {
  const fila = botonEliminar.closest('tr');
  fila.remove();

  // Después de eliminar la fila, recalcular el total
  calcularTotalVenta();
};
  
    // Manejar el envío del formulario de venta
    ventaForm.addEventListener('submit', function (event) {
      event.preventDefault();
  
      // Realizar operaciones necesarias con la información del formulario
  
      // Limpiar la tabla de productos después de registrar la venta
      productosTablaBody.innerHTML = '';
  
      // Cerrar el modal después de realizar la venta
      ventaModal.hide();
  
      // Puedes agregar la lógica para enviar la información al backend aquí
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
      precioProductoInput.disabled = false;
      precioProductoInput.style.border = '1px solid #ced4da';
      precioProductoInput.style.backgroundColor = 'white';
      precioProductoInput.style.color = '#495057';
      precioProductoInput.style.pointerEvents = 'auto';
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
  