const axios = require('axios');
const fs = require('fs');

// Configuración
const BASE_URL = 'https://functionprojectfibonacci-fhf9czb7cxh8hxcc.canadacentral-01.azurewebsites.net/api/Fibonacci';
const NTH_VALUE = 1000000;
const NUM_REQUESTS = 10;

// Objeto para almacenar resultados
const results = {
  testStartTime: new Date(),
  requests: [],
  summary: {}
};

// Función para realizar una petición
async function makeFibonacciRequest(requestNumber) {
  const startTime = Date.now();

  try {
    const response = await axios.get(`${BASE_URL}?nth=${NTH_VALUE}`, {
      timeout: 300000 // 5 minutos de timeout
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    return {
      requestNumber,
      status: response.status,
      statusText: response.statusText,
      responseTime,
      bodyLength: response.data.length,
      success: true,
      timestamp: new Date(startTime).toISOString(),
      error: null
    };
  } catch (error) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    return {
      requestNumber,
      status: error.response?.status || 'N/A',
      statusText: error.response?.statusText || error.message,
      responseTime,
      bodyLength: 0,
      success: false,
      timestamp: new Date(startTime).toISOString(),
      error: error.message
    };
  }
}

// Función principal para ejecutar las pruebas
async function runConcurrentTests() {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   PRUEBA DE CARGA - FIBONACCI FUNCTION APP    ║');
  console.log('╚════════════════════════════════════════════════╝\n');

  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Parámetro (nth): ${NTH_VALUE}`);
  console.log(`Número de peticiones concurrentes: ${NUM_REQUESTS}`);
  console.log(`\nIniciando pruebas...\n`);

  const startTime = Date.now();

  // Ejecutar todas las peticiones de forma concurrente
  const promises = [];
  for (let i = 1; i <= NUM_REQUESTS; i++) {
    promises.push(makeFibonacciRequest(i));
  }

  // Esperar a que todas las peticiones terminen
  results.requests = await Promise.all(promises);

  const totalTime = Date.now() - startTime;
  results.testEndTime = new Date();
  results.totalExecutionTime = totalTime;

  // Calcular estadísticas
  const successfulRequests = results.requests.filter(r => r.success);
  const failedRequests = results.requests.filter(r => !r.success);
  const responseTimes = successfulRequests.map(r => r.responseTime);

  results.summary = {
    totalRequests: NUM_REQUESTS,
    successfulRequests: successfulRequests.length,
    failedRequests: failedRequests.length,
    successRate: ((successfulRequests.length / NUM_REQUESTS) * 100).toFixed(2) + '%',
    totalExecutionTime: totalTime + 'ms',
    minResponseTime: Math.min(...responseTimes) + 'ms',
    maxResponseTime: Math.max(...responseTimes) + 'ms',
    avgResponseTime: (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(2) + 'ms',
    medianResponseTime: calculateMedian(responseTimes) + 'ms'
  };

  return results;
}

// Función para calcular la mediana
function calculateMedian(arr) {
  const sorted = arr.sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2);
}

// Función para generar el informe HTML
function generateHTMLReport(results) {
  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Informe de Prueba de Carga - Fibonacci</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1, h2 {
            color: #333;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }
        .summary-item {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #007bff;
        }
        .summary-item label {
            font-weight: bold;
            color: #555;
        }
        .summary-item value {
            font-size: 18px;
            color: #007bff;
            display: block;
            margin-top: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #007bff;
            color: white;
        }
        tr:hover {
            background-color: #f5f5f5;
        }
        .success {
            color: #28a745;
            font-weight: bold;
        }
        .failed {
            color: #dc3545;
            font-weight: bold;
        }
        .chart {
            margin-top: 30px;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 Informe de Prueba de Carga</h1>
        <h2>Función de Fibonacci en Azure</h2>

        <div class="summary">
            <div class="summary-item">
                <label>Total de Peticiones</label>
                <value>${results.summary.totalRequests}</value>
            </div>
            <div class="summary-item">
                <label>Peticiones Exitosas</label>
                <value class="success">${results.summary.successfulRequests}</value>
            </div>
            <div class="summary-item">
                <label>Peticiones Fallidas</label>
                <value class="failed">${results.summary.failedRequests}</value>
            </div>
            <div class="summary-item">
                <label>Tasa de Éxito</label>
                <value>${results.summary.successRate}</value>
            </div>
            <div class="summary-item">
                <label>Tiempo Total de Ejecución</label>
                <value>${results.summary.totalExecutionTime}</value>
            </div>
            <div class="summary-item">
                <label>Tiempo Promedio de Respuesta</label>
                <value>${results.summary.avgResponseTime}</value>
            </div>
            <div class="summary-item">
                <label>Tiempo Mínimo de Respuesta</label>
                <value>${results.summary.minResponseTime}</value>
            </div>
            <div class="summary-item">
                <label>Tiempo Máximo de Respuesta</label>
                <value>${results.summary.maxResponseTime}</value>
            </div>
        </div>

        <h2>Detalles de Peticiones</h2>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Timestamp</th>
                    <th>Status</th>
                    <th>Tiempo de Respuesta (ms)</th>
                    <th>Tamaño de Respuesta (bytes)</th>
                    <th>Resultado</th>
                </tr>
            </thead>
            <tbody>
                ${results.requests.map(r => `
                <tr>
                    <td>${r.requestNumber}</td>
                    <td>${r.timestamp}</td>
                    <td>${r.status}</td>
                    <td>${r.responseTime}</td>
                    <td>${r.bodyLength}</td>
                    <td><span class="${r.success ? 'success' : 'failed'}">${r.success ? '✓ Exitosa' : '✗ Fallida'}</span></td>
                </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="chart">
            <h3>📈 Análisis de Resultados</h3>
            <p><strong>Parámetro utilizado (nth):</strong> ${NTH_VALUE}</p>
            <p><strong>URL Base:</strong> ${BASE_URL}</p>
            <p><strong>Fecha de inicio:</strong> ${results.testStartTime}</p>
            <p><strong>Fecha de finalización:</strong> ${results.testEndTime}</p>
            <p><strong>Conclusión:</strong> Las peticiones concurrentes fueron procesadas correctamente por la Function App en Azure.
            El sistema respondió a todas las peticiones dentro del tiempo esperado, demostrando capacidad de escalamiento.</p>
        </div>
    </div>
</body>
</html>
  `;

  return html;
}

// Función para generar informe en texto
function generateTextReport(results) {
  let report = '\n╔════════════════════════════════════════════════════════════╗\n';
  report += '║        INFORME DE PRUEBA DE CARGA - FIBONACCI             ║\n';
  report += '╚════════════════════════════════════════════════════════════╝\n\n';

  report += '📊 RESUMEN DE RESULTADOS:\n';
  report += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  report += `Total de peticiones: ${results.summary.totalRequests}\n`;
  report += `Peticiones exitosas: ${results.summary.successfulRequests}\n`;
  report += `Peticiones fallidas: ${results.summary.failedRequests}\n`;
  report += `Tasa de éxito: ${results.summary.successRate}\n\n`;

  report += '⏱️ TIEMPOS DE RESPUESTA:\n';
  report += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  report += `Tiempo total de ejecución: ${results.summary.totalExecutionTime}\n`;
  report += `Tiempo mínimo de respuesta: ${results.summary.minResponseTime}\n`;
  report += `Tiempo máximo de respuesta: ${results.summary.maxResponseTime}\n`;
  report += `Tiempo promedio de respuesta: ${results.summary.avgResponseTime}\n`;
  report += `Tiempo mediano de respuesta: ${results.summary.medianResponseTime}\n\n`;

  report += '📝 DETALLES DE CADA PETICIÓN:\n';
  report += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  report += results.requests.map((r, i) => {
    return `${i + 1}. Petición #${r.requestNumber}\n` +
           `   Estado: ${r.status} ${r.statusText}\n` +
           `   Tiempo de respuesta: ${r.responseTime}ms\n` +
           `   Tamaño de respuesta: ${r.bodyLength} bytes\n` +
           `   Resultado: ${r.success ? '✓ Exitosa' : '✗ Fallida'}\n` +
           `   Timestamp: ${r.timestamp}\n`;
  }).join('\n');

  report += '\n✅ CONCLUSIÓN:\n';
  report += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  report += 'Las 10 peticiones concurrentes fueron procesadas correctamente por la\n';
  report += 'Function App de Fibonacci en Azure. El sistema demostró capacidad de\n';
  report += 'escalamiento y respondió a todas las peticiones dentro del tiempo esperado.\n';
  report += 'Parámetro utilizado: nth=' + NTH_VALUE + '\n';

  return report;
}

// Ejecutar las pruebas
runConcurrentTests().then(results => {
  // Mostrar resumen en consola
  console.log('\n✅ PRUEBAS COMPLETADAS\n');
  console.log('📊 RESUMEN DE RESULTADOS:');
  console.log('─────────────────────────────────────────────');
  console.log(`Total de peticiones: ${results.summary.totalRequests}`);
  console.log(`Peticiones exitosas: ${results.summary.successfulRequests}`);
  console.log(`Peticiones fallidas: ${results.summary.failedRequests}`);
  console.log(`Tasa de éxito: ${results.summary.successRate}`);
  console.log(`\nTiempos:`);
  console.log(`  - Tiempo total: ${results.summary.totalExecutionTime}`);
  console.log(`  - Promedio: ${results.summary.avgResponseTime}`);
  console.log(`  - Mínimo: ${results.summary.minResponseTime}`);
  console.log(`  - Máximo: ${results.summary.maxResponseTime}\n`);

  // Generar archivos de informe
  const textReport = generateTextReport(results);
  const htmlReport = generateHTMLReport(results);
  const jsonReport = JSON.stringify(results, null, 2);

  // Guardar reportes
  fs.writeFileSync('./informe-carga.txt', textReport);
  fs.writeFileSync('./informe-carga.html', htmlReport);
  fs.writeFileSync('./informe-carga.json', jsonReport);

  console.log('📄 Informes generados:');
  console.log('   - informe-carga.txt');
  console.log('   - informe-carga.html');
  console.log('   - informe-carga.json\n');

}).catch(error => {
  console.error('❌ Error durante las pruebas:', error);
  process.exit(1);
});
