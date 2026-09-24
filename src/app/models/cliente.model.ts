export interface Cliente {
  id_cliente: number;
  id_usuario?: number | null;
  nombre: string;
  dni?: string | null;
  correo: string;
  telefono?: string | null;
  estado: string;
  fecha_registro?: string;
}

export interface ClienteRegistro {
  nombre: string;
  dni?: string;
  correo: string;
  password: string;
  telefono?: string;
}

export interface ClienteLogin {
  correo: string;
  password: string;
}

export interface LoginResponse {
  mensaje: string;
  cliente: Cliente;
  token: string;
}
