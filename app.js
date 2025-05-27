// MAIN APPLICATION
// This is the main entry point that initializes the application

console.log("Probando funciones globales...");

if (typeof window.mostrarPantalla === "function") {
    console.log("mostrarPantalla está disponible");
} else {
    console.error("mostrarPantalla NO está disponible");
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the database
    window.inicializarBD();

    // Initialize fault catalog - ensure this runs first
    console.log('Initializing fault catalog...');
    window.inicializarCatalogoFaltas();

    // Initialize fault management with logging
    try {
        window.inicializarGestionFaltas();
        console.log('Fault management initialized');
    } catch (error) {
        console.error('Error initializing fault management:', error);
    }

    // Setup navigation and events
    setupEventListeners();

    // Load fault catalog
    const faltas = window.cargarCatalogoFaltas();
    console.log(`Loaded ${faltas.length} faults from catalog`);
});

// Global variables for the application
let alumnoSeleccionado = null;
window.alumnoSeleccionado = null;
let simulacroActual = null;

// Setup all event listeners
function setupEventListeners() {
    // Pantalla de bienvenida
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

    // Botón Añadir Alumno
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

    // Botón Buscar Alumno
    const btnBuscarAlumno = document.getElementById('btn-buscar-alumno');
    if (btnBuscarAlumno) {
        btnBuscarAlumno.addEventListener('click', () => {
            window.mostrarPantalla('pantalla-buscar-alumno');
            window.cargarListaAlumnos();
        });
    }

    // Botón Candidatos
    const btnCandidatos = document.getElementById('btn-candidatos');
    if (btnCandidatos) {
        btnCandidatos.addEventListener('click', () => {
            window.mostrarPantalla('pantalla-candidatos');
            window.cargarCandidatosExamen();
        });
    }

    // Botón Configurar Faltas
    const btnConfigurarFaltas = document.getElementById('btn-configurar-faltas');
    if (btnConfigurarFaltas) {
        btnConfigurarFaltas.addEventListener('click', () => {
            window.mostrarPantalla('pantalla-config-faltas');
            window.inicializarGestionFaltas();
        });
    }

    // Botón Guardar Alumno
    const btnGuardarAlumno = document.getElementById('btn-guardar-alumno');
    if (btnGuardarAlumno) {
        btnGuardarAlumno.addEventListener('click', window.guardarAlumno);
    }

    // Buscar Alumno (input)
    const inputBuscar = document.getElementById('input-buscar');
    if (inputBuscar) {
        inputBuscar.addEventListener('input', window.filtrarAlumnos);
    }

    // Buscar Candidato (input)
    const inputBuscarCandidato = document.getElementById('input-buscar-candidato');
    if (inputBuscarCandidato) {
        inputBuscarCandidato.addEventListener('input', window.filtrarCandidatos);
    }

    // Botón Nuevo Simulacro
    const btnNuevoSimulacro = document.getElementById('btn-nuevo-simulacro');
    if (btnNuevoSimulacro) {
        btnNuevoSimulacro.addEventListener('click', window.prepararSimulacro);
    }

    // Botón Exportar Ficha
    const btnExportarFicha = document.getElementById('btn-exportar-ficha');
    if (btnExportarFicha) {
        btnExportarFicha.addEventListener('click', window.exportarFichaAlumno);
    }

    // Botón Iniciar Prueba
    const btnIniciarPrueba = document.getElementById('btn-iniciar-prueba');
    if (btnIniciarPrueba) {
        btnIniciarPrueba.addEventListener('click', window.iniciarSimulacro);
    }

    // Botón Finalizar Simulacro
    const btnFinalizarSimulacro = document.getElementById('btn-finalizar-simulacro');
    if (btnFinalizarSimulacro) {
        btnFinalizarSimulacro.addEventListener('click', window.finalizarSimulacro);
    }

    // Botón Exportar Informe
    const btnExportarInforme = document.getElementById('btn-exportar-informe');
    if (btnExportarInforme) {
        btnExportarInforme.addEventListener('click', window.exportarInformeSimulacro);
    }

    // Botón Ver Resultado Final
    const btnVerResultado = document.getElementById('btn-ver-resultado');
    if (btnVerResultado) {
        btnVerResultado.addEventListener('click', window.mostrarResultadoFinal);
    }

    // Botón Volver al Menú
    const btnVolverMenu = document.getElementById('btn-volver-menu');
    if (btnVolverMenu) {
        btnVolverMenu.addEventListener('click', () => {
            window.mostrarPantalla('pantalla-menu');
        });
    }

    // Botón Exportar Candidatos
    const btnExportarCandidatos = document.getElementById('btn-exportar-candidatos');
    if (btnExportarCandidatos) {
        btnExportarCandidatos.addEventListener('click', window.exportarListaCandidatos);
    }

    // Botón Info
    const btnInfo = document.getElementById('btn-info');
    if (btnInfo) {
        btnInfo.addEventListener('click', () => {
            window.mostrarPantalla('pantalla-creditos');
        });
    }

    // Botones .btn-menu
    document.querySelectorAll('.btn-menu').forEach(btn => {
        btn.addEventListener('click', () => {
            window.mostrarPantalla('pantalla-menu');
        });
    });

    // Tabs de Faltas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', window.cambiarTabFaltas);
    });
}

// Funciones globales de respaldo
window.guardarAlumno = window.guardarAlumno || function() { console.log("guardarAlumno not loaded yet"); };
window.cargarListaAlumnos = window.cargarListaAlumnos || function() { console.log("cargarListaAlumnos not loaded yet"); };
window.filtrarAlumnos = window.filtrarAlumnos || function() { console.log("filtrarAlumnos not loaded yet"); };
window.mostrarFichaAlumno = window.mostrarFichaAlumno || function() { console.log("mostrarFichaAlumno not loaded yet"); };
window.cargarCandidatosExamen = window.cargarCandidatosExamen || function() { console.log("cargarCandidatosExamen not loaded yet"); };
window.filtrarCandidatos = window.filtrarCandidatos || function() { console.log("filtrarCandidatos not loaded yet"); };
window.exportarFichaAlumno = window.exportarFichaAlumno || function() { console.log("exportarFichaAlumno not loaded yet"); };
window.exportarInformeSimulacro = window.exportarInformeSimulacro || function() { console.log("exportarInformeSimulacro not loaded yet"); };
window.exportarListaCandidatos = window.exportarListaCandidatos || function() { console.log("exportarListaCandidatos not loaded yet"); };
window.mostrarResultadoFinal = window.mostrarResultadoFinal || function() { console.log("mostrarResultadoFinal not loaded yet"); };
window.cambiarTabFaltas = window.cambiarTabFaltas || function() { console.log("cambiarTabFaltas not loaded yet"); };
window.mostrarFaltasPorTipo = window.mostrarFaltasPorTipo || function() { console.log("mostrarFaltasPorTipo not loaded yet"); };