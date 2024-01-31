document.addEventListener('DOMContentLoaded', function () {
    const productoModal = new bootstrap.Modal(document.getElementById('productoModal'));
    const productoForm = document.getElementById('productoForm');
    const tipoProductoSelect = document.getElementById('tipoProducto');

    // Al cargar la página, cargar dinámicamente las opciones de tipo de producto desde el backend
    cargarTiposProducto();

    // Manejar el envío del formulario de producto
    productoForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Obtener la información del formulario
        const nombreProducto = document.getElementById('nombreProducto').value.trim();
        const tipoProducto = tipoProductoSelect.value;
        const cantidadKg = parseFloat(document.getElementById('cantidadKg').value);
        const precio = parseFloat(document.getElementById('precio').value);

        // Validar la información del producto
        if (!nombreProducto || !tipoProducto || isNaN(cantidadKg) || isNaN(precio)) {
            alert('Ingrese información válida para el producto.');
            return;
        }

        // Crear objeto con los datos del producto
        const productoData = {
            nombre: nombreProducto,
            id_tipo: tipoProducto,
            peso_kg: cantidadKg,
            costo: precio
        };

        // Enviar la información del producto al backend
        try {
            const response = await fetch('http://localhost:8000/productos/registro-producto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productoData)
            });

            const data = await response.json();

            if (response.ok) {
                // Producto registrado con éxito
                alert('Producto registrado con éxito.');
                // Limpiar el formulario después de registrar el producto
                productoForm.reset();
                // Cerrar el modal de productos
                productoModal.hide();
            } else {
                // Mostrar mensaje de error si falla el registro
                alert('Error al registrar el producto: ' + data.error);
            }
        } catch (error) {
            console.error('Error al comunicarse con el backend:', error);
            alert('Hubo un error al registrar el producto. Por favor, inténtelo de nuevo.');
        }
        // Desactivar el botón de enviar después de hacer clic
        document.querySelector('button[type="submit"]').disabled = true;

    });

    async function cargarTiposProducto() {
        try {
            const response = await fetch('http://localhost:8000/productos/tipos-producto');
            const data = await response.json();

            if (response.ok) {
                // Limpiar el select antes de agregar nuevas opciones
                tipoProductoSelect.innerHTML = '<option value="">Seleccionar tipo de producto</option>';

                // Agregar las opciones al select
                data.tiposProducto.forEach(tipo => {
                    const option = document.createElement('option');
                    option.value = tipo._id; // Establecer el ID como el valor
                    option.textContent = tipo.nombre;
                    tipoProductoSelect.appendChild(option);
                });
            } else {
                console.error('Error al cargar tipos de producto:', data.error);
            }
        } catch (error) {
            console.error('Error al comunicarse con el backend:', error);
        }
    }
    // Manejar el envío del formulario para agregar nuevo Tipo de Producto
    const nuevoTipoProductoForm = document.getElementById('nuevoTipoProductoForm');
    nuevoTipoProductoForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Obtener el nombre del nuevo tipo de producto
        const nombreNuevoTipo = document.getElementById('nombreNuevoTipo').value.trim();

        // Validar la información del nuevo tipo de producto
        if (!nombreNuevoTipo) {
            alert('Ingrese un nombre válido para el nuevo tipo de producto.');
            return;
        }

        // Crear objeto con los datos del nuevo tipo de producto
        const nuevoTipoProductoData = {
            nombre: nombreNuevoTipo
        };

        // Enviar la información del nuevo tipo de producto al backend
        try {
            const response = await fetch('http://localhost:8000/productos/registro-tipo-producto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoTipoProductoData)
            });

            const data = await response.json();

            if (response.ok) {
                // Nuevo tipo de producto registrado con éxito
                alert('Nuevo tipo de producto registrado con éxito.');
                // Limpiar el formulario después de registrar el nuevo tipo de producto
                nuevoTipoProductoForm.reset();
                // Recargar la tabla de tipos de productos
                cargarTiposProductoTabla();
            } else {
                // Mostrar mensaje de error si falla el registro
                alert('Error al registrar el nuevo tipo de producto: ' + data.error);
            }
        } catch (error) {
            console.error('Error al comunicarse con el backend:', error);
            alert('Hubo un error al registrar el nuevo tipo de producto. Por favor, inténtelo de nuevo.');
        }
    });

    // Función para cargar dinámicamente la tabla de tipos de producto desde el backend
    async function cargarTiposProductoTabla() {
        try {
            const response = await fetch('http://localhost:8000/productos/tipos-producto');
            const data = await response.json();

            if (response.ok) {
                // Limpiar la tabla antes de agregar nuevas filas
                const tiposProductoTablaBody = document.getElementById('tiposProductoTablaBody');
                tiposProductoTablaBody.innerHTML = '';

                // Agregar las filas a la tabla
                data.tiposProducto.forEach(tipo => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${tipo.nombre}</td>
                    `;
                    tiposProductoTablaBody.appendChild(fila);
                });
            } else {
                console.error('Error al cargar tipos de producto:', data.error);
            }
        } catch (error) {
            console.error('Error al comunicarse con el backend:', error);
        }
    }

    // Cargar la tabla de tipos de productos al cargar la página
    cargarTiposProductoTabla();
});
