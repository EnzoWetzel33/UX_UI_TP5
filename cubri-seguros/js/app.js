// js/app.js
import { solicitud, irAPaso, actualizarEquipo } from './estado.js';
import { render, mostrarError } from './render.js';
import {
  validarMarca,
  validarModelo,
  validarValor,
  validarAntiguedad,
} from './validaciones.js';

// Arranque: pinta el estado inicial (paso 0 = inicio)
render();

// Evita que los formularios recarguen la página
document.querySelectorAll('form').forEach((form) => {
  form.addEventListener('submit', (e) => e.preventDefault());
});

// ---------- Navegación ----------

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

// ---------- Paso 1: Cotizar ----------

const inputMarca = document.getElementById('marca');
const inputModelo = document.getElementById('modelo');
const inputValor = document.getElementById('valor');
const radiosAntiguedad = document.querySelectorAll('input[name="antiguedad"]');
const btnVerPlanes = document.getElementById('btn-ver-planes');

// ¿Están bien los 4 campos? (sin mostrar errores, solo para el botón)
function equipoEsValido() {
  const e = solicitud.equipo;
  return (
    validarMarca(e.marca) === null &&
    validarModelo(e.modelo) === null &&
    validarValor(e.valor) === null &&
    validarAntiguedad(e.antiguedad) === null
  );
}

function actualizarBotonVerPlanes() {
  btnVerPlanes.disabled = !equipoEsValido();
}

// Marca
inputMarca.addEventListener('change', () => {
  actualizarEquipo('marca', inputMarca.value);
  actualizarBotonVerPlanes();
});
inputMarca.addEventListener('blur', () => {
  mostrarError('marca', validarMarca(solicitud.equipo.marca));
});

// Modelo
inputModelo.addEventListener('input', () => {
  actualizarEquipo('modelo', inputModelo.value);
  actualizarBotonVerPlanes();
});
inputModelo.addEventListener('blur', () => {
  mostrarError('modelo', validarModelo(solicitud.equipo.modelo));
});

// Valor del equipo (se guarda como número: "600.000" → 600000)
inputValor.addEventListener('input', () => {
  actualizarEquipo('valor', Number(inputValor.value.replace(/\D/g, '')));
  actualizarBotonVerPlanes();
});
inputValor.addEventListener('blur', () => {
  mostrarError('valor', validarValor(solicitud.equipo.valor));
});

// Antigüedad (los 3 chips)
radiosAntiguedad.forEach((radio) => {
  radio.addEventListener('change', () => {
    actualizarEquipo('antiguedad', radio.value);
    actualizarBotonVerPlanes();
  });
  radio.addEventListener('blur', () => {
    mostrarError('antiguedad', validarAntiguedad(solicitud.equipo.antiguedad));
  });
});

window.solicitud = solicitud;   // PROVISORIO: solo para mirar el estado en la consola