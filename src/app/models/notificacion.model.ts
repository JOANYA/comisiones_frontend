export interface Notificacion {
  id_notificacion: number;
  id_cliente: number;
  id_comision?: number | null;
  mensaje: string;
  fecha_alerta: string;
  leido: number;
}
