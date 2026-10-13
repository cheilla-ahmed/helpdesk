
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  if (!token) {
    return router.createUrlTree(['/login']);
  }

  return authService.getCurrentUser().pipe(
    map(() => true),
    catchError(() => {
      authService.removeToken();
      return of(router.createUrlTree(['/login']));
    })
  );
};
