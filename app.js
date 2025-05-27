// MAIN APPLICATION
// This is the main entry point that initializes the application

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the database
    if (typeof window.inicializarBD === 'function') {
        window.inicializarBD();
    }

    // Initialize fault catalog
    if (typeof window.inicializarCatalogoFaltas === 'function') {
        window.inicializarCatalogoFaltas();
    }

    // Initialize fault management
    if (typeof window.inicializarGestionFaltas === 'function') {
        window.inicializarGestionFaltas();
    }

    // Setup event listeners
    setupEventListeners();
});

// Simple event listeners setup
function setupEventListeners() {
    const btnEntrar = document.getElementById('btn-entrar');
    if (btnEntrar) {
        btnEntrar.addEventListener('click', () => {
            alert('Has hecho clic en ENTRAR');
            if (typeof window.mostrarPantalla === 'function') {
                window.mostrarPantalla('pantalla-menu');
            } else {
                alert('mostrarPantalla no está disponible');
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
                btnGuardar.dataset.modo = 'nuevo';
                btnGuardar.removeAttribute('data-id');
            }

            window.mostrarPantalla('pantalla-anadir-alumno');
        });
    }

    document.querySelectorAll('.btn-menu').forEach(btn => {
        btn.addEventListener('click', () => {
            window.mostrarPantalla('pantalla-menu');
        });
    });

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
}