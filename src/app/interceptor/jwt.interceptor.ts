import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, throwError } from 'rxjs';
import { AuthService } from '../Services/auth.service';
import { NgxLoadingService } from '../Services/ngx-loading.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const loadingService = inject(NgxLoadingService);
  const token = authService.getToken();

  const excludedUrls = ['/api/banking/users/request/dw'];

  const isExcluded = excludedUrls.some(url => req.url.includes(url));

  if (!isExcluded) {
    loadingService.show();
  }

  const clonedRequest = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error.status === 401 && !authService.isLoggingOut) {
        authService.logout(false);
        authService.showErrorMessage(error.error?.message || 'Session expired. Please log in again.');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
    finalize(() => {
      if (!isExcluded) {
        loadingService.hide();
      }
    })
  );
};



