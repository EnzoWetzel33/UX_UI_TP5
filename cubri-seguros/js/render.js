// js/render.js
import { solicitud, planes } from './estado.js';
import { calcularCuota, FACTORES } from './cotizador.js';

const NOMBRES_PASOS = ['Cotizar', 'Plan', 'Datos', 'Pago'];

// Formato de moneda (tip 3 del TP)
const formatoMoneda = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export function render() {
  document.querySelectorAll('[data-paso]').forEach((s) => {
    s.hidden = Number(s.dataset.paso) !== solicitud.paso;
  });
  renderStepper();
  renderPlanes();
  renderResumen();
  renderExito();
  renderError();
}

// Cuota mensual de un plan según el equipo cargado.
// Es la única forma de calcularla: las cards, el resumen y el éxito usan esta función.
function cuotaDe(plan) {
  return calcularCuota(
    solicitud.equipo.valor,
    plan.tasaAnual,
    FACTORES[solicitud.equipo.antiguedad]
  );
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

// Pantalla 03: precio de cada card y plan marcado según el estado
function renderPlanes() {
  if (solicitud.equipo.antiguedad === '') return;   // solicitud vacía: nada que calcular

  planes.forEach((plan) => {
    const precio = document.querySelector(`[data-precio="${plan.id}"]`);
    precio.textContent = formatoMoneda.format(cuotaDe(plan));
  });

  document.querySelectorAll('input[name="plan"]').forEach((radio) => {
    radio.checked = radio.value === solicitud.plan;
  });
}

// Resúmenes generados desde el estado (footer del paso 2 y resumen final del paso 4)
function renderResumen() {
  const plan = planes.find((p) => p.id === solicitud.plan);
  if (!plan || solicitud.equipo.antiguedad === '') return;   // todavía no hay datos

  const cuota = formatoMoneda.format(cuotaDe(plan));
  const equipo = solicitud.equipo;
  const titular = solicitud.titular;

  // Footer del paso 2
  document.querySelector('[data-resumen="detalle"]').textContent =
    `Plan ${plan.nombre} · ${equipo.modelo}`;
  document.querySelector('[data-resumen="total"]').textContent = `${cuota}/mes`;

  // Resumen final del paso 4
  document.querySelector('[data-final="seguro"]').textContent = `Celular · Plan ${plan.nombre}`;
  document.querySelector('[data-final="equipo"]').textContent = `${equipo.marca} ${equipo.modelo}`;
  document.querySelector('[data-final="titular"]').textContent = `${titular.nombre} ${titular.apellido}`;
  document.querySelector('[data-final="total"]').textContent = cuota;
}

// Pantalla 06 (éxito): se llena cuando ya hay una póliza
function renderExito() {
  if (!solicitud.poliza) return;

  const plan = planes.find((p) => p.id === solicitud.plan);

  document.getElementById('exito-nombre').textContent = solicitud.titular.nombre;
  document.getElementById('exito-email').textContent = solicitud.titular.email;
  document.getElementById('exito-poliza').textContent = solicitud.poliza;
  document.getElementById('exito-plan').textContent = plan.nombre;
  document.getElementById('exito-vigencia').textContent = new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  document.getElementById('exito-cuota').textContent = formatoMoneda.format(cuotaDe(plan));
}

// Pantalla 07 (error): muestra el motivo del rechazo
function renderError() {
  if (!solicitud.errorPago) return;
  document.getElementById('error-motivo').textContent = `${solicitud.errorPago}.`;
}

// Muestra el mensaje de error de un campo (o lo oculta si mensaje es null)
export function mostrarError(id, mensaje) {
  const control = document.getElementById(id);
  const campo = control.closest('.field');
  const error = document.getElementById(id + '-error');

  if (mensaje) {
    error.textContent = mensaje;
    error.hidden = false;
    control.setAttribute('aria-invalid', 'true');
    control.setAttribute('aria-describedby', id + '-error');
    if (campo) campo.setAttribute('data-invalid', 'true');
  } else {
    error.textContent = '';
    error.hidden = true;
    control.removeAttribute('aria-invalid');
    control.removeAttribute('aria-describedby');
    if (campo) campo.removeAttribute('data-invalid');
  }
}