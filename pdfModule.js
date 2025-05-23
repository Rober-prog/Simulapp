function exportarFichaAlumno() {
    if (!window.alumnoSeleccionado) {
        alert('No hay alumno seleccionado');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Generar contenido del PDF
    doc.setFontSize(18);
    doc.text("Ficha del Alumno", 20, 20);

    const alumno = window.alumnoSeleccionado;
    doc.setFontSize(12);
    doc.text(`Nombre: ${alumno.nombre} ${alumno.apellido}`, 20, 40);
    doc.text(`Número: ${alumno.numero}`, 20, 50);

    doc.setFontSize(14);
    doc.text("Simulacros:", 20, 70);
    let y = 80;
    alumno.simulacros.forEach((sim, i) => {
        const fecha = new Date(sim.fecha);
        doc.text(`${i + 1}. ${fecha.toLocaleDateString()} - ${sim.resultado || 'Resultado desconocido'}`, 20, y);
        y += 10;
    });

    // Crear blob y simular descarga en WebView
    doc.output('blob').then(function (blob) {
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `Ficha_${alumno.apellido}_${alumno.nombre}.pdf`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
    });
}

window.exportarFichaAlumno = exportarFichaAlumno;


