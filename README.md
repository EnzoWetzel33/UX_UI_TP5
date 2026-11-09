# Cubrí Seguros · Flujo de contratación digital de seguros

Trabajo Práctico Nº  5 de **Diseño UXUI 2026** · Licenciatura en Sistemas de Información · FCyT, Sede Concepción del Uruguay.

Front-end de un checkout de **Seguro de Celular**: el usuario cotiza, elige un plan, carga sus datos, paga (simulado) y recibe su número de póliza. No hay backend, base de datos ni pagos reales.

- **Sitio publicado:** https://TU-SITIO.netlify.app
- **Repositorio:** https://github.com/EnzoWetzel33/UX_UI_TP5.git
- **Diseño en Figma:** https://www.figma.com/design/vJrfOUfiOI7OSeTtRfCloh

## Stack

- HTML5
- Tailwind CSS v4 (CDN, sin build)
- Basecoat UI 1.1.0 (solo CSS, sin su JavaScript)
- JavaScript vanilla con módulos ES (sin frameworks ni librerías de validación)

## Cómo correrlo

No requiere Node ni compilación. Todo se carga por CDN.

1. Clonar el repositorio:
   ```
   git clone https://github.com/EnzoWetzel33/UX_UI_TP5.git
   ```
2. Abrir la carpeta en Visual Studio Code.
3. Instalar la extensión **Live Server**, hacer click derecho sobre `index.html` y elegir **Open with Live Server**.

> No abrir `index.html` con doble click (`file://`): los módulos de JavaScript y el `fetch` de `data/planes.json` necesitan un servidor.

## Estructura del proyecto

```
cubri-seguros/
├── index.html            ← una sola página; cada paso es una <section data-paso="N">
├── css/
│   └── tokens.css        ← variables de Basecoat y pequeños ajustes
├── data/
│   └── planes.json       ← planes y tasas (se cargan con fetch)
├── js/
│   ├── app.js            ← arranque, eventos y navegación
│   ├── estado.js         ← objeto solicitud + funciones para modificarlo
│   ├── render.js         ← pinta cada paso a partir del estado
│   ├── validaciones.js   ← funciones puras: reciben un valor y devuelven error o null
│   ├── cotizador.js      ← calcularCuota()
│   └── pago.js           ← simularPago() y generarPoliza()
└── README.md
```

## Decisiones tomadas

- **Un único estado.** Toda la información del flujo vive en el objeto `solicitud` (`estado.js`). Cada evento modifica el estado y después llama a `render()`; el DOM solo muestra lo que dice el estado.
- **Una sola página.** Cada paso es una `<section data-paso="N">` que `render()` muestra u oculta con el atributo `hidden`. Como los pasos no se destruyen, "Volver" conserva los datos cargados.
- **Stepper y resúmenes generados una sola vez.** `renderStepper()` y `renderResumenLateral()` generan el HTML desde el estado para todos los pasos, sin copias para mobile y desktop.
- **Una única función de cuota.** `calcularCuota()` es el único lugar donde se calcula el precio, así las cards de plan, el resumen y la pantalla de éxito nunca muestran valores distintos.
- **Validaciones como funciones puras.** Cada función de `validaciones.js` recibe un valor y devuelve un mensaje de error o `null`. Se usan dos veces: para mostrar el error al salir del campo (`blur`) y para habilitar o deshabilitar el botón.
- **Errores accesibles.** Cada input tiene su `<label for>`; los errores usan `aria-invalid`, `aria-describedby` y `role="alert"`; al intentar pagar con datos inválidos el foco va al primer campo con error.
- **Pago sin doble click.** El botón "Pagar y contratar" se deshabilita y dice "Procesando…" durante 1,5 s, y se vuelve a habilitar al terminar.
- **Un campo extra en el estado.** Agregué `errorPago` a `solicitud` para guardar el motivo del rechazo y mostrarlo en la pantalla de error desde el estado.
- **Mobile first.** Se maquetó primero a 390 px y se agregó el diseño de 1440 px con el prefijo `lg:` de Tailwind, con el mismo código para ambos tamaños.
- **Componentes.** Se usó Basecoat UI (botón, field, input, select, card, badge, alert) siempre que existía el componente. El stepper, las cards de plan y los chips de antigüedad se armaron con utilidades de Tailwind.
- **Barra de estado del celular.** No se construyó: en el Figma está marcada como "solo decorativa en el mockup" y en un dispositivo real la muestra el sistema.
- **Productos del catálogo.** Solo Celular está habilitado; Hogar, Bicicleta y Viaje muestran "Próximamente", como piden los criterios de aceptación.
- **Diferencias conocidas con el Figma.** No se hizo una pasada de pulido fino, por lo que puede haber pequeñas diferencias de espaciado y de colores en algunos elementos (por ejemplo, el fondo del resumen y del aviso de simulación en mobile).

## Reglas de negocio verificadas

Casos de prueba de cuota (sección 5.1 del TP):

| Valor | Antigüedad | Básico | Plus | Premium |
|---|---|---|---|---|
| $ 600.000 | Menos de 1 año | $ 2.000 | $ 3.000 | $ 4.500 |
| $ 600.000 | 1 a 2 años | $ 2.200 | $ 3.300 | $ 4.950 |
| $ 1.200.000 | Más de 2 años | $ 5.000 | $ 7.500 | $ 11.250 |

Pago simulado (solo tarjetas de prueba, nunca datos reales):

| Número de tarjeta | Resultado |
|---|---|
| `4111 1111 1111 1111` | Aprobado → pantalla de éxito con póliza `POL-AAAA-NNNNNN` |
| `4000 0000 0000 0002` | Rechazado → pantalla de error (los datos se conservan) |
| Cualquier otro número válido | Aprobado |

## Capturas

### Mobile (390 px)

| 01 · Inicio | 02 · Cotizar | 03 · Elegir plan | 04 · Datos |
|---|---|---|---|
| ![Inicio mobile](capturas/mobile-01-inicio.png) | ![Cotizar mobile](capturas/mobile-02-cotizar.png) | ![Planes mobile](capturas/mobile-03-planes.png) | ![Datos mobile](capturas/mobile-04-datos.png) |

| 05 · Pago | 06 · Éxito | 07 · Error de pago |
|---|---|---|
| ![Pago mobile](capturas/mobile-05-pago.png) | ![Éxito mobile](capturas/mobile-06-exito.png) | ![Error mobile](capturas/mobile-07-error.png) |

### Desktop (1440 px)

**01 · Inicio**

![Inicio desktop](capturas/desktop-01-inicio.png)

**02 · Cotizar**

![Cotizar desktop](capturas/desktop-02-cotizar.png)

**03 · Elegir plan**

![Planes desktop](capturas/desktop-03-planes.png)

**04 · Datos personales**

![Datos desktop](capturas/desktop-04-datos.png)

**05 · Pago**

![Pago desktop](capturas/desktop-05-pago.png)

**06 · Éxito**

![Éxito desktop](capturas/desktop-06-exito.png)

**07 · Error de pago**

![Error desktop](capturas/desktop-07-error.png)

## Bonus

Ninguno.

## Checklist de entrega

- [x] Las 7 pantallas existen y se ven bien en 390 px y en 1440 px.
- [x] Los 3 casos de prueba de la sección 5.1 dan exactamente el valor esperado.
- [x] No se puede avanzar con datos inválidos y cada error tiene su mensaje.
- [x] "Volver" conserva los datos en todos los pasos.
- [x] La tarjeta `4000 0000 0000 0002` lleva al error y "Reintentar" vuelve al pago con todo cargado.
- [x] La póliza tiene formato `POL-AAAA-NNNNNN`.
- [x] No hay errores en la consola del navegador.
- [x] El sitio está publicado y el README tiene capturas y la URL.
