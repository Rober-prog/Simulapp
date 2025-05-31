// BASE DE DATOS LOCAL
// Funciones para gestionar la base de datos con localStorage

// Inicialización de la base de datos
function inicializarBD() {
    // Verificar si ya existe la base de datos
    if (!localStorage.getItem('alumnos')) {
        // Inicializar con un array vacío
        localStorage.setItem('alumnos', JSON.stringify([]));
    }
}

// Funciones para Alumnos
function obtenerAlumnosBD() {
    return JSON.parse(localStorage.getItem('alumnos') || '[]');
}

function guardarAlumnosBD(alumnos) {
    localStorage.setItem('alumnos', JSON.stringify(alumnos));
}

function guardarAlumnoBD(alumnoNuevoOActualizado) {
    if (!alumnoNuevoOActualizado || !alumnoNuevoOActualizado.numero) {
        console.error('Error DB: Datos de alumno inválidos');
        return null;
    }
    
    const alumnos = obtenerAlumnosBD();
    
    // Check if the student number already exists
    const numeroExistente = alumnos.find(a => 
        a.numero === alumnoNuevoOActualizado.numero && 
        a.id !== alumnoNuevoOActualizado.id // Exclude current student when editing
    );

    if (numeroExistente) {
        console.error('Error DB: El número de alumno ya existe');
        return null;
    }

    if (alumnoNuevoOActualizado.id) {
        // Update existing student
        const indice = alumnos.findIndex(a => a.id === alumnoNuevoOActualizado.id);
        if (indice !== -1) {
            // Preserve existing simulacros
            alumnoNuevoOActualizado.simulacros = alumnos[indice].simulacros || [];
            alumnos[indice] = alumnoNuevoOActualizado;
        } else {
            // If ID not found, treat as new student
            alumnoNuevoOActualizado.simulacros = [];
            alumnos.push(alumnoNuevoOActualizado);
        }
    } else {
        // New student
        alumnoNuevoOActualizado.simulacros = [];
        alumnos.push(alumnoNuevoOActualizado);
    }

    guardarAlumnosBD(alumnos);
    return alumnoNuevoOActualizado;
}

function obtenerAlumnoPorId(id) {
    const alumnos = obtenerAlumnosBD();
    return alumnos.find(alumno => alumno.id === id);
}

function eliminarAlumnoBD(id) {
    let alumnos = obtenerAlumnosBD();
    alumnos = alumnos.filter(alumno => alumno.id !== id);
    guardarAlumnosBD(alumnos);
}

// Funciones para Simulacros
function guardarSimulacroBD(simulacro) {
    const alumnos = obtenerAlumnosBD();
    const indiceAlumno = alumnos.findIndex(a => a.id === simulacro.alumnoId);
    
    if (indiceAlumno < 0) {
        console.error('No se encontró el alumno para guardar el simulacro');
        return null;
    }
    
    // Verificar si ya existe el simulacro
    const indiceSimulacro = alumnos[indiceAlumno].simulacros.findIndex(s => s.id === simulacro.id);
    
    if (indiceSimulacro >= 0) {
        // Actualizar simulacro existente
        alumnos[indiceAlumno].simulacros[indiceSimulacro] = simulacro;
    } else {
        // Añadir nuevo simulacro
        alumnos[indiceAlumno].simulacros.push(simulacro);
    }
    
    guardarAlumnosBD(alumnos);
    return simulacro;
}

function eliminarSimulacroBD(alumnoId, simulacroId) {
    const alumnos = obtenerAlumnosBD();
    const indiceAlumno = alumnos.findIndex(a => a.id === alumnoId);
    
    if (indiceAlumno < 0) {
        console.error('No se encontró el alumno para eliminar el simulacro');
        return;
    }
    
    alumnos[indiceAlumno].simulacros = alumnos[indiceAlumno].simulacros.filter(s => s.id !== simulacroId);
    guardarAlumnosBD(alumnos);
}

// Exportar e importar base de datos (utilidad)
function exportarBD() {
    const alumnos = obtenerAlumnosBD();
    const dataStr = JSON.stringify(alumnos, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'autoescuela_backup_' + new Date().toISOString().split('T')[0] + '.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function importarBD(jsonData) {
    try {
        const alumnos = JSON.parse(jsonData);
        
        if (!Array.isArray(alumnos)) {
            throw new Error('El formato de los datos no es válido');
        }
        
        guardarAlumnosBD(alumnos);
        return true;
    } catch (error) {
        console.error('Error al importar la base de datos:', error);
        return false;
    }
}

// Make functions available globally
window.obtenerAlumnoPorId = obtenerAlumnoPorId;
window.obtenerAlumnosBD = obtenerAlumnosBD;
window.guardarSimulacroBD = guardarSimulacroBD;

// Export all the database functions
export {
    inicializarBD,
    obtenerAlumnosBD,
    guardarAlumnosBD,
    guardarAlumnoBD,
    obtenerAlumnoPorId,
    eliminarAlumnoBD,
    guardarSimulacroBD,
    eliminarSimulacroBD,
    exportarBD,
    importarBD
};