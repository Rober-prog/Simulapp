document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

// Eventos básicos
function setupEventListeners() {
    const btnEntrar = document.getElementById('btn-entrar');
    if (btnEntrar) {
        btnEntrar.addEventListener('click', () => {
            alert("Botón ENTRAR pulsado");
            if (typeof window.mostrarPantalla === "function") {
                window.mostrarPantalla('pantalla-menu');
            } else {
                alert("mostrarPantalla no está disponible");
            }
        });
    }
}

// Global fallback para otras funciones si no están cargadas
window.mostrarPantalla = window.mostrarPantalla || function() { console.log("mostrarPantalla no cargada"); };