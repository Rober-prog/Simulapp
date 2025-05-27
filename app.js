// MAIN APPLICATION
// This is the main entry point that initializes the application

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la base de datos
    if (typeof window.inicializarBD === 'function') {
        window.inicializarBD();
    }

    // Inicializar catálogo de faltas
    if (typeof window.inicializarCatalogoFaltas === 'function') {
        window.inicializarCatalogoFaltas();
    }

    // Inicializar gestión de faltas
    if (typeof window.inicializarGestionFaltas === 'function') {
        window.inicializarGestionFaltas();
    }

    // Configurar eventos
    setupEventListeners();

    // Cargar catálogo de faltas para verificar
    if (typeof window.cargarCatalogoFaltas === 'function') {
        const faltas = window.cargarCatalogoFaltas();
        console.log(`Catálogo cargado con ${faltas.length} faltas`);
    }
});

// Variable global para el alumno seleccionado
window.alumnoSeleccionado = null;
window.simulacroActual = null;

// Configurar todos los eventos
function setupEventListeners() {
    const btnEntrar = document.getElementById('btn-entrar');
    if (btnEntrar) {
        btnEntrar.addEventListener('click', () => {
            window.mostrarPantalla('pantalla-menu');
        });
    }

    const btnAnadirAlumno = document.getElementById('btn-anadir-alumno');
    if (btnAnadirAlumno) {
        btnAnadirAlumno.addEventListener('click', () => {
            document.getElementById('numero-alumno').value = '';
            document.getElementById('nombre-alumno').value = '';
            document.getElementById('apellido-alumno').value = '';

            const btnGuardar = document.getElementById('btn-guardar-alumno');
            if (btnGuardar) {
                btnGuardar.dataset.modo = 'nuevo';
                btnGuardar.removeAttribute('data-id');
            }

            window.mostrarPantalla('pantalla-anadir-alumno');
        });
    }

    const btnBuscarAlumno = document.getElementById('btn-buscar-alumno');
    if (btnBuscarAlumno) {
        btnBuscarAlumno.addEventListener('click', () => {
            window.mostrarPantalla('pantalla-buscar-alumno');
            if (typeof window.cargarListaAlumnos === 'function') {
                window.cargarListaAlumnos();
            }
        });
    }

    const btnCandidatos = document.getElementById('btn-candidatos');
    if (btnCandidatos) {
        btnCandidatos.addEventListener('click', () => {
            window.mostrarPantalla('pantalla-candidatos');
            if (typeof window.cargarCandidatosExamen === 'function') {
                window.cargarCandidatosExamen();
            }
        });
    }

    const btnConfigurarFaltas = document.getElementById('btn-configurar-faltas');
    if (btnConfigurarFaltas) {
        btnConfigurarFaltas.addEventListener('click', () => {
            window.mostrarPantalla('pantalla-config-faltas');
            if (typeof window.inicializarGestionFaltas === 'function') {
                window.inicializarGestionFaltas();
            }
        });
    }

    const btnInfo = document.getElementById('btn-info');
    if (btnInfo) {
        btnInfo.addEventListener('click', () => {
            window.mostrarPantalla('pantalla-creditos');
        });
    }

    document.querySelectorAll('.btn-menu').forEach(btn => {
        btn.addEventListener('click', () => {
            window.mostrarPantalla('pantalla-menu');
        });
    });
}

// Funciones globales de respaldo para evitar errores si no están definidas
window.guardarAlumno = window.guardarAlumno || function() { console.log("guardarAlumno no está cargada"); };
window.cargarListaAlumnos = window.cargarListaAlumnos || function() { console.log("cargarListaAlumnos no está cargada"); };
window.cargarCandidatosExamen = window.cargarCandidatosExamen || function() { console.log("cargarCandidatosExamen no está cargada"); };
window.inicializarBD = window.inicializarBD || function() { console.log("inicializarBD no está cargada"); };
window.inicializarCatalogoFaltas = window.inicializarCatalogoFaltas || function() { console.log("inicializarCatalogoFaltas no está cargada"); };
window.inicializarGestionFaltas = window.inicializarGestionFaltas || function() { console.log("inicializarGestionFaltas no está cargada"); };