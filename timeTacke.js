// Handles all timing related functionality
export class TimeTracker {
    constructor() {
        this.startTime = null;
        this.intervalId = null;
        this.isRunning = false;
    }

    initializeRun() {
        if (this.isRunning) return;
        
        this.startTime = new Date();
        this.isRunning = true;
        const cronometroElement = document.getElementById('cronometro');
        
        if (!cronometroElement) {
            console.error('Cronometro element not found');
            return;
        }
        
        this.intervalId = setInterval(() => {
            const ahora = new Date();
            const diferencia = new Date(ahora - this.startTime);
            
            const horas = diferencia.getUTCHours().toString().padStart(2, '0');
            const minutos = diferencia.getUTCMinutes().toString().padStart(2, '0');
            const segundos = diferencia.getUTCSeconds().toString().padStart(2, '0');
            
            cronometroElement.textContent = `${horas}:${minutos}:${segundos}`;
            if (window.simulacroActual) {
                window.simulacroActual.duracion = `${horas}:${minutos}:${segundos}`;
            }
        }, 1000);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
    }

    getElapsedTime(format = true) {
        if (!this.startTime) return 0;
        
        const elapsedTime = new Date() - this.startTime;
        const horas = Math.floor(elapsedTime / (1000 * 60 * 60));
        const minutos = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((elapsedTime % (1000 * 60)) / 1000);
        
        if (format) {
            return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        } else {
            return { horas, minutos, segundos };
        }
    }
}