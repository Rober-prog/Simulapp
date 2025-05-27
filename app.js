// MAIN APPLICATION
// This is the main entry point that initializes the application

console.log("Probando funciones globales...");

document.addEventListener('DOMContentLoaded', () => {
    console.log("Probando funciones globales...");
    if (typeof window.mostrarPantalla === "function") {
        console.log("mostrarPantalla está disponible");
    } else {
        console.error("mostrarPantalla NO está disponible");
    }

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the database
    if (typeof window.inicializarBD === "function") {
        window.inicializarBD();
    }

    // Initialize fault catalog - ensure this runs first
    console.log('Initializing fault catalog...');
    if (typeof window.inicializarCatalogoFaltas === "function") {
        window.inicializarCatalogoFaltas();
    }

    // Initialize fault management with logging
    try {
        if (typeof window.inicializarGestionFaltas === "function") {
            window.inicializarGestionFaltas();
            console.log('Fault management initialized');
        }
    } catch (error) {
        console.error('Error initializing fault management:', error);
    }

    // Setup navigation and events
    setupEventListeners();

    // Ensure catalog is loaded correctly
    if (typeof window.cargarCatalogoFaltas === "function") {
        const faltas = window.cargarCatalogoFaltas();
        console.log(`Loaded ${faltas.length} faults from catalog`);
    }
});

// Global variables for the application
let alumnoSeleccionado = null;
window.alumnoSeleccionado = null;
let simulacroActual = null;
window.simulacroActual = null;
window.simulacroEnCurso = false;

// Simple event listeners setup
function setupEventListeners() {
    const btnEntrar = document.getElementById('btn-entrar');
    if (btnEntrar) {
        btnEntrar.addEventListener('click', () => {
            alert('Has hecho clic en ENTRAR');
            if (typeof window.mostrarPantalla === "function") {
                window.mostrarPantalla('pantalla-menu');
            } else {
                alert("mostrarPantalla no está disponible");
            }
        });
    }

    const btnAnadirAlumno = document.getElementById('btn-anadir-alumno');
    if (btnAnadirAlumno) {
        btnAnadirAlumno.addEventListener('click', () => {
            const numeroAlumno = document.getElementById('numero-alumno');
            const nombreAlumno = document.getElementById('nombre-alumno');
            const apellidoAlumno = document.getElementById('apellido-alumno');

            if (numeroAlumno) numeroAlumno.value = '';
            if (nombreAlumno) nombreAlumno.value = '';
            if (apellidoAlumno) apellidoAlumno.value = '';

            const btnGuardar = document.getElementById('btn-guardar-alumno');
            if (btnGuardar) {
                btnGuardar.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                    Guardar Alumno
                `;
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
            if (typeof window.cargarListaAlumnos === "function") {
                window.cargarListaAlumnos();
            }
        });
    }

    const btnCandidatos = document.getElementById('btn-candidatos');
    if (btnCandidatos) {
        btnCandidatos.addEventListener('click', () => {
            window.mostrarPantalla('pantalla-candidatos');
            if (typeof window.cargarCandidatosExamen === "function") {
                window.cargarCandidatosExamen();
            }
        });
    }

    const btnGuardarAlumno = document.getElementById('btn-guardar-alumno');
    if (btnGuardarAlumno) {
        btnGuardarAlumno.addEventListener('click', () => {
            if (typeof window.guardarAlumno === "function") {
                window.guardarAlumno();
            }
        });
    }

    const inputBuscar = document.getElementById('input-buscar');
    if (inputBuscar) {
        inputBuscar.addEventListener('input', () => {
            if (typeof window.filtrarAlumnos === "function") {
                window.filtrarAlumnos();
            }
        });
    }

    const inputBuscarCandidato = document.getElementById('input-buscar-candidato');
    if (inputBuscarCandidato) {
        inputBuscarCandidato.addEventListener('input', () => {
            if (typeof window.filtrarCandidatos === "function") {
                window.filtrarCandidatos();
            }
        });
    }

    const btnConfigurarFaltas = document.getElementById('btn-configurar-faltas');
    if (btnConfigurarFaltas) {
        btnConfigurarFaltas.addEventListener('click', () => {
            window.mostrarPantalla('pantalla-config-faltas');
            if (typeof window.inicializarGestionFaltas === "function") {
                window.inicializarGestionFaltas();
            }
        });
    }

    const btnNuevoSimulacro = document.getElementById('btn-nuevo-simulacro');
    if (btnNuevoSimulacro) {
        btnNuevoSimulacro.addEventListener('click', () => {
            if (typeof window.prepararSimulacro === "function") {
                window.prepararSimulacro();
            }
        });
    }

    const btnExportarFicha = document.getElementById('btn-exportar-ficha');
    if (btnExportarFicha) {
        btnExportarFicha.addEventListener('click', () => {
            if (typeof window.exportarFichaAlumno === "function") {
                window.exportarFichaAlumno();
            }
        });
    }

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (typeof window.cambiarTabFaltas === "function") {
                window.cambiarTabFaltas();
            }
        });
    });

    const btnIniciarPrueba = document.getElementById('btn-iniciar-prueba');
    if (btnIniciarPrueba) {
        btnIniciarPrueba.addEventListener('click', () => {
            if (typeof window.iniciarSimulacro === "function") {
                window.iniciarSimulacro();
            }
        });
    }

    const btnFinalizarSimulacro = document.getElementById('btn-finalizar-simulacro');
    if (btnFinalizarSimulacro) {
        btnFinalizarSimulacro.addEventListener('click', () => {
            if (typeof window.finalizarSimulacro === "function") {
                window.finalizarSimulacro();
            }
        });
    }

    const btnExportarInforme = document.getElementById('btn-exportar-informe');
    if (btnExportarInforme) {
        btnExportarInforme.addEventListener('click', () => {
            if (typeof window.exportarInformeSimulacro === "function") {
                window.exportarInformeSimulacro();
            }
        });
    }

    const btnVolverFicha = document.getElementById('btn-volver-ficha');
    if (btnVolverFicha) {
        btnVolverFicha.addEventListener('click', () => {
            if (window.alumnoSeleccionado && typeof window.mostrarFichaAlumno === "function") {
                window.mostrarFichaAlumno(window.alumnoSeleccionado);
            } else {
                if (typeof window.mostrarNotificacion === "function") {
                    window.mostrarNotificacion('Error al volver a la ficha del alumno', 'error');
                }
                window.mostrarPantalla('pantalla-menu');
            }
        });
    }

    const btnVerResultado = document.getElementById('btn-ver-resultado');
    if (btnVerResultado) {
        btnVerResultado.addEventListener('click', () => {
            if (typeof window.mostrarResultadoFinal === "function") {
                window.mostrarResultadoFinal();
            }
        });
    }

    const btnVolverMenu = document.getElementById('btn-volver-menu');
    if (btnVolverMenu) {
        btnVolverMenu.addEventListener('click', () => {
            window.mostrarPantalla('pantalla-menu');
        });
    }

    const btnExportarCandidatos = document.getElementById('btn-exportar-candidatos');
    if (btnExportarCandidatos) {
        btnExportarCandidatos.addEventListener('click', () => {
            if (typeof window.exportarListaCandidatos === "function") {
                window.exportarListaCandidatos();
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

// Asegurar funciones globales si no están cargadas aún
window.guardarAlumno = window.guardarAlumno || function() { console.log("guardarAlumno no disponible"); };
window.cargarListaAlumnos = window.cargarListaAlumnos || function() { console.log("cargarListaAlumnos no disponible"); };
window.filtrarAlumnos = window.filtrarAlumnos || function() { console.log("filtrarAlumnos no disponible"); };
window.mostrarFichaAlumno = window.mostrarFichaAlumno || function() { console.log("mostrarFichaAlumno no disponible"); };
window.cargarCandidatosExamen = window.cargarCandidatosExamen || function() { console.log("cargarCandidatosExamen no disponible"); };
window.filtrarCandidatos = window.filtrarCandidatos || function() { console.log("filtrarCandidatos no disponible"); };
window.exportarFichaAlumno = window.exportarFichaAlumno || function() { console.log("exportarFichaAlumno no disponible"); };
window.exportarInformeSimulacro = window.exportarInformeSimulacro || function() { console.log("exportarInformeSimulacro no disponible"); };
window.exportarListaCandidatos = window.exportarListaCandidatos || function() { console.log("exportarListaCandidatos no disponible"); };
window.mostrarResultadoFinal = window.mostrarResultadoFinal || function() { console.log("mostrarResultadoFinal no disponible"); };
window.cambiarTabFaltas = window.cambiarTabFaltas || function() { console.log("cambiarTabFaltas no disponible"); };
window.mostrarFaltasPorTipo = window.mostrarFaltasPorTipo || function() { console.log("mostrarFaltasPorTipo no disponible"); };