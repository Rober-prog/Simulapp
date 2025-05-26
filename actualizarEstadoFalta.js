// actualizarEstadoFalta.js

function actualizarEstadoFalta(id, nuevoEstado, faltas, setFaltasCallback) {
  try {
    if (!id || !nuevoEstado) {
      console.error('ID y nuevo estado son requeridos.');
      return;
    }

    const nuevasFaltas = faltas.map((falta) =>
      falta.id === id ? { ...falta, estado: nuevoEstado } : falta
    );

    if (typeof setFaltasCallback === 'function') {
      setFaltasCallback(nuevasFaltas);
    } else {
      console.warn('No se ha proporcionado una función para actualizar el estado.');
    }
  } catch (error) {
    console.error('Error al actualizar el estado de la falta:', error);
  }
}

// Exportar en entorno sin módulos ES6 (WebView Android)
window.actualizarEstadoFalta = actualizarEstadoFalta;

