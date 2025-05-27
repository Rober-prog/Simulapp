// alumnosControlador.js

console.log("alumnosControlador.js cargado correctamente");

function guardarAlumno() {
    const numero = document.getElementById('numero-alumno').value.trim();
    const nombre = document.getElementById('nombre-alumno').value.trim();
    const apellido = document.getElementById('apellido-alumno').value.trim();

    if (!numero || !nombre || !apellido) {
        window.mostrarNotificacion('Por favor, completa todos los campos', 'error');
        return;
    }

    const alumno = {
        numero,
        nombre,
        apellido,
        simulacros: []
    };

    let catalogo = JSON.parse(localStorage.getItem('catalogoAlumnos')) || [];
    const index = catalogo.findIndex(a => a.numero === numero);

    if (index >= 0) {
        // Actualizar
        catalogo[index] = alumno;
        window.mostrarNotificacion('Alumno actualizado', 'success');
    } else {
        // Nuevo
        catalogo.push(alumno);
        window.mostrarNotificacion('Alumno guardado', 'success');
    }

    localStorage.setItem('catalogoAlumnos', JSON.stringify(catalogo));
    window.mostrarPantalla('pantalla-menu');
}

function cargarListaAlumnos() {
    const lista = document.getElementById('lista-alumnos');
    lista.innerHTML = '';
    const catalogo = JSON.parse(localStorage.getItem('catalogoAlumnos')) || [];

    catalogo.forEach(alumno => {
        const div = document.createElement('div');
        div.classList.add('item-lista');
        div.innerHTML = `
            <strong>${alumno.nombre} ${alumno.apellido}</strong> - Nº: ${alumno.numero}
        `;
        div.addEventListener('click', () => {
            window.mostrarFichaAlumno(alumno);
        });
        lista.appendChild(div);
    });
}

function mostrarFichaAlumno(alumno) {
    window.alumnoSeleccionado = alumno;

    const datos = document.getElementById('datos-alumno');
    datos.innerHTML = `
        <p><strong>Número:</strong> ${alumno.numero}</p>
        <p><strong>Nombre:</strong> ${alumno.nombre}</p>
        <p><strong>Apellido:</strong> ${alumno.apellido}</p>
    `;

    const listaSimulacros = document.getElementById('lista-simulacros');
    listaSimulacros.innerHTML = '';

    if (alumno.simulacros && alumno.simulacros.length > 0) {
        alumno.simulacros.forEach((sim, index) => {
            const div = document.createElement('div');
            div.classList.add('item-lista');
            div.innerHTML = `
                <strong>Simulacro ${index + 1}</strong> - ${sim.resultado} (${sim.fecha})
            `;
            listaSimulacros.appendChild(div);
        });
    } else {
        listaSimulacros.innerHTML = '<p>No hay simulacros registrados</p>';
    }

    window.mostrarPantalla('pantalla-ficha-alumno');
}

// Asignar funciones al objeto window
window.guardarAlumno = guardarAlumno;
window.cargarListaAlumnos = cargarListaAlumnos;
window.mostrarFichaAlumno = mostrarFichaAlumno;