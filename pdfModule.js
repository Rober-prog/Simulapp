// EXPORTACIÓN A PDF
// Functions for exporting to PDF

function exportarFichaAlumno() {
    if (!window.alumnoSeleccionado) {
        alert('Error: No hay alumno seleccionado');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('portrait', 'mm', 'a4');
    
    // Add header with logo
    doc.setFillColor(0, 170, 255); // Color primario de la app
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('FICHA DE ALUMNO', 105, 15, { align: 'center' });
    
    // Datos del alumno - Marco decorativo
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
    
    // Sección de simulacros
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('SIMULACROS REALIZADOS', 105, 100, { align: 'center' });
    
    // Línea decorativa bajo el título
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
            // Si no hay espacio suficiente, nueva página
            if (y > 250) {
                doc.addPage();
                y = 30;
            }
            
            const fechaSimulacro = new Date(simulacro.fecha);
            
            // Determinar resultado y color
            let resultado = 'APTO';
            let colorResultado = [46, 204, 113]; // Verde para APTO
            
            if (simulacro.faltas.some(f => f.tipo === 'eliminatoria')) {
                resultado = 'NO APTO';
                colorResultado = [231, 76, 60]; // Rojo para NO APTO
            } else {
                const deficientes = simulacro.faltas.filter(f => f.tipo === 'deficiente').length;
                const leves = simulacro.faltas.filter(f => f.tipo === 'leve').length;
                
                if (deficientes >= 2 || leves >= 10) {
                    resultado = 'NO APTO';
                    colorResultado = [231, 76, 60];
                }
            }
            
            // Marco para cada simulacro
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.3);
            doc.roundedRect(20, y-5, 170, 35, 2, 2);
            
            // Número de simulacro con fondo
            doc.setFillColor(0, 170, 255);
            doc.circle(30, y+12, 8, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text((index + 1).toString(), 30, y+12, { align: 'center' });
            
            // Información del simulacro
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'normal');
            doc.text(`Fecha: ${fechaSimulacro.toLocaleDateString()}`, 45, y+8);
            doc.text(`Hora: ${fechaSimulacro.toLocaleTimeString()}`, 120, y+8);
            doc.text(`Duración: ${simulacro.duracion}`, 45, y+18);
            
            // Resultado con color
            doc.setTextColor(colorResultado[0], colorResultado[1], colorResultado[2]);
            doc.setFont('helvetica', 'bold');
            doc.text(`Resultado: ${resultado}`, 120, y+18);
            
            y += 40;
        });
    }
    
    // Pie de página
    const totalPaginas = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPaginas; i++) {
        doc.setPage(i);
        doc.setTextColor(128, 128, 128);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text(`Página ${i} de ${totalPaginas}`, 105, 290, { align: 'center' });
    }
    
    // Guardar PDF
    doc.save(`Ficha_${window.alumnoSeleccionado.apellido}_${window.alumnoSeleccionado.nombre}.pdf`);
}

function exportarInformeSimulacro() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('portrait', 'mm', 'a4');
    
    // Verificar simulacro y alumno
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
    
    // Determinar resultado
    let resultado = 'APTO';
    let colorResultado = [46, 204, 113]; // Verde para APTO
    let motivoNoApto = '';
    
    if (simulacro.faltas.some(f => f.tipo === 'eliminatoria')) {
        resultado = 'NO APTO';
        colorResultado = [231, 76, 60]; // Rojo para NO APTO
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
    
    // Cabecera con diseño
    doc.setFillColor(0, 170, 255);
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORME DE SIMULACRO', 105, 15, { align: 'center' });
    
    // Datos del alumno
    doc.setDrawColor(0, 170, 255);
    doc.setLineWidth(0.5);
    doc.roundedRect(15, 40, 180, 35, 3, 3);  
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS DEL ALUMNO', 20, 50);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre: ${alumno.nombre} ${alumno.apellido}`, 25, 60);
    doc.text(`Número: ${alumno.numero}`, 25, 70);
    
    // Datos del simulacro
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
    
    // Resultado con color
    doc.setTextColor(colorResultado[0], colorResultado[1], colorResultado[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`Resultado: ${resultado}`, 25, 140);
    
    if (motivoNoApto) {
        doc.text(`Motivo: ${motivoNoApto}`, 25, 150);
    }
    
    // Sección de faltas
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('FALTAS REGISTRADAS', 105, 170, { align: 'center' });
    
    // Línea decorativa
    doc.setDrawColor(0, 170, 255);
    doc.line(15, 175, 195, 175);
    
    let y = 185;  
    
    // Function for adding fault tables
    const agregarTablaFaltas = (faltas, titulo, posY) => {
        if (faltas.length === 0) return posY;
        
        // Check for page break
        if (posY > 250) {
            doc.addPage();
            posY = 30;
        }
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(titulo, 20, posY);
        posY += 8;  
    
        // Table header
        doc.setFillColor(240, 240, 240);
        doc.rect(20, posY, 170, 8, 'F');
        doc.setFontSize(10);
        doc.text('Código', 25, posY + 5);
        doc.text('Descripción', 45, posY + 5);  
        doc.text('Minuto', 170, posY + 5, { align: 'right' });
        posY += 8;
        
        // Table content
        doc.setFont('helvetica', 'normal');
        faltas.forEach((falta, i) => {
            if (posY > 270) {
                doc.addPage();
                posY = 30;
                // Repeat header on new page
                doc.setFillColor(240, 240, 240);
                doc.rect(20, posY, 170, 8, 'F');
                doc.setFont('helvetica', 'bold');
                doc.text('Código', 25, posY + 5);
                doc.text('Descripción', 45, posY + 5);
                doc.text('Minuto', 170, posY + 5, { align: 'right' });
                posY += 8;
                doc.setFont('helvetica', 'normal');
            }
            
            // Alternate row colors
            if (i % 2 === 0) {
                doc.setFillColor(250, 250, 250);
            } else {
                doc.setFillColor(245, 245, 245);
            }
            doc.rect(20, posY, 170, 7, 'F');
            
            // Handle long descriptions with text wrapping
            doc.text(falta.codigo, 25, posY + 5);
            
            // Split long descriptions into multiple lines if needed
            const maxWidth = 120;  
            const descripcionLines = doc.splitTextToSize(falta.descripcion, maxWidth);
            doc.text(descripcionLines, 45, posY + 5);
            
            doc.text(falta.minuto.toString(), 170, posY + 5, { align: 'right' });
            
            // Adjust row height based on number of description lines
            const rowHeight = Math.max(7, descripcionLines.length * 7);
            posY += rowHeight;
        });
        
        return posY + 10;  
    };
    
    // Agrupar y mostrar faltas por tipo
    const faltasLeves = simulacro.faltas.filter(f => f.tipo === 'leve');
    const faltasDeficientes = simulacro.faltas.filter(f => f.tipo === 'deficiente');
    const faltasEliminatorias = simulacro.faltas.filter(f => f.tipo === 'eliminatoria');
    
    if (faltasLeves.length > 0) {
        y = agregarTablaFaltas(faltasLeves, `Faltas Leves (${faltasLeves.length})`, y);
    }
    
    if (faltasDeficientes.length > 0) {
        y = agregarTablaFaltas(faltasDeficientes, `Faltas Deficientes (${faltasDeficientes.length})`, y);
    }
    
    if (faltasEliminatorias.length > 0) {
        y = agregarTablaFaltas(faltasEliminatorias, `Faltas Eliminatorias (${faltasEliminatorias.length})`, y);
    }
    
    // Observaciones si existen
    if (simulacro.observaciones && simulacro.observaciones.trim() !== '') {
        // Nueva página si no hay espacio suficiente
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
    
    // Pie de página en todas las páginas
    const totalPaginas = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPaginas; i++) {
        doc.setPage(i);
        doc.setTextColor(128, 128, 128);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text(`Página ${i} de ${totalPaginas}`, 105, 290, { align: 'center' });
    }
    
    // Guardar PDF
    const fecha = fechaSimulacro.toISOString().split('T')[0];
    doc.save(`Simulacro_${alumno.apellido}_${fecha}.pdf`);
}

// Make the functions available globally
window.exportarFichaAlumno = exportarFichaAlumno;
window.exportarInformeSimulacro = exportarInformeSimulacro;