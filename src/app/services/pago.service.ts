import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pago } from '../models/pago.model';

@Injectable({ providedIn: 'root' })
export class PagoService {
  private apiUrl = `${environment.apiUrl}/api/pagos`;
  constructor(private http: HttpClient) {}

  registrar(idComision: number, entidad_bancaria: string, monto: number, comprobante?: File): Observable<{ mensaje: string; resultado: Pago }> {
    const formData = new FormData();
    formData.append('entidad_bancaria', entidad_bancaria);
    formData.append('monto', String(monto));
    if (comprobante) formData.append('comprobante', comprobante);
    return this.http.post<{ mensaje: string; resultado: Pago }>(`${this.apiUrl}/${idComision}`, formData);
  }

  listarPorComision(idComision: number): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.apiUrl}/${idComision}`);
  }
}
