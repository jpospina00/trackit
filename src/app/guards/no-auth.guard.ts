import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UtilsService } from '../services/utils.services';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const utilsSvc = inject(UtilsService);
  
    return new Promise((resolve, reject) => {
      console.log('noAuthGuard');
      if (!utilsSvc.validateAuth()) {
        resolve(true);
      }
      else {
        utilsSvc.routerLink('/main/home');
        resolve(false);
      }
    });
};
