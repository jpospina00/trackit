import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UtilsService } from '../services/utils.services';

export const authGuard: CanActivateFn = (route, state) => {
  const utilsSvc = inject(UtilsService);

  return new Promise((resolve, reject) => {
    console.log('authGuard');
    if (utilsSvc.validateAuth()) {
      resolve(true);
    }
    else {
      utilsSvc.routerLink('/auth');
      resolve(false);
    }
  });
};
