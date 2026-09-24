import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EstadoComision } from '../models/estado-comision.model';

@Injectable({ providedIn: 'root' })
export class EstadoComisionService {
  private apiUrl = `${environment.apiUrl}/api/estados-comision`;
  constructor(private http: HttpClient) {}

  listar(): Observable<EstadoComision[]> {
    return this.http.get<EstadoComision[]>(this.apiUrl);
  }
}
