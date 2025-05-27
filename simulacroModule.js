// SIMULACRO MODULE
// Lógica para gestionar el simulacro de examen

window.simulacroActual = null;
window.simulacroEnCurso = false;
let cronometroIntervalo = null;
let tiempoInicioSimulacro = null;

// Iniciar simulacro
function iniciarSimulacro() {
    if (!window.simulacroActual) {
        alert('No hay simulacro preparado.');
        return;
    }

    window.simulacroEnCurso = true;
    tiempoInicioSimulacro = new Date();
    actualizarCronometro();
    cronometroIntervalo = setInterval(actualizarCronometro, 1000);

    alert('Simulacro iniciado.');
}

// Finalizar simulacro
function finalizarSimulacro() {
    if (!window.simulacroEnCurso) {
        alert('No hay simulacro en curso.');
        return;
    }

    clearInterval(cronometroIntervalo);
    window.simulacroEnCurso = false;

    const tiempoFin = new Date();
    const duracion = Math.floor((tiempoFin - tiempoInicioSimulacro) / 1000); // segundos

    window.simulacroActual.duracion = duracion;
    guardarSimulacro(window.simulacroActual);

    alert('Simulacro finalizado.');

    window.mostrarPantalla('pantalla-informe');
    mostrarInformeSimulacro();
}

// Preparar simulacro (cuando se pulsa "Nuevo Simulacro")
function prepararSimulacro() {
    if (!window.alumnoSeleccionado) {
        alert('Primero selecciona un alumno.');
        return;
    }

    const alumno = window.alumnoSeleccionado;

    window.simulacroActual = {
        alumnoId: alumno.id,
        fecha: new Date().toISOString(),
        faltas: [],
        duracion: 0
    };

    actualizarContadoresFaltas();
    cargarFaltasEnSimulacro();

    window.mostrarPantalla('pantalla-simulacro');
}

// Añadir falta al simulacro
function agregarFaltaSimulacro(codigo, descripcion, tipo) {
    if (!window.simulacroActual) {
        alert('No hay simulacro activo.');
        return;
    }

    window.simulacroActual.faltas.push({ codigo, descripcion, tipo, minuto: obtenerMinutoActual() });
    actualizarContadoresFaltas();
}

// Actualizar contadores en pantalla
function actualizarContadoresFaltas() {
    const leves = contarFaltasPorTipo('leve');
    const deficientes = contarFaltasPorTipo('deficiente');
    const eliminatorias = contarFaltasPorTipo('eliminatoria');

    document.getElementById('contador-leves').textContent = leves;
    document.getElementById('contador-deficientes').textContent = deficientes;
    document.getElementById('contador-eliminatorias').textContent = eliminatorias;
}

// Contar faltas por tipo
function contarFaltasPorTipo(tipo) {
    if (!window.simulacroActual) return 0;
    return window.simulacroActual.faltas.filter(f => f.tipo === tipo).length;
}

// Obtener minuto actual del cronómetro
function obtenerMinutoActual() {
    if (!tiempoInicioSimulacro) return 0;
    return Math.floor((new Date() - tiempoInicioSimulacro) / 60000);
}

// Cronómetro
function actualizarCronometro() {
    if (!tiempoInicioSimulacro) return;
    const ahora = new Date();
    const diferencia = ahora - tiempoInicioSimulacro;

    const horas = String(Math.floor(diferencia / 3600000)).padStart(2, '0');
    const minutos = String(Math.floor((diferencia % 3600000) / 60000)).padStart(2, '0');
    const segundos = String(Math.floor((diferencia % 60000) / 1000)).padStart(2, '0');

    document.getElementById('cronometro').textContent = `${horas}:${minutos}:${segundos}`;
}

// Guardar simulacro en el alumno
function guardarSimulacro(simulacro) {
    const alumnos = JSON.parse(localStorage.getItem('alumnos')) || [];
    const alumno = alumnos.find(a => a.id === simulacro.alumnoId);

    if (!alumno) {
        alert('No se encontró el alumno.');
        return;
    }

    if (!alumno.simulacros) alumno.simulacros = [];
    alumno.simulacros.push(simulacro);

    const apto = simulacro.faltas.filter(f => f.tipo === 'eliminatoria').length === 0 &&
                 simulacro.faltas.filter(f => f.tipo === 'deficiente').length <= 2;

    if (apto) {
        alumno.simulacrosAptos = (alumno.simulacrosAptos || 0) + 1;
    }

    localStorage.setItem('alumnos', JSON.stringify(alumnos));
}

// Mostrar informe del simulacro finalizado
function mostrarInformeSimulacro() {
    const contenedor = document.getElementById('contenido-informe');
    contenedor.innerHTML = '';

    if (!window.simulacroActual) {
        contenedor.textContent = 'No hay simulacro cargado.';
        return;
    }

    const alumno = window.alumnoSeleccionado;
    const resumen = document.createElement('div');
    resumen.innerHTML = `
        <p><strong>Alumno:</strong> ${alumno.nombre} ${alumno.apellido}</p>
        <p><strong>Duración:</strong> ${window.simulacroActual.duracion} segundos</p>
        <p><strong>Faltas:</strong></p>
        <ul>
            ${window.simulacroActual.faltas.map(f => `<li>${f.codigo} - ${f.descripcion} (${f.tipo}) - Minuto ${f.minuto}</li>`).join('')}
        </ul>
    `;

    contenedor.appendChild(resumen);
}

// Cargar faltas en pantalla de simulacro
function cargarFaltasEnSimulacro() {
    const lista = document.getElementById('lista-faltas');
    lista.innerHTML = '';

    const catalogo = window.cargarCatalogoFaltas();

    catalogo.forEach(falta => {
        const item = document.createElement('div');
        item.className = 'item-falta';
        item.textContent = `${falta.codigo} - ${falta.descripcion}`;
        item.addEventListener('click', () => {
            agregarFaltaSimulacro(falta.codigo, falta.descripcion, falta.tipo);
        });

        lista.appendChild(item);
    });
}

// Hacer funciones accesibles globalmente
window.iniciarSimulacro = iniciarSimulacro;
window.finalizarSimulacro = finalizarSimulacro;
window.prepararSimulacro = prepararSimulacro;
window.agregarFaltaSimulacro = agregarFaltaSimulacro;
window.actualizarContadoresFaltas = actualizarContadoresFaltas;
window.cargarFaltasEnSimulacro = cargarFaltasEnSimulacro;
window.mostrarInformeSimulacro = mostrarInformeSimulacro;