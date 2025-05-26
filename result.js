// Handles simulation result determination and reporting

function ResultVisitor() {}

ResultVisitor.prototype.determineResult = function(simulacro) {
    const faltas = simulacro.faltas;
    let apto = true;
    let reason = '';

    // Existing logic to determine apto and reason
    if (faltas.some(f => f.tipo === 'eliminatoria')) {
        apto = false;
        reason = 'Falta eliminatoria detectada';
    } else {
        const deficientes = faltas.filter(f => f.tipo === 'deficiente').length;
        const leves = faltas.filter(f => f.tipo === 'leve').length;

        if (deficientes >= 2) {
            apto = false;
            reason = '2 o más faltas deficientes';
        } else if (leves >= 10) {
            apto = false;
            reason = '10 o más faltas leves';
        }
    }

    return { isApto: apto, reason };
};

ResultVisitor.prototype.showReport = function(result) {
    // Build report HTML based on result
    const reportHtml = `
        <h2>Resultado del Simulacro</h2>
        <p>APTO: ${result.isApto ? 'Sí' : 'No'}</p>
        <p>Razón: ${result.reason}</p>
    `;

    // Display report
    const reportElement = document.getElementById('report');
    if (reportElement) {
        reportElement.innerHTML = reportHtml;
    } else {
        console.error('Elemento con id "report" no encontrado');
    }
};

ResultVisitor.prototype.showFinalResult = function(result) {
    // Display final result
    const finalResultElement = document.getElementById('final-result');
    if (finalResultElement) {
        finalResultElement.innerHTML = `
            <h2>Resultado Final</h2>
            <p>APTO: ${result.isApto ? 'Sí' : 'No'}</p>
            <p>Razón: ${result.reason}</p>
        `;
    } else {
        console.error('Elemento con id "final-result" no encontrado');
    }
};

// Hacer disponible la clase globalmente
window.ResultVisitor = ResultVisitor;
