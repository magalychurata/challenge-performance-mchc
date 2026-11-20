# Performance Testing - E-commerce

## 1. Descripción general

Este proyecto tiene como objetivo diseñar, implementar y ejecutar pruebas de rendimiento (Performance Testing) utilizando **Grafana k6**, para evaluar el comportamiento de servicios web ante diferentes niveles de carga.

El proyecto se desarrolla como parte de un challenge técnico para Senior Automation QA y contempla dos partes principales.

### Parte 1: Estrategia de pruebas de performance

Se propone una estrategia de rendimiento para una plataforma de comercio electrónico que procesa aproximadamente 1.500 ventas diarias y que puede incrementar su volumen hasta cinco veces durante eventos especiales, como Black Friday y Navidad.

Se consideran los siguientes tipos de pruebas:

- Baseline Testing.
- Load Testing.
- Stress Testing.
- Spike Testing.
- Soak Testing.
- Recovery Testing.

### Parte 2: Automatización de pruebas con k6

Se implementa un script automatizado utilizando JavaScript y Grafana k6 para evaluar el endpoint:

`POST https://dummyjson.com/products/add`

Se ejecutan dos escenarios de carga:

| Escenario | Tasa solicitada | Duración | Iteraciones esperadas |
|---|---:|---:|---:|
| Escenario 1 | 50 TPS | 1 minuto | 3.000 |
| Escenario 2 | 100 TPS | 1 minuto | 6.000 |

Cada iteración realiza una solicitud de creación de producto con un título único.

## 2. Objetivos del proyecto

- Evaluar el comportamiento del servicio bajo diferentes niveles de carga.
- Medir los tiempos de respuesta.
- Analizar la tasa de errores.
- Validar la autenticación mediante JWT.
- Generar títulos únicos para cada solicitud.
- Identificar posibles problemas de rendimiento.
- Obtener información que permita evaluar el comportamiento del servicio.

## 3. Tecnologías utilizadas

| Tecnología | Descripción |
|---|---|
| Grafana k6 | Herramienta para pruebas de rendimiento. |
| JavaScript | Lenguaje utilizado para desarrollar los scripts. |
| Visual Studio Code | Editor de código. |
| Git | Control de versiones. |
| DummyJSON | API utilizada para realizar las pruebas. |

## 4. Estructura del proyecto

```text
challenge-performance-mchc/
│
├── parte1/
│   └── estrategia-performance.md
│
├── parte2/
│   ├── scripts/
│   │   └── products-load-test.js
│   │
│   ├── results/
│   │   ├── 50-tps/
│   │   │   └── summary.json
│   │   │
│   │   └── 100-tps/
│   │       └── summary.json
│   │
│   └── reports/
│
├── README.md
└── .gitignore
```

### Descripción de las carpetas

- `parte1/`: contiene la estrategia de pruebas de performance.
- `parte2/scripts/`: contiene los scripts automatizados desarrollados con k6.
- `parte2/results/50-tps/`: almacena los resultados del escenario de 50 TPS.
- `parte2/results/100-tps/`: almacena los resultados del escenario de 100 TPS.
- `parte2/reports/`: contiene los reportes de resultados y conclusiones.

## 5. Requisitos previos

Para ejecutar el proyecto se necesitan los siguientes componentes:

- Sistema operativo Windows, Linux o macOS.
- Grafana k6 instalado.
- Visual Studio Code (recomendado).
- Conexión a Internet.
- Acceso a la API DummyJSON.

No es necesario instalar Node.js para ejecutar los scripts con k6.

## 6. Instalación de k6

### Windows

Se puede instalar mediante Windows Package Manager (winget).

Abrir PowerShell y ejecutar:

```powershell
winget install k6
```

Una vez finalizada la instalación, verificar:

```powershell
k6 version
```

### macOS

```bash
brew install k6
```

### Linux

Consultar las instrucciones oficiales de instalación:

https://grafana.com/docs/k6/latest/set-up/install-k6/

## 7. Configuración del proyecto

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

Ingresar a la carpeta:

```bash
cd challenge-performance-mchc
```

Verificar la estructura del proyecto y la existencia del script:

```text
parte2/scripts/products-load-test.js
```

El script obtiene automáticamente el JWT mediante el endpoint:

`POST https://dummyjson.com/auth/login`

Credenciales de demostración:

```json
{
  "username": "emilys",
  "password": "emilyspass"
}
```

El token se obtiene dinámicamente durante la función `setup()` de k6. No es necesario generar ni copiar manualmente el JWT.

## 8. Ejecución de las pruebas de performance

Todas las ejecuciones deben realizarse desde la carpeta raíz del proyecto.

### 8.1. Smoke Test

Antes de ejecutar las pruebas oficiales, se recomienda realizar una prueba pequeña para validar el funcionamiento del script.

Ejecutar:

```powershell
k6 run -e RATE=2 -e DURATION=10s parte2/scripts/products-load-test.js
```

Esta prueba genera una carga solicitada de 2 iteraciones por segundo durante 10 segundos.

Su objetivo es verificar:

- Autenticación correcta.
- Obtención del JWT.
- Envío de solicitudes POST.
- Generación de títulos únicos.
- Validación de respuestas.

### 8.2. Escenario 1: 50 TPS durante 1 minuto

Ejecutar:

```powershell
k6 run -e RATE=50 -e DURATION=1m --summary-export parte2/results/50-tps/summary.json part2/scripts/products-load-test.js
```

Configuración:

- Tasa solicitada: 50 iteraciones por segundo.
- Duración: 60 segundos.
- Iteraciones esperadas: 3.000.

El resultado se almacena en:

```text
parte2/results/50-tps/summary.json
```

### 8.3. Escenario 2: 100 TPS durante 1 minuto

Ejecutar:

```powershell
k6 run -e RATE=100 -e DURATION=1m --summary-export parte2/results/100-tps/summary.json parte2/scripts/products-load-test.js
```

Configuración:

- Tasa solicitada: 100 iteraciones por segundo.
- Duración: 60 segundos.
- Iteraciones esperadas: 6.000.

El resultado se almacena en:

```text
parte2/results/100-tps/summary.json
```

**Importante:** el executor `constant-arrival-rate` controla las iteraciones iniciadas por segundo. En este script cada iteración realiza una solicitud de creación de producto, por lo que el objetivo es 50 o 100 solicitudes por segundo. Las iteraciones realmente ejecutadas deben verificarse en los resultados.

## 9. Funcionamiento del script

El script `products-load-test.js` implementa el siguiente flujo:

1. Lee los parámetros de ejecución.
2. Ejecuta el login mediante `/auth/login`.
3. Obtiene el token JWT.
4. Configura los escenarios de carga.
5. Genera un título único para cada iteración.
6. Construye el body JSON del producto.
7. Envía la solicitud POST a `/products/add`.
8. Envía el JWT en el header Authorization.
9. Valida el código HTTP de respuesta.
10. Verifica que la respuesta contenga el título enviado y un identificador de producto.
11. Registra las métricas de ejecución.

### Ejemplo del body enviado

```json
{
  "title": "Performance-50-1-0-1790000000000",
  "price": 1.23
}
```

El título se genera dinámicamente utilizando la tasa de ejecución, el identificador del usuario virtual, su número de iteración y un timestamp.

### Headers utilizados

```http
Authorization: Bearer <JWT>
Content-Type: application/json
```

## 10. Métricas de rendimiento

Durante las ejecuciones se analizan las siguientes métricas:

| Métrica | Descripción |
|---|---|
| http_req_duration | Tiempo de respuesta de las solicitudes HTTP. |
| http_req_failed | Porcentaje de solicitudes HTTP fallidas. |
| http_reqs | Cantidad de solicitudes HTTP realizadas. |
| iterations | Cantidad de iteraciones ejecutadas. |
| vus | Cantidad de usuarios virtuales activos. |
| dropped_iterations | Iteraciones que no pudieron iniciarse según la tasa solicitada. |
| checks | Resultado de las validaciones funcionales. |
| successful_products | Cantidad de respuestas que superaron todos los checks del producto. |

También se recomienda monitorear CPU, memoria, base de datos y red cuando se realizan pruebas sobre una infraestructura propia.

**Nota:** las métricas HTTP generales también pueden incluir la solicitud de login realizada durante `setup()`. Para un análisis aislado del endpoint de creación de productos, se recomienda agregar etiquetas específicas a las solicitudes y analizar sus métricas por separado.

## 11. Criterios de aceptación

Se proponen los siguientes umbrales iniciales:

| Criterio | Objetivo |
|---|---|
| Tasa de errores HTTP | Inferior al 1%. |
| Percentil 95 | Inferior a 500 ms. |
| Iteraciones descartadas | Igual a 0. |
| Validaciones funcionales | Respuestas correctas según los checks. |

Los valores son criterios propuestos para este challenge y no representan un SLA oficial de DummyJSON ni de un sistema productivo.

La prueba se considera satisfactoria cuando se cumplen los criterios definidos y se logra sostener la tasa solicitada sin errores ni iteraciones descartadas.

## 12. Resultados y reportes

Los resultados se almacenan en archivos JSON generados mediante la opción `--summary-export` de k6.

Ubicación:

```text
parte2/results/50-tps/summary.json
parte2/results/100-tps/summary.json
```

Los reportes ejecutivos se almacenan en:

```text
parte2/reports/
```

El análisis comparativo debe contemplar:

- Tasa de solicitudes ejecutadas.
- Cantidad de iteraciones completadas.
- Tiempo promedio de respuesta.
- Percentil 95 y percentil 99.
- Porcentaje de errores.
- Iteraciones descartadas.
- Resultado de los checks.
- Conclusiones y recomendaciones.

Los valores definitivos se completarán después de ejecutar los escenarios.

## 13. Limitaciones y consideraciones

DummyJSON es un servicio de demostración utilizado para probar el flujo de autenticación y creación de productos.

Las respuestas de creación de productos son simuladas y no representan necesariamente una persistencia real de información.

Por lo tanto:

- Los resultados representan el comportamiento observado del servicio de demostración.
- No deben extrapolarse directamente a una plataforma de comercio electrónico productiva.
- La capacidad de infraestructura, base de datos y escalabilidad de un e-commerce real requiere pruebas en un ambiente controlado y representativo.
- El comportamiento del servicio externo puede variar según su disponibilidad y condiciones de red.

## 14. Conclusión

Este proyecto implementa una estrategia de pruebas de rendimiento y automatización utilizando Grafana k6.

Se evalúan dos escenarios de carga de 50 TPS y 100 TPS durante un minuto, incorporando autenticación JWT, generación de títulos únicos, validaciones funcionales y medición de métricas de rendimiento.

Los resultados permitirán comparar el comportamiento del endpoint ante diferentes niveles de demanda y documentar conclusiones basadas en evidencia.

## 15. Autor

Proyecto desarrollado como parte de un challenge técnico para la posición de Senior Automation QA.

**Tecnología principal:** Grafana k6.