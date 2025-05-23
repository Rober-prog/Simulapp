// EXPORTACIÓN A PDF
function exportarFichaAlumno() {
    if (!window.alumnoSeleccionado) {
        alert('Error: No hay alumno seleccionado');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('portrait', 'mm', 'a4');

    doc.setFillColor(0, 170, 255);
    doc.rect(0, 0, 210, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('FICHA DE ALUMNO', 105, 15, { align: 'center' });

    doc.setDrawColor(0, 170, 255);
    doc.setLineWidth(0.5);
    doc.roundedRect(15, 40, 180, 40, 3, 3);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS PERSONALES', 20, 50);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const nombreCompleto = `${window.alumnoSeleccionado.nombre} ${window.alumnoSeleccionado.apellido}`;
    doc.text(`Nombre: ${nombreCompleto}`, 25, 60);
    doc.text(`Número: ${window.alumnoSeleccionado.numero}`, 25, 70);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('SIMULACROS REALIZADOS', 105, 100, { align: 'center' });
    doc.setDrawColor(0, 170, 255);
    doc.setLineWidth(0.5);
    doc.line(15, 105, 195, 105);

    if (window.alumnoSeleccionado.simulacros.length === 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'italic');
        doc.text('No hay simulacros registrados', 105, 120, { align: 'center' });
    } else {
        let y = 115;
        window.alumnoSeleccionado.simulacros.forEach((simulacro, index) => {
            if (y > 250) {
                doc.addPage();
                y = 30;
            }

            const fechaSimulacro = new Date(simulacro.fecha);
            let resultado = 'APTO';
            let colorResultado = [46, 204, 113];
            if (simulacro.faltas.some(f => f.tipo === 'eliminatoria')) {
                resultado = 'NO APTO';
                colorResultado = [231, 76, 60];
            } else {
                const deficientes = simulacro.faltas.filter(f => f.tipo === 'deficiente').length;
                const leves = simulacro.faltas.filter(f => f.tipo === 'leve').length;
                if (deficientes >= 2 || leves >= 10) {
                    resultado = 'NO APTO';
                    colorResultado = [231, 76, 60];
                }
            }

            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.3);
            doc.roundedRect(20, y - 5, 170, 35, 2, 2);

            doc.setFillColor(0, 170, 255);
            doc.circle(30, y + 12, 8, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text((index + 1).toString(), 30, y + 12, { align: 'center' });

            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'normal');
            doc.text(`Fecha: ${fechaSimulacro.toLocaleDateString()}`, 45, y + 8);
            doc.text(`Hora: ${fechaSimulacro.toLocaleTimeString()}`, 120, y + 8);
            doc.text(`Duración: ${simulacro.duracion}`, 45, y + 18);

            doc.setTextColor(colorResultado[0], colorResultado[1], colorResultado[2]);
            doc.setFont('helvetica', 'bold');
            doc.text(`Resultado: ${resultado}`, 120, y + 18);

            y += 40;
        });
    }

    const totalPaginas = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPaginas; i++) {
        doc.setPage(i);
        doc.setTextColor(128, 128, 128);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text(`Página ${i} de ${totalPaginas}`, 105, 290, { align: 'center' });
    }

    // Mostrar PDF en nueva ventana (modo WebView compatible)
    const pdfData = doc.output('datauristring');
    const ventana = window.open('', '_blank');
    if (ventana) {
        ventana.document.write(`<iframe width='100%' height='100%' src='${pdfData}'></iframe>`);
    }
}

window.exportarFichaAlumno = exportarFichaAlumno;
