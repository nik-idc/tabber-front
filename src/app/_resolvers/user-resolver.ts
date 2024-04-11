import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from '../_services/user.service';
import { User } from '../_models/user';

export const userResolver: ResolveFn<User> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  console.log(route);
  return inject(UserService)
    .getUser(route.params['id'])
    .then((user: User) => {
      return user;
    });
};
