import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TokenService } from '../services/utils/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  let authReq = undefined;

  const excludedRoutes = [
    '/auth',
  ];

  const shouldIntercept = !excludedRoutes.some(
    (route) => req.url.includes(route)
  );

  if (TokenService.isAuthenticated() && shouldIntercept) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${TokenService.getToken()}`,
        Accept: 'application/json',
      },
    });
  }

  return next(authReq ?? req).pipe(
    catchError((error: HttpErrorResponse) => {    
      switch (error.status) {
        case 401:
          TokenService.revokeToken();
          router.navigate(['/auth/login']);
          break;
      }  
      return throwError(() => error);
    })
  );

};