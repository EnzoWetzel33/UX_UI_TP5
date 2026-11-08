// js/cotizador.js

// Factor según la antigüedad (los nombres coinciden con los value de los chips)
export const FACTORES = {
  menos1: 1.00,   // Menos de 1 año
  '1a2': 1.10,    // 1 a 2 años
  mas2: 1.25,     // Más de 2 años
};

// Única función que calcula la cuota (así el resumen y los planes nunca difieren)
export function calcularCuota(valor, tasaAnual, factor) {
  return Math.round(valor * tasaAnual / 12 * factor);
}