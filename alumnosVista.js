// alumnosVista.js
window.mostrarFichaAlumno = function(alumno) {
    if (!alumno) {
        console.error('No se proporcionó un alumno válido.');
        return;
    }

    window.alumnoSeleccionado = alumno;

    const datosAlumno = document.getElementById('datos-alumno');
    if (!datosAlumno) {
        console.error('No se encontró el contenedor de la ficha del alumno.');
        return;
    }

    datosAlumno.innerHTML = `
        <p><strong>Número:</strong> ${alumno.numero}</p>
        <p><strong>Nombre:</strong> ${alumno.nombre}</p>
        <p><strong>Apellido:</strong> ${alumno.apellido}</p>
    `;

    const listaSimulacros = document.getElementById('lista-simulacros');
    if (listaSimulacros) {
        listaSimulacros.innerHTML = '';

        if (alumno.simulacros && alumno.simulacros.length > 0) {
            alumno.simulacros.forEach((simulacro, index) => {
                const item = document.createElement('div');
                item.classList.add('item-simulacro');
                item.innerHTML = `
                    <p>Simulacro ${index + 1}: ${simulacro.resultado || 'Sin resultado'}</p>
                    <p>Faltas: Leves(${simulacro.leves || 0}), Deficientes(${simulacro.deficientes || 0}), Eliminatorias(${simulacro.eliminatorias || 0})</p>
                `;
                listaSimulacros.appendChild(item);
            });
        } else {
            listaSimulacros.innerHTML = '<p>No hay simulacros registrados.</p>';
        }
    }

    window.mostrarPantalla('pantalla-ficha-alumno');
};