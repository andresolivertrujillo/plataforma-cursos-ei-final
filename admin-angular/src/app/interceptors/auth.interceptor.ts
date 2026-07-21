import { HttpInterceptorFn } from '@angular/common/http';

// Adjunta el token JWT a cada peticion saliente
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return next(req);
};
