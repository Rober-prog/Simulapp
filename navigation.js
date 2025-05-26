// NAVEGACIÓN ENTRE PANTALLAS
// Functions for navigating between screens

// Global variable for screen history
let historialPantallas = ['pantalla-bienvenida'];

// Variable global para saber la pantalla actual
window.pantallaActual = 'pantalla-bienvenida';

// Mostrar pantalla específica
function mostrarPantalla(idPantalla) {
    // Ocultar todas las pantallas
    document.querySelectorAll('.pantalla').forEach(pantalla => {
        pantalla.classList.add('oculto');
    });

    // Mostrar la pantalla solicitada
    const pantalla = document.getElementById(idPantalla);
    if (pantalla) {
        pantalla.classList.remove('oculto');
    } else {
        console.error(`No se encontró la pantalla con id: ${idPantalla}`);
        return;
    }

    // Registrar en el historial
    historialPantallas.push(idPantalla);

    // Actualizar la variable global de pantalla actual
    window.pantallaActual = idPantalla;

    console.log(`Pantalla actual: ${window.pantallaActual}`);
}

// Volver a la pantalla anterior
function volverPantallaAnterior() {
    if (historialPantallas.length > 1) {
        historialPantallas.pop(); // Quitar pantalla actual
        const pantallaAnterior = historialPantallas[historialPantallas.length - 1];

        // Comprobar si hay un simulacro en curso
        if (window.simulacroEnCurso) {
            if (confirm('¿Estás seguro de salir? Se perderán los datos del simulacro.')) {
                if (typeof detenerCronometro === 'function') {
                    detenerCronometro();
                }
                window.simulacroEnCurso = false;
                console.log('Simulacro detenido por navegación.');
            } else {
                return; // Si no confirma, no salir
            }
        }

        // Ocultar todas las pantallas y mostrar la anterior
        document.querySelectorAll('.pantalla').forEach(pantalla => {
            pantalla.classList.add('oculto');
        });
        document.getElementById(pantallaAnterior).classList.remove('oculto');

        // Actualizar pantalla actual
        window.pantallaActual = pantallaAnterior;

        console.log(`Volviendo a pantalla: ${window.pantallaActual}`);
    }
}

// Reiniciar historial (opcional, por si quieres usarlo al iniciar app)
function reiniciarHistorial() {
    historialPantallas = ['pantalla-bienvenida'];
    window.pantallaActual = 'pantalla-bienvenida';
}

// Hacer las funciones accesibles globalmente
window.mostrarPantalla = mostrarPantalla;
window.volverPantallaAnterior = volverPantallaAnterior;
window.reiniciarHistorial = reiniciarHistorial;

// Exportar funciones (opcional para otros módulos)
export {
    mostrarPantalla,
    volverPantallaAnterior,
    historialPantallas,
    reiniciarHistorial
};
