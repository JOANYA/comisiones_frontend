export interface ReferenciaComision {
  id_referencia: number;
  id_comision: number;
  imagen_url: string;
  descripcion?: string | null;
  fecha_subida: string;
}
