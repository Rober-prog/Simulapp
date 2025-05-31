// LISTA DE ALUMNOS
// Functions for displaying and filtering student lists

import { obtenerAlumnosBD } from './db.js';
import { mostrarFichaAlumno } from './alumnosVista.js';
import { editarAlumno, confirmarEliminarAlumno } from './alumnosControlador.js';

// Function to load the list of students
function cargarListaAlumnos() {
    const alumnos = obtenerAlumnosBD();
    const listaAlumnos = document.getElementById('lista-alumnos');
    listaAlumnos.innerHTML = '';
    
    if (alumnos.length === 0) {
        listaAlumnos.innerHTML = '<p class="no-resultados">No hay alumnos registrados</p>';
        return;
    }
    
    alumnos.forEach(alumno => {
        const itemAlumno = crearElementoAlumno(alumno);
        listaAlumnos.appendChild(itemAlumno);
    });
}

// Function to filter students by search term
function filtrarAlumnos() {
    const textoBusqueda = document.getElementById('input-buscar').value.toLowerCase();
    const alumnos = obtenerAlumnosBD();
    const listaAlumnos = document.getElementById('lista-alumnos');
    listaAlumnos.innerHTML = '';
    
    const alumnosFiltrados = alumnos.filter(alumno => 
        alumno.apellido.toLowerCase().includes(textoBusqueda) ||
        alumno.nombre.toLowerCase().includes(textoBusqueda) ||
        alumno.numero.includes(textoBusqueda)
    );
    
    if (alumnosFiltrados.length === 0) {
        listaAlumnos.innerHTML = '<p class="no-resultados">No se encontraron resultados</p>';
        return;
    }
    
    alumnosFiltrados.forEach(alumno => {
        const itemAlumno = crearElementoAlumno(alumno);
        listaAlumnos.appendChild(itemAlumno);
    });
}

// Helper function to create a student list item
function crearElementoAlumno(alumno) {
    const itemAlumno = document.createElement('div');
    itemAlumno.className = 'item-lista';
    itemAlumno.innerHTML = `
        <div class="item-contenido">
            <h3>${alumno.nombre} ${alumno.apellido}</h3>
            <p>Nº: ${alumno.numero}</p>
        </div>
        <div class="item-acciones">
            <button class="btn-editar" data-id="${alumno.id}" title="Editar alumno">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="btn-eliminar" data-id="${alumno.id}" title="Eliminar alumno">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
        </div>
    `;
    
    // Evento para mostrar ficha al hacer clic en el contenido
    const contenido = itemAlumno.querySelector('.item-contenido');
    contenido.addEventListener('click', () => {
        mostrarFichaAlumno(alumno);
    });
    
    // Eventos para los botones de editar y eliminar
    const btnEditar = itemAlumno.querySelector('.btn-editar');
    btnEditar.addEventListener('click', (e) => {
        e.stopPropagation();
        editarAlumno(alumno.id);
    });
    
    const btnEliminar = itemAlumno.querySelector('.btn-eliminar');
    btnEliminar.addEventListener('click', (e) => {
        e.stopPropagation();
        confirmarEliminarAlumno(alumno.id);
    });
    
    return itemAlumno;
}

export {
    cargarListaAlumnos,
    filtrarAlumnos
};