import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../_services/auth.service';

export const canActivateAuth: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);

  console.log(authService.loggedIn);
  if (!authService.loggedIn) {
    inject(Router).navigate(['info']);
  } else {
    inject(Router).navigate(['user', authService.currentUser?.id]);
  }

  return authService.loggedIn;
};
