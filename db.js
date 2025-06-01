// BASE DE DATOS LOCAL
// Funciones para gestionar la base de datos con localStorage

// Inicialización de la base de datos
function inicializarBD() {
    try {
        // Verificar si ya existe la base de datos
        if (!localStorage.getItem('alumnos')) {
            // Inicializar con un array vacío
            localStorage.setItem('alumnos', JSON.stringify([]));
        }

        // Verificar integridad de los datos
        const alumnos = JSON.parse(localStorage.getItem('alumnos'));
        if (!Array.isArray(alumnos)) {
            console.error('Estructura de datos inválida, reinicializando BD');
            localStorage.setItem('alumnos', JSON.stringify([]));
        }

        // Validar estructura de cada alumno
        const alumnosValidados = alumnos.filter(alumno => {
            return alumno && 
                   typeof alumno.id === 'string' &&
                   typeof alumno.numero === 'string' &&
                   typeof alumno.nombre === 'string' &&
                   typeof alumno.apellido === 'string' &&
                   Array.isArray(alumno.simulacros);
        });

        if (alumnosValidados.length !== alumnos.length) {
            console.warn('Se encontraron registros inválidos, limpiando datos');
            localStorage.setItem('alumnos', JSON.stringify(alumnosValidados));
        }

    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
        localStorage.setItem('alumnos', JSON.stringify([]));
    }
}

// Funciones para Alumnos
function obtenerAlumnosBD() {
    try {
        const alumnos = JSON.parse(localStorage.getItem('alumnos') || '[]');
        return Array.isArray(alumnos) ? alumnos : [];
    } catch (error) {
        console.error('Error al obtener alumnos:', error);
        return [];
    }
}

function guardarAlumnosBD(alumnos) {
    try {
        if (!Array.isArray(alumnos)) {
            throw new Error('Los datos no son un array válido');
        }
        localStorage.setItem('alumnos', JSON.stringify(alumnos));
        return true;
    } catch (error) {
        console.error('Error al guardar alumnos:', error);
        return false;
    }
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

// Nueva función para verificar el estado de la base de datos
function verificarEstadoBD() {
    try {
        // Verify localStorage access
        const testKey = '__test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);

        // Get current storage usage
        const currentSize = new Blob([JSON.stringify(localStorage)]).size;
        const storageLimit = 5 * 1024 * 1024; // 5MB typical localStorage limit

        // Get database stats
        const alumnos = obtenerAlumnosBD();
        const catalogoFaltas = JSON.parse(localStorage.getItem('catalogoFaltas') || '[]');

        return {
            status: 'ok',
            alumnosCount: alumnos.length,
            simulacrosCount: alumnos.reduce((total, alumno) => total + (alumno.simulacros?.length || 0), 0),
            faltasCount: catalogoFaltas.length,
            storageUsed: currentSize,
            storageLimit: storageLimit,
            storagePercentage: Math.round((currentSize / storageLimit) * 100)
        };
    } catch (error) {
        return {
            status: 'error',
            error: error.message
        };
    }
}

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
    importarBD,
    verificarEstadoBD
};