// GESTIÓN DE ALUMNOS
// Functions for student management

// Variables de dependencias globales
// (asegúrate de que estos módulos ya estén cargados en el index.html)
window.mostrarFichaAlumno = window.mostrarFichaAlumno || function() { console.log("mostrarFichaAlumno not loaded yet"); };
window.guardarAlumno = window.guardarAlumno || function() { console.log("guardarAlumno not loaded yet"); };
window.editarAlumno = window.editarAlumno || function() { console.log("editarAlumno not loaded yet"); };
window.confirmarEliminarAlumno = window.confirmarEliminarAlumno || function() { console.log("confirmarEliminarAlumno not loaded yet"); };
window.cargarListaAlumnos = window.cargarListaAlumnos || function() { console.log("cargarListaAlumnos not loaded yet"); };
window.filtrarAlumnos = window.filtrarAlumnos || function() { console.log("filtrarAlumnos not loaded yet"); };
window.cargarCandidatosExamen = window.cargarCandidatosExamen || function() { console.log("cargarCandidatosExamen not loaded yet"); };
window.filtrarCandidatos = window.filtrarCandidatos || function() { console.log("filtrarCandidatos not loaded yet"); };

// Esto es opcional, pero puedes inicializar algo si necesitas
// Por ejemplo: window.cargarListaAlumnos();

// Funciones de acceso global (opcional, si quieres seguir declarando)
window.alumnosModule = {
    guardarAlumno: window.guardarAlumno,
    editarAlumno: window.editarAlumno,
    confirmarEliminarAlumno: window.confirmarEliminarAlumno,
    cargarListaAlumnos: window.cargarListaAlumnos,
    filtrarAlumnos: window.filtrarAlumnos,
    mostrarFichaAlumno: window.mostrarFichaAlumno,
    cargarCandidatosExamen: window.cargarCandidatosExamen,
    filtrarCandidatos: window.filtrarCandidatos
};

