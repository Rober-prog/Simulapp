// RESULT MODULE
// Lógica para mostrar el resultado final del simulacro

function mostrarResultadoFinal() {
    const contenedor = document.getElementById('contenido-resultado');
    contenedor.innerHTML = '';

    if (!window.simulacroActual) {
        contenedor.textContent = 'No hay simulacro cargado.';
        return;
    }

    const faltas = window.simulacroActual.faltas;
    const numEliminatorias = faltas.filter(f => f.tipo === 'eliminatoria').length;
    const numDeficientes = faltas.filter(f => f.tipo === 'deficiente').length;
    const numLeves = faltas.filter(f => f.tipo === 'leve').length;

    const resultado = document.createElement('div');
    resultado.classList.add('resultado-final');

    let mensaje = '';
    let color = '';

    if (numEliminatorias > 0) {
        mensaje = '¡NO APTO! LA RECOMENDACIÓN ES SEGUIR PRACTICANDO...';
        color = 'rojo';
    } else if (numDeficientes > 2) {
        mensaje = '¡NO APTO! LA RECOMENDACIÓN ES SEGUIR PRACTICANDO...';
        color = 'rojo';
    } else if (numLeves > 9) {
        mensaje = '¡NO APTO! LA RECOMENDACIÓN ES SEGUIR PRACTICANDO...';
        color = 'rojo';
    } else {
        // Contar aptos acumulados
        const aptosPrevios = window.simulacroActual.alumno.simulacrosAptos || 0;
        const aptosActual = aptosPrevios + 1;

        if (aptosActual >= 5) {
            mensaje = '¡APTO! CANDIDATO A EXAMEN';
        } else {
            mensaje = '¡APTO! SIGUE ASÍ...';
        }
        color = 'verde';
        // Actualizar contador de aptos en el alumno
        window.simulacroActual.alumno.simulacrosAptos = aptosActual;
        window.guardarAlumno(window.simulacroActual.alumno);
    }

    resultado.innerHTML = `
        <h2 class="${color}">${mensaje}</h2>
        <p>Leves: ${numLeves}</p>
        <p>Deficientes: ${numDeficientes}</p>
        <p>Eliminatorias: ${numEliminatorias}</p>
    `;

    contenedor.appendChild(resultado);
}

// Hacer la función accesible globalmente
window.mostrarResultadoFinal = mostrarResultadoFinal;