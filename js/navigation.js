// NAVEGACIÓN ENTRE PANTALLAS
// Functions for navigating between screens

// Global variable for screen history
let historialPantallas = ['pantalla-bienvenida'];

function mostrarPantalla(idPantalla) {
    // Ocultar todas las pantallas
    document.querySelectorAll('.pantalla').forEach(pantalla => {
        pantalla.classList.add('oculto');
    });
    
    // Mostrar la pantalla solicitada
    document.getElementById(idPantalla).classList.remove('oculto');
    
    // Registrar en el historial
    historialPantallas.push(idPantalla);
}

function volverPantallaAnterior() {
    if (historialPantallas.length > 1) {
        historialPantallas.pop(); // Quitar pantalla actual
        const pantallaAnterior = historialPantallas[historialPantallas.length - 1];
        
        // Si estamos en simulacro, confirmar antes de salir
        if (document.getElementById('pantalla-simulacro').classList.contains('oculto') === false) {
            if (confirm('¿Estás seguro de salir? Se perderán los datos del simulacro.')) {
                detenerCronometro();
                document.querySelectorAll('.pantalla').forEach(pantalla => {
                    pantalla.classList.add('oculto');
                });
                document.getElementById(pantallaAnterior).classList.remove('oculto');
            }
        } else {
            document.querySelectorAll('.pantalla').forEach(pantalla => {
                pantalla.classList.add('oculto');
            });
            document.getElementById(pantallaAnterior).classList.remove('oculto');
        }
    }
}

// Export the navigation functions
export {
    mostrarPantalla,
    volverPantallaAnterior,
    historialPantallas
};