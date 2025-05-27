// candidatosModule.js

window.cargarCandidatosExamen = function() {
    const lista = document.getElementById('lista-candidatos');
    if (!lista) {
        console.error('No se encontró el contenedor de la lista de candidatos');
        return;
    }

    lista.innerHTML = '';

    const candidatos = window.alumnos.filter(alumno => {
        const aptos = alumno.simulacros.filter(sim => sim.resultado === 'APTO').length;
        return aptos >= 5;
    });

    if (candidatos.length === 0) {
        lista.innerHTML = '<p>No hay candidatos disponibles.</p>';
        return;
    }

    candidatos.forEach(alumno => {
        const item = document.createElement('div');
        item.classList.add('item-candidato');
        item.innerHTML = `
            <strong>${alumno.nombre} ${alumno.apellido}</strong>
            <p>Simulacros aptos: ${alumno.simulacros.filter(sim => sim.resultado === 'APTO').length}</p>
        `;
        lista.appendChild(item);
    });
};

window.exportarListaCandidatos = function() {
    const candidatos = window.alumnos.filter(alumno => {
        const aptos = alumno.simulacros.filter(sim => sim.resultado === 'APTO').length;
        return aptos >= 5;
    });

    if (candidatos.length === 0) {
        window.mostrarNotificacion("No hay candidatos para exportar", "error");
        return;
    }

    const doc = new jspdf.jsPDF();
    doc.text("Lista de Candidatos a Examen", 10, 10);

    let y = 20;
    candidatos.forEach(alumno => {
        doc.text(`- ${alumno.nombre} ${alumno.apellido} (${alumno.simulacros.filter(sim => sim.resultado === 'APTO').length} aptos)`, 10, y);
        y += 10;
    });

    doc.save('CandidatosExamen.pdf');
};