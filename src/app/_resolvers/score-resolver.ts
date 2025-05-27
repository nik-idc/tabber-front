import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from '../_services/user.service';
import { User } from '../_models/user';
import { CurrentUserService } from '../_services/current-user.service';
import { Score } from '@atikincode/tabui';
import { ScoreService } from '../_services/score.service';

export const scoreResolver: ResolveFn<Score | undefined> = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const scoreId = Number(route.params['id']);
  const scoreService = inject(ScoreService);
  return await scoreService.loadScore(scoreId);
};
