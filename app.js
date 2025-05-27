// MAIN APPLICATION
// This is the main entry point that initializes the application

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the database
    if (window.inicializarBD) window.inicializarBD();

    // Initialize fault catalog
    if (window.inicializarCatalogoFaltas) window.inicializarCatalogoFaltas();

    // Initialize fault management
    if (window.inicializarGestionFaltas) window.inicializarGestionFaltas();

    // Setup navigation and events
    setupEventListeners();

    // Cargar catálogo de faltas
    if (window.cargarCatalogoFaltas) {
        const faltas = window.cargarCatalogoFaltas();
        console.log(`Catálogo de faltas cargado: ${faltas.length} faltas`);
    }
});

// Global variables for the application
let alumnoSeleccionado = null;
window.alumnoSeleccionado = null;
let simulacroActual = null;

// Simple event listeners setup
function setupEventListeners() {
    const btnEntrar = document.getElementById('btn-entrar');
    if (btnEntrar) {
        btnEntrar.addEventListener('click', () => {
            alert('Has hecho clic en ENTRAR');
            if (typeof window.mostrarPantalla === 'function') {
                window.mostrarPantalla('pantalla-menu');
            } else {
                alert('No se encontró la función mostrarPantalla');
            }
        });
    }

    document.querySelectorAll('.btn-menu').forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.mostrarPantalla) window.mostrarPantalla('pantalla-menu');
        });
    });
}