import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Bloque que aparece cuando la comisión no tiene portada o la URL murió.
 * Es un SVG local, nunca una imagen remota: no puede romperse a su vez.
 *
 * Estilo "flat vector, two-tone" (morado profundo + rosa suave), sin
 * sombras ni glow, siguiendo la guía de personajes sutiles: aparece solo
 * en estados vacíos, nunca satura la pantalla.
 *
 *   <dn-sin-portada texto="Sin portada registrada"></dn-sin-portada>
 */
@Component({
  selector: 'dn-sin-portada',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full h-full flex flex-col items-center justify-center gap-2 select-none"
         style="background: var(--kk-header-tint, #F0E8F3);">

      <svg [attr.width]="tam" [attr.height]="tam" viewBox="0 0 120 120" fill="none"
           stroke="#3D2449" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"
           aria-hidden="true">
        <!-- cráneo redondeado, línea limpia, sin sombra -->
        <path d="M30 62a30 30 0 1 1 60 0c0 10-5 15-5 22v8H35v-8c0-7-5-12-5-22Z" fill="#FFFFFF"/>
        <!-- ojos, en el rosa de acento -->
        <ellipse cx="48" cy="62" rx="5.5" ry="7" fill="#FFB3C6" stroke="none"/>
        <ellipse cx="72" cy="62" rx="5.5" ry="7" fill="#FFB3C6" stroke="none"/>
        <!-- costura de la boca -->
        <path d="M50 84h20M54 80v8M62 80v8"/>
        <!-- moño de tres picos -->
        <path d="M42 34 60 24l18 10-8 9H50l-8-9Z" fill="#FFB3C6" stroke="none"/>
      </svg>

      <p class="kk-eyebrow">{{ texto }}</p>
      <p *ngIf="sub" class="text-xs" style="color:#5E5463">{{ sub }}</p>
    </div>
  `
})
export class SinPortadaComponent {
  @Input() texto = 'Sin portada registrada';
  @Input() sub = '';
  @Input() tam = 88;
}
