import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/shared/services/auth/auth.service';

export const isLoggedIn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/auth']);
    return false;
  };
};

export const isAdmin = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoggedIn() && authService.getRole() === 'ADMIN') {
    return true;
  } else {
    router.navigate(['/403']);
    return false;
  }
};
