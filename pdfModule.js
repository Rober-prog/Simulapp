// EXPORTACIÓN A PDF
// Functions for exporting to PDF

// Function to save PDF to localStorage
function savePdfToLocalStorage(pdfBlob, fileName) {
    try {
        // Convert blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(pdfBlob);
        reader.onloadend = function() {
            const base64data = reader.result;
            
            // Get or create simulacros folder in localStorage
            let simulacros = JSON.parse(localStorage.getItem('simulacros') || '{}');
            
            // Add the PDF to the folder with timestamp and simulation date if available
            const simulationDate = window.simulacroActual ? new Date(window.simulacroActual.fecha) : new Date();
            
            simulacros[fileName] = {
                data: base64data,
                date: new Date().toISOString(),
                simulationDate: simulationDate.toISOString()
            };
            
            // Save back to localStorage
            localStorage.setItem('simulacros', JSON.stringify(simulacros));
            
            // Refresh the PDF library if we're on that screen
            if (!document.getElementById('pantalla-biblioteca-pdf').classList.contains('oculto')) {
                cargarBibliotecaPDF();
            }
        };
    } catch (error) {
        console.error('Error saving PDF to localStorage:', error);
        mostrarNotificacionWebView('Error al guardar PDF');
    }
}

function exportarFichaAlumno() {
    if (!window.alumnoSeleccionado) {
        mostrarNotificacionWebView('Error: No hay alumno seleccionado');
        return;
    }
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('portrait', 'mm', 'a4');
        
        // Add header with logo
        doc.setFillColor(0, 170, 255); // Color primario de la app
        doc.rect(0, 0, 210, 30, 'F');
        
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
        
        // Use blob for WebView compatibility
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        // Save to localStorage
        const fileName = `Ficha_${window.alumnoSeleccionado.apellido}_${window.alumnoSeleccionado.nombre}.pdf`;
        savePdfToLocalStorage(pdfBlob, fileName);
        
        // Create an anchor and trigger download
        const downloadLink = document.createElement('a');
        downloadLink.href = pdfUrl;
        downloadLink.download = fileName;
        downloadLink.click();
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
        
        mostrarNotificacionWebView('Informe PDF creado');
    } catch (error) {
        console.error('Error generando PDF:', error);
        mostrarNotificacionWebView('Error al generar el PDF');
    }
}

function exportarInformeSimulacro() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('portrait', 'mm', 'a4');
        
        // Verificar simulacro y alumno
        let simulacro = window.simulacroActual;
        let alumno = window.alumnoSeleccionado;
        
        if (!simulacro || !alumno) {
            const contenidoInforme = document.getElementById('contenido-informe');
            const idSimulacro = contenidoInforme.dataset.simulacroId;
            
            if (!idSimulacro) {
                mostrarNotificacionWebView('Error: No se pudo identificar el simulacro');
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
            mostrarNotificacionWebView('Error: No se pudo generar el informe');
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
        
        // Use blob for WebView compatibility
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        // Save to localStorage
        const fileName = `Simulacro_${alumno.apellido}_${alumno.nombre}_${new Date().toISOString().split('T')[0]}.pdf`;
        savePdfToLocalStorage(pdfBlob, fileName);
        
        // Create an anchor and trigger download
        const downloadLink = document.createElement('a');
        downloadLink.href = pdfUrl;
        downloadLink.download = fileName;
        downloadLink.click();
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
        
        mostrarNotificacionWebView('Informe PDF creado');
    } catch (error) {
        console.error('Error generando PDF:', error);
        mostrarNotificacionWebView('Error al generar el PDF');
    }
}

// Function to list saved PDFs
function listarPDFsGuardados() {
    try {
        const simulacros = JSON.parse(localStorage.getItem('simulacros') || '{}');
        return Object.keys(simulacros).map(fileName => ({
            fileName,
            date: new Date(simulacros[fileName].date),
            simulationDate: simulacros[fileName].simulationDate ? new Date(simulacros[fileName].simulationDate) : null
        }));
    } catch (error) {
        console.error('Error listing saved PDFs:', error);
        return [];
    }
}

// Function to get a specific PDF
function obtenerPDFGuardado(fileName) {
    try {
        const simulacros = JSON.parse(localStorage.getItem('simulacros') || '{}');
        return simulacros[fileName]?.data || null;
    } catch (error) {
        console.error('Error getting saved PDF:', error);
        return null;
    }
}

// Function to delete a PDF
function eliminarPDFGuardado(fileName) {
    try {
        const simulacros = JSON.parse(localStorage.getItem('simulacros') || '{}');
        if (simulacros[fileName]) {
            delete simulacros[fileName];
            localStorage.setItem('simulacros', JSON.stringify(simulacros));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error deleting PDF:', error);
        return false;
    }
}

// Function to load PDF library
function cargarBibliotecaPDF() {
    const listaPDFs = document.getElementById('lista-pdfs');
    listaPDFs.innerHTML = '';
    
    const pdfs = listarPDFsGuardados();
    
    if (pdfs.length === 0) {
        listaPDFs.innerHTML = '<p class="no-resultados">No hay PDFs guardados</p>';
        return;
    }
    
    // Sort by date (newest first)
    pdfs.sort((a, b) => b.date - a.date);
    
    pdfs.forEach(pdf => {
        const itemPDF = document.createElement('div');
        itemPDF.className = 'item-lista pdf-item';
        
        // Use simulationDate if available, otherwise fallback to storage date
        const displayDate = pdf.simulationDate ? pdf.simulationDate : pdf.date;
        const fecha = displayDate.toLocaleDateString();
        const hora = displayDate.toLocaleTimeString();
        
        // Extract and format the display name to follow Simulacro_apellido_nombre pattern if possible
        let displayName = pdf.fileName;
        if (displayName.startsWith('Simulacro_') && displayName.includes('_')) {
            const nameParts = displayName.split('_');
            if (nameParts.length >= 3) {
                // Keep the pattern but ensure it displays correctly
                displayName = `Simulacro_${nameParts[1]}_${nameParts[2].split('.')[0]}`;
            }
        }
        
        itemPDF.innerHTML = `
            <div class="item-contenido">
                <div class="pdf-details">
                    <h3 title="${pdf.fileName}">${displayName}</h3>
                    <p>Fecha: ${fecha} - Hora: ${hora}</p>
                </div>
            </div>
            <div class="item-acciones">
                <button class="btn-ver-pdf" data-filename="${pdf.fileName}" title="Ver PDF">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    <span class="action-text">Ver</span>
                </button>
                <button class="btn-descargar-pdf" data-filename="${pdf.fileName}" title="Descargar PDF">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    <span class="action-text">Descargar</span>
                </button>
                <button class="btn-eliminar-pdf" data-filename="${pdf.fileName}" title="Eliminar PDF">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    <span class="action-text">Eliminar</span>
                </button>
            </div>
        `;
        
        listaPDFs.appendChild(itemPDF);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.btn-ver-pdf').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const fileName = e.currentTarget.dataset.filename;
            abrirPDF(fileName);
        });
    });
    
    document.querySelectorAll('.btn-descargar-pdf').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const fileName = e.currentTarget.dataset.filename;
            descargarPDF(fileName);
        });
    });
    
    document.querySelectorAll('.btn-eliminar-pdf').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const fileName = e.currentTarget.dataset.filename;
            confirmarEliminarPDF(fileName);
        });
    });
}

function filtrarPDFs() {
    const textoBusqueda = document.getElementById('input-buscar-pdf').value.toLowerCase();
    const listaPDFs = document.getElementById('lista-pdfs');
    listaPDFs.innerHTML = '';
    
    const pdfs = listarPDFsGuardados();
    
    if (pdfs.length === 0) {
        listaPDFs.innerHTML = '<p class="no-resultados">No hay PDFs guardados</p>';
        return;
    }
    
    const pdfsFiltrados = pdfs.filter(pdf => 
        pdf.fileName.toLowerCase().includes(textoBusqueda)
    );
    
    if (pdfsFiltrados.length === 0) {
        listaPDFs.innerHTML = '<p class="no-resultados">No se encontraron resultados</p>';
        return;
    }
    
    // Sort by date (newest first)
    pdfsFiltrados.sort((a, b) => b.date - a.date);
    
    pdfsFiltrados.forEach(pdf => {
        const itemPDF = document.createElement('div');
        itemPDF.className = 'item-lista pdf-item';
        
        // Use simulationDate if available, otherwise fallback to storage date
        const displayDate = pdf.simulationDate ? pdf.simulationDate : pdf.date;
        const fecha = displayDate.toLocaleDateString();
        const hora = displayDate.toLocaleTimeString();
        
        // Extract and format the display name to follow Simulacro_apellido_nombre pattern if possible
        let displayName = pdf.fileName;
        if (displayName.startsWith('Simulacro_') && displayName.includes('_')) {
            const nameParts = displayName.split('_');
            if (nameParts.length >= 3) {
                // Keep the pattern but ensure it displays correctly
                displayName = `Simulacro_${nameParts[1]}_${nameParts[2].split('.')[0]}`;
            }
        }
        
        itemPDF.innerHTML = `
            <div class="item-contenido">
                <div class="pdf-details">
                    <h3 title="${pdf.fileName}">${displayName}</h3>
                    <p>Fecha: ${fecha} - Hora: ${hora}</p>
                </div>
            </div>
            <div class="item-acciones">
                <button class="btn-ver-pdf" data-filename="${pdf.fileName}" title="Ver PDF">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    <span class="action-text">Ver</span>
                </button>
                <button class="btn-descargar-pdf" data-filename="${pdf.fileName}" title="Descargar PDF">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    <span class="action-text">Descargar</span>
                </button>
                <button class="btn-eliminar-pdf" data-filename="${pdf.fileName}" title="Eliminar PDF">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    <span class="action-text">Eliminar</span>
                </button>
            </div>
        `;
        
        listaPDFs.appendChild(itemPDF);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.btn-ver-pdf').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const fileName = e.currentTarget.dataset.filename;
            abrirPDF(fileName);
        });
    });
    
    document.querySelectorAll('.btn-descargar-pdf').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const fileName = e.currentTarget.dataset.filename;
            descargarPDF(fileName);
        });
    });
    
    document.querySelectorAll('.btn-eliminar-pdf').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const fileName = e.currentTarget.dataset.filename;
            confirmarEliminarPDF(fileName);
        });
    });
}

// Function to open PDF in new tab
function abrirPDF(fileName) {
    const pdfData = obtenerPDFGuardado(fileName);
    if (pdfData) {
        const newTab = window.open();
        newTab.document.write(`
            <html>
                <head>
                    <title>${fileName}</title>
                    <style>
                        body, html {
                            margin: 0;
                            padding: 0;
                            height: 100%;
                            overflow: hidden;
                        }
                        iframe {
                            width: 100%;
                            height: 100%;
                            border: none;
                        }
                    </style>
                </head>
                <body>
                    <iframe src="${pdfData}" width="100%" height="100%"></iframe>
                </body>
            </html>
        `);
    } else {
        mostrarNotificacionWebView('Error al abrir el PDF');
    }
}

// Function to download PDF
function descargarPDF(fileName) {
    const pdfData = obtenerPDFGuardado(fileName);
    if (pdfData) {
        const link = document.createElement('a');
        link.href = pdfData;
        link.download = fileName;
        link.click();
    } else {
        mostrarNotificacionWebView('Error al descargar el PDF');
    }
}

// Function to confirm and delete PDF
function confirmarEliminarPDF(fileName) {
    confirmarAccion(`¿Estás seguro de eliminar el PDF "${fileName}"?`).then(confirmado => {
        if (confirmado) {
            if (eliminarPDFGuardado(fileName)) {
                mostrarNotificacionWebView('PDF eliminado correctamente');
                cargarBibliotecaPDF();
            } else {
                mostrarNotificacionWebView('Error al eliminar el PDF');
            }
        }
    });
}

// Make functions available globally
window.exportarFichaAlumno = exportarFichaAlumno;
window.exportarInformeSimulacro = exportarInformeSimulacro;
window.listarPDFsGuardados = listarPDFsGuardados;
window.obtenerPDFGuardado = obtenerPDFGuardado;
window.cargarBibliotecaPDF = cargarBibliotecaPDF;
window.filtrarPDFs = filtrarPDFs;
window.abrirPDF = abrirPDF;
window.descargarPDF = descargarPDF;
window.confirmarEliminarPDF = confirmarEliminarPDF;
window.eliminarPDFGuardado = eliminarPDFGuardado;
window.savePdfToLocalStorage = savePdfToLocalStorage;

// Export all functions
export {
    exportarFichaAlumno,
    exportarInformeSimulacro,
    savePdfToLocalStorage,
    listarPDFsGuardados,
    obtenerPDFGuardado,
    eliminarPDFGuardado,
    cargarBibliotecaPDF,
    filtrarPDFs,
    abrirPDF,
    descargarPDF,
    confirmarEliminarPDF
};