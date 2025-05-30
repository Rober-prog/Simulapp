// SIMULACROS
// Functions for simulation management

import { mostrarPantalla } from './navigation.js';
import { obtenerAlumnoPorId, guardarSimulacroBD, obtenerAlumnosBD, guardarAlumnosBD } from './db.js';
import { cargarCatalogoFaltas } from './catalogoFaltas.js';
import { mostrarNotificacion } from './ui.js';
// window.esSimulacroApto será cargado desde candidatosModule

let tiempoInicio = null;
let cronometroInterval = null;
let simulacroActual = null;

function prepararSimulacro() {
    // Use the global reference
    if (!window.alumnoSeleccionado) {
        mostrarNotificacion('Error: No hay alumno seleccionado', 'error');
        return;
    }
    
    const datosSimulacroAlumno = document.getElementById('datos-simulacro-alumno');
    datosSimulacroAlumno.innerHTML = `
        <p><strong>${window.alumnoSeleccionado.nombre} ${window.alumnoSeleccionado.apellido}</strong></p>
        <p>Nº: ${window.alumnoSeleccionado.numero}</p>
    `;
    
    // Resetear cronómetro
    document.getElementById('cronometro').textContent = '00:00:00';
    
    // Cargar faltas del primer tab (leves por defecto)
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.classList.remove('activo');
    });
    document.querySelector('.tab-btn[data-tipo="leve"]').classList.add('activo');
    
    // Resetear contadores
    document.getElementById('contador-leves').textContent = '0';
    document.getElementById('contador-deficientes').textContent = '0';
    document.getElementById('contador-eliminatorias').textContent = '0';
    
    // Mostrar el botón de iniciar y ocultar el simulacro actual
    document.getElementById('btn-iniciar-prueba').style.display = 'block';
    document.getElementById('btn-finalizar-simulacro').style.display = 'none';
    simulacroActual = null;
    
    mostrarPantalla('pantalla-simulacro');
}

function iniciarSimulacro() {
    // Inicializar simulacro
    tiempoInicio = new Date();
    simulacroActual = {
        id: Date.now().toString(),
        alumnoId: window.alumnoSeleccionado.id,
        fecha: tiempoInicio.toISOString(),
        duracion: '00:00:00',
        faltas: [],
        observaciones: '' // Initialize empty observations
    };
    
    // Make simulacroActual globally accessible
    window.simulacroActual = simulacroActual;
    
    // Iniciar cronómetro
    iniciarCronometro();
    
    // Ocultar botón de iniciar y mostrar finalizar
    document.getElementById('btn-iniciar-prueba').style.display = 'none';
    document.getElementById('btn-finalizar-simulacro').style.display = 'block';
    
    // Mostrar faltas por tipo activo
    const tipoActivo = document.querySelector('.tab-btn.activo').dataset.tipo;
    mostrarFaltasPorTipo(tipoActivo);
    
    mostrarNotificacion('Simulacro iniciado', 'exito');
}

function iniciarCronometro() {
    const cronometroElement = document.getElementById('cronometro');
    
    cronometroInterval = setInterval(() => {
        const ahora = new Date();
        const diferencia = new Date(ahora - tiempoInicio);
        
        const horas = diferencia.getUTCHours().toString().padStart(2, '0');
        const minutos = diferencia.getUTCMinutes().toString().padStart(2, '0');
        const segundos = diferencia.getUTCSeconds().toString().padStart(2, '0');
        
        cronometroElement.textContent = `${horas}:${minutos}:${segundos}`;
        simulacroActual.duracion = `${horas}:${minutos}:${segundos}`;
    }, 1000);
}

function detenerCronometro() {
    if (cronometroInterval) {
        clearInterval(cronometroInterval);
        cronometroInterval = null;
    }
}
// Hacerla global para que navigation.js pueda usarla
window.detenerCronometro = detenerCronometro;

function cambiarTabFaltas(event) {
    // Quitar clase activo de todos los tabs
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.classList.remove('activo');
    });
    
    // Añadir clase activo al tab seleccionado
    event.target.classList.add('activo');
    
    // Mostrar faltas del tipo seleccionado
    const tipo = event.target.dataset.tipo;
    mostrarFaltasPorTipo(tipo);
}

function registrarFalta(falta) {
    try {
        if (!simulacroActual) {
            mostrarNotificacion('Debe iniciar el simulacro primero', 'advertencia');
            return;
        }

        if (!falta || !falta.id) {
            throw new Error('Datos de falta inválidos');
        }

        const tiempoTranscurrido = new Date() - tiempoInicio;
        const minutos = Math.floor(tiempoTranscurrido / 60000);
        
        // Store complete fault data including all identifying fields
        simulacroActual.faltas.push({
            id: Date.now().toString(),
            faltaId: falta.id,  // Store the original fault ID
            codigo: falta.codigo,
            descripcion: falta.descripcion || '',
            tipo: falta.tipo || 'leve',
            minuto: minutos
        });
        
        // Find and update the specific fault counter by ID
        const itemFalta = document.querySelector(`.falta-item[data-id="${falta.id}"]`);
        if (itemFalta) {
            const contadorElement = itemFalta.querySelector('.contador-falta');
            const btnRestar = itemFalta.querySelector('.btn-restar-falta');
            
            if (contadorElement) {
                // Count by fault ID instead of code
                const nuevoConteo = simulacroActual.faltas.filter(f => f.faltaId === falta.id).length;
                contadorElement.textContent = nuevoConteo;
            }
            
            if (btnRestar) {
                btnRestar.disabled = false;
            }
        }
        
        actualizarContadoresFaltas();
        
    } catch (error) {
        console.error('Error al registrar falta:', error);
        mostrarNotificacion('Error al registrar la falta', 'error');
    }
}

function restarFalta(faltaId) {
    try {
        if (!simulacroActual) {
            mostrarNotificacion('No hay simulacro activo', 'advertencia');
            return;
        }

        if (!faltaId) {
            throw new Error('ID de falta no válido');
        }
        
        // Find the last entry of this exact fault ID
        const index = [...simulacroActual.faltas].reverse()
            .findIndex(f => f.faltaId === faltaId);
        
        if (index !== -1) {
            const actualIndex = simulacroActual.faltas.length - 1 - index;
            // Get the fault information before removing
            const faltaRemoved = simulacroActual.faltas[actualIndex];
            simulacroActual.faltas.splice(actualIndex, 1);
            
            actualizarContadoresFaltas();
            
            // Update the specific fault counter
            const itemFalta = document.querySelector(`.falta-item[data-id="${faltaId}"]`);
            if (itemFalta) {
                const contadorElement = itemFalta.querySelector('.contador-falta');
                const btnRestar = itemFalta.querySelector('.btn-restar-falta');
                
                if (contadorElement) {
                    // Count by fault ID
                    const nuevoConteo = simulacroActual.faltas.filter(f => f.faltaId === faltaId).length;
                    contadorElement.textContent = nuevoConteo;
                    
                    if (btnRestar) {
                        btnRestar.disabled = nuevoConteo === 0;
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error al restar falta:', error);
        mostrarNotificacion('Error al restar la falta', 'error');
    }
}

function mostrarFaltasPorTipo(tipo) {
    const listaFaltas = document.getElementById('lista-faltas');
    if (!listaFaltas) {
        console.error('Element lista-faltas not found');
        return;
    }
    
    listaFaltas.innerHTML = '';
    
    try {
        // Load and validate catalog
        const faltas = cargarCatalogoFaltas();
        if (!faltas || !Array.isArray(faltas)) {
            console.error('Invalid fault catalog:', faltas);
            listaFaltas.innerHTML = '<p class="no-resultados">Error: Catálogo de faltas no disponible</p>';
            return;
        }
        
        const faltasFiltradas = faltas.filter(falta => {
            if (!falta || typeof falta !== 'object') return false;
            const coincideTipo = falta.tipo === tipo;
            const estaActiva = falta.activa !== false;
            return coincideTipo && estaActiva;
        });
        
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
            
            // Count occurrences by fault ID
            const conteoFalta = simulacroActual ? 
                simulacroActual.faltas.filter(f => f.faltaId === falta.id).length : 0;
            
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
            
            // Add click event for registering fault
            itemFalta.querySelector('.falta-contenido').addEventListener('click', () => {
                if (simulacroActual) {
                    registrarFalta(falta);
                } else {
                    mostrarNotificacion('Primero debe iniciar la prueba', 'advertencia');
                }
            });
            
            // Add event for subtracting fault
            const btnRestar = itemFalta.querySelector('.btn-restar-falta');
            btnRestar.addEventListener('click', (e) => {
                e.stopPropagation();
                if (simulacroActual) {
                    restarFalta(falta.id);
                }
            });
            
            listaFaltas.appendChild(itemFalta);
        });
    } catch (error) {
        console.error('Error displaying faults:', error);
        listaFaltas.innerHTML = '<p class="no-resultados">Error al cargar las faltas</p>';
    }
}

function actualizarContadoresFaltas() {
    const contadorLeves = document.getElementById('contador-leves');
    const contadorDeficientes = document.getElementById('contador-deficientes');
    const contadorEliminatorias = document.getElementById('contador-eliminatorias');
    
    const leves = simulacroActual.faltas.filter(f => f.tipo === 'leve').length;
    const deficientes = simulacroActual.faltas.filter(f => f.tipo === 'deficiente').length;
    const eliminatorias = simulacroActual.faltas.filter(f => f.tipo === 'eliminatoria').length;
    
    contadorLeves.textContent = leves;
    contadorDeficientes.textContent = deficientes;
    contadorEliminatorias.textContent = eliminatorias;
    
    // Remove automatic end of simulation - user must click "Finalizar Prueba" button
}

function finalizarSimulacro() {
    detenerCronometro();
    
    // Guardar simulacro en el alumno
    guardarSimulacroBD(simulacroActual);
    
    // Mostrar informe
    mostrarInformeSimulacro(simulacroActual);
}

function mostrarInformeSimulacro(simulacro) {
    const contenidoInforme = document.getElementById('contenido-informe');
    
    // Obtener datos del alumno
    const alumno = obtenerAlumnoPorId(simulacro.alumnoId);
    
    if (!alumno) {
        // alert('Error: No se pudo encontrar el alumno asociado a este simulacro'); // Evitar alert
        mostrarNotificacion('Error: No se pudo encontrar el alumno asociado a este simulacro.', 'error');
        mostrarPantalla('pantalla-menu'); // Volver al menú si hay un error grave
        return;
    }
    
    // Store the student and simulation references for use by other functions
    window.alumnoSeleccionado = alumno;
    window.simulacroActual = simulacro;
    
    // Determinar resultado
    let resultado = 'APTO';
    let motivoNoApto = '';
    
    if (window.esSimulacroApto && !window.esSimulacroApto(simulacro)) {
        resultado = 'NO APTO';
        // Determinar motivo específico para NO APTO
        if (simulacro.faltas.some(f => f.tipo === 'eliminatoria')) {
            motivoNoApto = 'Falta eliminatoria detectada';
        } else {
            const deficientes = simulacro.faltas.filter(f => f.tipo === 'deficiente').length;
            const leves = simulacro.faltas.filter(f => f.tipo === 'leve').length;
            if (deficientes >= 2) {
                motivoNoApto = '2 o más faltas deficientes';
            } else if (deficientes === 1 && leves >= 5) {
                motivoNoApto = '1 falta deficiente y 5 o más leves';
            } else if (leves >= 10) {
                motivoNoApto = '10 o más faltas leves';
            } else {
                motivoNoApto = "Criterio no especificado"; // Fallback si esSimulacroApto es más complejo
            }
        }
    }
    
    // Generar HTML del informe
    const fechaSimulacro = new Date(simulacro.fecha);
    
    contenidoInforme.innerHTML = `
        <div class="informe-seccion">
            <h3>Datos del Alumno</h3>
            <p><strong>Nombre:</strong> ${alumno.nombre} ${alumno.apellido}</p>
            <p><strong>Número:</strong> ${alumno.numero}</p>
        </div>
        
        <div class="informe-seccion">
            <h3>Datos del Simulacro</h3>
            <p><strong>Fecha:</strong> ${fechaSimulacro.toLocaleDateString()}</p>
            <p><strong>Hora de inicio:</strong> ${fechaSimulacro.toLocaleTimeString()}</p>
            <p><strong>Duración:</strong> ${simulacro.duracion}</p>
            <p><strong>Resultado:</strong> <span style="color: ${resultado === 'APTO' ? 'green' : 'red'}; font-weight: bold;">${resultado}</span></p>
            ${motivoNoApto ? `<p><strong>Motivo:</strong> ${motivoNoApto}</p>` : ''}
        </div>
        
        <div class="informe-seccion">
            <h3>Faltas Registradas</h3>
            ${simulacro.faltas.length === 0 ? '<p>No se registraron faltas</p>' : ''}
    `;
    
    // Agrupar faltas por tipo
    const faltasLeves = simulacro.faltas.filter(f => f.tipo === 'leve');
    const faltasDeficientes = simulacro.faltas.filter(f => f.tipo === 'deficiente');
    const faltasEliminatorias = simulacro.faltas.filter(f => f.tipo === 'eliminatoria');
    
    // Añadir tablas para cada tipo de falta si hay faltas
    if (faltasLeves.length > 0) {
        contenidoInforme.innerHTML += `
            <h4>Faltas Leves (${faltasLeves.length})</h4>
            <table class="informe-tabla">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Descripción</th>
                        <th>Minuto</th>
                    </tr>
                </thead>
                <tbody>
                    ${faltasLeves.map(falta => `
                        <tr>
                            <td>${falta.codigo}</td>
                            <td>${falta.descripcion}</td>
                            <td>${falta.minuto}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    if (faltasDeficientes.length > 0) {
        contenidoInforme.innerHTML += `
            <h4>Faltas Deficientes (${faltasDeficientes.length})</h4>
            <table class="informe-tabla">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Descripción</th>
                        <th>Minuto</th>
                    </tr>
                </thead>
                <tbody>
                    ${faltasDeficientes.map(falta => `
                        <tr>
                            <td>${falta.codigo}</td>
                            <td>${falta.descripcion}</td>
                            <td>${falta.minuto}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    if (faltasEliminatorias.length > 0) {
        contenidoInforme.innerHTML += `
            <h4>Faltas Eliminatorias (${faltasEliminatorias.length})</h4>
            <table class="informe-tabla">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Descripción</th>
                        <th>Minuto</th>
                    </tr>
                </thead>
                <tbody>
                    ${faltasEliminatorias.map(falta => `
                        <tr>
                            <td>${falta.codigo}</td>
                            <td>${falta.descripcion}</td>
                            <td>${falta.minuto}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    contenidoInforme.innerHTML += `</div>`;
    contenidoInforme.dataset.simulacroId = simulacro.id;
    
    // Set the observations if they exist
    const textoObservaciones = document.getElementById('texto-observaciones');
    textoObservaciones.value = simulacro.observaciones || '';
    
    // Remove any existing event listeners to avoid duplicates
    const btnGuardarObservaciones = document.getElementById('btn-guardar-observaciones');
    const nuevoBoton = btnGuardarObservaciones.cloneNode(true);
    btnGuardarObservaciones.parentNode.replaceChild(nuevoBoton, btnGuardarObservaciones);
    
    // Add a fresh event listener for this specific simulation
    nuevoBoton.addEventListener('click', () => {
        guardarObservacionesSimulacro(simulacro.id, textoObservaciones.value);
    });
    
    // Fix the volver a ficha button - remove any existing event listeners
    const btnVolverFicha = document.getElementById('btn-volver-ficha');
    const nuevoBotonVolver = btnVolverFicha.cloneNode(true);
    btnVolverFicha.parentNode.replaceChild(nuevoBotonVolver, btnVolverFicha);
    
    // Add a fresh event listener
    nuevoBotonVolver.addEventListener('click', () => {
        if (window.alumnoSeleccionado) {
            window.mostrarFichaAlumno(window.alumnoSeleccionado);
        } else {
            mostrarNotificacion('Error al volver a la ficha del alumno', 'error');
            mostrarPantalla('pantalla-menu');
        }
    });
    
    mostrarPantalla('pantalla-informe');
}

// New function to save observations
function guardarObservacionesSimulacro(simulacroId, observaciones) {
    const alumnos = obtenerAlumnosBD();
    let simulacroActualizado = false;
    
    // Find the simulation in the database and update it
    for (const alumno of alumnos) {
        const index = alumno.simulacros.findIndex(s => s.id === simulacroId);
        if (index !== -1) {
            alumno.simulacros[index].observaciones = observaciones;
            simulacroActualizado = true;
            
            // If it's the current simulation, update the global reference
            if (window.simulacroActual && window.simulacroActual.id === simulacroId) {
                window.simulacroActual.observaciones = observaciones;
            }
            break;
        }
    }
    
    if (simulacroActualizado) {
        guardarAlumnosBD(alumnos);
        mostrarNotificacion('Observaciones guardadas correctamente', 'exito');
    } else {
        mostrarNotificacion('Error al guardar las observaciones', 'error');
    }
}

function mostrarResultadoFinal() {
    // Obtener el simulacro actual desde el informe si no está disponible
    let simulacro = window.simulacroActual;
    if (!simulacro) {
        const contenidoInforme = document.getElementById('contenido-informe');
        const idSimulacro = contenidoInforme.dataset.simulacroId;
        
        if (idSimulacro) {
            const alumnos = obtenerAlumnosBD();
            for (const a of alumnos) {
                const sim = a.simulacros.find(s => s.id === idSimulacro);
                if (sim) {
                    simulacro = sim;
                    window.alumnoSeleccionado = a;
                    window.simulacroActual = sim;
                    break;
                }
            }
        }
    }
    
    if (!simulacro || !window.alumnoSeleccionado) {
        // alert('Error: No se pudo identificar el simulacro'); // Evitar alert
        mostrarNotificacion('Error: No se pudo identificar el simulacro.', 'error');
        mostrarPantalla('pantalla-menu');
        return;
    }
    
    // Determinar resultado usando la función global
    let esApto = true;
    if (window.esSimulacroApto) {
        esApto = window.esSimulacroApto(simulacro);
    } else {
        console.warn("esSimulacroApto no está disponible globalmente. El resultado puede ser incorrecto.");
        // Fallback a la lógica anterior si esSimulacroApto no está disponible
        if (simulacro.faltas.some(f => f.tipo === 'eliminatoria')) {
            esApto = false;
        } else {
            const deficientes = simulacro.faltas.filter(f => f.tipo === 'deficiente').length;
            const leves = simulacro.faltas.filter(f => f.tipo === 'leve').length;
            if (deficientes >= 2 || leves >= 10 || (deficientes === 1 && leves >= 5)) {
                esApto = false;
            }
        }
    }
        
    // Contar simulacros aptos anteriores del alumno
    // Asegurarse que alumnoSeleccionado.simulacros es un array
    const simulacrosDelAlumno = window.alumnoSeleccionado.simulacros || [];
    
    const simulacrosAptosAnteriores = simulacrosDelAlumno.filter(s => {
        if (s.id === simulacro.id) return false; // Excluir el actual de este conteo
        return window.esSimulacroApto ? window.esSimulacroApto(s) : false;
    }).length;
    
    const totalAptos = esApto ? simulacrosAptosAnteriores + 1 : simulacrosAptosAnteriores;
    
    const contenidoResultado = document.getElementById('contenido-resultado');
    
    if (esApto) {
        contenidoResultado.className = 'resultado-final resultado-apto';
        
        if (totalAptos >= 5) {
            contenidoResultado.innerHTML = `
                <h2>¡APTO!</h2>
                <p>CANDIDATO A EXAMEN</p>
                <p class="resultado-detalle">Ha superado ${totalAptos} simulacros satisfactoriamente</p>
            `;
        } else {
            contenidoResultado.innerHTML = `
                <h2>¡APTO!</h2>
                <p>SIGUE ASÍ...</p>
                <p class="resultado-detalle">Lleva ${totalAptos} de 5 simulacros necesarios para ser candidato a examen</p>
            `;
        }
    } else {
        contenidoResultado.className = 'resultado-final resultado-no-apto';
        contenidoResultado.innerHTML = `
            <h2>¡NO APTO!</h2>
            <p>LA RECOMENDACIÓN ES SEGUIR PRACTICANDO...</p>
        `;
    }
    
    mostrarPantalla('pantalla-resultado');
}

export {
    prepararSimulacro,
    iniciarSimulacro,
    detenerCronometro,
    cambiarTabFaltas,
    mostrarFaltasPorTipo,
    registrarFalta,
    restarFalta,
    finalizarSimulacro,
    mostrarInformeSimulacro,
    mostrarResultadoFinal,
    guardarObservacionesSimulacro,
    simulacroActual
};