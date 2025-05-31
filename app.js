// MAIN APPLICATION
// This is the main entry point that initializes the application

import { guardarAlumno, cargarListaAlumnos, filtrarAlumnos, mostrarFichaAlumno, cargarCandidatosExamen, filtrarCandidatos } from './alumnosModule.js';
import { inicializarBD, obtenerAlumnosBD as appObtenerAlumnosBD } from './db.js'; 
import { mostrarPantalla, volverPantallaAnterior } from './navigation.js';
import { prepararSimulacro, iniciarSimulacro, finalizarSimulacro, mostrarResultadoFinal, cambiarTabFaltas, mostrarInformeSimulacro } from './simulacroModule.js';
import { inicializarCatalogoFaltas, cargarCatalogoFaltas } from './catalogoFaltas.js';
import { inicializarGestionFaltas } from './faltasModule.js';
// window.esSimulacroApto será cargado desde candidatosModule y estará disponible globalmente

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the database
    inicializarBD();
    
    // Initialize fault catalog
    console.log('Initializing fault catalog...');
    inicializarCatalogoFaltas();
    
    // Initialize fault management
    try {
        inicializarGestionFaltas();
        console.log('Fault management initialized');
    } catch (error) {
        console.error('Error initializing fault management:', error);
    }
    
    // Setup navigation and events
    setupEventListeners();

    // Add this line to ensure catalog is loaded correctly
    const faltas = cargarCatalogoFaltas();
    console.log(`Loaded ${faltas.length} faults from catalog`);
});

// Global variables for the application
let alumnoSeleccionado = null;
window.alumnoSeleccionado = null; 
let simulacroActual = null;

// Simple event listeners setup
function setupEventListeners() {
    // Welcome screen ENTRAR button - Updated logic
    const btnEntrar = document.getElementById('btn-entrar');
    if (btnEntrar) {
        btnEntrar.addEventListener('click', () => {
            // Hide welcome screen
            const welcomeScreen = document.getElementById('pantalla-bienvenida');
            welcomeScreen.classList.add('oculto');
            welcomeScreen.style.display = 'none';
            
            // Show menu screen
            const menuScreen = document.getElementById('pantalla-menu');
            menuScreen.classList.remove('oculto');
            menuScreen.style.display = 'block';
            
            // Update navigation history
            if (window.historialPantallas) {
                window.historialPantallas = ['pantalla-menu'];
            }
        });
    } else {
        console.error("Button 'btn-entrar' not found");
    }

    // Menú principal
    const btnAnadirAlumno = document.getElementById('btn-anadir-alumno');
    if (btnAnadirAlumno) {
        btnAnadirAlumno.addEventListener('click', () => {
            // Resetear formulario por si se viene de una edición
            const numeroAlumnoInput = document.getElementById('numero-alumno');
            const nombreAlumno = document.getElementById('nombre-alumno');
            const apellidoAlumno = document.getElementById('apellido-alumno');
            
            if (numeroAlumnoInput) numeroAlumnoInput.value = '';
            if (nombreAlumno) nombreAlumno.value = '';
            if (apellidoAlumno) apellidoAlumno.value = '';
            
            const btnGuardar = document.getElementById('btn-guardar-alumno');
            if (btnGuardar) {
                btnGuardar.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                    Guardar Alumno
                `;
                btnGuardar.dataset.modo = 'nuevo';
                btnGuardar.removeAttribute('data-id');
            }
            
            mostrarPantalla('pantalla-anadir-alumno');
        });
    } else {
        console.error("Button 'btn-anadir-alumno' not found. Add student functionality might not work.");
    }
    
    const btnBuscarAlumno = document.getElementById('btn-buscar-alumno');
    if (btnBuscarAlumno) {
        btnBuscarAlumno.addEventListener('click', () => {
            mostrarPantalla('pantalla-buscar-alumno');
            window.cargarListaAlumnos();
        });
    } else {
        console.error("Button 'btn-buscar-alumno' not found. Search student functionality might not work.");
    }
    
    const btnCandidatos = document.getElementById('btn-candidatos');
    if (btnCandidatos) {
        btnCandidatos.addEventListener('click', () => {
            mostrarPantalla('pantalla-candidatos');
            window.cargarCandidatosExamen();
        });
    } else {
        console.error("Button 'btn-candidatos' not found. Candidates functionality might not work.");
    }
    
    // Formulario añadir alumno
    const btnGuardarAlumno = document.getElementById('btn-guardar-alumno');
    if (btnGuardarAlumno) {
        btnGuardarAlumno.addEventListener('click', guardarAlumno);
    } else {
        console.error("Button 'btn-guardar-alumno' not found. Save student functionality might not work.");
    }

    // Input validation for numero-alumno
    const numeroAlumnoInput = document.getElementById('numero-alumno');
    if (numeroAlumnoInput) {
        numeroAlumnoInput.addEventListener('input', function(event) {
            // Allow only numbers
            event.target.value = event.target.value.replace(/[^\d]/g, '');
            
            // Limit to 5 digits
            if (event.target.value && event.target.value.length > 5) {
                event.target.value = event.target.value.slice(0, 5);
            }
        });
    }

    // Input validation for nombre-alumno and apellido-alumno
    const nombreAlumnoInput = document.getElementById('nombre-alumno');
    const apellidoAlumnoInput = document.getElementById('apellido-alumno');

    const validateNameInput = (event) => {
        // Allow only letters and spaces, including Spanish characters
        event.target.value = event.target.value
            .replace(/[^A-Za-zÁáÉéÍíÓóÚúÑñ\s]/g, '')
            .replace(/\s+/g, ' '); // Prevent multiple consecutive spaces
    };

    if (nombreAlumnoInput) {
        nombreAlumnoInput.addEventListener('input', validateNameInput);
    }
    if (apellidoAlumnoInput) {
        apellidoAlumnoInput.addEventListener('input', validateNameInput);
    }
    
    // Búsqueda de alumnos
    const inputBuscar = document.getElementById('input-buscar');
    if (inputBuscar) {
        inputBuscar.addEventListener('input', filtrarAlumnos);
    } else {
        console.error("Input 'input-buscar' not found. Search student functionality might not work.");
    }
    
    // Búsqueda de candidatos
    const inputBuscarCandidato = document.getElementById('input-buscar-candidato');
    if (inputBuscarCandidato) {
        inputBuscarCandidato.addEventListener('input', filtrarCandidatos);
    } else {
        console.error("Input 'input-buscar-candidato' not found. Search candidates functionality might not work.");
    }
    
    // Configurar faltas
    const btnConfigurarFaltas = document.getElementById('btn-configurar-faltas');
    if (btnConfigurarFaltas) {
        btnConfigurarFaltas.addEventListener('click', () => {
            mostrarPantalla('pantalla-config-faltas');
            inicializarGestionFaltas(); // This already calls cargarYMostrarFaltas
        });
    } else {
        console.error("Button 'btn-configurar-faltas' not found. Fault configuration functionality might not work.");
    }
    
    // Eventos de la ficha del alumno
    const btnNuevoSimulacro = document.getElementById('btn-nuevo-simulacro');
    if (btnNuevoSimulacro) {
        btnNuevoSimulacro.addEventListener('click', prepararSimulacro);
    } else {
        console.error("Button 'btn-nuevo-simulacro' not found. New simulation functionality might not work.");
    }
    
    const btnExportarFicha = document.getElementById('btn-exportar-ficha');
    if (btnExportarFicha) {
        // Ensure exportarFichaAlumno is available from pdfModule via window
        btnExportarFicha.addEventListener('click', () => {
            if (window.exportarFichaAlumno) {
                window.exportarFichaAlumno();
            } else {
                console.error("exportarFichaAlumno is not defined on window");
            }
        });
    } else {
        console.error("Button 'btn-exportar-ficha' not found. Export student file functionality might not work.");
    }
    
    // Simulacro - Improve tab handling with clear active class setting
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn) {
            btn.addEventListener('click', cambiarTabFaltas);  
        } else {
            console.error("Button '.tab-btn' not found. Tab functionality might not work.");
        }
    });
    
    const btnIniciarPrueba = document.getElementById('btn-iniciar-prueba');
    if (btnIniciarPrueba) {
        btnIniciarPrueba.addEventListener('click', iniciarSimulacro);
    } else {
        console.error("Button 'btn-iniciar-prueba' not found. Start test functionality might not work.");
    }
    
    // Simulacro - Mejorar la manipulación de botones
    const btnFinalizarSimulacro = document.getElementById('btn-finalizar-simulacro');
    if (btnFinalizarSimulacro) {
        // Replace existing listeners to prevent duplicates
        const nuevoBoton = btnFinalizarSimulacro.cloneNode(true);
        btnFinalizarSimulacro.parentNode.replaceChild(nuevoBoton, btnFinalizarSimulacro);
        nuevoBoton.addEventListener('click', finalizarSimulacro);
    } else {
        console.error("Button 'btn-finalizar-simulacro' not found. Finish simulation functionality might not work.");
    }
    
    // Informe
    const btnExportarInforme = document.getElementById('btn-exportar-informe');
    if (btnExportarInforme) {
         // Ensure exportarInformeSimulacro is available from pdfModule via window
        btnExportarInforme.addEventListener('click', () => {
            if (window.exportarInformeSimulacro) {
                window.exportarInformeSimulacro();
            } else {
                console.error("exportarInformeSimulacro is not defined on window");
            }
        });
    } else {
        console.error("Button 'btn-exportar-informe' not found. Export report functionality might not work.");
    }
    
    const btnVolverFicha = document.getElementById('btn-volver-ficha');
    if (btnVolverFicha) {
        btnVolverFicha.addEventListener('click', () => {
            if (window.alumnoSeleccionado) {
                window.mostrarFichaAlumno(window.alumnoSeleccionado);
            } else {
                mostrarNotificacion('Error al volver a la ficha del alumno', 'error');
                mostrarPantalla('pantalla-menu');
            }
        });
    } else {
        console.error("Button 'btn-volver-ficha' not found. Go back to student file functionality might not work.");
    }
    
    const btnVerResultado = document.getElementById('btn-ver-resultado');
    if (btnVerResultado) {
        btnVerResultado.addEventListener('click', mostrarResultadoFinal);
    } else {
        console.error("Button 'btn-ver-resultado' not found. View result functionality might not work.");
    }
    
    // Resultado
    const btnVolverMenu = document.getElementById('btn-volver-menu');
    if (btnVolverMenu) {
        btnVolverMenu.addEventListener('click', () => {
            mostrarPantalla('pantalla-menu');
        });
    } else {
        console.error("Button 'btn-volver-menu' not found. Go back to menu functionality might not work.");
    }
    
    // Exportar candidatos
    const btnExportarCandidatos = document.getElementById('btn-exportar-candidatos');
    if (btnExportarCandidatos) {
        btnExportarCandidatos.addEventListener('click', exportarListaCandidatos);
    } else {
        console.error("Button 'btn-exportar-candidatos' not found. Export candidates functionality might not work.");
    }
    
    // Info button
    const btnInfo = document.getElementById('btn-info');
    if (btnInfo) {
        btnInfo.addEventListener('click', () => {
            mostrarPantalla('pantalla-creditos');
        });
    } else {
        console.error("Button 'btn-info' not found. Info functionality might not work.");
    }
    
    // Botones de menú
    document.querySelectorAll('.btn-menu').forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                mostrarPantalla('pantalla-menu');
            });
        } else {
            console.error("Button '.btn-menu' not found. Menu functionality might not work.");
        }
    });
}

// Enhanced export functionality
function exportarListaCandidatos() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('portrait', 'mm', 'a4');
        
        // Cabecera con diseño
        doc.setFillColor(0, 170, 255);
        doc.rect(0, 0, 210, 30, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('LISTA DE CANDIDATOS A EXAMEN', 105, 15, { align: 'center' });

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 15, 40);

        const alumnos = appObtenerAlumnosBD(); 
        const candidatos = alumnos.filter(alumno => {
            const simulacrosAptos = (alumno.simulacros || []).filter(simulacro => {
                return window.esSimulacroApto ? window.esSimulacroApto(simulacro) : false;
            }).length;
            return simulacrosAptos >= 5;
        });

        if (candidatos.length === 0) {
            doc.setFontSize(12);
            doc.setFont('helvetica', 'italic');
            doc.text('No hay candidatos que cumplan los criterios.', 105, 60, { align: 'center' });
        } else {
            const headers = [['Nº Alumno', 'Nombre Completo', 'Simulacros Aptos']];
            const data = candidatos.map(c => [
                c.numero,
                `${c.nombre} ${c.apellido}`,
                (c.simulacros || []).filter(simulacro => {
                     return window.esSimulacroApto ? window.esSimulacroApto(simulacro) : false;
                }).length
            ]);

            doc.autoTable({
                startY: 50,
                head: headers,
                body: data,
                theme: 'striped',
                headStyles: { fillColor: [0, 170, 255], textColor: 255 },
                styles: { font: 'helvetica', fontSize: 10 },
                margin: { top: 30 }
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
        
        const pdfBlob = doc.output('blob');
        const fileName = `Candidatos_Examen_${new Date().toISOString().split('T')[0]}.pdf`;
        
        // Trigger download
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = pdfUrl;
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink); // Required for Firefox
        downloadLink.click();
        document.body.removeChild(downloadLink); // Clean up
        
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
        
        mostrarNotificacionWebView('Informe PDF creado');
    } catch (error) {
        console.error('Error generando PDF de candidatos:', error);
        mostrarNotificacionWebView('Error al generar el PDF');
    }
}

// Make functions available globally if they're used in HTML event attributes
window.prepararSimulacro = prepararSimulacro;
window.iniciarSimulacro = iniciarSimulacro;
window.finalizarSimulacro = finalizarSimulacro;
window.cargarListaAlumnos = cargarListaAlumnos;
window.filtrarAlumnos = filtrarAlumnos;
window.cargarCandidatosExamen = cargarCandidatosExamen;
window.filtrarCandidatos = filtrarCandidatos;
// window.exportarFichaAlumno and window.exportarInformeSimulacro are set in pdfModule.js
window.exportarListaCandidatos = exportarListaCandidatos;
window.mostrarResultadoFinal = mostrarResultadoFinal;
window.cambiarTabFaltas = cambiarTabFaltas;
window.mostrarFaltasPorTipo = window.mostrarFaltasPorTipo || function() { console.log("mostrarFaltasPorTipo not loaded yet"); };