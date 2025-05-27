// NAVEGACIÓN ENTRE PANTALLAS
// Funciones para navegación

// Global variable for screen history
let historialPantallas = ['pantalla-bienvenida'];
window.historialPantallas = historialPantallas;

// Variable global para la pantalla actual
window.pantallaActual = 'pantalla-bienvenida';

// Mostrar pantalla específica
function mostrarPantalla(idPantalla) {
    document.querySelectorAll('.pantalla').forEach(pantalla => {
        pantalla.classList.add('oculto');
    });

    const pantalla = document.getElementById(idPantalla);
    if (pantalla) {
        pantalla.classList.remove('oculto');
    }

    historialPantallas.push(idPantalla);
    window.pantallaActual = idPantalla;

    console.log(`Pantalla actual: ${window.pantallaActual}`);
}

// Volver a la pantalla anterior
function volverPantallaAnterior() {
    if (historialPantallas.length > 1) {
        historialPantallas.pop();
        const pantallaAnterior = historialPantallas[historialPantallas.length - 1];

        document.querySelectorAll('.pantalla').forEach(p => p.classList.add('oculto'));
        document.getElementById(pantallaAnterior).classList.remove('oculto');

        window.pantallaActual = pantallaAnterior;
    }
}

// Hacer funciones globales
window.mostrarPantalla = mostrarPantalla;
window.volverPantallaAnterior = volverPantallaAnterior;