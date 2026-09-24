export interface Comision {
  id_comision: number;
  id_cliente: number;
  id_estado?: number;
  nombre_estado?: string;
  estado?: string; // alias que devuelve GET /api/comisiones (listado)
  artista?: string;
  nombre_ig: string;
  cuenta_ig: string;
  titulo: string;
  descripcion?: string | null;
  imagen_de_comision?: string | null;
  precio_total: number;
  fecha_creacion?: string;
  fecha_limite?: string | null;
  visible?: number;
}

export interface NuevaComision {
  nombre_ig: string;
  cuenta_ig: string;
  titulo: string;
  descripcion?: string;
  precio_total: number;
  fecha_limite?: string;
  id_cliente?: number; // solo lo usa el admin al crear a nombre de una artista
}

export interface SaldoComision {
  id_comision: number;
  titulo: string;
  id_cliente: number;
  precio_total: number;
  total_pagado: number;
  saldo_pendiente: number;
}

/**
 * Comisión con su saldo ya resuelto. El dashboard trabaja con esto para
 * poder pintar el badge de arte y el de dinero por separado.
 */
export interface ComisionVista extends Comision {
  saldo?: SaldoComision;
}
