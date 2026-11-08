// js/app.js
import { solicitud, irAPaso } from './estado.js';
import { render } from './render.js';

// Arranque: pinta el estado inicial (paso 0 = inicio)
render();

// Evita que los formularios recarguen la página
document.querySelectorAll('form').forEach((form) => {
  form.addEventListener('submit', (e) => e.preventDefault());
});

// Conecta un botón (por su id) con un paso
function conectarBoton(id, paso) {
  document.getElementById(id).addEventListener('click', () => irAPaso(paso));
}

conectarBoton('btn-empezar', 1);          // Inicio → Cotizar
conectarBoton('btn-ver-planes', 2);       // Cotizar → Elegir plan
conectarBoton('btn-continuar-plan', 3);   // Elegir plan → Datos
conectarBoton('btn-continuar-pago', 4);   // Datos → Pago
conectarBoton('btn-pagar', 5);            // Pago → Éxito (provisorio, el pago real es del hito 4)
conectarBoton('btn-volver-inicio', 0);    // Éxito → Inicio
conectarBoton('btn-reintentar', 4);       // Error → Pago
conectarBoton('btn-cambiar-medio', 4);    // Error → Pago

// "Volver": lleva al paso anterior (las 4 flechas del header)
document.querySelectorAll('[data-accion="volver"]').forEach((boton) => {
  boton.addEventListener('click', () => irAPaso(solicitud.paso - 1));
});