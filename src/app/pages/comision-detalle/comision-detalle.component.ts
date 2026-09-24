import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/icon.component';
import { SinPortadaComponent } from '../../shared/sin-portada.component';

import { ComisionService } from '../../services/comision.service';
import { PagoService } from '../../services/pago.service';
import { ReferenciaService } from '../../services/referencia.service';
import { EstadoComisionService } from '../../services/estado-comision.service';
import { ComisionesStore } from '../../core/comisiones-store.service';

import { Comision, SaldoComision } from '../../models/comision.model';
import { Pago } from '../../models/pago.model';
import { ReferenciaComision } from '../../models/referencia.model';
import { EstadoComision } from '../../models/estado-comision.model';
import {
  clasePago, estadoPago, estiloEstado, etiquetaPago,
  onImgError, progresoPago, urlImagen, urlValida
} from '../../core/ui-estado';

@Component({
  selector: 'app-comision-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent, SinPortadaComponent],
  templateUrl: './comision-detalle.component.html'
})
export class ComisionDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private comisionService = inject(ComisionService);
  private pagoService = inject(PagoService);
  private referenciaService = inject(ReferenciaService);
  private estadoService = inject(EstadoComisionService);
  private store = inject(ComisionesStore);

  id!: number;
  comision?: Comision;
  saldo?: SaldoComision;
  pagos: Pago[] = [];
  referencias: ReferenciaComision[] = [];
  estados: EstadoComision[] = [];
  error = '';
  guardando = false;

  // Formulario de pago
  entidadBancaria = '';
  montoPago: number | null = null;
  archivoComprobante: File | null = null;

  // Formulario de referencia
  descripcionReferencia = '';
  archivoReferencia: File | null = null;

  // Helpers para el template
  estiloEstado = estiloEstado;
  estadoPago = estadoPago;
  clasePago = clasePago;
  etiquetaPago = etiquetaPago;
  progresoPago = progresoPago;
  urlValida = urlValida;
  urlImagen = urlImagen;
  onImgError = onImgError;

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarTodo();
    this.estadoService.listar().subscribe({ next: e => this.estados = e });
  }

  cargarTodo(): void {
    this.comisionService.obtenerPorId(this.id).subscribe({ next: c => this.comision = c });
    this.comisionService.saldo(this.id).subscribe({ next: s => this.saldo = s });
    this.pagoService.listarPorComision(this.id).subscribe({ next: p => this.pagos = p });
    this.referenciaService.listarPorComision(this.id).subscribe({ next: r => this.referencias = r });
  }

  get nombreEstado(): string {
    return this.comision?.nombre_estado ?? this.comision?.estado ?? '';
  }

  cambiarEstado(nombreEstado: string): void {
    this.error = '';
    this.comisionService.cambiarEstado(this.id, nombreEstado).subscribe({
      next: () => {
        this.cargarTodo();
        this.store.cargar();
      },
      error: e => this.error = e?.error?.error || 'No se pudo cambiar el estado'
    });
  }

  onArchivoComprobante(evento: Event): void {
    this.archivoComprobante = (evento.target as HTMLInputElement).files?.[0] || null;
  }

  registrarPago(): void {
    if (!this.entidadBancaria.trim()) { this.error = 'Indica de dónde vino el pago (Yape, Plin, BCP…)'; return; }
    if (!this.montoPago || this.montoPago <= 0) { this.error = 'El monto debe ser mayor a 0'; return; }
    if (this.saldo && this.montoPago > Number(this.saldo.saldo_pendiente)) {
      this.error = `El monto supera el saldo pendiente (S/ ${Number(this.saldo.saldo_pendiente).toFixed(2)})`;
      return;
    }

    this.guardando = true;
    this.error = '';
    this.pagoService.registrar(this.id, this.entidadBancaria, this.montoPago, this.archivoComprobante || undefined)
      .subscribe({
        next: () => {
          this.entidadBancaria = '';
          this.montoPago = null;
          this.archivoComprobante = null;
          this.guardando = false;
          this.cargarTodo();
          this.store.cargar();
        },
        error: e => {
          this.error = e?.error?.error || 'No se pudo registrar el pago';
          this.guardando = false;
        }
      });
  }

  onArchivoReferencia(evento: Event): void {
    this.archivoReferencia = (evento.target as HTMLInputElement).files?.[0] || null;
  }

  agregarReferencia(): void {
    if (!this.archivoReferencia) { this.error = 'Elige una imagen de referencia'; return; }
    this.guardando = true;
    this.referenciaService.agregar(this.id, this.archivoReferencia, this.descripcionReferencia).subscribe({
      next: () => {
        this.descripcionReferencia = '';
        this.archivoReferencia = null;
        this.guardando = false;
        this.cargarTodo();
      },
      error: e => {
        this.error = e?.error?.error || 'No se pudo agregar la referencia';
        this.guardando = false;
      }
    });
  }

  trackRef = (_: number, r: ReferenciaComision) => r.id_referencia;
  trackPago = (_: number, p: Pago) => p.id_pago;
}