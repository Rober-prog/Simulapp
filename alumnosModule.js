// alumnosModule.js

// Base de datos local para los alumnos (almacenados en LocalStorage)
window.alumnos = window.alumnos || [];

window.guardarAlumno = function() {
    const numero = document.getElementById('numero-alumno').value.trim();
    const nombre = document.getElementById('nombre-alumno').value.trim();
    const apellido = document.getElementById('apellido-alumno').value.trim();

    if (!numero || !nombre || !apellido) {
        window.mostrarNotificacion("Por favor, rellena todos los campos", "error");
        return;
    }

    const nuevoAlumno = {
        id: Date.now(),
        numero,
        nombre,
        apellido,
        simulacros: []
    };

    window.alumnos.push(nuevoAlumno);
    localStorage.setItem('alumnos', JSON.stringify(window.alumnos));

    window.mostrarNotificacion("Alumno guardado correctamente", "exito");
    window.mostrarPantalla('pantalla-menu');
};

window.cargarAlumnosDesdeStorage = function() {
    const datos = localStorage.getItem('alumnos');
    if (datos) {
        window.alumnos = JSON.parse(datos);
    }
};

window.obtenerAlumnoPorId = function(id) {
    return window.alumnos.find(alumno => alumno.id === id);
};

window.actualizarAlumno = function(id, datosActualizados) {
    const index = window.alumnos.findIndex(alumno => alumno.id === id);
    if (index !== -1) {
        window.alumnos[index] = { ...window.alumnos[index], ...datosActualizados };
        localStorage.setItem('alumnos', JSON.stringify(window.alumnos));
        window.mostrarNotificacion("Alumno actualizado", "exito");
    } else {
        window.mostrarNotificacion("Alumno no encontrado", "error");
    }
};

// Cargar los alumnos al iniciar
window.cargarAlumnosDesdeStorage();