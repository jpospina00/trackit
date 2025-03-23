import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UtilsService } from '../services/utils.services';

export const roleGuard: CanActivateFn = (route, state) => {

  const utilsSvc = inject(UtilsService);
  return new Promise((resolve, reject) => {
    console.log('roleGuard');
    const user = utilsSvc.getLocalStorage('user');
    if (user.role === 'admin') {
      resolve(true);
    } else {
      utilsSvc.routerLink('/');
      resolve(false);
    }
  });
};
