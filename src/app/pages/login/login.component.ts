import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ComisionesStore } from '../../core/comisiones-store.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, IconComponent],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private store = inject(ComisionesStore);

  cargando = false;
  error = '';

  form = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = 'Correo válido y contraseña de 6 caracteres o más.';
      return;
    }
    this.cargando = true;
    this.error = '';

    // AuthService ya guarda token y cliente en localStorage dentro del tap().
    this.auth.login(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.store.cargar();
        this.router.navigateByUrl('/dashboard');
      },
      error: e => {
        this.error = e?.error?.error || 'Correo o contraseña incorrectos';
        this.cargando = false;
      }
    });
  }
}
