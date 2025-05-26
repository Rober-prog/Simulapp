// GESTIÓN DE FALTAS 
// Module for managing faults configuration

// Las funciones dependientes de otros módulos se llaman a través de window
// Ejemplo: window.mostrarNotificacion, window.confirmarAccion, etc.

// Variables para el estado de edición
window.modoEdicion = false;
window.faltaEditandoId = null;

// Inicializar el módulo de gestión de faltas
window.inicializarGestionFaltas = function () {
    document.getElementById('btn-agregar-falta').addEventListener('click', window.validarYGuardarFalta);
    document.getElementById('btn-cancelar-edicion').addEventListener('click', window.cancelarEdicion);

    document.getElementById('ordenar-tipo').addEventListener('click', () => {
        window.ordenarYMostrarFaltas('tipo');
    });

    document.getElementById('ordenar-codigo').addEventListener('click', () => {
        window.ordenarYMostrarFaltas('codigo');
    });

    window.cargarYMostrarFaltas();
}

// Cargar y mostrar la lista de faltas
window.cargarYMostrarFaltas = function () {
    const faltas = window.cargarCatalogoFaltas();
    window.mostrarListaFaltas(faltas);
}

// Ordenar y mostrar faltas
window.ordenarYMostrarFaltas = function (criterio) {
    const faltas = window.ordenarFaltas(criterio);
    window.mostrarListaFaltas(faltas);

    document.querySelectorAll('.btn-ordenar').forEach(btn => {
        btn.classList.remove('activo');
    });
    document.getElementById(`ordenar-${criterio}`).classList.add('activo');
}

// Mostrar la lista de faltas
window.mostrarListaFaltas = function (faltas) {
    const listaFaltas = document.getElementById('lista-config-faltas');
    listaFaltas.innerHTML = '';

    if (faltas.length === 0) {
        listaFaltas.innerHTML = '<p class="no-resultados">No hay faltas configuradas</p>';
        return;
    }

    const selectAllCheckbox = document.getElementById('seleccionar-todas-faltas');
    selectAllCheckbox.checked = faltas.every(f => f.activa !== false);
    selectAllCheckbox.addEventListener('change', (e) => {
        const newValue = e.target.checked;
        faltas.forEach(falta => {
            const checkbox = document.querySelector(`input[data-id="${falta.id}"]`);
            if (checkbox) {
                checkbox.checked = newValue;
                window.actualizarEstadoFalta(falta.id, newValue);
            }
        });
    });

    const tiposFalta = ['leve', 'deficiente', 'eliminatoria'];

    tiposFalta.forEach(tipo => {
        const faltasPorTipo = faltas.filter(falta => falta.tipo === tipo);

        if (faltasPorTipo.length > 0) {
            const seccionTipo = document.createElement('div');
            seccionTipo.className = 'seccion-tipo-falta';

            const headerTipo = document.createElement('h3');
            headerTipo.className = `header-tipo-${tipo}`;
            headerTipo.textContent = tipo.charAt(0).toUpperCase() + tipo.slice(1) + 's';
            seccionTipo.appendChild(headerTipo);

            faltasPorTipo.forEach(falta => {
                const itemFalta = document.createElement('div');
                itemFalta.className = `item-lista falta-item-config tipo-${falta.tipo}`;

                if (falta.activa === false) {
                    itemFalta.classList.add('falta-inactiva');
                }

                itemFalta.innerHTML = `
                    <div class="item-contenido">
                        <h4>${falta.codigo} - ${falta.descripcion}</h4>
                        <p>Tipo: ${falta.tipo}</p>
                        <div class="casilla-activa">
                            <input type="checkbox" id="activa-${falta.id}" 
                                   data-id="${falta.id}" 
                                   ${falta.activa !== false ? 'checked' : ''}>
                            <label for="activa-${falta.id}">Mostrar en simulacros</label>
                        </div>
                    </div>
                    <div class="item-acciones">
                        <button class="btn-editar" data-id="${falta.id}" title="Editar falta">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="btn-eliminar" data-id="${falta.id}" title="Eliminar falta">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                    </div>
                `;

                const checkbox = itemFalta.querySelector(`input[data-id="${falta.id}"]`);
                checkbox.addEventListener('change', (e) => {
                    window.actualizarEstadoFalta(falta.id, e.target.checked);
                    if (!e.target.checked) {
                        selectAllCheckbox.checked = false;
                    } else {
                        selectAllCheckbox.checked = faltas.every(f =>
                            document.querySelector(`input[data-id="${f.id}"]`)?.checked
                        );
                    }
                });

                const btnEditar = itemFalta.querySelector('.btn-editar');
                btnEditar.addEventListener('click', () => {
                    window.prepararEdicionFalta(falta);
                });

                const btnEliminar = itemFalta.querySelector('.btn-eliminar');
                btnEliminar.addEventListener('click', () => {
                    window.confirmarEliminarFalta(falta.id);
                });

                seccionTipo.appendChild(itemFalta);
            });

            listaFaltas.appendChild(seccionTipo);
        }
    });
}

// Preparar la edición de una falta
window.prepararEdicionFalta = function (falta) {
    try {
        const codigoInput = document.getElementById('codigo-falta');
        const descripcionInput = document.getElementById('descripcion-falta');
        const tipoSelect = document.getElementById('tipo-falta');
        const btnAgregar = document.getElementById('btn-agregar-falta');
        const btnCancelar = document.getElementById('btn-cancelar-edicion');
        const formHeader = document.querySelector('.form-header h3');

        if (!codigoInput || !descripcionInput || !tipoSelect || !btnAgregar || !btnCancelar || !formHeader) {
            throw new Error('Elementos del formulario no encontrados');
        }

        codigoInput.value = falta.codigo || '';
        descripcionInput.value = falta.descripcion || '';
        tipoSelect.value = falta.tipo || 'leve';

        btnAgregar.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            Actualizar Falta
        `;
        btnCancelar.style.display = 'inline-block';
        formHeader.textContent = 'Editar Falta';

        window.modoEdicion = true;
        window.faltaEditandoId = falta.id;

        const formulario = document.querySelector('.formulario-faltas');
        if (formulario) {
            formulario.scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        console.error('Error al preparar edición:', error);
        window.mostrarNotificacion('Error al preparar la edición de la falta', 'error');
    }
}

// Cancelar edición
window.cancelarEdicion = function () {
    document.getElementById('codigo-falta').value = '';
    document.getElementById('descripcion-falta').value = '';
    document.getElementById('tipo-falta').value = 'leve';

    document.getElementById('btn-agregar-falta').textContent = 'Agregar Falta';
    document.getElementById('btn-cancelar-edicion').style.display = 'none';
    document.querySelector('.form-header h3').textContent = 'Añadir Nueva Falta';

    window.modoEdicion = false;
    window.faltaEditandoId = null;
}

// Validar y guardar falta
window.validarYGuardarFalta = function () {
    const codigo = document.getElementById('codigo-falta').value.trim().toUpperCase();
    const descripcion = document.getElementById('descripcion-falta').value.trim();
    const tipo = document.getElementById('tipo-falta').value;

    if (!codigo || !descripcion || !tipo) {
        window.mostrarNotificacion('Por favor, complete todos los campos!', 'advertencia');
        return;
    }

    if (window.modoEdicion) {
        const faltaActualizada = {
            id: window.faltaEditandoId,
            codigo: codigo,
            descripcion: descripcion,
            tipo: tipo,
            activa: true
        };

        if (window.actualizarFalta(faltaActualizada)) {
            window.mostrarNotificacion('Falta actualizada correctamente', 'exito');
            window.cancelarEdicion();
            window.cargarYMostrarFaltas();
        } else {
            window.mostrarNotificacion('Error al actualizar la falta', 'error');
        }
    } else {
        const nuevaFalta = {
            codigo: codigo,
            descripcion: descripcion,
            tipo: tipo,
            activa: true
        };

        window.agregarFalta(nuevaFalta);
        window.mostrarNotificacion('Falta agregada correctamente', 'exito');

        document.getElementById('codigo-falta').value = '';
        document.getElementById('descripcion-falta').value = '';

        window.cargarYMostrarFaltas();
    }
}

// Confirmar y eliminar falta
window.confirmarEliminarFalta = function (id) {
    window.confirmarAccion('¿Estás seguro de eliminar esta falta?').then(confirmado => {
        if (confirmado) {
            window.eliminarFalta(id);
            window.mostrarNotificacion('Falta eliminada correctamente', 'exito');
            window.cargarYMostrarFaltas();

            if (window.modoEdicion && window.faltaEditandoId === id) {
                window.cancelarEdicion();
            }
        }
    });
}

// Actualizar estado de una falta
window.actualizarEstadoFalta = function (id, activa) {
    try {
        if (!id) throw new Error('ID de falta no válido');

        const faltas = window.cargarCatalogoFaltas();
        const falta = faltas.find(f => f.id === id);

        if (!falta) throw new Error('Falta no encontrada');

        falta.activa = Boolean(activa);
        localStorage.setItem('catalogoFaltas', JSON.stringify(faltas));

        const itemFalta = document.querySelector(`.falta-item-config:has(input[data-id="${id}"])`);
        if (itemFalta) {
            if (!activa) {
                itemFalta.classList.add('falta-inactiva');
            } else {
                itemFalta.classList.remove('falta-inactiva');
            }
        }
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        window.mostrarNotificacion('Error al actualizar el estado de la falta', 'error');
    }
}
