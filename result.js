// Handles simulation result determination and reporting
export class ResultVisitor {
  determineResult(simulacro) {
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
  }

  showReport(result) {
    // Build report HTML based on result
    const reportHtml = `
      <h2>Resultado del Simulacro</h2>
      <p>APTO: ${result.isApto ? 'Sí' : 'No'}</p>
      <p>Razón: ${result.reason}</p>
    `;

    // Display report
    const reportElement = document.getElementById('report');
    reportElement.innerHTML = reportHtml;
  }

  showFinalResult(result) {
    // Display final result
    const finalResultElement = document.getElementById('final-result');
    finalResultElement.innerHTML = `
      <h2>Resultado Final</h2>
      <p>APTO: ${result.isApto ? 'Sí' : 'No'}</p>
      <p>Razón: ${result.reason}</p>
    `;
  }
}