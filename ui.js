// INTERFAZ DE USUARIO
// Funciones auxiliares para la interfaz

// Función para mostrar mensajes de notificación
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear el elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.textContent = mensaje;
    
    // Añadir al DOM
    document.body.appendChild(notificacion);
    
    // Mostrar con animación
    setTimeout(() => {
        notificacion.classList.add('visible');
    }, 10);
    
    // Ocultar después de un tiempo
    setTimeout(() => {
        notificacion.classList.remove('visible');
        setTimeout(() => {
            notificacion.remove();
        }, 300);
    }, 3000);
}

// Función para crear elementos de lista
function crearElementoLista(titulo, subtitulo, onClick) {
    const elemento = document.createElement('div');
    elemento.className = 'item-lista';
    
    const tituloElement = document.createElement('h3');
    tituloElement.textContent = titulo;
    
    const subtituloElement = document.createElement('p');
    subtituloElement.textContent = subtitulo;
    
    elemento.appendChild(tituloElement);
    elemento.appendChild(subtituloElement);
    
    if (onClick) {
        elemento.addEventListener('click', onClick);
    }
    
    return elemento;
}

// Validación de formularios
function validarCampo(valor, tipo) {
    if (!valor) return false;
    
    switch (tipo) {
        case 'numero':
            return /^\d+$/.test(valor);
        case 'texto':
            return valor.trim().length > 0;
        default:
            return true;
    }
}

// Formatear fecha y hora
function formatearFecha(fecha) {
    const d = new Date(fecha);
    return d.toLocaleDateString();
}

function formatearHora(fecha) {
    const d = new Date(fecha);
    return d.toLocaleTimeString();
}

// Confirmar acción
function confirmarAccion(mensaje) {
    return new Promise((resolve) => {
        // Crear el modal de confirmación
        const modal = document.createElement('div');
        modal.className = 'modal-confirmacion';
        
        const contenido = document.createElement('div');
        contenido.className = 'modal-contenido';
        
        const mensajeElement = document.createElement('p');
        mensajeElement.textContent = mensaje;
        
        const botonesContainer = document.createElement('div');
        botonesContainer.className = 'modal-botones';
        
        const btnCancelar = document.createElement('button');
        btnCancelar.textContent = 'Cancelar';
        btnCancelar.className = 'btn-secundario';
        btnCancelar.addEventListener('click', () => {
            document.body.removeChild(modal);
            resolve(false);
        });
        
        const btnConfirmar = document.createElement('button');
        btnConfirmar.textContent = 'Confirmar';
        btnConfirmar.className = 'btn-principal';
        btnConfirmar.addEventListener('click', () => {
            document.body.removeChild(modal);
            resolve(true);
        });
        
        botonesContainer.appendChild(btnCancelar);
        botonesContainer.appendChild(btnConfirmar);
        
        contenido.appendChild(mensajeElement);
        contenido.appendChild(botonesContainer);
        
        modal.appendChild(contenido);
        document.body.appendChild(modal);
    });
}

// Animaciones de transición
function animarTransicion(elementoSaliente, elementoEntrante) {
    // Animación simple de fade
    elementoSaliente.style.opacity = '0';
    setTimeout(() => {
        elementoSaliente.classList.add('oculto');
        elementoEntrante.classList.remove('oculto');
        elementoEntrante.style.opacity = '0';
        setTimeout(() => {
            elementoEntrante.style.opacity = '1';
        }, 10);
    }, 300);
}

// Estilos CSS para los elementos creados dinámicamente
const estilosUI = document.createElement('style');
estilosUI.textContent = `
    .notificacion {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        background-color: #3498db;
        color: white;
        z-index: 1000;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        transform: translateY(-100px);
        opacity: 0;
        transition: transform 0.3s, opacity 0.3s;
    }
    
    .notificacion.visible {
        transform: translateY(0);
        opacity: 1;
    }
    
    .notificacion-info {
        background-color: #3498db;
    }
    
    .notificacion-exito {
        background-color: #2ecc71;
    }
    
    .notificacion-advertencia {
        background-color: #f39c12;
    }
    
    .notificacion-error {
        background-color: #e74c3c;
    }
    
    .modal-confirmacion {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    }
    
    .modal-contenido {
        background-color: white;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        width: 80%;
        max-width: 400px;
    }
    
    .modal-botones {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
        gap: 10px;
    }
    
    .modal-botones button {
        padding: 8px 15px;
        cursor: pointer;
    }
`;

document.head.appendChild(estilosUI);

// Make functions available globally
window.mostrarNotificacion = mostrarNotificacion;
window.confirmarAccion = confirmarAccion;

// Export functions for other modules to import
export {
    mostrarNotificacion,
    confirmarAccion,
    crearElementoLista,
    validarCampo,
    formatearFecha,
    formatearHora,
    animarTransicion
};