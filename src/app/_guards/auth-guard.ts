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
  console.log('canActivateAuth');
  const currentUserService = inject(CurrentUserService);

  if (!currentUserService.loggedIn) {
    console.log('redirect to info');
    inject(Router).navigate(['info']);
  } else {
    console.log('redirect to user');
    inject(Router).navigate(['user', currentUserService.currentUser?.id]);
  }

  return currentUserService.loggedIn;
};
