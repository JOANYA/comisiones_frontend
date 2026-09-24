import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon.component';
import { SinPortadaComponent } from '../../shared/sin-portada.component';
import { ComisionesStore } from '../../core/comisiones-store.service';
import { ComisionVista } from '../../models/comision.model';
import {
  ESTADOS_ARTE, FILTRO_DEUDA,
  clasePago, estadoPago, estiloEstado, etiquetaPago,
  onImgError, progresoPago, urlImagen, urlValida
} from '../../core/ui-estado';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent, SinPortadaComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  store = inject(ComisionesStore);

  // Opciones del desplegable de filtro
  estadosArte = ESTADOS_ARTE;
  filtroDeuda = FILTRO_DEUDA;

  // Helpers de renderizado visual expuestos a la plantilla
  estiloEstado = estiloEstado;
  estadoPago = estadoPago;
  clasePago = clasePago;
  etiquetaPago = etiquetaPago;
  progresoPago = progresoPago;
  urlValida = urlValida;
  urlImagen = urlImagen;
  onImgError = onImgError;

  ngOnInit(): void {
    if (!this.store.comisiones().length) {
      this.store.cargar();
    }
  }

  /**
   * Obtiene la lista filtrada descartando las comisiones entregadas.
   * Si una comisión se cambia a "Entregado" / "Entregada",
   * desaparece inmediatamente de este panel.
   */
  get comisionesFiltradas(): ComisionVista[] {
    // Si la store ya provee la lista con sus filtros (store.filtradas()), usas esa lista;
    // de lo contrario, usas store.comisiones()
    const lista = (this.store.filtradas ? this.store.filtradas() : this.store.comisiones()) as ComisionVista[];
    
    return lista.filter((c: ComisionVista) => {
      const e = this.nombreEstado(c).toLowerCase().trim();
      return e !== 'entregado' && e !== 'entregada';
    });
  }

// Agrega esto dentro de tu DashboardComponent:

get comisionesActivas(): ComisionVista[] {
  // 1. Tomamos la lista ya filtrada de la Store (o la lista general si no existe filtradas)
  const lista = (this.store.filtradas ? this.store.filtradas() : this.store.comisiones()) as ComisionVista[];

  // 2. Evaluamos si entre los elementos de la lista filtrada HAY comisiones entregadas
  // Y si la lista global contiene otros estados.
  // O bien, verificamos si 'Entregado' está presente en la selección actual.
  const hayEntregadasEnLista = lista.some(c => {
    const e = this.nombreEstado(c).toLowerCase().trim();
    return e === 'entregado' || e === 'entregada';
  });

  const hayOtrasEnLista = lista.some(c => {
    const e = this.nombreEstado(c).toLowerCase().trim();
    return e !== 'entregado' && e !== 'entregada';
  });

  // 3. Si el usuario filtró de forma que SOLO hay entregadas (seleccionó explícitamente "Entregado"),
  // devolvemos la lista completa sin filtrar.
  if (hayEntregadasEnLista && !hayOtrasEnLista) {
    return lista;
  }

  // 4. Para la vista general (o cuando hay mezcla de estados), descartamos las entregadas
  return lista.filter((c: ComisionVista) => {
    const e = this.nombreEstado(c).toLowerCase().trim();
    return e !== 'entregado' && e !== 'entregada';
  });
}





  trackId = (_: number, c: ComisionVista) => c.id_comision;

  nombreEstado(c: ComisionVista): string {
    return this.store.nombreEstado(c);
  }

  /** Calcula los días restantes hacia la fecha límite. */
  diasRestantes(fecha?: string | null): number | null {
    if (!fecha) return null;
    const ms = new Date(fecha).getTime() - new Date().setHours(0, 0, 0, 0);
    return Math.ceil(ms / 86400000);
  }





}