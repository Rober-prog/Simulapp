// New function to handle fault state updates
function actualizarEstadoFalta(id, activa) {
    try {
        if (!id) throw new Error('ID de falta no válido');
        
        const faltas = cargarCatalogoFaltas();
        const falta = faltas.find(f => f.id === id);
        
        if (!falta) throw new Error('Falta no encontrada');
        
        falta.activa = Boolean(activa);
        localStorage.setItem('catalogoFaltas', JSON.stringify(faltas));
        
        // Update visual indicator if element exists
        const itemFalta = document.querySelector(`.falta-item-config[data-id="${id}"]`);
        if (itemFalta) {
            if (!activa) {
                itemFalta.classList.add('falta-inactiva');
            } else {
                itemFalta.classList.remove('falta-inactiva');
            }
        }
        
        return true;
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        return false;
    }
}