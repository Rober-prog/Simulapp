// alumnosLista.js

// Función para cargar y mostrar la lista de alumnos
function cargarListaAlumnos() {
    const listaAlumnos = document.getElementById('lista-alumnos');
    if (!listaAlumnos) return;

    // Limpiar lista anterior
    listaAlumnos.innerHTML = '';

    const alumnos = window.obtenerAlumnos();
    if (!alumnos || alumnos.length === 0) {
        listaAlumnos.innerHTML = '<p>No hay alumnos registrados.</p>';
        return;
    }

    alumnos.forEach(alumno => {
        const div = document.createElement('div');
        div.className = 'alumno-item';
        div.innerHTML = `
            <p><strong>${alumno.nombre} ${alumno.apellido}</strong></p>
            <p>Número: ${alumno.numero}</p>
            <button onclick="window.mostrarFichaAlumno('${alumno.numero}')">Ver Ficha</button>
        `;
        listaAlumnos.appendChild(div);
    });
}

// Hacerla global
window.cargarListaAlumnos = cargarListaAlumnos;