// MAIN APPLICATION
// This is the main entry point that initializes the application

import { guardarAlumno, cargarListaAlumnos, filtrarAlumnos, mostrarFichaAlumno, cargarCandidatosExamen, filtrarCandidatos } from './alumnosModule.js';
import { inicializarBD } from './db.js';
import { mostrarPantalla, volverPantallaAnterior } from './navigation.js';
import { prepararSimulacro, iniciarSimulacro, finalizarSimulacro, mostrarResultadoFinal, cambiarTabFaltas, mostrarInformeSimulacro } from './simulacroModule.js';
import { inicializarCatalogoFaltas, cargarCatalogoFaltas } from './catalogoFaltas.js';
import { inicializarGestionFaltas } from './faltasModule.js';
import { savePdfToLocalStorage } from './pdfModule.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the database
    inicializarBD();
    
    // Initialize fault catalog - ensure this runs first
    console.log('Initializing fault catalog...');
    inicializarCatalogoFaltas();
    
    // Initialize fault management with logging
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
    // Add null checks for all event listeners
    
    // Pantalla de bienvenida
    const btnEntrar = document.getElementById('btn-entrar');
    if (btnEntrar) {
        btnEntrar.addEventListener('click', () => {
            mostrarPantalla('pantalla-menu');
        });
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
    }
    
    const btnBuscarAlumno = document.getElementById('btn-buscar-alumno');
    if (btnBuscarAlumno) {
        btnBuscarAlumno.addEventListener('click', () => {
            mostrarPantalla('pantalla-buscar-alumno');
            window.cargarListaAlumnos();
        });
    }
    
    const btnCandidatos = document.getElementById('btn-candidatos');
    if (btnCandidatos) {
        btnCandidatos.addEventListener('click', () => {
            mostrarPantalla('pantalla-candidatos');
            window.cargarCandidatosExamen();
        });
    }
    
    // PDF Library
    const btnBibliotecaPDF = document.getElementById('btn-biblioteca-pdf');
    if (btnBibliotecaPDF) {
        btnBibliotecaPDF.addEventListener('click', () => {
            mostrarPantalla('pantalla-biblioteca-pdf');
            cargarBibliotecaPDF();
        });
    }
    
    const inputBuscarPDF = document.getElementById('input-buscar-pdf');
    if (inputBuscarPDF) {
        inputBuscarPDF.addEventListener('input', filtrarPDFs);
    }
    
    // Formulario añadir alumno
    const btnGuardarAlumno = document.getElementById('btn-guardar-alumno');
    if (btnGuardarAlumno) {
        btnGuardarAlumno.addEventListener('click', guardarAlumno);
    }

    // Input validation for numero-alumno
    const numeroAlumnoInput = document.getElementById('numero-alumno');
    if (numeroAlumnoInput) {
        numeroAlumnoInput.addEventListener('input', function(event) {
            if (event.target.value && event.target.value.length > 5) {
                event.target.value = event.target.value.slice(0, 5);
            }
        });
    }
    
    // Búsqueda de alumnos
    const inputBuscar = document.getElementById('input-buscar');
    if (inputBuscar) {
        inputBuscar.addEventListener('input', filtrarAlumnos);
    }
    
    // Búsqueda de candidatos
    const inputBuscarCandidato = document.getElementById('input-buscar-candidato');
    if (inputBuscarCandidato) {
        inputBuscarCandidato.addEventListener('input', filtrarCandidatos);
    }
    
    // Configurar faltas
    const btnConfigurarFaltas = document.getElementById('btn-configurar-faltas');
    if (btnConfigurarFaltas) {
        btnConfigurarFaltas.addEventListener('click', () => {
            mostrarPantalla('pantalla-config-faltas');
            inicializarGestionFaltas();
        });
    }
    
    // Eventos de la ficha del alumno
    const btnNuevoSimulacro = document.getElementById('btn-nuevo-simulacro');
    if (btnNuevoSimulacro) {
        btnNuevoSimulacro.addEventListener('click', prepararSimulacro);
    }
    
    const btnExportarFicha = document.getElementById('btn-exportar-ficha');
    if (btnExportarFicha) {
        btnExportarFicha.addEventListener('click', exportarFichaAlumno);
    }
    
    // Simulacro - Improve tab handling with clear active class setting
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', cambiarTabFaltas);  
    });
    
    const btnIniciarPrueba = document.getElementById('btn-iniciar-prueba');
    if (btnIniciarPrueba) {
        btnIniciarPrueba.addEventListener('click', iniciarSimulacro);
    }
    
    // Simulacro - Mejorar la manipulación de botones
    const btnFinalizarSimulacro = document.getElementById('btn-finalizar-simulacro');
    if (btnFinalizarSimulacro) {
        // Replace existing listeners to prevent duplicates
        const nuevoBoton = btnFinalizarSimulacro.cloneNode(true);
        btnFinalizarSimulacro.parentNode.replaceChild(nuevoBoton, btnFinalizarSimulacro);
        nuevoBoton.addEventListener('click', finalizarSimulacro);
    }
    
    // Informe
    const btnExportarInforme = document.getElementById('btn-exportar-informe');
    if (btnExportarInforme) {
        btnExportarInforme.addEventListener('click', exportarInformeSimulacro);
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
    }
    
    const btnVerResultado = document.getElementById('btn-ver-resultado');
    if (btnVerResultado) {
        btnVerResultado.addEventListener('click', mostrarResultadoFinal);
    }
    
    // Resultado
    const btnVolverMenu = document.getElementById('btn-volver-menu');
    if (btnVolverMenu) {
        btnVolverMenu.addEventListener('click', () => {
            mostrarPantalla('pantalla-menu');
        });
    }
    
    // Exportar candidatos
    const btnExportarCandidatos = document.getElementById('btn-exportar-candidatos');
    if (btnExportarCandidatos) {
        btnExportarCandidatos.addEventListener('click', exportarListaCandidatos);
    }
    
    // Info button
    const btnInfo = document.getElementById('btn-info');
    if (btnInfo) {
        btnInfo.addEventListener('click', () => {
            mostrarPantalla('pantalla-creditos');
        });
    }
    
    // Botones de menú
    document.querySelectorAll('.btn-menu').forEach(btn => {
        btn.addEventListener('click', () => {
            mostrarPantalla('pantalla-menu');
        });
    });
}

// Enhanced export functionality
function exportarListaCandidatos() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('portrait', 'mm', 'a4');
        
        // ... existing PDF generation code ...
        
        // Save to localStorage
        const pdfBlob = doc.output('blob');
        const fileName = `Candidatos_Examen_${new Date().toISOString().split('T')[0]}.pdf`;
        savePdfToLocalStorage(pdfBlob, fileName);
        
        // Also trigger download
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = pdfUrl;
        downloadLink.download = fileName;
        downloadLink.click();
        
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
        
        mostrarNotificacionWebView('Informe PDF creado');
    } catch (error) {
        console.error('Error generando PDF:', error);
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
window.exportarFichaAlumno = window.exportarFichaAlumno || function() { console.log("exportarFichaAlumno not loaded yet"); };
window.exportarInformeSimulacro = window.exportarInformeSimulacro || function() { console.log("exportarInformeSimulacro not loaded yet"); };
window.exportarListaCandidatos = exportarListaCandidatos;
window.mostrarResultadoFinal = mostrarResultadoFinal;
window.cambiarTabFaltas = cambiarTabFaltas;
window.mostrarFaltasPorTipo = mostrarFaltasPorTipo;  