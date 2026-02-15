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
        bottom: 80px; 
        left: 50%;
        transform: translateX(-50%) translateY(100px); 
        padding: 14px 28px;
        border-radius: 28px; 
        background: rgba(15, 23, 42, 0.65);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        color: #f1f5f9;
        z-index: 1000;
        box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(148, 163, 184, 0.12);
        opacity: 0;
        transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s cubic-bezier(0.4,0,0.2,1);
        text-align: center;
        min-width: 200px;
        max-width: 90%;
        font-weight: 500;
    }
    
    .notificacion.visible {
        transform: translateX(-50%) translateY(0); 
        opacity: 1;
    }
    
    .notificacion-info {
        border-color: rgba(6, 182, 212, 0.3);
        box-shadow: 0 8px 40px rgba(0,0,0,0.5), 0 0 20px rgba(6, 182, 212, 0.35);
    }
    
    .notificacion-exito {
        border-color: rgba(16, 185, 129, 0.3);
        box-shadow: 0 8px 40px rgba(0,0,0,0.5), 0 0 20px rgba(16, 185, 129, 0.3);
    }
    
    .notificacion-advertencia {
        border-color: rgba(245, 158, 11, 0.3);
        box-shadow: 0 8px 40px rgba(0,0,0,0.5), 0 0 20px rgba(245, 158, 11, 0.3);
    }
    
    .notificacion-error {
        border-color: rgba(239, 68, 68, 0.3);
        box-shadow: 0 8px 40px rgba(0,0,0,0.5), 0 0 20px rgba(239, 68, 68, 0.3);
    }
    
    .modal-confirmacion {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        animation: modalFadeIn 0.3s ease;
    }
    
    @keyframes modalFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .modal-contenido {
        background: #111827;
        padding: 28px;
        border-radius: 20px;
        border: 1px solid rgba(148, 163, 184, 0.12);
        box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0,0,0,0.3);
        width: 85%;
        max-width: 400px;
        color: #f1f5f9;
        animation: modalContentIn 0.4s cubic-bezier(0.4,0,0.2,1);
    }
    
    @keyframes modalContentIn {
        from { opacity: 0; transform: scale(0.9) translateY(20px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
    }
    
    .modal-contenido p {
        color: #94a3b8;
        font-size: 1rem;
        line-height: 1.5;
    }
    
    .modal-botones {
        display: flex;
        justify-content: flex-end;
        margin-top: 25px;
        gap: 12px;
    }
    
    .modal-botones button {
        padding: 10px 22px;
        cursor: pointer;
        border-radius: 8px;
    }
    
    .modal-botones .btn-secundario {
        background: rgba(15, 23, 42, 0.65);
        color: #f1f5f9;
        border: 1px solid rgba(148, 163, 184, 0.12);
    }
    
    .modal-botones .btn-principal {
        background: linear-gradient(135deg, #06b6d4, #0891b2);
        color: #ffffff;
        border: none;
        box-shadow: 0 4px 15px rgba(6, 182, 212, 0.35);
    }
    
    .webview-notification {
        position: fixed;
        bottom: 80px; 
        left: 50%;
        transform: translateX(-50%);
        background: rgba(15, 23, 42, 0.65);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        color: #f1f5f9;
        padding: 12px 28px;
        border-radius: 28px;
        font-size: 0.9rem;
        max-width: 90%;
        text-align: center;
        z-index: 9999;
        border: 1px solid rgba(148, 163, 184, 0.12);
        box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
        opacity: 1;
        transition: opacity 0.3s ease;
        font-weight: 500;
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