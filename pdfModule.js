function exportarFichaAlumno() {
    if (!window.alumnoSeleccionado) {
        alert('Error: No hay alumno seleccionado');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Ficha de: ${window.alumnoSeleccionado.nombre} ${window.alumnoSeleccionado.apellido}`, 20, 20);
    doc.text(`Número: ${window.alumnoSeleccionado.numero}`, 20, 30);

    let y = 50;
    doc.setFontSize(14);
    doc.text("Simulacros Realizados", 20, y);

    y += 10;

    if (window.alumnoSeleccionado.simulacros.length === 0) {
        doc.setFontSize(12);
        doc.text("No hay simulacros registrados", 20, y);
    } else {
        window.alumnoSeleccionado.simulacros.forEach((simulacro, i) => {
            const fecha = new Date(simulacro.fecha);
            doc.setFontSize(12);
            doc.text(`${i + 1}. Fecha: ${fecha.toLocaleDateString()} - Resultado: ${simulacro.resultado || 'APTO/NO APTO'}`, 20, y);
            y += 10;
        });
    }

    // Convertir a blob y mostrar en WebView
    doc.output('blob').then(function (blob) {
        const blobUrl = URL.createObjectURL(blob);
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.src = blobUrl;

        const nuevaVentana = window.open();
        if (nuevaVentana) {
            nuevaVentana.document.body.style.margin = '0';
            nuevaVentana.document.body.appendChild(iframe);
        } else {
            alert("No se pudo abrir el PDF. Asegúrate de que tu WebView permite ventanas emergentes.");
        }
    });
}

window.exportarFichaAlumno = exportarFichaAlumno;

