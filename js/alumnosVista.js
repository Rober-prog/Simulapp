// VISTA DE ALUMNOS
// Functions for displaying student information and details

import { obtenerAlumnoPorId } from './db.js';
import { mostrarPantalla } from './navigation.js';
import { mostrarInformeSimulacro } from './simulacroModule.js';
import { mostrarNotificacion } from './ui.js';

// Global variable for selected student
let alumnoSeleccionado = null;

// Function to display student details
function mostrarFichaAlumno(alumno) {
    if (!alumno) {
        mostrarNotificacion('Error: No se pudo cargar el alumno', 'error');
        mostrarPantalla('pantalla-menu');
        return;
    }
    
    alumnoSeleccionado = alumno;
    window.alumnoSeleccionado = alumno; // Update global reference
    
    // Actualizar datos del alumno por si han cambiado
    const alumnoActualizado = obtenerAlumnoPorId(alumno.id);
    
    if (!alumnoActualizado) {
        mostrarNotificacion('Error: El alumno ya no existe en la base de datos', 'error');
        mostrarPantalla('pantalla-menu');
        return;
    }
    
    // Use the updated student data
    alumno = alumnoActualizado;
    alumnoSeleccionado = alumnoActualizado;
    window.alumnoSeleccionado = alumnoActualizado;
    
    const datosAlumno = document.getElementById('datos-alumno');
    datosAlumno.innerHTML = `
        <h3>${alumno.nombre} ${alumno.apellido}</h3>
        <p><strong>Número:</strong> ${alumno.numero}</p>
    `;
    
    const listaSimulacros = document.getElementById('lista-simulacros');
    listaSimulacros.innerHTML = '';
    
    if (!alumno.simulacros || alumno.simulacros.length === 0) {
        listaSimulacros.innerHTML = '<p class="no-resultados">No hay simulacros registrados</p>';
    } else {
        // Sort simulacros by date (most recent first)
        const simulacrosOrdenados = [...alumno.simulacros].sort((a, b) => 
            new Date(b.fecha) - new Date(a.fecha)
        );
        
        simulacrosOrdenados.forEach(simulacro => {
            const fechaSimulacro = new Date(simulacro.fecha);
            
            const itemSimulacro = document.createElement('div');
            itemSimulacro.className = 'item-lista';
            
            // Calcular resultado
            let resultado = 'APTO';
            if (simulacro.faltas.some(f => f.tipo === 'eliminatoria')) {
                resultado = 'NO APTO';
            } else {
                const deficientes = simulacro.faltas.filter(f => f.tipo === 'deficiente').length;
                const leves = simulacro.faltas.filter(f => f.tipo === 'leve').length;
                
                if (deficientes >= 2 || leves >= 10 || (leves >= 5 && deficientes >= 1)) {
                    resultado = 'NO APTO';
                }
            }
            
            // Add classes to highlight results with color
            const resultadoClass = resultado === 'APTO' ? 'resultado-apto-text' : 'resultado-no-apto-text';
            
            itemSimulacro.innerHTML = `
                <div class="item-contenido">
                    <h3>Simulacro: ${fechaSimulacro.toLocaleDateString()}</h3>
                    <p>Hora: ${fechaSimulacro.toLocaleTimeString()} - Duración: ${simulacro.duracion}</p>
                    <p>Resultado: <strong class="${resultadoClass}">${resultado}</strong></p>
                </div>
                <div class="item-acciones">
                    <button class="btn-ver-detalles" title="Ver detalles">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                </div>
            `;
            
            itemSimulacro.addEventListener('click', () => {
                // Show the simulation report when clicking on a simulation
                mostrarInformeSimulacro(simulacro);
            });
            
            listaSimulacros.appendChild(itemSimulacro);
        });
    }
    
    mostrarPantalla('pantalla-ficha-alumno');
}

// Make the function available globally
window.mostrarFichaAlumno = mostrarFichaAlumno;

export {
    mostrarFichaAlumno,
    alumnoSeleccionado
};