// js/pago.js

export function simularPago(numero) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const limpio = numero.replace(/\s/g, '');
      resolve(limpio === '4000000000000002'
        ? { ok: false, motivo: 'Tarjeta rechazada' }
        : { ok: true });
    }, 1500);
  });
}

// Número de póliza: POL-AAAA-NNNNNN
let contador = 0;

export function generarPoliza() {
  contador = contador + 1;
  return `POL-${new Date().getFullYear()}-${String(contador).padStart(6, '0')}`;
}