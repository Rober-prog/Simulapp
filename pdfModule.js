// PDF MODULE
// Funciones para exportar a PDF

function exportarFichaAlumno() {
    if (!window.alumnoSeleccionado) {
        alert('No hay alumno seleccionado.');
        return;
    }

    const { numero, nombre, apellido, simulacrosAptos } = window.alumnoSeleccionado;

    const doc = new jspdf.jsPDF();
    doc.setFontSize(16);
    doc.text('Ficha del Alumno', 105, 20, null, null, 'center');

    doc.setFontSize(12);
    doc.text(`Número: ${numero}`, 20, 40);
    doc.text(`Nombre: ${nombre}`, 20, 50);
    doc.text(`Apellido: ${apellido}`, 20, 60);
    doc.text(`Simulacros APTOS: ${simulacrosAptos || 0}`, 20, 70);

    doc.save(`Ficha_${nombre}_${apellido}.pdf`);
}

function exportarInformeSimulacro() {
    if (!window.simulacroActual) {
        alert('No hay simulacro en curso.');
        return;
    }

    const { alumno, faltas } = window.simulacroActual;
    const doc = new jspdf.jsPDF();

    doc.setFontSize(16);
    doc.text('Informe de Simulacro', 105, 20, null, null, 'center');

    doc.setFontSize(12);
    doc.text(`Alumno: ${alumno.nombre} ${alumno.apellido}`, 20, 40);
    doc.text(`Número: ${alumno.numero}`, 20, 50);

    doc.autoTable({
        startY: 60,
        head: [['Código', 'Descripción', 'Tipo', 'Minuto']],
        body: faltas.map(f => [f.codigo, f.descripcion, f.tipo, f.minuto])
    });

    doc.save(`Informe_${alumno.nombre}_${alumno.apellido}.pdf`);
}

function exportarListaCandidatos() {
    const candidatos = window.obtenerCandidatos() || [];

    if (candidatos.length === 0) {
        alert('No hay candidatos para exportar.');
        return;
    }

    const doc = new jspdf.jsPDF();
    doc.setFontSize(16);
    doc.text('Lista de Candidatos a Examen', 105, 20, null, null, 'center');

    doc.autoTable({
        startY: 40,
        head: [['Número', 'Nombre', 'Apellido', 'Simulacros APTOS']],
        body: candidatos.map(c => [c.numero, c.nombre, c.apellido, c.simulacrosAptos])
    });

    doc.save('Candidatos_Examen.pdf');
}

// Hacer funciones globales
window.exportarFichaAlumno = exportarFichaAlumno;
window.exportarInformeSimulacro = exportarInformeSimulacro;
window.exportarListaCandidatos = exportarListaCandidatos;