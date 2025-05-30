// GESTIÓN DE ALUMNOS
// Functions for student management

import { mostrarFichaAlumno } from './alumnosVista.js';
import { guardarAlumno, editarAlumno, confirmarEliminarAlumno } from './alumnosControlador.js';
import { cargarListaAlumnos, filtrarAlumnos } from './alumnosLista.js';
import { cargarCandidatosExamen, filtrarCandidatos } from './candidatosModule.js';

// Make these functions available globally
window.cargarListaAlumnos = cargarListaAlumnos;
window.filtrarAlumnos = filtrarAlumnos;
window.guardarAlumno = guardarAlumno;
window.mostrarFichaAlumno = mostrarFichaAlumno;

export {
    guardarAlumno,
    cargarListaAlumnos,
    filtrarAlumnos,
    mostrarFichaAlumno,
    cargarCandidatosExamen,
    filtrarCandidatos,
    editarAlumno,
    confirmarEliminarAlumno
};

