# DraNotes — frontend (Angular 17)

## Correr en local

```bash
npm install
npm start          # http://localhost:4200
```

El backend debe estar levantado en `http://localhost:3000` (lo define
`src/environments/environment.ts`).

## Compilar para producción

```bash
npm run build      # genera dist/comisiones-frontend/browser
```

Antes de desplegar, cambia la URL real de tu API en
`src/environments/environment.prod.ts`. La configuración de producción ya
sustituye el archivo de entorno automáticamente (`fileReplacements` en
`angular.json`): antes no lo hacía y el sitio publicado seguía apuntando a
`localhost:3000`, así que en el servidor no cargaba nada.

Sube el contenido de `dist/comisiones-frontend/browser`. Si el hosting es
estático (Netlify, Vercel, Nginx), redirige todas las rutas a `index.html`
porque la app usa rutas del router (`/dashboard`, `/comisiones/5`).

Netlify — archivo `_redirects`:

```
/*  /index.html  200
```

## Qué cambió en esta versión

**Tema.** Bootstrap salió de `package.json` y de `angular.json`; entró
Tailwind (`tailwind.config.js` + `.postcssrc.json`). Todo el estilo propio
vive en `src/styles.css` con prefijo `dn-`, así nunca choca con las
utilidades de Tailwind. Las fuentes se cargan con `<link>` en `index.html`
y el inlining de fuentes está desactivado en el build, porque si la máquina
que compila no tiene salida a Google Fonts el build entero falla.

**Sidebar CRM.** `app.component` pasó de una navbar a un layout con barra
lateral colapsable: buscador en vivo (busca a la vez en `nombre_ig`,
`cuenta_ig` y `titulo`), chips multiselección por estado y acordeón con la
lista filtrada. El estado compartido vive en
`src/app/core/comisiones-store.service.ts` con signals.

**Dos badges por tarjeta.** El de arte lee el catálogo `estado_comision`;
el financiero se deriva de `vw_saldo_comisiones`. Son independientes: una
comisión puede estar pagada al 100% y seguir en 'Pendiente por dibujar'.

**Imágenes.** Ver abajo.

## Por qué se veían rotas las imágenes

Eran dos causas sumadas, no una:

1. `[src]="r.imagen_url"` sin validar. Cuando la columna venía `NULL`,
   Angular escribía `src="null"` y el navegador pedía esa ruta.
2. El backend guarda rutas **relativas** (`/images/comisiones/foo.jpg`) y
   las sirve en el puerto 3000. Angular corre en el 4200, así que la
   imagen se pedía al 4200 y devolvía 404 incluso cuando el archivo
   existía.

`src/app/core/ui-estado.ts` resuelve las dos: `urlValida()` descarta
`null`, `'null'`, `'undefined'` y vacío antes de pintar, y `urlImagen()`
antepone `environment.apiUrl` a las rutas relativas. Encima, cada `<img>`
lleva `(error)="onImgError($event)"` que la oculta si el archivo ya no
está, dejando ver el SVG de respaldo (`dn-sin-portada`) que vive debajo y
que no puede fallar porque no viaja por la red.
