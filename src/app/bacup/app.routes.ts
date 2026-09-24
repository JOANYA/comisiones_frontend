import { Routes } from '@angular/router';
import { authGuard, soloInvitadoGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [soloInvitadoGuard],
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'registro',
    canActivate: [soloInvitadoGuard],
    loadComponent: () => import('./pages/registro/registro.component').then(m => m.RegistroComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'comisiones/nueva',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/nueva-comision/nueva-comision.component').then(m => m.NuevaComisionComponent)
  },
  {
    path: 'comisiones/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/comision-detalle/comision-detalle.component').then(m => m.ComisionDetalleComponent)
  },
  { path: '**', redirectTo: 'login' }
];
