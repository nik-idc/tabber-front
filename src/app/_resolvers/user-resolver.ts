import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from '../_services/user.service';
import { User } from '../_models/user';
import { CurrentUserService } from '../_services/current-user.service';

export const userResolver: ResolveFn<User | undefined> = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const userId = Number(route.params['id']);
  const currentUserService = inject(CurrentUserService);
  const userService = inject(UserService);

  if (
    currentUserService.currentUser &&
    userId === currentUserService.currentUser.id
  ) {
    await currentUserService.getScores();
  }

  const user = await userService.getUser(userId);
  user.scores = await userService.getUserScores(userId);

  return user;
};
