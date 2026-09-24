import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, IconComponent],
  templateUrl: './registro.component.html'
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  cargando = false;
  error = '';
  exito = false;

  form = this.fb.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    telefono: [''],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = 'Faltan datos obligatorios o la contraseña es muy corta.';
      return;
    }
    this.cargando = true;
    this.error = '';

    this.auth.registro(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.exito = true;
        this.cargando = false;
        setTimeout(() => this.router.navigateByUrl('/login'), 1200);
      },
      error: e => {
        this.error = e?.error?.error || 'No se pudo crear la cuenta';
        this.cargando = false;
      }
    });
  }
}
