// js/validaciones.js
// Cada función recibe un valor y devuelve un mensaje de error, o null si es válido.

// ---------- Paso 1: equipo ----------

export function validarMarca(valor) {
  if (valor === '') return 'Elegí una marca';
  return null;
}

export function validarModelo(valor) {
  const largo = valor.trim().length;
  if (largo < 2 || largo > 40) return 'Ingresá el modelo del equipo';
  return null;
}

export function validarValor(valor) {
  // El input devuelve texto como "600.000": nos quedamos solo con los números
  const numero = Number(String(valor).replace(/\D/g, ''));
  if (numero < 100000 || numero > 2500000) {
    return 'El valor debe estar entre $100.000 y $2.500.000';
  }
  return null;
}

export function validarAntiguedad(valor) {
  if (valor === '') return 'Indicá la antigüedad';
  return null;
}

// ---------- Paso 3: datos personales ----------

export function validarNombre(valor) {
  if (valor.trim().length < 2) return 'Ingresá tu nombre';
  return null;
}

export function validarApellido(valor) {
  if (valor.trim().length < 2) return 'Ingresá tu apellido';
  return null;
}

export function validarDni(valor) {
  if (!/^\d{7,8}$/.test(valor)) return 'El DNI debe tener 7 u 8 números';
  return null;
}

export function validarNacimiento(valor) {
  const mensaje = 'Tenés que ser mayor de edad';
  if (valor === '') return mensaje;

  // El input date entrega "aaaa-mm-dd"
  const [anio, mes, dia] = valor.split('-').map(Number);
  const hoy = new Date();

  let edad = hoy.getFullYear() - anio;
  // Si todavía no cumplió años este año, restamos uno
  const yaCumplio =
    (hoy.getMonth() + 1 > mes) || (hoy.getMonth() + 1 === mes && hoy.getDate() >= dia);
  if (!yaCumplio) edad = edad - 1;

  if (edad < 18) return mensaje;
  return null;
}

export function validarEmail(valor) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) return 'Ingresá un email válido';
  return null;
}

export function validarCelular(valor) {
  const mensaje = 'Ej.: 11 5555-1234';
  // Se ignoran espacios y guiones
  const limpio = valor.replace(/[\s-]/g, '');
  // 10 dígitos, sin 0 ni 15 adelante
  if (!/^\d{10}$/.test(limpio)) return mensaje;
  if (limpio.startsWith('0') || limpio.startsWith('15')) return mensaje;
  return null;
}

export function validarTerminos(tildado) {
  if (!tildado) return 'Tenés que aceptar los términos';
  return null;
}

// ---------- Paso 4: pago ----------

export function validarTarjeta(valor) {
  // Se ignoran espacios
  if (!/^\d{16}$/.test(valor.replace(/\s/g, ''))) return 'Número de tarjeta inválido';
  return null;
}

export function validarVencimiento(valor) {
  const mensaje = 'Vencimiento inválido';
  const partes = /^(\d{2})\/(\d{2})$/.exec(valor);   // formato MM/AA
  if (!partes) return mensaje;

  const mes = Number(partes[1]);
  const anio = 2000 + Number(partes[2]);
  if (mes < 1 || mes > 12) return mensaje;

  // Fecha futura: posterior al mes actual
  const hoy = new Date();
  const mesActual = hoy.getFullYear() * 12 + hoy.getMonth() + 1;
  if (anio * 12 + mes <= mesActual) return mensaje;
  return null;
}

export function validarCvv(valor) {
  if (!/^\d{3}$/.test(valor)) return 'CVV inválido';
  return null;
}

export function validarTitular(valor) {
  if (valor.trim() === '') return 'Ingresá el nombre del titular';
  return null;
}