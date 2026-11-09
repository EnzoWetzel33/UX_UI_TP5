// js/estado.js
import { render } from './render.js';

export const solicitud = {
  paso: 0,   // 0 = inicio, 1..4 = checkout, 5 = éxito, 6 = error
  equipo: { marca: '', modelo: '', valor: 0, antiguedad: '' },
  plan: 'plus',
  titular: { nombre: '', apellido: '', dni: '', nacimiento: '',
             email: '', celular: '', terminos: false },
  pago: { metodo: 'credito', tarjeta: '', vencimiento: '', cvv: '', titular: '' },
  poliza: null,
  errorPago: null,   // motivo del rechazo (pantalla 07)
};

// Los planes se cargan desde data/planes.json (son datos fijos, no parte del formulario)
export const planes = [];

export function irAPaso(n) {
  solicitud.paso = n;
  render();   // siempre después de cambiar el estado
}

export function actualizarEquipo(campo, valor) {
  solicitud.equipo[campo] = valor;
}

export function elegirPlan(id) {
  solicitud.plan = id;
  render();
}

export function actualizarTitular(campo, valor) {
  solicitud.titular[campo] = valor;
}

export function actualizarPago(campo, valor) {
  solicitud.pago[campo] = valor;
}

export function guardarPoliza(poliza) {
  solicitud.poliza = poliza;
}

export function guardarErrorPago(motivo) {
  solicitud.errorPago = motivo;
}

// Vuelve todo al estado inicial ("Volver al inicio")
export function reiniciar() {
  solicitud.paso = 0;
  solicitud.equipo = { marca: '', modelo: '', valor: 0, antiguedad: '' };
  solicitud.plan = 'plus';
  solicitud.titular = { nombre: '', apellido: '', dni: '', nacimiento: '',
                        email: '', celular: '', terminos: false };
  solicitud.pago = { metodo: 'credito', tarjeta: '', vencimiento: '', cvv: '', titular: '' };
  solicitud.poliza = null;
  solicitud.errorPago = null;
}