import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { IconComponent } from './shared/icon.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, IconComponent],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  auth = inject(AuthService);

  colapsado = signal(localStorage.getItem('dn_sidebar') === '1');
  abiertoMovil = signal(false);
  rutaActual = signal(this.router.url);

  // Signal reactivo para refrescar el estado del usuario al cambiar de ruta
  usuarioActual = signal(this.auth.getClienteActual());

  // Evaluamos la sesión usando directamente la señal del usuario
  sinChrome = computed(() => {
    const hayUsuario = !!this.usuarioActual();
    const esRutaPublica = /\/(login|registro)/.test(this.rutaActual());
    return !hayUsuario || esRutaPublica;
  });

  constructor() {
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe((e: NavigationEnd) => {
      this.rutaActual.set(e.urlAfterRedirects);
      this.abiertoMovil.set(false);
      
      // Actualiza la señal reactiva inmediatamente al completar la redirección
      this.usuarioActual.set(this.auth.getClienteActual());
    });
  }

  ngOnInit(): void {
    this.usuarioActual.set(this.auth.getClienteActual());
  }

  get nombreArtista(): string {
    return this.usuarioActual()?.nombre ?? 'Artista';
  }

  get handleArtista(): string {
    const correo = this.usuarioActual()?.correo ?? '';
    return correo ? '@' + correo.split('@')[0] : '@sin-cuenta';
  }

  alternarColapso(): void {
    const v = !this.colapsado();
    this.colapsado.set(v);
    localStorage.setItem('dn_sidebar', v ? '1' : '0');
  }

  cerrarSesion(): void {
    this.auth.logout();
    this.usuarioActual.set(null);
    this.router.navigateByUrl('/login');
  }
}