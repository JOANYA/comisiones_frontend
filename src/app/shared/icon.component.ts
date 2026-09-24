import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Set de íconos vectoriales propios. Sustituye TODOS los emojis del
 * proyecto: un emoji se renderiza distinto en Windows, Android y iOS y
 * no hereda el color del tema; estos sí (usan currentColor).
 *
 * Uso:  <dn-icon name="calavera-mono" [size]="18"></dn-icon>
 *
 * Nombres disponibles:
 *   calavera-mono · mono · estrella-fugaz · destello · corazon-espina
 *   pincel · lapiz · moneda · billetera · reloj · sobre · lupa
 *   chevron · menu · mas · check · equis · imagen · subir · salir · disco
 */
@Component({
  selector: 'dn-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" [attr.stroke-width]="grosor"
         stroke-linecap="round" stroke-linejoin="round"
         aria-hidden="true" focusable="false"
         [style.flex]="'0 0 auto'">

      <!-- Calavera de Kuromi: cráneo redondo + moño de tres picos arriba -->
      <ng-container *ngIf="name === 'calavera-mono'">
        <path d="M6 12a6 6 0 1 1 12 0c0 2-1 3-1 4.5V19H7v-2.5C7 15 6 14 6 12Z"/>
        <circle cx="9.7" cy="12" r="1.1" fill="currentColor" stroke="none"/>
        <circle cx="14.3" cy="12" r="1.1" fill="currentColor" stroke="none"/>
        <path d="M12 15.2v1.4"/>
        <path d="M9 6.4 12 4.8l3 1.6-1.4 1.4h-3.2L9 6.4Z"/>
      </ng-container>

      <!-- Moño Hello Kitty -->
      <ng-container *ngIf="name === 'mono'">
        <path d="M11.2 12 4.8 8.2A.7.7 0 0 0 3.8 9v6a.7.7 0 0 0 1 .8L11.2 12Z"/>
        <path d="M12.8 12l6.4-3.8a.7.7 0 0 1 1 .8v6a.7.7 0 0 1-1 .8L12.8 12Z"/>
        <circle cx="12" cy="12" r="1.7"/>
      </ng-container>

      <!-- Estrella fugaz -->
      <ng-container *ngIf="name === 'estrella-fugaz'">
        <path d="M15.5 4.5 17 8l3.5 1.4L17 11l-1.5 3.5L14 11l-3.5-1.6L14 8l1.5-3.5Z"/>
        <path d="M9.5 14.5 3 21"/><path d="M11 18.5 7.5 22"/><path d="M6.5 13 3.5 16"/>
      </ng-container>

      <!-- Destello de cristal (4 puntas) -->
      <ng-container *ngIf="name === 'destello'">
        <path d="M12 3c.6 4.5 2.4 6.3 6.9 6.9-4.5.7-6.3 2.5-6.9 7-.6-4.5-2.4-6.3-6.9-7C9.6 9.3 11.4 7.5 12 3Z"/>
      </ng-container>

      <!-- Corazón con espina -->
      <ng-container *ngIf="name === 'corazon-espina'">
        <path d="M12 20s-7-4.4-7-9.2A3.9 3.9 0 0 1 12 8.6a3.9 3.9 0 0 1 7 2.2C19 15.6 12 20 12 20Z"/>
        <path d="M4 5.5 20 17"/>
      </ng-container>

      <!-- Pincel -->
      <ng-container *ngIf="name === 'pincel'">
        <path d="M14.8 3.9 20 9.1l-8.3 8.3a3.7 3.7 0 0 1-5.2-5.2L14.8 4Z"/>
        <path d="M6.5 17.5C5 19 5.5 21 3 21c0-2.5 2-2 3.5-3.5"/>
      </ng-container>

      <!-- Lápiz -->
      <ng-container *ngIf="name === 'lapiz'">
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"/>
        <path d="M14.5 5.5l3 3"/>
      </ng-container>

      <!-- Moneda / sol peruano -->
      <ng-container *ngIf="name === 'moneda'">
        <circle cx="12" cy="12" r="8.5"/>
        <path d="M14.2 9.2c-.6-.8-1.5-1.2-2.5-1.2-1.3 0-2.2.7-2.2 1.7 0 2.4 4.8 1.2 4.8 3.7 0 1.1-1 1.8-2.4 1.8-1.1 0-2.1-.4-2.7-1.2"/>
      </ng-container>

      <!-- Billetera -->
      <ng-container *ngIf="name === 'billetera'">
        <path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H17a1 1 0 0 1 1 1v1"/>
        <rect x="3.5" y="7.5" width="17" height="11" rx="2"/>
        <circle cx="16.5" cy="13" r="1.1" fill="currentColor" stroke="none"/>
      </ng-container>

      <!-- Reloj -->
      <ng-container *ngIf="name === 'reloj'">
        <circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 1.8"/>
      </ng-container>

      <!-- Sobre / entrega -->
      <ng-container *ngIf="name === 'sobre'">
        <rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>
      </ng-container>

      <!-- Lupa -->
      <ng-container *ngIf="name === 'lupa'">
        <circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>
      </ng-container>

      <!-- Chevron (acordeón) -->
      <ng-container *ngIf="name === 'chevron'"><path d="m7 10 5 5 5-5"/></ng-container>

      <!-- Menú hamburguesa -->
      <ng-container *ngIf="name === 'menu'">
        <path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h10"/>
      </ng-container>

      <ng-container *ngIf="name === 'mas'"><path d="M12 5v14"/><path d="M5 12h14"/></ng-container>
      <ng-container *ngIf="name === 'check'"><path d="m5 12.5 4.5 4.5L19 7"/></ng-container>
      <ng-container *ngIf="name === 'equis'"><path d="M6 6l12 12"/><path d="M18 6 6 18"/></ng-container>

      <!-- Imagen -->
      <ng-container *ngIf="name === 'imagen'">
        <rect x="3" y="4.5" width="18" height="15" rx="2.5"/>
        <circle cx="8.5" cy="10" r="1.6"/><path d="m4 17 5-5 4.5 4.5L17 13l3 3"/>
      </ng-container>

      <!-- Subir archivo -->
      <ng-container *ngIf="name === 'subir'">
        <path d="M12 16V4.5"/><path d="m7.5 9 4.5-4.5L16.5 9"/><path d="M4 16v2.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V16"/>
      </ng-container>

      <!-- Salir -->
      <ng-container *ngIf="name === 'salir'">
        <path d="M14 4.5h4A1.5 1.5 0 0 1 19.5 6v12a1.5 1.5 0 0 1-1.5 1.5h-4"/>
        <path d="M10 8.5 6 12l4 3.5"/><path d="M6 12h8"/>
      </ng-container>

      <!-- Disco Y2K -->
      <ng-container *ngIf="name === 'disco'">
        <circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.4"/>
        <path d="M12 3.5a8.5 8.5 0 0 1 7.2 4"/>
      </ng-container>
    </svg>
  `
})
export class IconComponent {
  @Input() name = 'destello';
  @Input() size = 18;
  /** Trazo más grueso para íconos chicos dentro de badges. */
  @Input() grosor = 1.7;
}
