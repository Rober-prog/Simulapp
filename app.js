// MAIN APPLICATION
// This is the main entry point that initializes the application

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the database
    window.inicializarBD();

    // Initialize fault catalog
    window.inicializarCatalogoFaltas();

    // Initialize fault management
    window.inicializarGestionFaltas();

    // Setup navigation and events
    setupEventListeners();

    // Cargar catálogo de faltas
    const faltas = window.cargarCatalogoFaltas();
    console.log(`Loaded ${faltas.length} faults from catalog`);
});

// Global variables
window.alumnoSeleccionado = null;
window.simulacroActual = null;

// Event listeners
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
            const numeroAlumno = document.getElementById('numero-alumno');
            const nombreAlumno = document.getElementById('nombre-alumno');
            const apellidoAlumno = document.getElementById('apellido-alumno');
            if (numeroAlumno) numeroAlumno.value = '';
            if (nombreAlumno) nombreAlumno.value = '';
            if (apellidoAlumno) apellidoAlumno.value = '';
            const btnGuardar = document.getElementById('btn-guardar-alumno');
            if (btnGuardar) {
                btnGuardar.innerHTML = 'Guardar Alumno';
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
            window.cargarListaAlumnos();
        });
    }

    const btnCandidatos = document.getElementById('btn-candidatos');
    if (btnCandidatos) {
        btnCandidatos.addEventListener('click', () => {
            window.mostrarPantalla('pantalla-candidatos');
            window.cargarCandidatosExamen();
        });
    }

    const btnGuardarAlumno = document.getElementById('btn-guardar-alumno');
    if (btnGuardarAlumno) {
        btnGuardarAlumno.addEventListener('click', window.guardarAlumno);
    }

    const inputBuscar = document.getElementById('input-buscar');
    if (inputBuscar) {
        inputBuscar.addEventListener('input', window.filtrarAlumnos);
    }

    const inputBuscarCandidato = document.getElementById('input-buscar-candidato');
    if (inputBuscarCandidato) {
        inputBuscarCandidato.addEventListener('input', window.filtrarCandidatos);
    }

    const btnConfigurarFaltas = document.getElementById('btn-configurar-faltas');
    if (btnConfigurarFaltas) {
        btnConfigurarFaltas.addEventListener('click', () => {
            window.mostrarPantalla('pantalla-config-faltas');
            window.inicializarGestionFaltas();
        });
    }

    const btnNuevoSimulacro = document.getElementById('btn-nuevo-simulacro');
    if (btnNuevoSimulacro) {
        btnNuevoSimulacro.addEventListener('click', window.prepararSimulacro);
    }

    const btnExportarFicha = document.getElementById('btn-exportar-ficha');
    if (btnExportarFicha) {
        btnExportarFicha.addEventListener('click', window.exportarFichaAlumno);
    }

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', window.cambiarTabFaltas);
    });

    const btnIniciarPrueba = document.getElementById('btn-iniciar-prueba');
    if (btnIniciarPrueba) {
        btnIniciarPrueba.addEventListener('click', window.iniciarSimulacro);
    }

    const btnFinalizarSimulacro = document.getElementById('btn-finalizar-simulacro');
    if (btnFinalizarSimulacro) {
        btnFinalizarSimulacro.addEventListener('click', window.finalizarSimulacro);
    }

    const btnExportarInforme = document.getElementById('btn-exportar-informe');
    if (btnExportarInforme) {
        btnExportarInforme.addEventListener('click', window.exportarInformeSimulacro);
    }

    const btnVolverFicha = document.getElementById('btn-volver-ficha');
    if (btnVolverFicha) {
        btnVolverFicha.addEventListener('click', () => {
            if (window.alumnoSeleccionado) {
                window.mostrarFichaAlumno(window.alumnoSeleccionado);
            } else {
                window.mostrarPantalla('pantalla-menu');
            }
        });
    }

    const btnVerResultado = document.getElementById('btn-ver-resultado');
    if (btnVerResultado) {
        btnVerResultado.addEventListener('click', window.mostrarResultadoFinal);
    }

    const btnVolverMenu = document.getElementById('btn-volver-menu');
    if (btnVolverMenu) {
        btnVolverMenu.addEventListener('click', () => {
            window.mostrarPantalla('pantalla-menu');
        });
    }

    const btnExportarCandidatos = document.getElementById('btn-exportar-candidatos');
    if (btnExportarCandidatos) {
        btnExportarCandidatos.addEventListener('click', window.exportarListaCandidatos);
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

// Aseguramos funciones globales
window.guardarAlumno = window.guardarAlumno || function() { console.log("guardarAlumno no cargado"); };
window.cargarListaAlumnos = window.cargarListaAlumnos || function() { console.log("cargarListaAlumnos no cargado"); };
window.filtrarAlumnos = window.filtrarAlumnos || function() { console.log("filtrarAlumnos no cargado"); };
window.mostrarFichaAlumno = window.mostrarFichaAlumno || function() { console.log("mostrarFichaAlumno no cargado"); };
window.cargarCandidatosExamen = window.cargarCandidatosExamen || function() { console.log("cargarCandidatosExamen no cargado"); };
window.filtrarCandidatos = window.filtrarCandidatos || function() { console.log("filtrarCandidatos no cargado"); };
window.exportarFichaAlumno = window.exportarFichaAlumno || function() { console.log("exportarFichaAlumno no cargado"); };
window.exportarInformeSimulacro = window.exportarInformeSimulacro || function() { console.log("exportarInformeSimulacro no cargado"); };
window.exportarListaCandidatos = window.exportarListaCandidatos || function() { console.log("exportarListaCandidatos no cargado"); };
window.mostrarResultadoFinal = window.mostrarResultadoFinal || function() { console.log("mostrarResultadoFinal no cargado"); };
window.cambiarTabFaltas = window.cambiarTabFaltas || function() { console.log("cambiarTabFaltas no cargado"); };