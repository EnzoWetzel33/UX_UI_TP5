// js/app.js
import { solicitud, irAPaso, actualizarEquipo, actualizarTitular, planes, elegirPlan } from './estado.js';
import { render, mostrarError } from './render.js';
import {
  validarMarca,
  validarModelo,
  validarValor,
  validarAntiguedad,
  validarNombre,
  validarApellido,
  validarDni,
  validarNacimiento,
  validarEmail,
  validarCelular,
  validarTerminos,
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

// ---------- Paso 2: Elegir plan ----------

// "Ver planes": carga planes.json (solo la primera vez) y pasa al paso 2
btnVerPlanes.addEventListener('click', async () => {
  if (planes.length === 0) {
    const respuesta = await fetch('data/planes.json');
    const lista = await respuesta.json();
    planes.push(...lista);
  }
  irAPaso(2);
});

// Elegir un plan: se guarda en el estado y se vuelve a pintar
document.querySelectorAll('input[name="plan"]').forEach((radio) => {
  radio.addEventListener('change', () => elegirPlan(radio.value));
});

// ---------- Paso 3: Datos personales ----------

const btnContinuarPago = document.getElementById('btn-continuar-pago');

// Los id coinciden con los nombres de solicitud.titular
const camposTitular = [
  { id: 'nombre', validar: validarNombre },
  { id: 'apellido', validar: validarApellido },
  { id: 'dni', validar: validarDni },
  { id: 'nacimiento', validar: validarNacimiento },
  { id: 'email', validar: validarEmail },
  { id: 'celular', validar: validarCelular },
];

// ¿Está todo bien? (sin mostrar errores, solo para el botón)
function titularEsValido() {
  const t = solicitud.titular;
  return (
    validarNombre(t.nombre) === null &&
    validarApellido(t.apellido) === null &&
    validarDni(t.dni) === null &&
    validarNacimiento(t.nacimiento) === null &&
    validarEmail(t.email) === null &&
    validarCelular(t.celular) === null &&
    validarTerminos(t.terminos) === null
  );
}

function actualizarBotonContinuarPago() {
  btnContinuarPago.disabled = !titularEsValido();
}

// Los 6 campos de texto hacen lo mismo: guardar al escribir, validar al salir
camposTitular.forEach(({ id, validar }) => {
  const input = document.getElementById(id);

  input.addEventListener('input', () => {
    actualizarTitular(id, input.value);
    actualizarBotonContinuarPago();
  });

  input.addEventListener('blur', () => {
    mostrarError(id, validar(solicitud.titular[id]));
  });
});

// Términos (checkbox)
const inputTerminos = document.getElementById('terminos');

inputTerminos.addEventListener('change', () => {
  actualizarTitular('terminos', inputTerminos.checked);
  mostrarError('terminos', validarTerminos(solicitud.titular.terminos));
  actualizarBotonContinuarPago();
});

window.solicitud = solicitud;   // PROVISORIO: solo para mirar el estado en la consola
