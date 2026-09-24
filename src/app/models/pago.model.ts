export interface Pago {
  id_pago: number;
  id_comision: number;
  entidad_bancaria: string;
  fecha_de_pago: string;
  monto: number;
  comprobante_pago?: string | null;
}
