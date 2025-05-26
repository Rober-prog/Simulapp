// BASE DE DATOS LOCAL
// Funciones para gestionar la base de datos con localStorage

// Inicialización de la base de datos
function inicializarBD() {
    if (!localStorage.getItem('alumnos')) {
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

function guardarAlumnoBD(alumno) {
    const alumnos = obtenerAlumnosBD();

    const existente = alumnos.findIndex(a => a.numero === alumno.numero);

    if (existente >= 0) {
        alumnos[existente] = { ...alumnos[existente], ...alumno };
    } else {
        alumnos.push(alumno);
    }

    guardarAlumnosBD(alumnos);
    return alumno;
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

    if (!alumnos[indiceAlumno].simulacros) {
        alumnos[indiceAlumno].simulacros = [];
    }

    const indiceSimulacro = alumnos[indiceAlumno].simulacros.findIndex(s => s.id === simulacro.id);

    if (indiceSimulacro >= 0) {
        alumnos[indiceAlumno].simulacros[indiceSimulacro] = simulacro;
    } else {
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

// Hacer funciones disponibles globalmente (para WebView)
window.obtenerAlumnoPorId = obtenerAlumnoPorId;
window.obtenerAlumnosBD = obtenerAlumnosBD;
window.guardarSimulacroBD = guardarSimulacroBD;
window.guardarAlumnoBD = guardarAlumnoBD;
window.eliminarAlumnoBD = eliminarAlumnoBD;
window.eliminarSimulacroBD = eliminarSimulacroBD;
window.exportarBD = exportarBD;
window.importarBD = importarBD;

// Exportar todas las funciones (para posibles usos en otros módulos)
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
