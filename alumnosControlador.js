// CONTROLADOR DE ALUMNOS
// Logic for student data manipulation

// Asegurarse de que las dependencias estén disponibles globalmente
window.mostrarNotificacion = window.mostrarNotificacion || function() { console.log("mostrarNotificacion not loaded yet"); };
window.confirmarAccion = window.confirmarAccion || function() { console.log("confirmarAccion not loaded yet"); };
window.obtenerAlumnoPorId = window.obtenerAlumnoPorId || function() { console.log("obtenerAlumnoPorId not loaded yet"); };
window.guardarAlumnoBD = window.guardarAlumnoBD || function() { console.log("guardarAlumnoBD not loaded yet"); };
window.eliminarAlumnoBD = window.eliminarAlumnoBD || function() { console.log("eliminarAlumnoBD not loaded yet"); };
window.mostrarPantalla = window.mostrarPantalla || function() { console.log("mostrarPantalla not loaded yet"); };

// Function to save a student (new or edit)
function guardarAlumno() {
    const numero = document.getElementById('numero-alumno').value.trim();
    const nombre = document.getElementById('nombre-alumno').value.trim();
    const apellido = document.getElementById('apellido-alumno').value.trim();
    
    if (!numero || !nombre || !apellido) {
        window.mostrarNotificacion('Por favor, complete todos los campos', 'advertencia');
        return;
    }
    
    const btnGuardar = document.getElementById('btn-guardar-alumno');
    const modo = btnGuardar.dataset.modo || 'nuevo';
    
    if (modo === 'edicion') {
        const id = btnGuardar.dataset.id;
        const alumnoExistente = window.obtenerAlumnoPorId(id);
        
        if (!alumnoExistente) {
            window.mostrarNotificacion('Error al actualizar: alumno no encontrado', 'error');
            return;
        }
        
        const alumnoActualizado = {
            ...alumnoExistente,
            numero,
            nombre,
            apellido
        };
        
        window.guardarAlumnoBD(alumnoActualizado);
        window.mostrarNotificacion('Alumno actualizado correctamente', 'exito');
    } else {
        const alumno = {
            id: Date.now().toString(),
            numero,
            nombre,
            apellido,
            simulacros: []
        };
        
        window.guardarAlumnoBD(alumno);
        window.mostrarNotificacion('Alumno guardado correctamente', 'exito');
    }
    
    document.getElementById('numero-alumno').value = '';
    document.getElementById('nombre-alumno').value = '';
    document.getElementById('apellido-alumno').value = '';
    
    window.mostrarPantalla('pantalla-menu');
}

// Function to edit a student
function editarAlumno(id) {
    const alumno = window.obtenerAlumnoPorId(id);
    if (!alumno) {
        window.mostrarNotificacion('No se pudo encontrar el alumno', 'error');
        return;
    }
    
    document.getElementById('numero-alumno').value = alumno.numero;
    document.getElementById('nombre-alumno').value = alumno.nombre;
    document.getElementById('apellido-alumno').value = alumno.apellido;
    
    const btnGuardar = document.getElementById('btn-guardar-alumno');
    btnGuardar.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
        Actualizar Alumno
    `;
    btnGuardar.dataset.modo = 'edicion';
    btnGuardar.dataset.id = id;
    
    window.mostrarPantalla('pantalla-anadir-alumno');
}

// Function to confirm and delete a student
function confirmarEliminarAlumno(id) {
    const alumno = window.obtenerAlumnoPorId(id);
    if (!alumno) {
        window.mostrarNotificacion('No se pudo encontrar el alumno', 'error');
        return;
    }
    
    window.confirmarAccion(`¿Estás seguro de eliminar al alumno ${alumno.nombre} ${alumno.apellido}?`).then(confirmado => {
        if (confirmado) {
            window.eliminarAlumnoBD(id);
            window.mostrarNotificacion('Alumno eliminado correctamente', 'exito');
            
            const cargarListaAlumnos = window.cargarListaAlumnos || (() => {
                console.error('Function cargarListaAlumnos not found');
            });
            cargarListaAlumnos();
        }
    });
}

// Hacer funciones accesibles globalmente
window.guardarAlumno = guardarAlumno;
window.editarAlumno = editarAlumno;
window.confirmarEliminarAlumno = confirmarEliminarAlumno;
