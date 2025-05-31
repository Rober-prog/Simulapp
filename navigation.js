// NAVEGACIÓN ENTRE PANTALLAS
// Functions for navigating between screens

// Global variable for screen history
let historialPantallas = ['pantalla-bienvenida'];

function mostrarPantalla(idPantalla) {
    // Hide all screens with transition
    document.querySelectorAll('.pantalla').forEach(pantalla => {
        pantalla.classList.add('oculto');
    });
    
    // Show requested screen
    const pantallaDestino = document.getElementById(idPantalla);
    if (pantallaDestino) {
        // Remove oculto class to trigger transition
        setTimeout(() => {
            pantallaDestino.classList.remove('oculto');
        }, 50); // Small delay to ensure transition works
    } else {
        console.error(`Error: Screen with ID '${idPantalla}' not found`);
        // Fallback to menu if there's an error
        document.getElementById('pantalla-menu').classList.remove('oculto');
        historialPantallas = ['pantalla-menu'];
        return;
    }
    
    // Update history only if screen is different from last
    if (historialPantallas[historialPantallas.length - 1] !== idPantalla) {
        historialPantallas.push(idPantalla);
    }
}

function volverPantallaAnterior() {
    if (historialPantallas.length > 1) {
        const pantallaActual = historialPantallas.pop(); // Quitar pantalla actual
        const pantallaAnterior = historialPantallas[historialPantallas.length - 1];
        
        // Si estamos en simulacro, confirmar antes de salir
        if (pantallaActual === 'pantalla-simulacro' && document.getElementById('pantalla-simulacro').classList.contains('oculto') === false) {
            // Usar la función de confirmación personalizada de ui.js si está disponible
            if (window.confirmarAccion && typeof window.confirmarAccion === 'function') {
                window.confirmarAccion('¿Estás seguro de salir? Se perderán los datos del simulacro en curso.')
                    .then(confirmado => {
                        if (confirmado) {
                            if (window.detenerCronometro) window.detenerCronometro(); // Llamada global
                            mostrarPantalla(pantallaAnterior); // Usar mostrarPantalla para la transición y manejo de historial
                            // Quitar la pantalla anterior que se añadió por llamar a mostrarPantalla
                            if (historialPantallas[historialPantallas.length -1] === pantallaAnterior && historialPantallas[historialPantallas.length -2] === pantallaAnterior) {
                                historialPantallas.pop();
                            }
                        } else {
                            historialPantallas.push(pantallaActual); // Re-agregar pantalla actual al historial si no se confirma
                        }
                    });
                return; // Salir para evitar que se ejecute el código de abajo
            } else { // Fallback a confirm nativo
                if (confirm('¿Estás seguro de salir? Se perderán los datos del simulacro en curso.')) {
                    if (window.detenerCronometro) window.detenerCronometro(); // Llamada global
                } else {
                    historialPantallas.push(pantallaActual); // Re-agregar si no se confirma
                    return;
                }
            }
        }
        
        // Usar mostrarPantalla para la transición y manejo de historial,
        // pero como ya hicimos pop, la pantallaAnterior será la nueva "actual" y
        // su anterior será la que realmente queremos. Esto es un poco confuso.
        // Mejor, simplemente mostramos la pantallaAnterior sin manipular el historial aquí
        // ya que mostrarPantalla lo hará.
        // Necesitamos quitar la pantallaAnterior del historial antes de llamar a mostrarPantalla(pantallaAnterior)
        // porque mostrarPantalla la volverá a añadir.
        historialPantallas.pop(); // Quitar la pantalla a la que vamos a volver para que mostrarPantalla la añada correctamente
        mostrarPantalla(pantallaAnterior);

    } else {
        // No hay pantalla anterior en el historial o solo queda la de bienvenida, ir al menú por defecto
        mostrarPantalla('pantalla-menu');
    }
}

// Export the navigation functions
export {
    mostrarPantalla,
    volverPantallaAnterior,
    historialPantallas
};