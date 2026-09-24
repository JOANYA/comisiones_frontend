import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { ComisionesStore } from './core/comisiones-store.service';
import { IconComponent } from './shared/icon.component';
import { ComisionVista } from './models/comision.model';
import { ESTADOS_ARTE, FILTRO_DEUDA, estadoPago, estiloEstado } from './core/ui-estado';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, IconComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  private router = inject(Router);
  auth = inject(AuthService);
  store = inject(ComisionesStore);

  /** Sidebar reducido a iconos. Se recuerda entre recargas. */
  colapsado = signal(localStorage.getItem('dn_sidebar') === '1');
  /** En movil el sidebar es un cajon superpuesto. */
  abiertoMovil = signal(false);
  /** Acordeon "Mis comisiones". */
  listaAbierta = signal(true);

  rutaActual = signal(this.router.url);

  estadosArte = ESTADOS_ARTE;
  filtroDeuda = FILTRO_DEUDA;
  estiloEstado = estiloEstado;
  estadoPago = estadoPago;

  /** Login y registro se pintan sin chrome: sin sesion no hay que filtrar. */
  sinChrome = computed(() => !this.auth.estaAutenticado() || /\/(login|registro)/.test(this.rutaActual()));

  constructor() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(e => {
      this.rutaActual.set((e as NavigationEnd).urlAfterRedirects);
      this.abiertoMovil.set(false);
      if (!this.sinChrome() && !this.store.comisiones().length) this.store.cargar();
    });

    if (!this.sinChrome()) this.store.cargar();
  }

  get nombreArtista(): string {
    return this.auth.getClienteActual()?.nombre ?? 'Artista';
  }

  /** El backend no guarda el handle de IG de la artista: se deriva del correo. */
  get handleArtista(): string {
    const correo = this.auth.getClienteActual()?.correo ?? '';
    return correo ? '@' + correo.split('@')[0] : '@sin-cuenta';
  }

  alternarColapso(): void {
    const v = !this.colapsado();
    this.colapsado.set(v);
    localStorage.setItem('dn_sidebar', v ? '1' : '0');
  }

  conteo(nombre: string): number {
    return this.store.conteoPorEstado()[nombre] ?? 0;
  }

  trackId = (_: number, c: ComisionVista) => c.id_comision;

  cerrarSesion(): void {
    this.auth.logout();
    this.store.limpiarTodo();
    this.router.navigateByUrl('/login');
  }
}
