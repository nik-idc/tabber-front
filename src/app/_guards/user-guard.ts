import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { CurrentUserService } from '../_services/current-user.service';

export const canActivateUser: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const currentUserService = inject(CurrentUserService);

  if (!currentUserService.loggedIn) {
    inject(Router).navigateByUrl('signin');
  }

  return currentUserService.loggedIn;
};
