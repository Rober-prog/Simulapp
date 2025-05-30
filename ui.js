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

// Formatear fecha y hora
function formatearFecha(fecha) {
    const d = new Date(fecha);
    return d.toLocaleDateString();
}

function formatearHora(fecha) {
    const d = new Date(fecha);
    return d.toLocaleTimeString();
}

// Updated notification function to also work with Android WebView
function mostrarNotificacionWebView(mensaje, duracion = 5000) {
    // Try to use Android interface if available
    if (window.Android && typeof window.Android.showToast === 'function') {
        window.Android.showToast(mensaje);
    } else {
        // Fallback to web notification
        const notificacion = document.createElement('div');
        notificacion.className = 'webview-notification';
        notificacion.textContent = mensaje;
        
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notificacion);
            }, 300);
        }, duracion);
    }
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
    
    .webview-notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 20px;
        border-radius: 20px;
        font-size: 14px;
        max-width: 90%;
        text-align: center;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        opacity: 1;
        transition: opacity 0.3s ease;
    }
`;

document.head.appendChild(estilosUI);

// Export functions for other modules to import
export {
    mostrarNotificacion,
    confirmarAccion,
    formatearFecha,
    formatearHora,
    mostrarNotificacionWebView
};

// Make functions available globally
window.mostrarNotificacion = mostrarNotificacion;
window.confirmarAccion = confirmarAccion;
window.mostrarNotificacionWebView = mostrarNotificacionWebView;