// CANDIDATOS A EXAMEN
// Functions for managing and displaying exam candidates

import { obtenerAlumnosBD } from './db.js';
import { mostrarFichaAlumno } from './alumnosVista.js';

// Function to determine if a simulation is passed
function esSimulacroApto(simulacro) {
    if (!simulacro || !simulacro.faltas) return false; // Basic validation

    if (simulacro.faltas.some(f => f.tipo === 'eliminatoria')) return false;
    
    const deficientes = simulacro.faltas.filter(f => f.tipo === 'deficiente').length;
    const leves = simulacro.faltas.filter(f => f.tipo === 'leve').length;
    
    // Condiciones de NO APTO:
    // 1. Una eliminatoria (ya cubierto arriba)
    // 2. Dos deficientes
    // 3. Una deficiente y cinco leves
    // 4. Diez leves
    if (deficientes >= 2) return false;
    if (deficientes === 1 && leves >= 5) return false;
    if (leves >= 10) return false;
    
    return true; // Si ninguna condición de NO APTO se cumple, es APTO
}

// Function to load exam candidates
function cargarCandidatosExamen() {
    const alumnos = obtenerAlumnosBD();
    const listaCandidatos = document.getElementById('lista-candidatos');
    listaCandidatos.innerHTML = '';
    
    // Filtrar candidatos (alumnos con 3 o más simulacros APTOS)
    const candidatos = alumnos.filter(alumno => {
        const simulacrosAptos = alumno.simulacros.filter(esSimulacroApto).length;
        return simulacrosAptos >= 3;  
    });
    
    // Ordenar por cantidad de simulacros aptos (de mayor a menor)
    candidatos.sort((a, b) => {
        const aptosA = a.simulacros.filter(esSimulacroApto).length;
        const aptosB = b.simulacros.filter(esSimulacroApto).length;
        return aptosB - aptosA;
    });
    
    if (candidatos.length === 0) {
        listaCandidatos.innerHTML = '<p class="no-resultados">No hay candidatos a examen</p>';
        return;
    }
    
    candidatos.forEach(candidato => {
        const simulacrosAptos = candidato.simulacros.filter(esSimulacroApto).length;
        
        const itemCandidato = document.createElement('div');
        itemCandidato.className = 'candidato-item';
        itemCandidato.innerHTML = `
            <div class="candidato-info">
                <h3>${candidato.nombre} ${candidato.apellido}</h3>
                <p>Nº: ${candidato.numero}</p>
            </div>
            <span class="candidato-aptos">${simulacrosAptos} APTOS</span>
        `;
        
        itemCandidato.addEventListener('click', () => {
            mostrarFichaAlumno(candidato);
        });
        
        listaCandidatos.appendChild(itemCandidato);
    });
}

// Function to filter candidates by search term
function filtrarCandidatos() {
    const textoBusqueda = document.getElementById('input-buscar-candidato').value.toLowerCase();
    
    // Si está vacío, mostrar todos los candidatos
    if (!textoBusqueda.trim()) {
        cargarCandidatosExamen();
        return;
    }
    
    const alumnos = obtenerAlumnosBD();
    const listaCandidatos = document.getElementById('lista-candidatos');
    listaCandidatos.innerHTML = '';
    
    // Filtrar candidatos (alumnos con 3 o más simulacros APTOS) y por texto
    const candidatos = alumnos.filter(alumno => {
        const simulacrosAptos = alumno.simulacros.filter(esSimulacroApto).length;
        
        const coincideTexto = 
            alumno.nombre.toLowerCase().includes(textoBusqueda) || 
            alumno.apellido.toLowerCase().includes(textoBusqueda) ||
            alumno.numero.includes(textoBusqueda);
        
        return simulacrosAptos >= 3 && coincideTexto;
    });
    
    // Ordenar por cantidad de simulacros aptos (de mayor a menor)
    candidatos.sort((a, b) => {
        const aptosA = a.simulacros.filter(esSimulacroApto).length;
        const aptosB = b.simulacros.filter(esSimulacroApto).length;
        return aptosB - aptosA;
    });
    
    if (candidatos.length === 0) {
        listaCandidatos.innerHTML = '<p class="no-resultados">No se encontraron candidatos</p>';
        return;
    }
    
    candidatos.forEach(candidato => {
        const simulacrosAptos = candidato.simulacros.filter(esSimulacroApto).length;
        
        const itemCandidato = document.createElement('div');
        itemCandidato.className = 'candidato-item';
        itemCandidato.innerHTML = `
            <div class="candidato-info">
                <h3>${candidato.nombre} ${candidato.apellido}</h3>
                <p>Nº: ${candidato.numero}</p>
            </div>
            <span class="candidato-aptos">${simulacrosAptos} APTOS</span>
        `;
        
        itemCandidato.addEventListener('click', () => {
            mostrarFichaAlumno(candidato);
        });
        
        listaCandidatos.appendChild(itemCandidato);
    });
}

// Make functions available globally
window.cargarCandidatosExamen = cargarCandidatosExamen;
window.filtrarCandidatos = filtrarCandidatos;
window.esSimulacroApto = esSimulacroApto;

export {
    cargarCandidatosExamen,
    filtrarCandidatos,
    esSimulacroApto
};