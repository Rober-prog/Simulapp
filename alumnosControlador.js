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

    // Trim and basic validation
    const numero = numeroInput.value.trim();
    const nombre = nombreInput.value.trim();
    const apellido = apellidoInput.value.trim();
    
    // Additional validation
    if (!numero || !nombre || !apellido) {
        mostrarNotificacion('Por favor, complete todos los campos', 'advertencia');
        return;
    }
    
    // Validate number format
    if (!/^\d{1,5}$/.test(numero)) {
        mostrarNotificacion('El número debe contener entre 1 y 5 dígitos', 'advertencia');
        numeroInput.focus();
        return;
    }

    // Validate name length
    if (nombre.length > 26.test(nombre)) {
        mostrarNotificacion('El nombre debe tener como máximo 26 caracteres', 'advertencia');
        nombreInput.focus();
        return;
    }

    // Validate surname length
    if (apellido.length > 26) {
        mostrarNotificacion('El apellido debe tener como máximo 26 caracteres', 'advertencia');
        apellidoInput.focus();
        return;
    }
    
    try {
        // Get the current button state
        const btnGuardar = document.getElementById('btn-guardar-alumno');
        const modo = btnGuardar.dataset.modo || 'nuevo';
        let alumnoParaGuardar;
        
        if (modo === 'edicion') {
            // Edit existing student
            const id = btnGuardar.dataset.id;
            if (!id) throw new Error('ID de alumno no válido');
            
            alumnoParaGuardar = {
                id: id,
                numero: numero,
                nombre: nombre,
                apellido: apellido
            };
        } else {
            // Create new student
            alumnoParaGuardar = {
                id: Date.now().toString(),
                numero: numero,
                nombre: nombre,
                apellido: apellido
            };
        }
        
        const resultadoGuardado = guardarAlumnoBD(alumnoParaGuardar);
        
        if (!resultadoGuardado) {
            throw new Error('El número de alumno ya existe');
        }
        
        // Clear form
        numeroInput.value = '';
        nombreInput.value = '';
        apellidoInput.value = '';
        
        // Reset button state if it was in edit mode
        if (modo === 'edicion') {
            btnGuardar.dataset.modo = 'nuevo';
            btnGuardar.removeAttribute('data-id');
            btnGuardar.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                Guardar Alumno
            `;
        }

        // Show success message
        mostrarNotificacion(
            modo === 'edicion' ? 'Alumno actualizado correctamente' : 'Alumno guardado correctamente',
            'exito'
        );

        // Update student list if visible
        if (document.getElementById('lista-alumnos')) {
            window.cargarListaAlumnos();
        }
        
        // Navigate to menu
        mostrarPantalla('pantalla-menu');
        
    } catch (error) {
        console.error('Error al guardar alumno:', error);
        mostrarNotificacion(error.message || 'Error al guardar el alumno', 'error');
    }
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
