# 🚀 Guía de Ejecución - Prueba de Carga Concurrente con NEWMAN

## Descripción del Punto 5

Este documento describe cómo ejecutar **10 peticiones concurrentes** a la Function App de Fibonacci en Azure usando NEWMAN y generar un informe de resultados.

---

## 📋 Requisitos Previos

1. **Node.js** instalado en tu equipo
2. **NEWMAN** instalado globalmente: `npm install -g newman`
3. **Extensión de NEWMAN en VSCode** (ya instalada según mencionaste)
4. **URL de la Function App**: `https://functionprojectfibonacci-fhf9czb7cxh8hxcc.canadacentral-01.azurewebsites.net`
5. Los archivos de colección generados en este proyecto

---

## 📁 Archivos Generados

- **`Fibonacci-Postman-Collection.json`**: Colección de POSTMAN con 10 peticiones concurrentes
- **`test-carga-concurrente.js`**: Script Node.js para ejecutar pruebas de carga

---

## ✅ Opción 1: Ejecutar con Script Node.js (RECOMENDADO)

Este método es más eficiente para peticiones verdaderamente concurrentes.

### Pasos:

1. **Instala axios** (si no lo tienes):
   ```bash
   npm install axios
   ```

2. **Ejecuta el script**:
   ```bash
   node test-carga-concurrente.js
   ```

3. **Resultados**: Se generarán 3 archivos en la raíz del proyecto:
   - `informe-carga.txt` - Informe en texto plano
   - `informe-carga.html` - Informe visual en HTML (abre en navegador)
   - `informe-carga.json` - Datos crudos en JSON

---

## ✅ Opción 2: Ejecutar con NEWMAN

NEWMAN es la herramienta oficial de Postman para ejecutar colecciones desde línea de comandos.

### Pasos:

1. **Verifica que NEWMAN está instalado**:
   ```bash
   newman --version
   ```

2. **Ejecuta la colección** (peticiones secuenciales):
   ```bash
   newman run Fibonacci-Postman-Collection.json -e environment.json --reporters cli,json
   ```

3. **Para simular concurrencia con NEWMAN**, puedes crear múltiples iteraciones:
   ```bash
   newman run Fibonacci-Postman-Collection.json --iterations 1 --reporters cli,json,html --reporter-json-export results.json --reporter-html-export report.html
   ```

4. **Para verdadera concurrencia**, combina con herramientas como Apache JMeter o mantén el script Node.js

---

## 📊 Interpretación de Resultados

### Métricas Principales:

| Métrica | Descripción |
|---------|-----------|
| **Total de peticiones** | 10 |
| **Peticiones exitosas** | Número de respuestas con status 200 |
| **Tasa de éxito** | Porcentaje de peticiones exitosas |
| **Tiempo promedio** | Tiempo promedio de respuesta |
| **Tiempo mínimo** | Respuesta más rápida |
| **Tiempo máximo** | Respuesta más lenta |
| **Tiempo total** | Tiempo total de ejecución |

### Análisis de Escalabilidad:

- ✅ **Si todas las peticiones responden exitosamente**: La Function App maneja bien la concurrencia
- ⚠️ **Si hay timeouts o errores**: Puede haber limitaciones de recursos
- 📈 **Si los tiempos son consistentes**: Indica escalamiento automático correcto

---

## 🔧 Personalización

### Modificar el parámetro `nth`:

Abre `test-carga-concurrente.js` y cambia:
```javascript
const NTH_VALUE = 1000000; // Cambiar este valor
```

Valores sugeridos:
- `500000` - Carga media
- `1000000` - Carga alta (como en el README)
- `2000000` - Carga muy alta

### Cambiar número de peticiones:

```javascript
const NUM_REQUESTS = 10; // Cambiar a 5, 20, 100, etc.
```

---

## 📈 Verificación en Azure Portal

Para monitorear la Function App mientras ejecutas las pruebas:

1. Abre [Azure Portal](https://portal.azure.com)
2. Ve a tu Function App "functionprojectfibonacci"
3. En el panel izquierdo, ve a **Monitor**
4. Observa:
   - Invocaciones
   - Duración promedio
   - Tasa de éxito
   - Errores (si los hay)

---

## 📝 Ejemplo de Salida Esperada

```
╔════════════════════════════════════════════╗
║   PRUEBA DE CARGA - FIBONACCI FUNCTION APP    ║
╚════════════════════════════════════════════╝

Base URL: https://functionprojectfibonacci-fhf9czb7cxh8hxcc.canadacentral-01.azurewebsites.net/api/Fibonacci
Parámetro (nth): 1000000
Número de peticiones concurrentes: 10

Iniciando pruebas...

✅ PRUEBAS COMPLETADAS

📊 RESUMEN DE RESULTADOS:
─────────────────────────────────────────────
Total de peticiones: 10
Peticiones exitosas: 10
Peticiones fallidas: 0
Tasa de éxito: 100%

Tiempos:
  - Tiempo total: 45500ms
  - Promedio: 4550ms
  - Mínimo: 4200ms
  - Máximo: 5100ms

📄 Informes generados:
   - informe-carga.txt
   - informe-carga.html
   - informe-carga.json
```

---

## ✨ Siguiente Paso

Una vez ejecutadas las pruebas y generado el informe:

1. **Revisa el informe HTML** para una visualización completa
2. **Verifica los tiempos de respuesta** - ¿Son consistentes?
3. **Compara con el requisito del README**: "consumo de CPU del sistema no puede superar el 70%"
4. **Documenta los resultados** en tu reporte de laboratorio

---

## 🆘 Troubleshooting

| Problema | Solución |
|---------|----------|
| "Error: Cannot find module 'axios'" | Ejecuta: `npm install axios` |
| "Function not found" | Verifica que la URL es correcta |
| "Timeout errors" | Aumenta el timeout en el script (línea timeout) |
| "All requests failed" | Verifica conectividad a internet |
| NEWMAN no funciona | Instala con: `npm install -g newman` |

---

## 📞 Notas Importantes

- Las peticiones se envían **completamente en paralelo** en el script Node.js
- Cada petición calcula el número de Fibonacci en la posición 1,000,000
- Se recolectan métricas detalladas de cada petición
- Los informes incluyen timestamps para análisis temporal

**¡Listo para ejecutar las pruebas! 🚀**
