import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { UserService } from "../services/user.service";
import { User } from "../models/user";

export const userResolver: ResolveFn<User> =
	(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
		return inject(UserService).getUser().then((user: User) => {
			return user;
		});
	};