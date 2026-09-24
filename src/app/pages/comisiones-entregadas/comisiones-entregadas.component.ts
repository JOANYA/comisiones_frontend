import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ComisionesStore } from '../../core/comisiones-store.service';
import { ComisionVista } from '../../models/comision.model';
import { IconComponent } from '../../shared/icon.component';
import { SinPortadaComponent } from '../../shared/sin-portada.component';

// 1. IMPORTAR HELPERS DE UI
import { urlValida, urlImagen, onImgError, estiloEstado } from '../../core/ui-estado';

@Component({
  selector: 'app-comisiones-entregadas',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, SinPortadaComponent],
  templateUrl: './comisiones-entregadas.component.html'
})
export class ComisionesEntregadasComponent implements OnInit {
  store = inject(ComisionesStore);

  // 2. EXPONER HELPERS A LA PLANTILLA HTML
  urlValida = urlValida;
  urlImagen = urlImagen;
  onImgError = onImgError;
  estiloEstado = estiloEstado;

  ngOnInit(): void {
    if (!this.store.comisiones().length) {
      this.store.cargar();
    }
  }

  // Jala ÚNICAMENTE las comisiones con estado 'Entregado' o 'Entregada'
  get entregadas(): ComisionVista[] {
    return this.store.comisiones().filter((c: ComisionVista) => {
      const estado = this.store.nombreEstado(c).toLowerCase().trim();
      return estado === 'entregado' || estado === 'entregada';
    });
  }


  

  trackId = (_: number, c: ComisionVista) => c.id_comision;
}