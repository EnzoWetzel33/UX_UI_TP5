// js/render.js
import { solicitud } from './estado.js';

const NOMBRES_PASOS = ['Cotizar', 'Plan', 'Datos', 'Pago'];

export function render() {
  document.querySelectorAll('[data-paso]').forEach((s) => {
    s.hidden = Number(s.dataset.paso) !== solicitud.paso;
  });
  renderStepper();
  renderResumen();
}

function renderStepper() {
  let html = '<ol class="flex items-center gap-1.5 text-xs font-semibold">';

  NOMBRES_PASOS.forEach((nombre, i) => {
    const n = i + 1;   // número de paso: 1, 2, 3, 4

    // Línea entre pasos: verde si el paso anterior ya está completo
    if (n > 1) {
      const colorLinea = (n - 1) < solicitud.paso ? 'bg-emerald-600' : 'bg-slate-200';
      html += `<li class="h-px flex-1 ${colorLinea}"></li>`;
    }

    if (n < solicitud.paso) {
      // Completo
      html += `
        <li class="flex items-center gap-1.5 text-emerald-600">
          <span class="flex size-5 items-center justify-center rounded-full bg-emerald-600 text-white">✓</span>
          ${nombre}
        </li>`;
    } else if (n === solicitud.paso) {
      // Activo
      html += `
        <li class="flex items-center gap-1.5 text-indigo-600" aria-current="step">
          <span class="flex size-5 items-center justify-center rounded-full bg-indigo-600 text-white">${n}</span>
          ${nombre}
        </li>`;
    } else {
      // Pendiente
      html += `
        <li class="flex items-center gap-1.5 text-slate-500">
          <span class="flex size-5 items-center justify-center rounded-full border border-slate-200 bg-white">${n}</span>
          ${nombre}
        </li>`;
    }
  });

  html += '</ol>';

  // Se escribe en los 4 contenedores; solo se ve el de la pantalla actual
  document.querySelectorAll('[data-stepper]').forEach((contenedor) => {
    contenedor.innerHTML = html;
  });
}

function renderResumen() {
  // la completamos más adelante
}