// AÑADIDO PARA WEBVIEW ANDROID: compatibilidad con jsPDF
const { jsPDF } = window.jspdf;

// EXPORTACIÓN A PDF
// Functions for exporting to PDF

function exportarFichaAlumno() {
    if (!window.alumnoSeleccionado) {
        alert('Error: No hay alumno seleccionado');
        return;
    }

    const doc = new jsPDF('portrait', 'mm', 'a4');

    // Cabecera
    doc.setFillColor(0, 170, 255);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('FICHA DE ALUMNO', 105, 15, { align: 'center' });

    // Datos personales
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

    // Título simulacros
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

            doc.setTextColor(...colorResultado);
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

    doc.save(`Ficha_${window.alumnoSeleccionado.apellido}_${window.alumnoSeleccionado.nombre}.pdf`);
}

function exportarInformeSimulacro() {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    let simulacro = window.simulacroActual;
    let alumno = window.alumnoSeleccionado;

    if (!simulacro || !alumno) {
        const contenidoInforme = document.getElementById('contenido-informe');
        const idSimulacro = contenidoInforme.dataset.simulacroId;
        if (!idSimulacro) {
            alert('Error: No se pudo identificar el simulacro');
            return;
        }

        const alumnos = window.obtenerAlumnosBD();
        for (const a of alumnos) {
            const sim = a.simulacros.find(s => s.id === idSimulacro);
            if (sim) {
                simulacro = sim;
                alumno = a;
                break;
            }
        }
    }

    if (!simulacro || !alumno) {
        alert('Error: No se pudo generar el informe');
        return;
    }

    let resultado = 'APTO';
    let colorResultado = [46, 204, 113];
    let motivoNoApto = '';

    if (simulacro.faltas.some(f => f.tipo === 'eliminatoria')) {
        resultado = 'NO APTO';
        colorResultado = [231, 76, 60];
        motivoNoApto = 'Falta eliminatoria detectada';
    } else {
        const deficientes = simulacro.faltas.filter(f => f.tipo === 'deficiente').length;
        const leves = simulacro.faltas.filter(f => f.tipo === 'leve').length;
        if (deficientes >= 2) {
            resultado = 'NO APTO';
            colorResultado = [231, 76, 60];
            motivoNoApto = '2 o más faltas deficientes';
        } else if (leves >= 10) {
            resultado = 'NO APTO';
            colorResultado = [231, 76, 60];
            motivoNoApto = '10 o más faltas leves';
        }
    }

    doc.setFillColor(0, 170, 255);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORME DE SIMULACRO', 105, 15, { align: 'center' });

    doc.setDrawColor(0, 170, 255);
    doc.roundedRect(15, 40, 180, 35, 3, 3);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS DEL ALUMNO', 20, 50);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre: ${alumno.nombre} ${alumno.apellido}`, 25, 60);
    doc.text(`Número: ${alumno.numero}`, 25, 70);

    doc.roundedRect(15, 85, 180, 70, 3, 3);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS DEL SIMULACRO', 20, 95);
    const fechaSimulacro = new Date(simulacro.fecha);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha: ${fechaSimulacro.toLocaleDateString()}`, 25, 110);
    doc.text(`Hora de inicio: ${fechaSimulacro.toLocaleTimeString()}`, 25, 120);
    doc.text(`Duración: ${simulacro.duracion}`, 25, 130);
    doc.setTextColor(...colorResultado);
    doc.setFont('helvetica', 'bold');
    doc.text(`Resultado: ${resultado}`, 25, 140);
    if (motivoNoApto) doc.text(`Motivo: ${motivoNoApto}`, 25, 150);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('FALTAS REGISTRADAS', 105, 170, { align: 'center' });
    doc.setDrawColor(0, 170, 255);
    doc.line(15, 175, 195, 175);

    let y = 185;

    const agregarTablaFaltas = (faltas, titulo, posY) => {
        if (faltas.length === 0) return posY;
        if (posY > 250) {
            doc.addPage();
            posY = 30;
        }
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(titulo, 20, posY);
        posY += 8;
        doc.setFillColor(240, 240, 240);
        doc.rect(20, posY, 170, 8, 'F');
        doc.setFontSize(10);
        doc.text('Código', 25, posY + 5);
        doc.text('Descripción', 45, posY + 5);
        doc.text('Minuto', 170, posY + 5, { align: 'right' });
        posY += 8;
        doc.setFont('helvetica', 'normal');

        faltas.forEach((falta, i) => {
            if (posY > 270) {
                doc.addPage();
                posY = 30;
                doc.setFillColor(240, 240, 240);
                doc.rect(20, posY, 170, 8, 'F');
                doc.setFont('helvetica', 'bold');
                doc.text('Código', 25, posY + 5);
                doc.text('Descripción', 45, posY + 5);
                doc.text('Minuto', 170, posY + 5, { align: 'right' });
                posY += 8;
                doc.setFont('helvetica', 'normal');
            }

            doc.setFillColor(i % 2 === 0 ? 250 : 245, 245, 245);
            doc.rect(20, posY, 170, 7, 'F');
            doc.text(falta.codigo, 25, posY + 5);
            const descripcionLines = doc.splitTextToSize(falta.descripcion, 120);
            doc.text(descripcionLines, 45, posY + 5);
            doc.text(falta.minuto.toString(), 170, posY + 5, { align: 'right' });
            posY += Math.max(7, descripcionLines.length * 7);
        });

        return posY + 10;
    };

    y = agregarTablaFaltas(simulacro.faltas.filter(f => f.tipo === 'leve'), `Faltas Leves`, y);
    y = agregarTablaFaltas(simulacro.faltas.filter(f => f.tipo === 'deficiente'), `Faltas Deficientes`, y);
    y = agregarTablaFaltas(simulacro.faltas.filter(f => f.tipo === 'eliminatoria'), `Faltas Eliminatorias`, y);

    if (simulacro.observaciones?.trim()) {
        if (y > 230) {
            doc.addPage();
            y = 30;
        }
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('OBSERVACIONES', 20, y);
        y += 10;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const observaciones = doc.splitTextToSize(simulacro.observaciones, 170);
        doc.text(observaciones, 20, y);
    }

    const totalPaginas = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPaginas; i++) {
        doc.setPage(i);
        doc.setTextColor(128, 128, 128);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text(`Página ${i} de ${totalPaginas}`, 105, 290, { align: 'center' });
    }

    const fecha = fechaSimulacro.toISOString().split('T')[0];
    doc.save(`Simulacro_${alumno.apellido}_${fecha}.pdf`);
}

// Exportar funciones globalmente
window.exportarFichaAlumno = exportarFichaAlumno;
window.exportarInformeSimulacro = exportarInformeSimulacro;
