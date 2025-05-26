// SIMULACROS
// Functions for simulation management

// Asegurar las dependencias globales
window.mostrarPantalla = window.mostrarPantalla || function() {};
window.obtenerAlumnoPorId = window.obtenerAlumnoPorId || function() {};
window.guardarSimulacroBD = window.guardarSimulacroBD || function() {};
window.obtenerAlumnosBD = window.obtenerAlumnosBD || function() {};
window.guardarAlumnosBD = window.guardarAlumnosBD || function() {};
window.cargarCatalogoFaltas = window.cargarCatalogoFaltas || function() {};
window.mostrarNotificacion = window.mostrarNotificacion || function() {};

window.tiempoInicio = null;
window.cronometroInterval = null;
window.simulacroActual = null;
window.simulacroEnCurso = false;

window.prepararSimulacro = function() {
    if (!window.alumnoSeleccionado) {
        window.mostrarNotificacion('Error: No hay alumno seleccionado', 'error');
        return;
    }
    
    const datosSimulacroAlumno = document.getElementById('datos-simulacro-alumno');
    datosSimulacroAlumno.innerHTML = `
        <p><strong>${window.alumnoSeleccionado.nombre} ${window.alumnoSeleccionado.apellido}</strong></p>
        <p>Nº: ${window.alumnoSeleccionado.numero}</p>
    `;
    
    document.getElementById('cronometro').textContent = '00:00:00';
    
    document.querySelectorAll('.tab-btn').forEach(tab => tab.classList.remove('activo'));
    document.querySelector('.tab-btn[data-tipo="leve"]').classList.add('activo');
    
    document.getElementById('contador-leves').textContent = '0';
    document.getElementById('contador-deficientes').textContent = '0';
    document.getElementById('contador-eliminatorias').textContent = '0';
    
    document.getElementById('btn-iniciar-prueba').style.display = 'block';
    document.getElementById('btn-finalizar-simulacro').style.display = 'none';
    window.simulacroActual = null;
    window.simulacroEnCurso = false;
    
    window.mostrarPantalla('pantalla-simulacro');
};

window.iniciarSimulacro = function() {
    window.tiempoInicio = new Date();
    window.simulacroActual = {
        id: Date.now().toString(),
        alumnoId: window.alumnoSeleccionado.id,
        fecha: window.tiempoInicio.toISOString(),
        duracion: '00:00:00',
        faltas: [],
        observaciones: ''
    };
    window.simulacroEnCurso = true;

    iniciarCronometro();
    
    document.getElementById('btn-iniciar-prueba').style.display = 'none';
    document.getElementById('btn-finalizar-simulacro').style.display = 'block';
    
    const tipoActivo = document.querySelector('.tab-btn.activo').dataset.tipo;
    window.mostrarFaltasPorTipo(tipoActivo);
    
    window.mostrarNotificacion('Simulacro iniciado', 'exito');
};

function iniciarCronometro() {
    const cronometroElement = document.getElementById('cronometro');
    
    window.cronometroInterval = setInterval(() => {
        const ahora = new Date();
        const diferencia = new Date(ahora - window.tiempoInicio);
        
        const horas = diferencia.getUTCHours().toString().padStart(2, '0');
        const minutos = diferencia.getUTCMinutes().toString().padStart(2, '0');
        const segundos = diferencia.getUTCSeconds().toString().padStart(2, '0');
        
        cronometroElement.textContent = `${horas}:${minutos}:${segundos}`;
        window.simulacroActual.duracion = `${horas}:${minutos}:${segundos}`;
    }, 1000);
}

window.detenerCronometro = function() {
    if (window.cronometroInterval) {
        clearInterval(window.cronometroInterval);
        window.cronometroInterval = null;
    }
};

window.cambiarTabFaltas = function(event) {
    document.querySelectorAll('.tab-btn').forEach(tab => tab.classList.remove('activo'));
    event.target.classList.add('activo');
    
    const tipo = event.target.dataset.tipo;
    window.mostrarFaltasPorTipo(tipo);
};

window.registrarFalta = function(falta) {
    try {
        if (!window.simulacroActual) {
            window.mostrarNotificacion('Debe iniciar el simulacro primero', 'advertencia');
            return;
        }

        const tiempoTranscurrido = new Date() - window.tiempoInicio;
        const minutos = Math.floor(tiempoTranscurrido / 60000);
        
        window.simulacroActual.faltas.push({
            id: Date.now().toString(),
            faltaId: falta.id,
            codigo: falta.codigo,
            descripcion: falta.descripcion || '',
            tipo: falta.tipo || 'leve',
            minuto: minutos
        });
        
        const itemFalta = document.querySelector(`.falta-item[data-id="${falta.id}"]`);
        if (itemFalta) {
            const contadorElement = itemFalta.querySelector('.contador-falta');
            const btnRestar = itemFalta.querySelector('.btn-restar-falta');
            if (contadorElement) {
                const nuevoConteo = window.simulacroActual.faltas.filter(f => f.faltaId === falta.id).length;
                contadorElement.textContent = nuevoConteo;
            }
            if (btnRestar) btnRestar.disabled = false;
        }
        
        actualizarContadoresFaltas();
        
    } catch (error) {
        console.error('Error al registrar falta:', error);
        window.mostrarNotificacion('Error al registrar la falta', 'error');
    }
};

window.restarFalta = function(faltaId) {
    try {
        if (!window.simulacroActual) {
            window.mostrarNotificacion('No hay simulacro activo', 'advertencia');
            return;
        }

        const index = [...window.simulacroActual.faltas].reverse().findIndex(f => f.faltaId === faltaId);
        if (index !== -1) {
            const actualIndex = window.simulacroActual.faltas.length - 1 - index;
            window.simulacroActual.faltas.splice(actualIndex, 1);
            
            actualizarContadoresFaltas();
            
            const itemFalta = document.querySelector(`.falta-item[data-id="${faltaId}"]`);
            if (itemFalta) {
                const contadorElement = itemFalta.querySelector('.contador-falta');
                const btnRestar = itemFalta.querySelector('.btn-restar-falta');
                if (contadorElement) {
                    const nuevoConteo = window.simulacroActual.faltas.filter(f => f.faltaId === faltaId).length;
                    contadorElement.textContent = nuevoConteo;
                    if (btnRestar) btnRestar.disabled = nuevoConteo === 0;
                }
            }
        }
    } catch (error) {
        console.error('Error al restar falta:', error);
        window.mostrarNotificacion('Error al restar la falta', 'error');
    }
};

window.mostrarFaltasPorTipo = function(tipo) {
    const listaFaltas = document.getElementById('lista-faltas');
    if (!listaFaltas) return;
    
    listaFaltas.innerHTML = '';
    
    try {
        const faltas = window.cargarCatalogoFaltas();
        if (!faltas || !Array.isArray(faltas)) {
            listaFaltas.innerHTML = '<p class="no-resultados">Error al cargar las faltas</p>';
            return;
        }
        
        const faltasFiltradas = faltas.filter(f => f.tipo === tipo && f.activa !== false);
        if (faltasFiltradas.length === 0) {
            listaFaltas.innerHTML = '<p class="no-resultados">No hay faltas configuradas para este tipo</p>';
            return;
        }
        
        faltasFiltradas.forEach(falta => {
            const itemFalta = document.createElement('div');
            itemFalta.className = `falta-item tipo-${falta.tipo}`;
            itemFalta.dataset.id = falta.id;
            itemFalta.dataset.codigo = falta.codigo;
            itemFalta.dataset.descripcion = falta.descripcion;
            
            const conteoFalta = window.simulacroActual ? 
                window.simulacroActual.faltas.filter(f => f.faltaId === falta.id).length : 0;
            
            itemFalta.innerHTML = `
                <div class="falta-contenido">
                    <div class="falta-info">
                        <h4>${falta.codigo} - ${falta.descripcion}</h4>
                    </div>
                </div>
                <div class="falta-acciones">
                    <div class="contador-falta">${conteoFalta}</div>
                    <button class="btn-restar-falta" ${conteoFalta === 0 ? 'disabled' : ''} title="Restar falta">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path></svg>
                    </button>
                </div>
            `;
            
            itemFalta.querySelector('.falta-contenido').addEventListener('click', () => window.registrarFalta(falta));
            itemFalta.querySelector('.btn-restar-falta').addEventListener('click', (e) => {
                e.stopPropagation();
                window.restarFalta(falta.id);
            });
            
            listaFaltas.appendChild(itemFalta);
        });
    } catch (error) {
        console.error('Error displaying faults:', error);
        listaFaltas.innerHTML = '<p class="no-resultados">Error al cargar las faltas</p>';
    }
};

function actualizarContadoresFaltas() {
    const leves = window.simulacroActual.faltas.filter(f => f.tipo === 'leve').length;
    const deficientes = window.simulacroActual.faltas.filter(f => f.tipo === 'deficiente').length;
    const eliminatorias = window.simulacroActual.faltas.filter(f => f.tipo === 'eliminatoria').length;
    
    document.getElementById('contador-leves').textContent = leves;
    document.getElementById('contador-deficientes').textContent = deficientes;
    document.getElementById('contador-eliminatorias').textContent = eliminatorias;
}

window.finalizarSimulacroDesdeAndroid = function() {
    if (window.simulacroEnCurso) {
        window.finalizarSimulacro();
        window.simulacroEnCurso = false;
        console.log("Simulacro finalizado desde Android");
    }
};

// Las demás funciones como mostrarInformeSimulacro, mostrarResultadoFinal, etc., se añaden de forma similar a este esquema global.

