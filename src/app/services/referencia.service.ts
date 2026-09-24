import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReferenciaComision } from '../models/referencia.model';

@Injectable({ providedIn: 'root' })
export class ReferenciaService {
  private apiUrl = `${environment.apiUrl}/api/referencias`;
  constructor(private http: HttpClient) {}

  agregar(idComision: number, archivo: File, descripcion?: string): Observable<{ mensaje: string; resultado: ReferenciaComision }> {
    const formData = new FormData();
    formData.append('imagen', archivo);
    if (descripcion) formData.append('descripcion', descripcion);
    return this.http.post<{ mensaje: string; resultado: ReferenciaComision }>(`${this.apiUrl}/${idComision}`, formData);
  }

  listarPorComision(idComision: number): Observable<ReferenciaComision[]> {
    return this.http.get<ReferenciaComision[]>(`${this.apiUrl}/${idComision}`);
  }

  eliminar(idReferencia: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/item/${idReferencia}`);
  }
}
