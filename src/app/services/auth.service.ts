import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cliente, ClienteLogin, ClienteRegistro, LoginResponse } from '../models/cliente.model';

const TOKEN_KEY = 'comisiones_token';
const CLIENTE_KEY = 'comisiones_cliente';

/**
 * Autenticación de la artista (rol 'cliente' en el backend). El login del
 * administrador usa el mismo patrón contra /api/usuarios si se necesita
 * un panel de admin aparte.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/clientes`;

  private clienteActualSubject = new BehaviorSubject<Cliente | null>(this.leerClienteGuardado());
  clienteActual$ = this.clienteActualSubject.asObservable();

  constructor(private http: HttpClient) {}

  registro(datos: ClienteRegistro): Observable<{ mensaje: string; resultado: { id_cliente: number } }> {
    return this.http.post<{ mensaje: string; resultado: { id_cliente: number } }>(`${this.apiUrl}/registro`, datos);
  }

  login(credenciales: ClienteLogin): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credenciales).pipe(
      tap((respuesta) => {
        localStorage.setItem(TOKEN_KEY, respuesta.token);
        this.guardarSesion(respuesta.cliente);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CLIENTE_KEY);
    this.clienteActualSubject.next(null);
  }

  estaAutenticado(): boolean {
    return this.clienteActualSubject.value !== null && !!localStorage.getItem(TOKEN_KEY);
  }

  getClienteActual(): Cliente | null {
    return this.clienteActualSubject.value;
  }

  private guardarSesion(cliente: Cliente): void {
    localStorage.setItem(CLIENTE_KEY, JSON.stringify(cliente));
    this.clienteActualSubject.next(cliente);
  }

  private leerClienteGuardado(): Cliente | null {
    const crudo = localStorage.getItem(CLIENTE_KEY);
    if (!crudo) return null;
    try {
      return JSON.parse(crudo) as Cliente;
    } catch {
      return null;
    }
  }
}
