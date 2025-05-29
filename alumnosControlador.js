// CONTROLADOR DE ALUMNOS
// Logic for student data manipulation

import { mostrarNotificacion, confirmarAccion } from './ui.js';
import { obtenerAlumnoPorId, guardarAlumnoBD, eliminarAlumnoBD } from './db.js';
import { mostrarPantalla } from './navigation.js';

// Function to save a student (new or edit)
function guardarAlumno() {
    const numeroInput = document.getElementById('numero-alumno');
    const nombreInput = document.getElementById('nombre-alumno');
    const apellidoInput = document.getElementById('apellido-alumno');

    const numero = numeroInput.value.trim();
    const nombre = nombreInput.value.trim();
    const apellido = apellidoInput.value.trim();
    
    if (!numero || !nombre || !apellido) {
        mostrarNotificacion('Por favor, complete todos los campos', 'advertencia');
        return;
    }
    
    // Add validation for number length (max 5 digits)
    if (numero.length > 5) {
        mostrarNotificacion('El número debe tener como máximo 5 dígitos', 'advertencia');
        numeroInput.focus(); // Focus the input field
        return;
    }

    // Add validation for name length (max 24 characters)
    if (nombre.length > 24) {
        mostrarNotificacion('El nombre debe tener como máximo 24 caracteres', 'advertencia');
        nombreInput.focus();
        return;
    }

    // Add validation for surname length (max 24 characters)
    if (apellido.length > 24) {
        mostrarNotificacion('El apellido debe tener como máximo 24 caracteres', 'advertencia');
        apellidoInput.focus();
        return;
    }
    
    const btnGuardar = document.getElementById('btn-guardar-alumno');
    const modo = btnGuardar.dataset.modo || 'nuevo';
    
    if (modo === 'edicion') {
        // Editar alumno existente
        const id = btnGuardar.dataset.id;
        const alumnoExistente = obtenerAlumnoPorId(id);
        
        if (!alumnoExistente) {
            mostrarNotificacion('Error al actualizar: alumno no encontrado', 'error');
            return;
        }
        
        const alumnoActualizado = {
            ...alumnoExistente,
            numero,
            nombre,
            apellido
        };
        
        guardarAlumnoBD(alumnoActualizado);
        mostrarNotificacion('Alumno actualizado correctamente', 'exito');
    } else {
        // Guardar nuevo alumno
        const alumno = {
            id: Date.now().toString(),
            numero,
            nombre,
            apellido,
            simulacros: []
        };
        
        guardarAlumnoBD(alumno);
        mostrarNotificacion('Alumno guardado correctamente', 'exito');
    }
    
    // Limpiar campos
    numeroInput.value = '';
    nombreInput.value = '';
    apellidoInput.value = '';
    
    mostrarPantalla('pantalla-menu');
}

// Function to edit a student
function editarAlumno(id) {
    const alumno = obtenerAlumnoPorId(id);
    if (!alumno) {
        mostrarNotificacion('No se pudo encontrar el alumno', 'error');
        return;
    }
    
    // Rellenar el formulario con los datos del alumno
    document.getElementById('numero-alumno').value = alumno.numero;
    document.getElementById('nombre-alumno').value = alumno.nombre;
    document.getElementById('apellido-alumno').value = alumno.apellido;
    
    // Cambiar el botón guardar para indicar que es edición
    const btnGuardar = document.getElementById('btn-guardar-alumno');
    btnGuardar.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
        Actualizar Alumno
    `;
    btnGuardar.dataset.modo = 'edicion';
    btnGuardar.dataset.id = id;
    
    // Mostrar la pantalla de añadir alumno (ahora editar)
    mostrarPantalla('pantalla-anadir-alumno');
}

// Function to confirm and delete a student
function confirmarEliminarAlumno(id) {
    const alumno = obtenerAlumnoPorId(id);
    if (!alumno) {
        mostrarNotificacion('No se pudo encontrar el alumno', 'error');
        return;
    }
    
    confirmarAccion(`¿Estás seguro de eliminar al alumno ${alumno.nombre} ${alumno.apellido}?`).then(confirmado => {
        if (confirmado) {
            eliminarAlumnoBD(id);
            mostrarNotificacion('Alumno eliminado correctamente', 'exito');
            
            // Reload the student list
            const cargarListaAlumnos = window.cargarListaAlumnos || (() => {
                console.error('Function cargarListaAlumnos not found');
            });
            cargarListaAlumnos();
        }
    });
}

export {
    guardarAlumno,
    editarAlumno,
    confirmarEliminarAlumno
};