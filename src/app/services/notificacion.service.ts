import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Notificacion } from '../models/notificacion.model';

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private apiUrl = `${environment.apiUrl}/api/notificaciones`;
  constructor(private http: HttpClient) {}

  listarPorCliente(idCliente: number): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.apiUrl}/${idCliente}`);
  }

  marcarLeida(idNotificacion: number): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiUrl}/${idNotificacion}/leida`, {});
  }
}
