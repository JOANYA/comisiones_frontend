import { Injectable, computed, inject, signal } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ComisionService } from '../services/comision.service';
import { Comision, ComisionVista, SaldoComision } from '../models/comision.model';
import { FILTRO_DEUDA, estadoPago } from './ui-estado';

/**
 * Estado compartido entre el sidebar (donde se busca y se filtra) y el
 * dashboard (donde se pinta). Con signals, escribir en el buscador
 * repinta el grid sin Inputs ni Outputs intermedios.
 */
@Injectable({ providedIn: 'root' })
export class ComisionesStore {
  private api = inject(ComisionService);

  // --- estado crudo ---------------------------------------------------
  readonly comisiones = signal<ComisionVista[]>([]);
  readonly cargando   = signal(false);
  readonly error      = signal('');

  // --- controles de UI ------------------------------------------------
  readonly busqueda       = signal('');
  readonly estadosActivos = signal<Set<string>>(new Set());

  // --- derivados ------------------------------------------------------

  /** Busca a la vez en nombre_ig, cuenta_ig y titulo. */
  readonly filtradas = computed<ComisionVista[]>(() => {
    const q = this.busqueda().trim().toLowerCase().replace(/^@/, '');
    const activos = this.estadosActivos();

    return this.comisiones().filter(c => {
      const coincide = !q
        || (c.nombre_ig ?? '').toLowerCase().includes(q)
        || (c.cuenta_ig ?? '').toLowerCase().replace(/^@/, '').includes(q)
        || (c.titulo ?? '').toLowerCase().includes(q);
      if (!coincide) return false;

      if (activos.size === 0) return true;

      // "Pendiente de pago" se evalúa contra el saldo, en paralelo a los
      // estados de arte: son dos dimensiones distintas.
      const porDeuda = activos.has(FILTRO_DEUDA) && estadoPago(c.saldo) !== 'full';
      return porDeuda || activos.has(this.nombreEstado(c));
    });
  });

  readonly totalRecaudado = computed(() =>
    this.comisiones().reduce((s, c) => s + Number(c.saldo?.total_pagado ?? 0), 0));

  readonly totalPorCobrar = computed(() =>
    this.comisiones().reduce((s, c) => s + Number(c.saldo?.saldo_pendiente ?? 0), 0));

  readonly enCola = computed(() =>
    this.comisiones().filter(c => ['Pendiente por dibujar', 'En boceto'].includes(this.nombreEstado(c))).length);

  readonly porEntregar = computed(() =>
    this.comisiones().filter(c => ['Dibujado', 'Pagado'].includes(this.nombreEstado(c))).length);

  /** Contador que va dentro de cada chip del sidebar. */
  readonly conteoPorEstado = computed<Record<string, number>>(() => {
    const mapa: Record<string, number> = {};
    for (const c of this.comisiones()) {
      const n = this.nombreEstado(c);
      if (n) mapa[n] = (mapa[n] ?? 0) + 1;
      if (estadoPago(c.saldo) !== 'full') mapa[FILTRO_DEUDA] = (mapa[FILTRO_DEUDA] ?? 0) + 1;
    }
    return mapa;
  });

  // --- acciones -------------------------------------------------------

  /** El listado devuelve `estado`; el detalle devuelve `nombre_estado`. */
  nombreEstado(c: Comision): string {
    return c.estado ?? c.nombre_estado ?? '';
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set('');

    this.api.listar().pipe(
      switchMap(lista => {
        if (!lista.length) return of([] as ComisionVista[]);

        // Camino rápido: un solo GET /api/comisiones/saldos, que lee
        // vw_saldo_comisiones de golpe.
        return this.api.saldos().pipe(
          map(saldos => {
            const indice = new Map<number, SaldoComision>(saldos.map(s => [Number(s.id_comision), s]));
            return lista.map(c => ({ ...c, saldo: indice.get(Number(c.id_comision)) }));
          }),
          // Respaldo por si el backend desplegado es una versión anterior
          // sin ese endpoint: se piden los saldos uno por uno.
          catchError(() => forkJoin(
            lista.map(c => this.api.saldo(c.id_comision).pipe(
              catchError(() => of(undefined as unknown as SaldoComision)),
              map(s => ({ ...c, saldo: s }))
            ))
          ))
        );
      })
    ).subscribe({
      next: data => { this.comisiones.set(data); this.cargando.set(false); },
      error: e => {
        this.error.set(e?.error?.error || 'No se pudieron cargar las comisiones');
        this.cargando.set(false);
      }
    });
  }

  alternarEstado(nombre: string): void {
    const copia = new Set(this.estadosActivos());
    copia.has(nombre) ? copia.delete(nombre) : copia.add(nombre);
    this.estadosActivos.set(copia);
  }

  estadoActivo(nombre: string): boolean {
    return this.estadosActivos().has(nombre);
  }

  limpiarFiltros(): void {
    this.estadosActivos.set(new Set());
    this.busqueda.set('');
  }

  limpiarTodo(): void {
    this.comisiones.set([]);
    this.limpiarFiltros();
  }
}
