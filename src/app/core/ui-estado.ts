import { environment } from '../../environments/environment';
import { SaldoComision } from '../models/comision.model';

/* =====================================================================
   1. ESTADO DEL ARTE  (estado_comision.nombre_estado)
   Los nombres coinciden EXACTO con el catálogo del SQL.
   ===================================================================== */

export interface EstiloEstado {
  clase: string;   // clase CSS del badge
  icono: string;   // nombre para <dn-icon>
}

export const ESTADOS_ARTE = [
  'Pendiente por dibujar',
  'En boceto',
  'Dibujado',
  'Pagado',
  'Entregado',
  'Cancelado'
] as const;

/** Filtro que no existe en `estado_comision`: sale de vw_saldo_comisiones. */
export const FILTRO_DEUDA = 'Pendiente de pago';

const MAPA: Record<string, EstiloEstado> = {
  // Naranja resaltante
  'Pendiente por dibujar': { 
    clase: 'bg-orange-500 text-white font-bold shadow-sm', 
    icono: 'reloj' 
  },
  // Plomo / Gris resaltante
  'En boceto': { 
    clase: 'bg-slate-500 text-white font-bold shadow-sm', 
    icono: 'lapiz' 
  },
  // Celeste resaltante
  'Dibujado': { 
    clase: 'bg-sky-400 text-white font-bold shadow-sm', 
    icono: 'pincel' 
  },
  // Verde resaltante
  'Pagado': { 
    clase: 'bg-emerald-600 text-white font-bold shadow-sm', 
    icono: 'moneda' 
  },
  // Verde resaltante
  'Entregado': { 
    clase: 'bg-emerald-500 text-white font-bold shadow-sm', 
    icono: 'sobre' 
  },
  'Entregada': { 
    clase: 'bg-emerald-500 text-white font-bold shadow-sm', 
    icono: 'sobre' 
  },
  // Rojo resaltante
  'Cancelado': { 
    clase: 'bg-red-500 text-white font-bold shadow-sm', 
    icono: 'equis' 
  },
  // Amarillo / Ámbar resaltante
  [FILTRO_DEUDA]: { 
    clase: 'bg-amber-500 text-white font-bold shadow-sm', 
    icono: 'billetera' 
  }
};

const POR_DEFECTO: EstiloEstado = { clase: 'dn-estado-pendiente', icono: 'calavera-mono' };

export function estiloEstado(nombre?: string | null): EstiloEstado {
  return (nombre && MAPA[nombre]) || POR_DEFECTO;
}

/* =====================================================================
   2. ESTADO FINANCIERO (independiente del anterior)
   El dashboard viejo los mezclaba: una comisión puede estar pagada al
   100% y seguir 'Pendiente por dibujar'.
   ===================================================================== */

export type EstadoPago = 'full' | 'parcial' | 'cero';

export function estadoPago(saldo?: SaldoComision | null): EstadoPago {
  if (!saldo) return 'cero';
  const pagado = Number(saldo.total_pagado ?? 0);
  const pendiente = Number(saldo.saldo_pendiente ?? 0);
  if (pendiente <= 0.009) return 'full';   // tolerancia por DECIMAL(10,2)
  return pagado > 0 ? 'parcial' : 'cero';
}

export function clasePago(e: EstadoPago): string {
  return e === 'full' ? 'dn-pago-full' : e === 'parcial' ? 'dn-pago-parcial' : 'dn-pago-cero';
}

export function etiquetaPago(e: EstadoPago, saldo?: SaldoComision | null): string {
  const falta = Number(saldo?.saldo_pendiente ?? 0).toFixed(2);
  if (e === 'full') return 'Pagado 100%';
  if (e === 'parcial') return `Abonado · falta S/ ${falta}`;
  return `Sin pagos · S/ ${falta}`;
}

/** 0–100 para la barra de progreso. */
export function progresoPago(saldo?: SaldoComision | null): number {
  const total = Number(saldo?.precio_total ?? 0);
  if (!total) return 0;
  return Math.min(100, Math.round((Number(saldo?.total_pagado ?? 0) / total) * 100));
}

/* =====================================================================
   3. IMÁGENES
   El backend guarda rutas RELATIVAS ('/images/comisiones/foo.jpg') y las
   sirve como estáticos de Express en el puerto 3000. Angular corre en el
   4200: si se pasa la ruta tal cual al <img>, el navegador la pide al
   4200 y devuelve 404 — esa es la causa real de las imágenes rotas,
   además de los src="null".
   ===================================================================== */

const BASURA = new Set(['', 'null', 'undefined', 'NULL', 'none']);

export function urlValida(url?: string | null): boolean {
  if (url === null || url === undefined) return false;
  return !BASURA.has(String(url).trim());
}

/** Convierte la ruta relativa del backend en una URL absoluta usable. */
export function urlImagen(ruta?: string | null): string {
  if (!urlValida(ruta)) return '';
  const limpia = String(ruta).trim();
  if (/^(https?:|data:|blob:)/i.test(limpia)) return limpia;         // ya es absoluta
  return `${environment.apiUrl}${limpia.startsWith('/') ? '' : '/'}${limpia}`;
}

/**
 * Handler de (error) para <img>: si la URL existe pero el archivo ya no
 * está en el servidor, se oculta la imagen y queda visible el
 * placeholder vectorial que vive debajo en el DOM.
 */
export function onImgError(evento: Event): void {
  const img = evento.target as HTMLImageElement;
  img.style.display = 'none';
  img.dataset['roto'] = '1';
}
