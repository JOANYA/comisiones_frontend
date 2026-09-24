# Comisiones de Arte — Frontend (Angular 17)

Interfaz para que la artista registre y siga sus comisiones (pedidos de
dibujo) desde el navegador: login/registro, listado con estado por
color, alta de comisión con portada, y una vista de detalle donde se
cambia el estado, se registran pagos (con comprobante) y se suben
imágenes de referencia.

Sigue el mismo patrón standalone components + `provideHttpClient` +
interceptor de token + guards que el proyecto de referencia
"Azúcar & Amor", adaptado a los endpoints del nuevo backend
`comisiones-backend`.

## Configurar

Edita `src/environments/environment.ts` (desarrollo) y
`environment.prod.ts` (build de producción) con la URL real del backend.

## Instalar y correr

```bash
npm install
npm start        # http://localhost:4200
```

## Build de producción

```bash
npm run build
```

## Estructura

- `models/` — interfaces TS que reflejan las tablas/vistas del backend.
- `services/` — un servicio HTTP por recurso (auth, comisiones, pagos,
  referencias, notificaciones, estados).
- `guards/authGuard` — protege `/dashboard` y las rutas de comisiones.
- `interceptors/authInterceptor` — agrega `Authorization: Bearer <token>`
  automáticamente a cada petición (excepto login/registro).
- `pages/` — login, registro, dashboard (listado), nueva-comision (alta),
  comision-detalle (estado + pagos + referencias).
