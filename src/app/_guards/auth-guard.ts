import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { CurrentUserService } from '../_services/current-user.service';

export const canActivateAuth: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const currentUserService = inject(CurrentUserService);

  if (!currentUserService.loggedIn) {
    inject(Router).navigate(['info']);
  } else {
    inject(Router).navigate(['user', currentUserService.currentUser?.id]);
  }

  return currentUserService.loggedIn;
};
