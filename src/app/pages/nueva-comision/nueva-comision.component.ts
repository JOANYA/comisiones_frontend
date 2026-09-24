import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ComisionService } from '../../services/comision.service';
import { ComisionesStore } from '../../core/comisiones-store.service';
import { IconComponent } from '../../shared/icon.component';
import { SinPortadaComponent } from '../../shared/sin-portada.component';

@Component({
  selector: 'app-nueva-comision',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, IconComponent, SinPortadaComponent],
  templateUrl: './nueva-comision.component.html'
})
export class NuevaComisionComponent {
  private fb = inject(FormBuilder);
  private comisionService = inject(ComisionService);
  private router = inject(Router);
  private store = inject(ComisionesStore);

  cargando = false;
  error = '';
  archivoPortada: File | null = null;
  /** DataURL local para previsualizar sin tocar el servidor. */
  previewPortada: string | null = null;

  form = this.fb.group({
    nombre_ig: ['', Validators.required],
    cuenta_ig: ['', Validators.required],
    titulo: ['', Validators.required],
    descripcion: [''],
    precio_total: [0, [Validators.required, Validators.min(0)]],
    fecha_limite: ['']
  });

  onArchivo(evento: Event): void {
    const archivo = (evento.target as HTMLInputElement).files?.[0] || null;
    this.archivoPortada = archivo;
    this.previewPortada = null;
    if (!archivo) return;

    if (!archivo.type.startsWith('image/')) {
      this.error = 'La portada debe ser una imagen (jpg, png o webp)';
      this.archivoPortada = null;
      return;
    }
    const lector = new FileReader();
    lector.onload = () => this.previewPortada = String(lector.result);
    lector.readAsDataURL(archivo);
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = 'Revisa los campos marcados en rosa.';
      return;
    }
    this.cargando = true;
    this.error = '';

    this.comisionService.registrar(this.form.getRawValue() as any).subscribe({
      next: respuesta => {
        const id = respuesta.resultado.id_comision;
        const irAlDetalle = () => { this.store.cargar(); this.router.navigate(['/comisiones', id]); };

        if (this.archivoPortada) {
          this.comisionService.subirImagenPortada(id, this.archivoPortada)
            .subscribe({ next: irAlDetalle, error: irAlDetalle }); // la portada es opcional
        } else {
          irAlDetalle();
        }
      },
      error: e => {
        this.error = e?.error?.error || 'No se pudo registrar la comisión';
        this.cargando = false;
      }
    });
  }
}
