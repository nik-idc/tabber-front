import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "../services/user.service";

export const canActivateUser: CanActivateFn =
	(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
		let userService = inject(UserService);

		if (!userService.loggedIn) {
			inject(Router).navigateByUrl('signin');
		}

		return userService.loggedIn;
	};