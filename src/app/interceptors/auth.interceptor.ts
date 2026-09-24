import { HttpInterceptorFn } from '@angular/common/http';

const TOKEN_KEY = 'comisiones_token';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/login') || req.url.includes('/registro')) {
    return next(req);
  }

  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    return next(req);
  }

  const reqConToken = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
  return next(reqConToken);
};
