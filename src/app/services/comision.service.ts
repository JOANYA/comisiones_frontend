import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Comision, NuevaComision, SaldoComision } from '../models/comision.model';

@Injectable({ providedIn: 'root' })
export class ComisionService {
  private apiUrl = `${environment.apiUrl}/api/comisiones`;
  constructor(private http: HttpClient) {}

  registrar(datos: NuevaComision): Observable<{ mensaje: string; resultado: Comision }> {
    return this.http.post<{ mensaje: string; resultado: Comision }>(this.apiUrl, datos);
  }

  listar(): Observable<Comision[]> {
    return this.http.get<Comision[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Comision> {
    return this.http.get<Comision>(`${this.apiUrl}/${id}`);
  }

  actualizarDatos(id: number, datos: Partial<NuevaComision>): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiUrl}/${id}`, datos);
  }

  subirImagenPortada(id: number, archivo: File): Observable<{ mensaje: string }> {
    const formData = new FormData();
    formData.append('imagen', archivo);
    return this.http.post<{ mensaje: string }>(`${this.apiUrl}/${id}/imagen`, formData);
  }

  cambiarEstado(id: number, nombre_estado: string): Observable<{ mensaje: string; resultado: Comision }> {
    return this.http.put<{ mensaje: string; resultado: Comision }>(`${this.apiUrl}/${id}/estado`, { nombre_estado });
  }

  cancelar(id: number): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiUrl}/${id}/cancelar`, {});
  }

  eliminar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/${id}`);
  }

  /**
   * Saldo de TODAS las comisiones de la artista en una sola llamada
   * (lee vw_saldo_comisiones). Evita el N+1 del dashboard.
   */
  saldos(): Observable<SaldoComision[]> {
    return this.http.get<SaldoComision[]>(`${this.apiUrl}/saldos`);
  }

  saldo(id: number): Observable<SaldoComision> {
    return this.http.get<SaldoComision>(`${this.apiUrl}/${id}/saldo`);
  }

  proximasEntregas(): Observable<Comision[]> {
    return this.http.get<Comision[]>(`${this.apiUrl}/proximas-entregas`);
  }
}
